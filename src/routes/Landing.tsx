import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { CoverFan } from '@/components/landing/CoverFan'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { LandingNav } from '@/components/landing/LandingNav'
import {
  EditIcon,
  ListenIcon,
  LocalIcon,
  RatingIcon,
  SpecIcon,
  ViewsIcon,
} from '@/components/landing/icons'
import { GridPreview, HistoryPreview, ListPreview, ShelfPreview } from '@/components/landing/ViewPreviews'
import { Button } from '@/components/ui/button'
import { COLLECTION, FAN } from '@/lib/showcase'
import { PITCHFORK_SOURCE_URL } from '@/lib/sources'
import type { ViewMode } from '@/lib/types'
import { cn } from '@/lib/utils'

const count = (n: number) => n.toLocaleString('en-US')

/** A page section. `tone="paper"` sets it on the darker paper, between hairlines. */
function Band({
  id,
  tone = 'high',
  className,
  children,
}: {
  id?: string
  tone?: 'high' | 'paper'
  className?: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      className={cn(
        'px-6 sm:px-10 xl:px-16',
        tone === 'paper'
          ? 'mt-12 border-y border-line bg-paper py-20 sm:mt-16 sm:py-28'
          : 'pt-20 sm:pt-28',
        className,
      )}
    >
      <div className="mx-auto w-full max-w-[1120px]">{children}</div>
    </section>
  )
}

function Eyebrow({ children }: { children: string }) {
  return <p className="font-label text-label uppercase text-ink-faint">{children}</p>
}

/* ------------------------------------------------------------------- hero */

function Hero() {
  return (
    <>
      <Band>
        <Eyebrow>A record collection, in the browser</Eyebrow>
        <h1 className="mt-5 max-w-[22ch] font-display-sm text-display-sm text-ink-strong sm:font-display-md sm:text-display-md lg:font-display lg:text-display">
          Browse the shelf, not a spreadsheet.
        </h1>
        <p className="mt-7 max-w-[56ch] font-body-relaxed text-body-relaxed text-ink-muted">
          A collection you look at, rather than a table you scroll. Flip through the covers, keep the whole
          pressing on every record, and write down each time you drop the needle.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-2.5">
          <Button variant="solid" asChild>
            <Link to="/library">Open the library</Link>
          </Button>
          <Button variant="outline" asChild>
            <a href="#views">See the four views</a>
          </Button>
        </div>
        <p className="mt-6 font-caption text-caption text-ink-faint">
          {COLLECTION.records} records already on the shelf · Stored in this browser · No account, no server
        </p>
      </Band>

      {/* Full-bleed: the hero sleeve fan runs edge to edge, as the shelf does in the app. */}
      <div className="mt-16 sm:mt-24">
        <CoverFan albums={FAN} />
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ views */

const VIEW_CARDS: { view: ViewMode; name: string; blurb: string; preview: ReactNode }[] = [
  {
    view: 'grid',
    name: 'Grid',
    blurb:
      'Sleeves at full size, up to five across, each with its title set underneath. Point at one and the rest step back.',
    preview: <GridPreview />,
  },
  {
    view: 'list',
    name: 'List',
    blurb:
      'One spine per record, coloured from its own cover, carrying label, catalog number, format, year and play count along the edge.',
    preview: <ListPreview />,
  },
  {
    view: 'shelf',
    name: 'Shelf',
    blurb:
      'Cover flow. Arrow keys or the scroll wheel move a sleeve at a time, and the shelf reopens where you left it.',
    preview: <ShelfPreview />,
  },
  {
    view: 'history',
    name: 'History',
    blurb:
      'Listening sessions by day, under a date set large, with the records played and the room and system they played on.',
    preview: <HistoryPreview />,
  },
]

function Views() {
  return (
    <Band id="views" tone="paper">
      <Eyebrow>Four views</Eyebrow>
      <h2 className="mt-5 font-display-sm text-display-sm text-ink-strong sm:font-display-md sm:text-display-md">
        Grid. List. Shelf. History.
      </h2>
      <p className="mt-6 max-w-[52ch] font-body-relaxed text-body-relaxed text-ink-muted">
        One collection, read four ways. Pick the one you like; it is still there next time.
      </p>

      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        {VIEW_CARDS.map((item) => (
          <Link
            key={item.view}
            to={`/library?view=${item.view}`}
            className="group flex flex-col rounded-md bg-raised p-7 shadow-lift ring-1 ring-line transition-[box-shadow,transform,--tw-ring-color] duration-200 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:shadow-float hover:ring-ink-faint/60 sm:p-8"
          >
            <div className="flex min-h-[260px] items-center justify-center sm:min-h-[330px]">
              <div className="w-full max-w-[400px]">{item.preview}</div>
            </div>
            <div className="mt-8 border-t border-line-soft pt-6">
              <h3 className="font-record-md text-record-md text-ink-strong">{item.name}</h3>
              <p className="mt-2.5 font-small text-small text-ink-muted">{item.blurb}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 font-caption text-caption text-ink-faint transition-colors duration-150 group-hover:text-ink">
                Open this view
                <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </Band>
  )
}

/* ----------------------------------------------------------------- detail */

const DETAILS: { icon: ReactNode; title: string; body: string }[] = [
  {
    icon: <ViewsIcon />,
    title: 'Four ways to browse',
    body: 'Grid, list, shelf and history, each with its own sort order, all remembered between visits.',
  },
  {
    icon: <SpecIcon />,
    title: 'The whole pressing',
    body: 'Label, catalog number, pressing, mastering, speed, weight, format and country of pressing — a field for every line on the sleeve.',
  },
  {
    icon: <ListenIcon />,
    title: 'Listening sessions',
    body: 'Log a listen with the date, the room, the system and a note. Each record keeps its own history, and the library keeps the whole run.',
  },
  {
    icon: <RatingIcon />,
    title: 'Rating and condition',
    body: 'A five-step rating set in a single click, and a condition grade written in the same hand as the rest of the record.',
  },
  {
    icon: <LocalIcon />,
    title: 'Nothing leaves the browser',
    body: 'The library lives in IndexedDB on this device. No account, no server, no sync, and no requests for artwork or metadata at runtime.',
  },
  {
    icon: <EditIcon />,
    title: 'Edit in place',
    body: 'Click any field, type, and leave. Enter commits, Escape reverts, and nothing opens a form you have to find your way out of.',
  },
]

function Details() {
  return (
    <Band>
      <Eyebrow>Details</Eyebrow>
      <h2 className="mt-5 font-display-sm text-display-sm text-ink-strong sm:font-display-md sm:text-display-md">
        Everything on the sleeve.
      </h2>

      <div className="mt-12 grid gap-x-14 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {DETAILS.map((detail) => (
          <div key={detail.title}>
            <span className="flex size-8 items-center justify-center rounded-md bg-ink/6 text-ink-muted">
              {detail.icon}
            </span>
            <h3 className="mt-4 font-record-sm text-record-sm text-ink-strong">{detail.title}</h3>
            <p className="mt-1.5 font-small text-small text-ink-muted">{detail.body}</p>
          </div>
        ))}
      </div>
    </Band>
  )
}

/* ------------------------------------------------------------------ steps */

const STEPS: { name: string; lines: string[] }[] = [
  { name: 'Open', lines: ['Nothing to install.', 'Nothing to sign up for.', `${COLLECTION.records} records already filed.`] },
  { name: 'Browse', lines: ['Flip the shelf.', 'Scan the grid.', 'Read the spines.', 'Sort by rank, year, artist or last played.'] },
  { name: 'Log', lines: ['Add a listen.', 'Date, room, system, note.', 'Watch it land at the top of the history.'] },
  { name: 'Keep', lines: ['Add your own records.', 'Delete the ones you don’t own.', 'Edits survive every reload.'] },
]

function Steps() {
  return (
    <Band>
      <Eyebrow>How it goes</Eyebrow>
      <h2 className="mt-5 font-display-sm text-display-sm text-ink-strong sm:font-display-md sm:text-display-md">
        Open. Browse. Log. Keep.
      </h2>

      <ol className="mt-12 grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, i) => (
          <li key={step.name} className="border-t border-line pt-6">
            <span className="font-display-sm text-display-sm tabular-nums text-ink-faint">{i + 1}</span>
            <h3 className="mt-4 font-record-md text-record-md text-ink-strong">{step.name}</h3>
            <ul className="mt-3 flex flex-col gap-1.5">
              {step.lines.map((line) => (
                <li key={line} className="font-small text-small text-ink-muted">
                  {line}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Band>
  )
}

/* ------------------------------------------------------------- collection */

const SPEC: { label: string; value: string }[] = [
  { label: 'Records', value: `${COLLECTION.records} seeded` },
  { label: 'Ranks', value: `1–${COLLECTION.ranks} in the source list, three of them not included` },
  { label: 'Artists', value: `${COLLECTION.artists}` },
  { label: 'Labels', value: `${COLLECTION.labels}` },
  { label: 'Released', value: `${COLLECTION.yearFrom}–${COLLECTION.yearTo}` },
  { label: 'Decades', value: COLLECTION.decades.map((d) => `${d.decade}s ${d.count}`).join(' · ') },
  { label: 'Genres', value: COLLECTION.genres.map((g) => `${g.name} ${g.count}`).join(' · ') },
  { label: 'Reader votes', value: `${count(COLLECTION.votes)} counted across the list` },
  { label: 'Covers', value: `${COLLECTION.records} WebP sleeves, bundled with the app` },
  {
    label: 'Sample listens',
    value: `${COLLECTION.listens} fictional sessions across ${COLLECTION.listenedAlbums} records`,
  },
  { label: 'Unseeded', value: 'Rating, condition, catalog, pressing, master, speed, weight, format, country' },
  { label: 'Storage', value: 'IndexedDB, in this browser, through Dexie' },
]

function Collection() {
  return (
    <Band id="collection" tone="paper">
      <Eyebrow>What&rsquo;s on the shelf</Eyebrow>
      <h2 className="mt-5 font-display-sm text-display-sm text-ink-strong sm:font-display-md sm:text-display-md">
        The collection, as filed.
      </h2>
      <p className="mt-6 max-w-[58ch] font-body-relaxed text-body-relaxed text-ink-muted">
        The library opens on Pitchfork&rsquo;s 25th-anniversary readers&rsquo; poll: rank, votes, artist, title,
        year and genre from the list itself, labels from the reviews it links to. The listening sessions are
        sample data, written for the app.
      </p>

      <dl className="mt-12 grid md:grid-cols-2 md:gap-x-16">
        {SPEC.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[96px_minmax(0,1fr)] items-baseline gap-5 border-t border-line py-3 sm:grid-cols-[116px_minmax(0,1fr)]"
          >
            <dt className="font-label text-label uppercase text-ink-faint">{row.label}</dt>
            <dd className="min-w-0 font-body text-body text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-8 max-w-[92ch] font-caption text-caption text-ink-faint">
        Source:{' '}
        <a
          href={PITCHFORK_SOURCE_URL}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4 transition-colors duration-150 hover:text-ink"
        >
          The People&rsquo;s List, Pitchfork, 2021
        </a>
        . Release years follow that list&rsquo;s regional conventions, and some labels come from reviews of
        reissues, so they do not identify a particular vinyl pressing. Album artwork remains the property of
        its respective rights holders; attribution is not a licence.
      </p>
    </Band>
  )
}

/* --------------------------------------------------------------- questions */

const QUESTIONS: { q: string; a: ReactNode }[] = [
  {
    q: 'Where does my collection live?',
    a: 'In this browser, in IndexedDB, through Dexie. There is no account and no server, so nothing is uploaded and nothing is synced to another device.',
  },
  {
    q: 'Can I add records of my own?',
    a: 'Yes. A new record takes the same fields as a seeded one, plus a rating, and you pick a generated sleeve from eight styles and twelve palettes until real artwork takes its place.',
  },
  {
    q: 'Is the seeded collection mine to change?',
    a: 'Entirely. Edit it, play it, or delete all of it — including down to an empty library. The app will not quietly put the samples back.',
  },
  {
    q: 'Why are the pressing details blank?',
    a: 'Because the poll does not say which edition you own. Rating, condition, catalog number, pressing, mastering, speed, weight, format and country of pressing are left empty on purpose, for you to fill in from the record in your hands.',
  },
  {
    q: 'Are the listening sessions real?',
    a: `No. The ${COLLECTION.listens} sessions spread across ${COLLECTION.listenedAlbums} records are fictional sample data, written to give the history something to show. Your own listens sit alongside them, and survive.`,
  },
  {
    q: 'How do I start over?',
    a: 'Delete the record-library database in your browser’s developer tools. The collection is seeded again on the next load.',
  },
]

function Questions() {
  return (
    <Band id="questions">
      <Eyebrow>Questions</Eyebrow>
      <h2 className="mt-5 font-display-sm text-display-sm text-ink-strong sm:font-display-md sm:text-display-md">
        Before you open it.
      </h2>

      <dl className="mt-12 border-b border-line">
        {QUESTIONS.map((item) => (
          <div
            key={item.q}
            className="grid gap-x-12 gap-y-3 border-t border-line py-7 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]"
          >
            <dt className="font-record-md text-record-md text-ink-strong">{item.q}</dt>
            <dd className="font-body-relaxed text-body-relaxed text-ink-muted">{item.a}</dd>
          </div>
        ))}
      </dl>
    </Band>
  )
}

/* ---------------------------------------------------------------- closing */

function Closing() {
  return (
    <div className="mt-12 border-y border-line bg-paper px-6 py-24 sm:mt-16 sm:px-10 sm:py-32 xl:px-16">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col items-center text-center">
        <h2 className="font-display-sm text-display-sm text-ink-strong sm:font-display-md sm:text-display-md">
          Pick a record.
        </h2>
        <p className="mt-6 max-w-[46ch] font-body-relaxed text-body-relaxed text-ink-muted">
          The shelf is already full. Open it, flip through it, and log the first thing you put on.
        </p>
        <Button variant="solid" className="mt-9" asChild>
          <Link to="/library">Open the library</Link>
        </Button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------- page */

export function Landing() {
  return (
    <div className="pb-0">
      <LandingNav />
      <main>
        <Hero />
        <Views />
        <Details />
        <Steps />
        <Collection />
        <Questions />
        <Closing />
      </main>
      <LandingFooter />
    </div>
  )
}
