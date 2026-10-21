import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Cover } from '@/components/Cover'
import { GridIcon, HistoryIcon, ListIcon, ShelfIcon, TopBar } from '@/components/TopBar'
import { Button } from '@/components/ui/button'
import { spineStyle } from '@/lib/art'
import { SEED_ALBUMS, SEED_LISTENS } from '@/lib/seed'
import { PITCHFORK_SOURCE_URL } from '@/lib/sources'
import type { Album } from '@/lib/types'

const BY_ID = new Map(SEED_ALBUMS.map((album) => [album.id, album]))

/** Sleeves shown as illustration. Every id is a seeded record, so the artwork is local. */
function sleeve(id: string): Album {
  return BY_ID.get(id) ?? SEED_ALBUMS[0]
}

const GRID_SLEEVES = [
  'pitchfork-019', 'pitchfork-008', 'pitchfork-014', 'pitchfork-020',
  'pitchfork-035', 'pitchfork-050', 'pitchfork-062', 'pitchfork-067',
]
const LIST_SPINES = [
  'pitchfork-001', 'pitchfork-010', 'pitchfork-016',
  'pitchfork-035', 'pitchfork-062', 'pitchfork-019',
]
const SHELF_SLEEVES = ['pitchfork-019', 'pitchfork-014', 'pitchfork-020']
const HISTORY_SLEEVES = ['pitchfork-050', 'pitchfork-062']
const FEATURED = sleeve('pitchfork-010')

/** Fields the source list cannot fill in: they describe the copy on your own shelf. */
const UNSEEDED_FIELDS = [
  'Catalog no.',
  'Pressing',
  'Mastering',
  'Speed',
  'Weight',
  'Format',
  'Country',
  'Condition',
  'Rating',
]

/** The most recent sample sessions, as the History view stacks a single day. */
const LOG_ENTRIES = [
  {
    album: sleeve('pitchfork-001'),
    location: 'Living room',
    system: 'Technics SL-1200GR',
    notes: 'A quiet evening, listened all the way through.',
  },
  {
    album: sleeve('pitchfork-070'),
    location: 'Study',
    system: 'Rega Planar 3',
    notes: 'Phone in the other room. Listened without interruptions.',
  },
  {
    album: sleeve('pitchfork-019'),
    location: 'Kitchen',
    system: 'Wiim Mini',
    notes: 'Put this on while making dinner. Stayed for the whole album.',
  },
]

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="font-label text-label uppercase text-ink-faint">{children}</p>
}

function SectionHead({
  id,
  label,
  title,
  lead,
}: {
  id?: string
  label: string
  title: ReactNode
  lead: string
}) {
  return (
    <div id={id} className="flex max-w-3xl scroll-mt-16 flex-col gap-5">
      <Eyebrow>{label}</Eyebrow>
      <h2 className="font-display-sm text-display-sm text-ink-strong sm:font-display-md sm:text-display-md">
        {title}
      </h2>
      <p className="max-w-xl font-body-relaxed text-body-relaxed text-ink-muted">{lead}</p>
    </div>
  )
}

/**
 * The whole collection stood upright, drifting past. Spines are drawn from each
 * record's palette, so the band costs nothing to load — the sleeve images stay
 * further down the page.
 */
function ShelfBand() {
  const run = SEED_ALBUMS.map((album, i) => (
    <div
      key={album.id}
      className="shelf-band-spine rounded-sm"
      style={{
        ...spineStyle(album.palette),
        width: 12 + ((i * 7) % 11),
        height: `${94 + ((i * 5) % 3) * 2}%`,
      }}
    >
      <span className="font-glyph text-glyph">{album.title}</span>
    </div>
  ))

  return (
    <div className="shelf-band" aria-hidden>
      {/* Two identical runs so the drift can loop without a seam. */}
      <div className="shelf-band-track">
        {run}
        {run}
      </div>
    </div>
  )
}

/** Three sleeves angled away from a front-facing one, as the Shelf view arranges them. */
function Fan({ ids }: { ids: string[] }) {
  return (
    <div className="landing-fan">
      {ids.map((id, i) => {
        const album = sleeve(id)
        return (
          <div key={id} className="landing-fan-item" style={{ '--d': i - (ids.length - 1) / 2 } as CSSProperties}>
            <Cover
              art={album.art}
              palette={album.palette}
              src={album.coverUrl}
              className="rounded-md"
            />
          </div>
        )
      })}
    </div>
  )
}

function ViewCard({
  icon,
  name,
  description,
  children,
}: {
  icon: ReactNode
  name: string
  description: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-md bg-raised shadow-lift ring-1 ring-line">
      <div className="relative h-60 overflow-hidden bg-paper sm:h-72">{children}</div>
      <div className="flex flex-col gap-2 border-t border-line-soft px-6 py-5">
        <div className="flex items-center gap-2.5 text-ink">
          <span className="text-ink-faint">{icon}</span>
          <h3 className="font-label text-label uppercase">{name}</h3>
        </div>
        <p className="font-small text-small text-ink-muted">{description}</p>
      </div>
    </div>
  )
}

/** One metadata row, matching the album page's label-and-value grid. */
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[104px_minmax(0,1fr)] items-baseline gap-5 border-t border-line py-2.5">
      <dt className="font-label text-label uppercase text-ink-faint">{label}</dt>
      <dd className="min-w-0 font-body text-body">{children}</dd>
    </div>
  )
}

export function Landing() {
  return (
    <>
      <TopBar
        left={<span className="font-caption text-caption text-ink-muted">Record Library</span>}
        right={
          <Button variant="quiet" size="sm" className="-mr-2.5" asChild>
            <Link to="/library">Open the library</Link>
          </Button>
        }
      />

      <main>
        {/* ------------------------------------------------------------- hero */}
        <section className="flex flex-col items-center px-6 pb-16 pt-20 text-center sm:px-10 sm:pt-28 xl:px-16">
          <Eyebrow>Local-first · No account</Eyebrow>
          <h1 className="mt-7 max-w-4xl font-display-sm text-display-sm text-ink-strong sm:font-display-md sm:text-display-md lg:font-display lg:text-display">
            Every record you own.
            <br />
            Every time you played it.
          </h1>
          <p className="mt-8 max-w-xl font-body-relaxed text-body-relaxed text-ink-muted">
            Browse the sleeves, keep the detail of the pressing in your hands, and log every
            listen. Record Library runs entirely in your browser — the collection lives on your
            machine, not on a server.
          </p>
          <div className="mt-10 flex items-center gap-2">
            <Button variant="solid" asChild>
              <Link to="/library">Open the library</Link>
            </Button>
            <Button variant="quiet" asChild>
              <a href="#views">See the four views</a>
            </Button>
          </div>
        </section>

        <ShelfBand />

        <p className="px-6 pt-8 text-center font-caption text-caption tabular-nums text-ink-faint sm:px-10 xl:px-16">
          {SEED_ALBUMS.length} records · {SEED_LISTENS.length} listening sessions · nothing to sign into
        </p>

        {/* ------------------------------------------------------------ views */}
        <section className="flex flex-col gap-14 px-6 pt-32 sm:px-10 xl:px-16">
          <SectionHead
            id="views"
            label="Four views"
            title="One collection, four ways to stand in front of it."
            lead="The same records, re-shelved. Switch from the top bar — the view and the sort you leave it on are the ones you come back to."
          />

          <div className="grid gap-5 lg:grid-cols-2">
            <ViewCard
              icon={<GridIcon />}
              name="Grid"
              description="Sleeves at full size, five across on a wide screen, each one tilting toward the cursor while its neighbours fade back."
            >
              <div className="grid grid-cols-3 gap-3 p-5 pb-0 sm:grid-cols-4">
                {GRID_SLEEVES.map((id) => {
                  const album = sleeve(id)
                  return (
                    <Cover
                      key={id}
                      art={album.art}
                      palette={album.palette}
                      src={album.coverUrl}
                      className="rounded-md shadow-cover"
                    />
                  )
                })}
              </div>
            </ViewCard>

            <ViewCard
              icon={<ListIcon />}
              name="List"
              description="Spines, as if the shelf were seen edge-on: label, catalog number, format, year and play count on a single line."
            >
              <div className="flex flex-col gap-[5px] p-5">
                {LIST_SPINES.map((id) => {
                  const album = sleeve(id)
                  return (
                    <div
                      key={id}
                      style={spineStyle(album.palette)}
                      className="flex h-10 items-center gap-4 overflow-hidden rounded-sm px-4 shadow-spine ring-1 ring-inset ring-sleeve-edge"
                    >
                      <span className="min-w-0 flex-1 truncate font-record-sm text-record-sm">
                        {album.title}
                      </span>
                      <span className="shrink-0 font-label text-label uppercase opacity-60">
                        {album.label}
                      </span>
                      <span className="w-9 shrink-0 text-right font-label text-label uppercase opacity-70">
                        {album.year}
                      </span>
                    </div>
                  )
                })}
              </div>
            </ViewCard>

            <ViewCard
              icon={<ShelfIcon />}
              name="Shelf"
              description="Cover flow. Scroll it, swipe it, or walk the collection one sleeve at a time with the arrow keys."
            >
              <Fan ids={SHELF_SLEEVES} />
            </ViewCard>

            <ViewCard
              icon={<HistoryIcon />}
              name="History"
              description="Every listen stacked by day, under a date you can read from across the room."
            >
              <div className="flex h-full items-center gap-7 p-5">
                <div className="flex flex-col items-start gap-3">
                  <span className="font-date text-date leading-16 text-ink tabular-nums">14</span>
                  <span className="flex flex-col gap-1 font-label text-label uppercase">
                    <span className="text-ink">Saturday</span>
                    <span className="text-ink-faint">March</span>
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 gap-4">
                  {HISTORY_SLEEVES.map((id) => {
                    const album = sleeve(id)
                    return (
                      <Cover
                        key={id}
                        art={album.art}
                        palette={album.palette}
                        src={album.coverUrl}
                        className="min-w-0 flex-1 rounded-md shadow-cover"
                      />
                    )
                  })}
                </div>
              </div>
            </ViewCard>
          </div>
        </section>

        {/* ----------------------------------------------------------- detail */}
        <section className="px-6 pt-32 sm:px-10 xl:px-16">
          <SectionHead
            label="Pressing detail"
            title="Everything the list knows, and room for everything only you do."
            lead="Each record arrives with the metadata from the source list. The fields that describe the copy on your shelf stay empty until you fill them in — a poll of readers cannot know which pressing you own."
          />

          <div className="mt-14 grid items-start gap-12 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-20">
            <div>
              <Cover
                art={FEATURED.art}
                palette={FEATURED.palette}
                src={FEATURED.coverUrl}
                alt={`${FEATURED.title} by ${FEATURED.artist}`}
                className="rounded-md shadow-cover"
              />
              <h3 className="mt-7 font-display-sm text-display-sm text-ink-strong">{FEATURED.title}</h3>
              <p className="mt-2 font-small text-small text-ink-muted">
                {FEATURED.artist} · {FEATURED.year}
              </p>
            </div>

            <div className="min-w-0">
              <dl>
                <Field label="Label">{FEATURED.label}</Field>
                <Field label="Genre">{FEATURED.genre}</Field>
                <Field label="Released">{FEATURED.year}</Field>
                {FEATURED.source && (
                  <Field label="Readers' list">
                    #{FEATURED.source.rank} · {FEATURED.source.votes.toLocaleString('en')} votes
                  </Field>
                )}
                {UNSEEDED_FIELDS.map((label) => (
                  <Field key={label} label={label}>
                    <span className="text-ink-faint">—</span>
                  </Field>
                ))}
              </dl>
              <p className="mt-5 border-t border-line pt-5 font-small text-small text-ink-muted">
                Click any value to edit it in place. There is no save button and no form — the
                change is written to the collection as you leave the field.
              </p>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------- log */}
        <section className="px-6 pt-32 sm:px-10 xl:px-16">
          <SectionHead
            label="Listening log"
            title="A record of the playing, not just the owning."
            lead="Log a listen with the date, the room, the signal chain and a note on how it went. History groups them by day and counts them back onto each record."
          />

          <div className="mt-14 flex flex-col items-start gap-10 border-t border-line pt-10 md:flex-row md:gap-16">
            <div className="flex w-full flex-none flex-col items-start gap-3 md:w-64">
              <span className="font-date text-date text-ink tabular-nums">9</span>
              <span className="flex flex-col gap-1 pt-3 font-label text-label uppercase">
                <span className="text-ink">Thursday</span>
                <span className="text-ink-faint">October</span>
              </span>
              <span className="pl-1 font-caption text-caption text-ink-faint">
                {LOG_ENTRIES.length} records
              </span>
            </div>

            <ol className="flex w-full min-w-0 grow basis-0 flex-col gap-10 sm:flex-row sm:gap-10">
              {LOG_ENTRIES.map(({ album, location, system, notes }) => (
                <li key={album.id} className="flex w-full min-w-0 flex-col gap-6 sm:w-56">
                  <Cover
                    art={album.art}
                    palette={album.palette}
                    src={album.coverUrl}
                    alt={`${album.title} by ${album.artist}`}
                    className="rounded-md shadow-cover"
                  />
                  <div className="flex flex-col gap-1">
                    <span className="font-record-lg text-record-lg text-ink">{album.title}</span>
                    <span className="font-small text-small text-ink-muted">
                      {album.artist} · {album.year}
                    </span>
                    <span className="font-metadata text-metadata text-ink-faint">
                      {location} · {system}
                    </span>
                    <p className="mt-2 font-small text-small text-ink-muted">{notes}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ------------------------------------------------------- local-first */}
        <section className="px-6 pt-32 sm:px-10 xl:px-16">
          <SectionHead
            label="How it works"
            title="No server. No account. No sync."
            lead="The app is a static build and a database in the browser. Open it, and the collection is already there."
          />

          <div className="mt-14 grid gap-10 border-t border-line pt-10 sm:grid-cols-3 sm:gap-12">
            <div className="flex flex-col gap-3">
              <h3 className="font-label text-label uppercase text-ink">On your machine</h3>
              <p className="font-body-relaxed text-body-relaxed text-ink-muted">
                Records and listens are stored in IndexedDB through Dexie. There is nothing to
                sign into, and nothing is sent anywhere. Clearing the database reseeds the
                collection; everything you edited until then was only ever local.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="font-label text-label uppercase text-ink">Artwork included</h3>
              <p className="font-body-relaxed text-body-relaxed text-ink-muted">
                All {SEED_ALBUMS.length} sleeves ship with the app as optimized WebP files. No
                external metadata or image service is called at runtime, so the shelf fills in
                offline. Records you add fall back to generated sleeve art.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="font-label text-label uppercase text-ink">Built to be read</h3>
              <p className="font-body-relaxed text-body-relaxed text-ink-muted">
                Vite, React and TypeScript, Tailwind 4, and a few heavily customised Radix
                primitives. One theme file holds every type size, colour and radius the
                interface is allowed to use.
              </p>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------- cta */}
        <section className="flex flex-col items-center px-6 pb-28 pt-32 text-center sm:px-10 xl:px-16">
          <h2 className="max-w-2xl font-display-sm text-display-sm text-ink-strong sm:font-display-md sm:text-display-md">
            Start from {SEED_ALBUMS.length} records, or clear it out and shelve your own.
          </h2>
          <div className="mt-10">
            <Button variant="solid" asChild>
              <Link to="/library">Open the library</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-line px-6 py-12 sm:px-10 xl:px-16">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <p className="font-dialog text-dialog text-ink-strong">Record Library</p>
          <p className="max-w-xl font-caption text-caption text-ink-muted">
            Seeded from{' '}
            <a
              className="underline underline-offset-4 transition-colors duration-150 hover:text-ink-muted"
              href={PITCHFORK_SOURCE_URL}
              target="_blank"
              rel="noreferrer"
            >
              Pitchfork's 25th-anniversary readers' list
            </a>{' '}
            (2021): 200 ranks across {SEED_ALBUMS.length} entries, two of which pair two albums
            under one rank. Rank, votes, artist, title, release year and genre come from that
            list; labels come from the linked reviews, some of which cover reissues. Listening
            sessions are fictional sample data. Artwork remains the property of its respective
            rights holders.
          </p>
        </div>
      </footer>
    </>
  )
}
