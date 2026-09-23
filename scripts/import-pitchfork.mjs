import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import sharp from 'sharp'
import JSON5 from 'json5'

const sourceUrl = 'https://pitchfork.com/features/lists-and-guides/peoples-list-25th-anniversary/'
const cache = '.context/pitchfork-import'
await mkdir(cache, { recursive: true })
await mkdir('public/covers', { recursive: true })
await mkdir('src/data', { recursive: true })

async function download(url) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(30_000) })
      if (!response.ok) throw new Error(`${response.status}: ${url}`)
      return Buffer.from(await response.arrayBuffer())
    } catch (error) {
      if (attempt === 2) throw error
      await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)))
    }
  }
}

async function cached(name, url) {
  const path = `${cache}/${name}`
  try {
    return await readFile(path)
  } catch {
    const bytes = await download(url)
    await writeFile(path, bytes)
    return bytes
  }
}

const page = (await cached('list.html', sourceUrl)).toString()
const bundlePath = page.match(/src="([^"]*peoples-list\/static\/js\/main\.[^"]+\.js)"/)?.[1]
if (!bundlePath) throw new Error('Pitchfork list bundle not found')
const bundleUrl = new URL(bundlePath, sourceUrl).href
const bundle = (await cached('list.js', bundleUrl)).toString()
// Parse only the static data literal; never execute downloaded JavaScript.
const literal = bundle.match(/\[\{Artist:[\s\S]*?\}\]/)?.[0]
if (!literal) throw new Error('Album data not found')
const sourceAlbums = JSON5.parse(literal)
if (sourceAlbums.length !== 200 || sourceAlbums.some((a, i) => a.Rank !== i + 1)) {
  throw new Error('Expected exactly 200 consecutive rankings')
}

const reviewOverrides = {
  53: 'https://pitchfork.com/reviews/albums/belle-and-sebastian-if-youre-feeling-sinister/',
}
// Manually matched releases where the list supplies neither a review nor a working cover.
const appleReleases = {
  35: { id: 1247942375, label: 'Warner Records' },
  38: { id: 1536669507, label: 'Arista' },
  168: { id: 281111401, label: 'Warp' },
  169: {
    id: 1440760785,
    label: 'DreamWorks',
    metadataUrl: 'https://www.universalmusic.ca/2019/08/06/elliott-smiths-major-label-masterpieces-xo-and-figure-8-out-now-as-digital-deluxe-editions/',
  },
}
// Higher-resolution originals, replacing thumbnails and reissue artwork.
const appleCovers = {
  2: 1097861387,
  40: 313302066,
  46: 1440856219,
  58: 1544226562,
  64: 1660485817,
  74: 1440898333,
  78: 1850810462,
  107: 850571319,
  109: 1510827144,
  147: 1771710012,
  176: 1097863576,
  178: 1440814077,
  193: 693063670,
}

async function appleAlbum(rank, id) {
  const response = JSON.parse((await cached(`${rank}-apple-${id}.json`, `https://itunes.apple.com/lookup?id=${id}`)).toString())
  const album = response.results.find((album) => album.collectionId === id)
  if (!album) throw new Error(`Apple release ${id} not found`)
  return album
}

function headerFrom(html, title) {
  const state = html.match(/window\.__PRELOADED_STATE__ = (\{[\s\S]*?\});?\s*<\/script>/)?.[1]
  if (!state) throw new Error('Review metadata not found')
  const review = JSON.parse(state).transformed?.review
  const header = review?.headerProps
  const items = review?.multiReviewHeaderProps?.itemsReviewed ?? []
  const item = items.find((item) => item.dangerousHed === title)
    ?? items.find((item) => item.dangerousHed.startsWith(`${title} [`))
    ?? items.find((item) => title.startsWith(`${item.dangerousHed} /`))
  const label = item?.publisher ?? header?.infoSliceFields?.label
  if (!label) throw new Error('Review label not found')
  return { label, image: item?.image ?? header.lede, matchedItem: Boolean(item) }
}

function paletteFrom({ r, g, b }) {
  const hex = (scale) => '#' + [r, g, b].map((v) => Math.round(v * scale).toString(16).padStart(2, '0')).join('')
  const linear = [r, g, b].map((v) => v / 255 <= 0.04045 ? v / 255 / 12.92 : ((v / 255 + 0.055) / 1.055) ** 2.4)
  const luminance = linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722
  return { base: hex(1), accent: hex(0.8), deep: hex(0.65), ink: luminance > 0.35 ? '#171717' : '#ffffff' }
}

const albums = new Array(200)
const errors = []
let next = 0
async function worker() {
  while (next < sourceAlbums.length) {
    const row = sourceAlbums[next++]
    try {
      const rank = String(row.Rank).padStart(3, '0')
      const reviewUrl = reviewOverrides[row.Rank] ?? (row.URL === '#' ? undefined : row.URL.replace('www.pitchfork.com', 'pitchfork.com'))
      let label, metadataUrl, coverReleaseUrl
      let coverSourceUrl = row.imgURL
      if (reviewUrl) {
        const header = headerFrom((await cached(`${rank}-review.html`, reviewUrl)).toString(), row.Album)
        label = header.label
        metadataUrl = reviewUrl
        if (!coverSourceUrl.includes('media.pitchfork.com') || header.matchedItem) coverSourceUrl = header.image.sources.md.url
      } else {
        const release = appleReleases[row.Rank]
        const album = await appleAlbum(rank, release.id)
        label = release.label
        metadataUrl = release.metadataUrl ?? album.collectionViewUrl
        coverReleaseUrl = album.collectionViewUrl
        coverSourceUrl = album.artworkUrl100.replace('/100x100bb.jpg', '/600x600bb.jpg')
      }
      if (appleCovers[row.Rank]) {
        const album = await appleAlbum(rank, appleCovers[row.Rank])
        coverSourceUrl = album.artworkUrl100.replace('/100x100bb.jpg', '/600x600bb.jpg')
        coverReleaseUrl = album.collectionViewUrl
      }
      coverSourceUrl = coverSourceUrl.replace(/\/(?:1:1|master)\/w_[^/]+\//, '/1:1/w_600,c_limit/')
        .replace('/master/pass/', '/1:1/w_600,c_limit/')
      const hash = createHash('sha256').update(coverSourceUrl).digest('hex').slice(0, 12)
      const bytes = await cached(`${rank}-cover-${hash}`, coverSourceUrl)
      const dimensions = await sharp(bytes).metadata()
      if (dimensions.width < 400 || dimensions.height < 400) throw new Error('Cover is smaller than 400px')
      const cover = sharp(bytes).rotate().resize(600, 600, { fit: 'inside', withoutEnlargement: true })
      const stats = await cover.stats()
      const coverPath = `/covers/pitchfork-${rank}.webp`
      await cover.webp({ quality: 85 }).toFile(`public${coverPath}`)
      albums[row.Rank - 1] = {
        id: `pitchfork-${rank}`,
        title: row.Album,
        // Repair the source's double-encoded accented artist name.
        artist: row.Artist.includes('Ã') ? Buffer.from(row.Artist, 'latin1').toString('utf8') : row.Artist,
        year: row['Release Date'],
        genre: row.Genre,
        label,
        coverUrl: coverPath,
        palette: paletteFrom(stats.dominant),
        source: { rank: row.Rank, votes: row.Votes, reviewUrl, metadataUrl, coverSourceUrl, coverReleaseUrl },
      }
      console.log(`${rank} ${row.Artist} — ${row.Album}`)
    } catch (error) {
      errors.push({ rank: row.Rank, album: row.Album, error: String(error) })
      console.error(`FAILED ${row.Rank}: ${error}`)
    }
  }
}
await Promise.all(Array.from({ length: 4 }, worker))
if (errors.length) {
  await writeFile(`${cache}/errors.json`, JSON.stringify(errors, null, 2))
  throw new Error(`${errors.length} albums failed; see ${cache}/errors.json`)
}
await writeFile('src/data/pitchfork-200.json', JSON.stringify({
  title: "Pitchfork Readers' 200 Best Albums of the Last 25 Years",
  publishedYear: 2021,
  sourceUrl,
  bundleUrl,
  retrievedAt: new Date().toISOString().slice(0, 10),
  albums,
}, null, 2) + '\n')
console.log('Saved all 200 albums and local covers.')
