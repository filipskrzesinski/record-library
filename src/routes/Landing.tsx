import { Link } from 'react-router-dom'
import { Cover } from '@/components/Cover'
import { Fan } from '@/components/landing/Fan'
import { FEATURED, TOTAL } from '@/components/landing/picks'
import { Reveal } from '@/components/landing/Reveal'
import {
  GridPreview,
  HistoryPreview,
  ListPreview,
  ShelfPreview,
} from '@/components/landing/ViewPreviews'
import { GridIcon, HistoryIcon, ListIcon, ShelfIcon, TopBar } from '@/components/TopBar'
import { Button } from '@/components/ui/button'
import collection from '@/data/pitchfork-200.json'

const PAD = 'px-6 sm:px-10 xl:px-16'

const VIEWS = [
  {
    icon: <GridIcon />,
    name: 'Grid',
    line: 'Sleeves at full size, five across, in whatever order you want them.',
    preview: <GridPreview />,
  },
  {
    icon: <ListIcon />,
    name: 'List',
    line: 'One spine per record, printed with its label, format and year.',
    preview: <ListPreview />,
  },
  {
    icon: <ShelfIcon />,
    name: 'Shelf',
    line: 'Flip through the collection a cover at a time, the way you would at home.',
    preview: <ShelfPreview />,
  },
  {
    icon: <HistoryIcon />,
    name: 'History',
    line: 'Every listening session, stacked under the day it happened.',
    preview: <HistoryPreview />,
  },
]

/** Fields you fill in yourself, listed as the pressing section's closing note. */
const PRESSING_FIELDS = [
  'Catalog',
  'Pressing',
  'Format',
  'Speed',
  'Weight',
  'Country',
  'Master',
  'Condition',
]

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2.5 text-center">
      <span className="font-display-sm text-display-sm tabular-nums text-ink-strong">{value}</span>
      <span className="font-label text-label uppercase text-ink-faint">{label}</span>
    </div>
  )
}

function SectionHead({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children?: string
}) {
  return (
    <>
      <p className="font-label text-label uppercase text-ink-faint">{eyebrow}</p>
      <h2 className="mt-5 max-w-[16ch] font-display-sm text-display-sm text-ink-strong">{title}</h2>
      {children && (
        <p className="mt-5 max-w-[46ch] font-body-relaxed text-body-relaxed text-ink-muted">{children}</p>
      )}
    </>
  )
}

export function Landing() {
  return (
    <>
      <TopBar
        left={<span className="font-caption text-caption text-ink">Record Library</span>}
        right={
          <Button variant="quiet" size="sm" className="-mr-2.5" asChild>
            <Link to="/library">Open the library</Link>
          </Button>
        }
      />

      <main>
        {/* Hero ------------------------------------------------------------ */}
        <section className={`flex flex-col items-center pt-20 text-center sm:pt-28 ${PAD}`}>
          <Reveal as="p" className="font-label text-label uppercase text-ink-faint">
            In your browser · No account
          </Reveal>

          <Reveal
            as="h1"
            delay={60}
            className="mt-7 max-w-[18ch] font-display-sm text-display-sm text-ink-strong sm:font-display-md sm:text-display-md lg:font-display lg:text-display"
          >
            Everything you own, and every night you played it.
          </Reveal>

          <Reveal
            as="p"
            delay={120}
            className="mt-7 max-w-[52ch] font-body-relaxed text-body-relaxed text-ink-muted"
          >
            Browse your sleeves on a shelf you can flip through, keep the pressing detail on every
            record, and log the evenings you spent listening to them. It runs in your browser: no
            account, no server, nothing to sync.
          </Reveal>

          <Reveal delay={180} className="mt-9 flex items-center gap-2">
            <Button variant="solid" asChild>
              <Link to="/library">Open the library</Link>
            </Button>
            <Button variant="quiet" asChild>
              <a href="#views">See the views</a>
            </Button>
          </Reveal>
        </section>

        <Reveal delay={240} className="mt-16 sm:mt-20">
          <Fan />
        </Reveal>

        <Reveal
          as="p"
          delay={300}
          className={`mt-10 text-center font-caption text-caption text-ink-faint ${PAD}`}
        >
          Seeded with all {TOTAL} albums from{' '}
          <a
            href={collection.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="underline decoration-line underline-offset-4 transition-colors duration-150 hover:text-ink-muted"
          >
            Pitchfork&rsquo;s readers&rsquo; poll
          </a>
          . Edit them, delete them, or add your own.
        </Reveal>

        {/* Stats ----------------------------------------------------------- */}
        <Reveal className={`mt-28 sm:mt-36 ${PAD}`}>
          <div className="mx-auto grid max-w-3xl grid-cols-3 gap-8 border-y border-line py-12">
            <Stat value={String(TOTAL)} label="Records seeded" />
            <Stat value="4" label="Ways to browse" />
            <Stat value="0" label="Accounts" />
          </div>
        </Reveal>

        {/* Views ----------------------------------------------------------- */}
        <section id="views" className={`scroll-mt-16 pt-28 sm:pt-36 ${PAD}`}>
          <Reveal>
            <SectionHead eyebrow="Four views" title="Four ways through one collection.">
              The same records, read four different ways. The library opens on whichever one you
              used last.
            </SectionHead>
          </Reveal>

          <div className="mt-14 grid gap-x-10 gap-y-14 sm:grid-cols-2">
            {VIEWS.map((view, i) => (
              <Reveal key={view.name} delay={(i % 2) * 80} className="landing-view">
                <div className="flex h-80 items-center justify-center rounded-lg bg-well/60 p-6">
                  <div className="w-full max-w-[400px]">{view.preview}</div>
                </div>
                <div className="mt-6 flex items-baseline gap-3">
                  <span className="text-ink-faint">{view.icon}</span>
                  <h3 className="font-record text-record text-ink">{view.name}</h3>
                </div>
                <p className="mt-2 max-w-[42ch] font-body-relaxed text-body-relaxed text-ink-muted">
                  {view.line}
                </p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Pressing detail -------------------------------------------------- */}
        <section className={`pt-28 sm:pt-36 ${PAD}`}>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal className="order-2 lg:order-1">
              <SectionHead eyebrow="Every record" title="Down to the gram.">
                Open a record and every field edits in place — click the text, type, done. No forms,
                no save button, nothing hidden behind a mode.
              </SectionHead>

              <dl className="mt-10 max-w-md border-t border-line">
                {[
                  ['Artist', FEATURED.artist],
                  ['Released', String(FEATURED.year)],
                  ['Genre', FEATURED.genre],
                  ['Label', FEATURED.label],
                ].map(([term, value]) => (
                  <div key={term} className="flex items-baseline justify-between gap-6 border-b border-line py-3">
                    <dt className="font-label text-label uppercase text-ink-faint">{term}</dt>
                    <dd className="truncate font-record-sm text-record-sm text-ink">{value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-7 flex flex-wrap gap-1.5">
                {PRESSING_FIELDS.map((field) => (
                  <span
                    key={field}
                    className="rounded-pill bg-ink/6 px-2.5 py-1 font-label text-label uppercase text-ink-muted"
                  >
                    {field}
                  </span>
                ))}
              </div>
              <p className="mt-4 font-caption text-caption text-ink-faint">
                And the rest, once you&rsquo;ve had the sleeve in your hands.
              </p>
            </Reveal>

            <Reveal delay={80} className="order-1 lg:order-2">
              <div className="mx-auto max-w-sm lg:ml-auto lg:mr-0">
                <Cover
                  art={FEATURED.art}
                  palette={FEATURED.palette}
                  src={FEATURED.coverUrl}
                  alt={`${FEATURED.title} by ${FEATURED.artist}`}
                  className="rounded-md shadow-cover"
                />
                <div className="mt-6">
                  <div className="font-record-lg text-record-lg text-ink">{FEATURED.title}</div>
                  <div className="mt-1.5 font-metadata text-metadata text-ink-muted">
                    {FEATURED.artist} · {FEATURED.year}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Listening log ----------------------------------------------------- */}
        <section className={`pt-28 sm:pt-36 ${PAD}`}>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <div className="max-w-md rounded-lg bg-raised p-8 shadow-lift ring-1 ring-line">
                <div className="font-label text-label uppercase text-ink-faint">14 March 2026</div>
                <dl className="mt-6 flex flex-col gap-4 border-t border-line pt-6">
                  <div>
                    <dt className="font-label text-label uppercase text-ink-faint">Room</dt>
                    <dd className="mt-1.5 font-body text-body text-ink">Living room</dd>
                  </div>
                  <div>
                    <dt className="font-label text-label uppercase text-ink-faint">System</dt>
                    <dd className="mt-1.5 font-body text-body text-ink">
                      Technics SL-1200GR → Yamaha A-S801 → Wharfedale Linton
                    </dd>
                  </div>
                  <div>
                    <dt className="font-label text-label uppercase text-ink-faint">Note</dt>
                    <dd className="mt-1.5 font-record-sm text-record-sm text-ink-muted">
                      A quiet evening, listened all the way through.
                    </dd>
                  </div>
                </dl>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <SectionHead eyebrow="Every listen" title="Where you played it, and on what.">
                Log a session in a few keystrokes: the date, the room, the system it ran through,
                and a line about the evening if it earned one. History stacks them by day under a
                date you can read from across the room.
              </SectionHead>
            </Reveal>
          </div>
        </section>

        {/* Close -------------------------------------------------------------- */}
        <section className={`flex flex-col items-center pt-32 text-center sm:pt-40 ${PAD}`}>
          <Reveal
            as="h2"
            className="max-w-[18ch] font-display-sm text-display-sm text-ink-strong sm:font-display-md sm:text-display-md"
          >
            Put the needle down.
          </Reveal>
          <Reveal as="p" delay={60} className="mt-6 max-w-[42ch] font-body-relaxed text-body-relaxed text-ink-muted">
            Nothing to install and nothing to sign up for. It opens with the collection already on
            the shelf.
          </Reveal>
          <Reveal delay={120} className="mt-9">
            <Button variant="solid" asChild>
              <Link to="/library">Open the library</Link>
            </Button>
          </Reveal>
        </section>
      </main>

      {/* Footer --------------------------------------------------------------- */}
      <footer className="mt-32 overflow-hidden sm:mt-40">
        <div className={`flex flex-wrap items-baseline justify-between gap-x-10 gap-y-4 border-t border-line py-6 font-label text-label uppercase text-ink-faint ${PAD}`}>
          <div className="flex flex-wrap gap-x-7 gap-y-3">
            <Link to="/library" className="transition-colors duration-150 hover:text-ink">
              The collection
            </Link>
            <a
              href={collection.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="transition-colors duration-150 hover:text-ink"
            >
              Readers&rsquo; poll {collection.publishedYear}
            </a>
            <span>React · Dexie · Tailwind</span>
          </div>
          <span>Stored in this browser only</span>
        </div>

        <div className={`pt-14 ${PAD}`} aria-hidden>
          <p className="landing-wordmark text-ink-strong">Record Library</p>
        </div>
      </footer>
    </>
  )
}
