import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { GridIcon, HistoryIcon, ListIcon, ShelfIcon } from '@/components/TopBar'
import { Button } from '@/components/ui/button'
import { SEED_LISTENS } from '@/lib/seed'
import { PITCHFORK_SOURCE_URL } from '@/lib/sources'
import collection from '@/data/pitchfork-200.json'

/** The landing page reads the bundled collection directly, so it renders before the database opens. */
const ALBUMS = collection.albums

/** Quoted from the bundle rather than written down, so the page cannot drift from the seed. */
const RECORDS = ALBUMS.length
const LISTENS = SEED_LISTENS.length
/** The source poll runs to 200 places; a couple of them are paired entries. */
const RANKS = Math.max(...ALBUMS.map((album) => album.source.rank))

function pick(...ranks: number[]) {
  return ranks.map((rank) => ALBUMS[rank - 1])
}

/** Front-facing sleeve flanked by three angled on each side, as the shelf shows it. */
const FAN = pick(11, 7, 3, 1, 8, 14, 20)
/** Two bands of sleeves drifting in opposite directions behind the collection statement. */
const WALL_TOP = pick(2, 5, 9, 13, 17, 21, 25, 29, 33, 37, 41, 45, 49, 53, 57, 61, 65, 69)
const WALL_BOTTOM = pick(4, 10, 16, 22, 28, 34, 40, 46, 52, 58, 64, 70, 76, 82, 88, 94, 100, 106)
/** A single day of listening, laid out the way the History view lays one out. */
const DAY = [
  { album: ALBUMS[30], place: 'Living room', deck: 'Technics SL-1200' },
  { album: ALBUMS[23], place: 'Study', deck: 'Rega Planar 3' },
  { album: ALBUMS[5], place: 'Kitchen', deck: 'Thorens TD 160' },
]

function Overline({ children }: { children: ReactNode }) {
  return <p className="font-label text-label uppercase text-ink-faint">{children}</p>
}

/** Section heading: the same serif steps the album pages climb through. */
function Heading({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h2
      className={`font-display-sm text-display-sm text-ink-strong sm:font-display-md sm:text-display-md ${className}`}
    >
      {children}
    </h2>
  )
}

function Sleeve({
  src,
  alt,
  className = '',
  eager = false,
}: {
  src: string
  alt: string
  className?: string
  eager?: boolean
}) {
  return (
    <img
      src={src}
      alt={alt}
      width={600}
      height={600}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className={`aspect-square w-full bg-well object-cover ${className}`}
    />
  )
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 bg-paper-high/88 backdrop-blur-sm">
      <div className="mx-auto flex h-11 max-w-[1120px] items-center justify-between gap-6 px-6 sm:px-10">
        <span className="font-caption text-caption text-ink">Record Library</span>
        <nav className="flex items-center gap-1">
          <Button variant="quiet" size="sm" asChild>
            <a href="#views">Views</a>
          </Button>
          <Button variant="quiet" size="sm" className="hidden sm:inline-flex" asChild>
            <a href="#collection">Collection</a>
          </Button>
          <Button variant="solid" size="sm" className="ml-1.5" asChild>
            <Link to="/library">Open the library</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 sm:pt-28">
      <div className="mx-auto flex max-w-[1120px] flex-col items-center px-6 text-center sm:px-10">
        <Overline>Local-first record catalogue</Overline>
        <h1 className="mt-6 max-w-[19ch] font-display-sm text-display-sm text-ink-strong sm:font-display-md sm:text-display-md lg:font-display lg:text-display">
          A catalogue for the records you actually own.
        </h1>
        <p className="mt-7 max-w-[54ch] font-body-relaxed text-body-relaxed text-ink-muted">
          Flip through your sleeves in cover flow, keep the pressing details that tell two copies
          apart, and log every time a record comes off the shelf. It runs entirely in your browser —
          no server, no account, nothing to sync.
        </p>
        <div className="mt-9 flex items-center gap-2.5">
          <Button variant="solid" asChild>
            <Link to="/library">Open the library</Link>
          </Button>
          <Button variant="outline" asChild>
            <a href="#views">See the views</a>
          </Button>
        </div>
        <p className="mt-8 font-caption text-caption tabular-nums text-ink-faint">
          {RECORDS} records · {LISTENS} listens · 0 accounts
        </p>
      </div>

      <div className="fan mt-16 sm:mt-20" aria-hidden>
        <div className="fan-floor">
          {FAN.map((album, i) => (
            <div key={album.id} className="fan-item rounded-md" style={{ '--d': i - 3 } as CSSProperties}>
              <Sleeve src={album.coverUrl} alt="" className="rounded-md" eager />
              <span className="fan-haze rounded-md" />
              <span className="fan-reflection">
                <Sleeve src={album.coverUrl} alt="" className="fan-reflection-art rounded-md" eager />
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-[1120px] px-6 text-center sm:px-10">
        <p className="font-record text-record text-ink">{FAN[3].title}</p>
        <p className="mt-1 font-metadata text-metadata text-ink-muted">
          {FAN[3].artist} · {FAN[3].year}
        </p>
      </div>
    </section>
  )
}

function Wall() {
  return (
    <section id="collection" className="scroll-mt-16 pt-32 sm:pt-40">
      <div className="mx-auto max-w-[1120px] px-6 text-center sm:px-10">
        <Overline>The collection</Overline>
        <Heading className="mx-auto mt-6 max-w-[20ch]">
          Every sleeve bundled, ready offline.
        </Heading>
        <p className="mx-auto mt-6 max-w-[52ch] font-body-relaxed text-body-relaxed text-ink-muted">
          A new library arrives seeded with the Pitchfork readers' list — {RECORDS} records across
          its {RANKS} places, artwork and all. Every cover is a local file, so the shelf fills
          instantly and keeps working with the network off.
        </p>
      </div>

      <div className="wall mt-14" aria-hidden>
        {[WALL_TOP, WALL_BOTTOM].map((row, index) => (
          <div key={index} className={`wall-row ${index === 1 ? 'wall-row-reverse' : ''}`}>
            {[...row, ...row].map((album, i) => (
              <Sleeve key={`${album.id}-${i}`} src={album.coverUrl} alt="" className="wall-sleeve rounded-sm" />
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

const VIEWS = [
  {
    icon: <ShelfIcon />,
    name: 'Shelf',
    copy: 'Cover flow, one sleeve at a time. Scroll, arrow through, press Enter to open.',
  },
  {
    icon: <GridIcon />,
    name: 'Grid',
    copy: 'Every sleeve at once. Hover tilts the cover and dims the rest of the wall.',
  },
  {
    icon: <ListIcon />,
    name: 'List',
    copy: 'Spines on a shelf, coloured from the artwork. The densest way to scan a run.',
  },
  {
    icon: <HistoryIcon />,
    name: 'History',
    copy: 'Listening sessions by day, newest first, with the records you played on each.',
  },
]

function Views() {
  return (
    <section id="views" className="scroll-mt-16 pt-32 sm:pt-40">
      <div className="mx-auto max-w-[1120px] px-6 sm:px-10">
        <Overline>Four ways to look</Overline>
        <Heading className="mt-6 max-w-[18ch]">The same collection, read four ways.</Heading>

        <div className="mt-14 grid gap-px overflow-hidden rounded-md bg-line sm:grid-cols-2 lg:grid-cols-4">
          {VIEWS.map((view) => (
            <div key={view.name} className="flex flex-col gap-3 bg-paper-high p-6">
              <span className="text-ink-faint [&_svg]:size-6">{view.icon}</span>
              <h3 className="font-record-sm text-record-sm text-ink-strong">{view.name}</h3>
              <p className="font-small text-small text-ink-muted">{view.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/** An illustrative sheet: the label comes from the bundled data, the rest is the kind
    of thing a collector types in, since the source list never says which copy you own. */
const PRESSING_EXAMPLE = ALBUMS[10]

const PRESSING = [
  ['Label', PRESSING_EXAMPLE.label],
  ['Catalog', 'MRG-136'],
  ['Pressing', '2015 reissue'],
  ['Speed', '45 rpm'],
  ['Weight', '180 g'],
  ['Country', 'United States'],
  ['Mastering', 'Half-speed, lacquer cut'],
  ['Condition', 'Near mint'],
]

function Pressing() {
  const album = PRESSING_EXAMPLE
  return (
    <section className="pt-32 sm:pt-40">
      <div className="mx-auto grid max-w-[1120px] items-start gap-14 px-6 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
        <div>
          <Overline>Every pressing</Overline>
          <Heading className="mt-6 max-w-[16ch]">The details that tell two copies apart.</Heading>
          <p className="mt-6 max-w-[48ch] font-body-relaxed text-body-relaxed text-ink-muted">
            Catalog number, pressing, speed, weight, country, mastering, condition — all of it edits
            in place on the record's own page. Click a value, type, press Enter. Nothing is seeded
            for you, because the list cannot know which copy is on your shelf.
          </p>
          <div className="mt-9">
            <Button variant="outline" asChild>
              <Link to="/library">Browse the collection</Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex items-end gap-5">
            <div className="w-28 shrink-0 shadow-cover sm:w-36">
              <Sleeve src={album.coverUrl} alt={`${album.title} by ${album.artist}`} className="rounded-md" />
            </div>
            <div className="min-w-0 pb-1">
              <p className="truncate font-record text-record text-ink-strong">{album.title}</p>
              <p className="mt-1 truncate font-metadata text-metadata text-ink-muted">
                {album.artist} · {album.year}
              </p>
            </div>
          </div>

          <dl className="m-0">
            {PRESSING.map(([label, value]) => (
              <div
                key={label}
                className="grid grid-cols-[86px_minmax(0,1fr)] items-baseline gap-5 border-t border-line py-2.5 sm:grid-cols-[104px_minmax(0,1fr)]"
              >
                <dt className="font-label text-label uppercase text-ink-faint">{label}</dt>
                <dd className="m-0 min-w-0 font-body text-body">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

function Listening() {
  return (
    <section className="pt-32 sm:pt-40">
      <div className="mx-auto max-w-[1120px] px-6 sm:px-10">
        <Overline>Listening history</Overline>
        <Heading className="mt-6 max-w-[20ch]">A record of every time it came off the shelf.</Heading>
        <p className="mt-6 max-w-[52ch] font-body-relaxed text-body-relaxed text-ink-muted">
          Log a listen with the date, the room, the signal chain and a note. The history stacks by
          day, newest first, so a year of listening reads like a diary rather than a spreadsheet.
        </p>

        <div className="mt-14 flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-start sm:gap-12">
          <div className="shrink-0">
            <p className="font-date text-date leading-none text-ink-strong">14</p>
            <p className="mt-3 font-label text-label uppercase text-ink-faint">Saturday · March</p>
          </div>

          <div className="grid flex-1 grid-cols-3 gap-5 sm:max-w-[520px]">
            {DAY.map(({ album, place, deck }) => (
              <div key={album.id}>
                <div className="shadow-cover">
                  <Sleeve src={album.coverUrl} alt={`${album.title} by ${album.artist}`} className="rounded-md" />
                </div>
                <p className="mt-3 truncate font-record-sm text-record-sm text-ink">{album.title}</p>
                <p className="truncate font-metadata text-metadata text-ink-muted">{album.artist}</p>
                <p className="mt-1.5 hidden truncate font-caption text-caption text-ink-faint sm:block">
                  {place} · {deck}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const PRINCIPLES = [
  {
    title: 'Stored in your browser',
    copy: 'The whole library lives in IndexedDB on your machine. There is no backend to sign up for and nothing leaves the device.',
  },
  {
    title: 'No calls at runtime',
    copy: 'Artwork and metadata are bundled as local files. Once the page is open, the collection works with the network switched off.',
  },
  {
    title: 'Your edits survive',
    copy: 'Updating the bundled list never overwrites what you changed. Edited records, your own additions and your sessions are left alone.',
  },
]

function Principles() {
  return (
    <section className="pt-32 sm:pt-40">
      <div className="mx-auto max-w-[1120px] px-6 sm:px-10">
        <Overline>How it works</Overline>
        <div className="mt-10 grid gap-10 border-t border-line pt-10 sm:grid-cols-3 sm:gap-8">
          {PRINCIPLES.map((principle) => (
            <div key={principle.title}>
              <h3 className="font-record-sm text-record-sm text-ink-strong">{principle.title}</h3>
              <p className="mt-2.5 font-small text-small text-ink-muted">{principle.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Provenance() {
  return (
    <section className="pt-32 sm:pt-40">
      <div className="mx-auto max-w-[1120px] px-6 sm:px-10">
        <div className="max-w-[60ch] border-t border-line pt-10">
          <Overline>Seeded collection</Overline>
          <p className="mt-6 font-record-md text-record-md text-ink">
            The starting library is the whole of{' '}
            <a
              href={PITCHFORK_SOURCE_URL}
              target="_blank"
              rel="noreferrer"
              className="underline decoration-line underline-offset-4 transition-colors duration-150 hover:decoration-ink-faint"
            >
              Pitchfork's 25th-anniversary readers' poll
            </a>
            : {RECORDS} records across its {RANKS} places, since a couple of places are paired
            entries. Rank, votes, release year, genre and label come across from the source, and
            every cover was downloaded once and bundled as a local WebP.
          </p>
          <p className="mt-5 font-small text-small text-ink-muted">
            Ratings, condition, catalog numbers and pressing details are deliberately left blank —
            the poll says which albums are loved, not which edition you own. Delete the lot and the
            app keeps your empty collection empty.
          </p>
        </div>
      </div>
    </section>
  )
}

function Closing() {
  return (
    <section className="pt-32 sm:pt-40">
      <div className="mx-auto flex max-w-[1120px] flex-col items-center px-6 text-center sm:px-10">
        <Heading className="max-w-[16ch]">Put your shelf in order.</Heading>
        <p className="mt-6 max-w-[44ch] font-body-relaxed text-body-relaxed text-ink-muted">
          The library opens seeded and ready. Keep the records you like, delete the rest, add your
          own.
        </p>
        <div className="mt-9">
          <Button variant="solid" asChild>
            <Link to="/library">Open the library</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="mt-28 sm:mt-32">
      <div className="mx-auto max-w-[1120px] px-6 sm:px-10">
        <div className="flex flex-col gap-6 border-t border-line py-10 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-caption text-caption text-ink">Record Library</span>
          <div className="flex items-center gap-5 font-caption text-caption text-ink-muted">
            <Link to="/library" className="transition-colors duration-150 hover:text-ink">
              Collection
            </Link>
            <a
              href={PITCHFORK_SOURCE_URL}
              target="_blank"
              rel="noreferrer"
              className="transition-colors duration-150 hover:text-ink"
            >
              Source list
            </a>
          </div>
        </div>
        <p className="max-w-[72ch] pb-16 font-caption text-caption text-ink-faint">
          Album artwork remains the property of its respective rights holders; source attribution
          does not grant an artwork license. Listening sessions shown here are sample data.
        </p>
      </div>
    </footer>
  )
}

export function Landing() {
  return (
    <div className="bg-paper-high">
      <Nav />
      <main>
        <Hero />
        <Wall />
        <Views />
        <Pressing />
        <Listening />
        <Principles />
        <Provenance />
        <Closing />
      </main>
      <Footer />
    </div>
  )
}
