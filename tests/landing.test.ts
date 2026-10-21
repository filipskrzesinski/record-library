import assert from 'node:assert/strict'
import test from 'node:test'
import collection from '../src/data/pitchfork-200.json'
import { SEED_LISTENS } from '../src/lib/seed'
import { COLLECTION, FAN, SHOWCASE } from '../src/lib/showcase'

const albums = collection.albums

test('every sleeve the landing page shows is copied faithfully from the collection', () => {
  assert.equal(new Set(SHOWCASE.map((album) => album.id)).size, SHOWCASE.length)
  for (const shown of SHOWCASE) {
    const source = albums.find((album) => album.id === shown.id)
    assert.ok(source, `${shown.id} is not in the collection`)
    assert.deepEqual(
      { ...shown },
      {
        id: source.id,
        title: source.title,
        artist: source.artist,
        year: source.year,
        coverUrl: source.coverUrl,
        palette: source.palette,
      },
    )
  }
})

test('the hero fan has a centre sleeve', () => {
  assert.equal(FAN.length % 2, 1)
  assert.deepEqual(FAN, SHOWCASE.slice(0, FAN.length))
})

test('the figures quoted on the landing page match the collection', () => {
  const genres = Object.entries(
    albums.reduce<Record<string, number>>((counts, album) => {
      counts[album.genre] = (counts[album.genre] ?? 0) + 1
      return counts
    }, {}),
  ).sort((a, b) => b[1] - a[1])

  const decades = Object.entries(
    albums.reduce<Record<number, number>>((counts, album) => {
      const decade = Math.floor(album.year / 10) * 10
      counts[decade] = (counts[decade] ?? 0) + 1
      return counts
    }, {}),
  ).sort((a, b) => Number(a[0]) - Number(b[0]))

  assert.equal(COLLECTION.records, albums.length)
  assert.equal(COLLECTION.ranks, Math.max(...albums.map((album) => album.source.rank)))
  assert.equal(COLLECTION.artists, new Set(albums.map((album) => album.artist)).size)
  assert.equal(COLLECTION.labels, new Set(albums.map((album) => album.label)).size)
  assert.equal(COLLECTION.votes, albums.reduce((sum, album) => sum + album.source.votes, 0))
  assert.equal(COLLECTION.yearFrom, Math.min(...albums.map((album) => album.year)))
  assert.equal(COLLECTION.yearTo, Math.max(...albums.map((album) => album.year)))
  assert.deepEqual(
    COLLECTION.genres.map((genre) => [genre.name, genre.count]),
    genres,
  )
  assert.deepEqual(
    COLLECTION.decades.map((decade) => [String(decade.decade), decade.count]),
    decades,
  )
})

test('the sample listening figures match the seeded sessions', () => {
  assert.equal(COLLECTION.listens, SEED_LISTENS.length)
  assert.equal(COLLECTION.listenedAlbums, new Set(SEED_LISTENS.map((listen) => listen.albumId)).size)
})
