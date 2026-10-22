import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Cover } from '@/components/Cover'
import { cn } from '@/lib/utils'
import { spineStyle } from '@/lib/art'
import collection from '@/data/pitchfork-200.json'
import type { Album } from '@/lib/types'

/** Records shown in the hero, chosen for sleeves that read at a distance. */
const FEATURED = [1, 3, 8, 14, 19, 20, 7, 11]
/** Sleeves laid out in the index strip, spread across the ranking. */
const STRIP = [1, 2, 5, 6, 9, 12, 16, 22, 25, 29, 33, 41, 55, 72]
/** Seconds each record holds the hero before the next one takes over. */
const HOLD = 6000

/** A seeded album straight from the bundled collection: ranked, so `source` is always present. */
type CollectionRecord = Omit<Album, 'art' | 'addedAt' | 'source'> & { source: NonNullable<Album['source']> }

const RECORDS = collection.albums as CollectionRecord[]
const byRank = new Map(RECORDS.map((record) => [record.source.rank, record]))

function pick(ranks: number[], fallback: number) {
  const chosen = ranks.map((rank) => byRank.get(rank)).filter((record): record is CollectionRecord => Boolean(record))
  return chosen.length >= 3 ? chosen : RECORDS.slice(0, fallback)
}

/** The sleeve as it sits on a shelf: the printed face with its spine turned toward you. */
function Sleeve({ record, className }: { record: CollectionRecord; className?: string }) {
  return (
    <div className={cn('flex', className)}>
      <div
        className="w-[3.5%] shrink-0 rounded-l-sm"
        style={spineStyle(record.palette)}
        aria-hidden
      />
      <Cover
        art="flat"
        palette={record.palette}
        src={record.coverUrl}
        alt={`${record.title} by ${record.artist}`}
        loading="eager"
        className="min-w-0 flex-1 rounded-r-sm"
      />
    </div>
  )
}

/** Tiny letterspaced caps, used for every label on the page. */
function Label({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('font-label text-label uppercase text-ink-faint', className)}>{children}</span>
  )
}

const VIEWS = [
  {
    name: 'Grid',
    note: 'Every sleeve at the same size, face out. Hover and the rest of the wall recedes so the one under the cursor stands alone.',
  },
  {
    name: 'List',
    note: 'Spines, stacked the way they sit on a shelf. Each one is printed in its own record’s colours, so the collection reads as a run of edges.',
  },
  {
    name: 'Shelf',
    note: 'Cover flow. One record faces you, its neighbours angle away into the paper, and the whole rack turns under the scroll wheel.',
  },
  {
    name: 'History',
    note: 'Not the collection but the listening. Days down the page under outsized numerals, each with the covers you put on that day.',
  },
]

const PRESSING = [
  ['Label', 'Capitol'],
  ['Catalog', 'TOCP-65515'],
  ['Pressing', 'First, 2000'],
  ['Format', '2 × LP, 33⅓'],
  ['Weight', '180 g'],
  ['Country', 'United Kingdom'],
  ['Mastering', 'Half-speed, Abbey Road'],
  ['Condition', 'Near Mint'],
]

export function Landing() {
  const featured = useMemo(() => pick(FEATURED, 8), [])
  const strip = useMemo(() => pick(STRIP, 14), [])
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const current = featured[index % featured.length]
  const advance = useCallback((step: number) => {
    setIndex((value) => (value + step + featured.length) % featured.length)
  }, [featured.length])

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = setInterval(() => advance(1), HOLD)
    return () => clearInterval(timer)
  }, [advance, paused])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowRight') advance(1)
      else if (event.key === 'ArrowLeft') advance(-1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [advance])

  const plays = 188

  return (
    <div className="relative min-h-screen bg-paper">
      {/* The only colour on the page is the record's own, washed faintly over the paper. */}
      <div
        key={current.id}
        className="pointer-events-none fixed inset-0 opacity-5 transition-opacity duration-700"
        style={{ backgroundColor: current.palette.base }}
        aria-hidden
      />

      <div className="relative">
        {/* ---------------------------------------------------------------- Hero */}
        <section
          className="flex min-h-screen flex-col px-6 py-6 sm:px-10 xl:px-16"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <header className="grid grid-cols-[1fr_auto] items-start gap-6 sm:grid-cols-[1fr_auto_1fr]">
            <nav className="hidden items-center gap-4 sm:flex" aria-label="Views">
              {['Grid', 'List', 'Shelf'].map((view) => (
                <Link
                  key={view}
                  to="/library"
                  className="font-record-sm text-record-sm text-ink-muted underline-offset-4 transition-colors duration-150 hover:text-ink hover:underline"
                >
                  {view}
                </Link>
              ))}
            </nav>
            <Label className="pt-1.5 text-ink">Record Library</Label>
            <Link
              to="/library"
              className="justify-self-end font-record-sm text-record-sm text-ink-muted underline-offset-4 transition-colors duration-150 hover:text-ink hover:underline"
            >
              Open the collection
            </Link>
          </header>

          <div className="flex flex-1 flex-col items-center justify-center py-10">
            <button
              type="button"
              onClick={() => advance(1)}
              aria-label={`${current.title} by ${current.artist}. Show the next record.`}
              className="group block w-full max-w-[min(78vw,20rem)] sm:max-w-[min(50vw,23rem)]"
            >
              <Sleeve
                key={current.id}
                record={current}
                className="animate-card-fade-in shadow-cover transition-shadow duration-300 group-hover:shadow-cover-hover motion-reduce:animate-none"
              />
            </button>

            <div key={`${current.id}-caption`} className="mt-7 animate-card-fade-in text-center motion-reduce:animate-none">
              <div className="font-record text-record text-ink">{current.title}</div>
              <div className="mt-1 font-metadata text-metadata text-ink-muted">{current.artist}</div>
            </div>
          </div>

          <footer className="grid grid-cols-[1fr_auto_1fr] items-end gap-6">
            <span
              key={`${current.id}-year`}
              className="animate-card-fade-in font-display-md text-display-md sm:font-date sm:text-date tabular-nums leading-none text-ink motion-reduce:animate-none"
            >
              {current.year}
            </span>
            <Link
              to="/library"
              className="justify-self-center pb-3 font-record-sm text-record-sm text-ink underline underline-offset-4 decoration-ink-faint transition-colors duration-150 hover:decoration-ink"
            >
              All ({RECORDS.length})
            </Link>
            <span
              key={`${current.id}-rank`}
              className="animate-card-fade-in justify-self-end font-display-md text-display-md sm:font-date sm:text-date tabular-nums leading-none text-ink motion-reduce:animate-none"
            >
              {String(current.source.rank).padStart(3, '0')}
            </span>
          </footer>
        </section>

        {/* --------------------------------------------------------------- Index */}
        <section className="pb-28 pt-20" aria-label="The collection">
          <div className="flex items-baseline justify-between px-6 sm:px-10 xl:px-16">
            <Label>The collection</Label>
            <Link
              to="/library"
              className="font-record-sm text-record-sm text-ink-muted underline-offset-4 transition-colors duration-150 hover:text-ink hover:underline"
            >
              {RECORDS.length} records →
            </Link>
          </div>

          <div className="landing-strip mt-6 overflow-hidden">
            <ul className="flex gap-5 px-6 sm:px-10 xl:px-16">
              {strip.map((record) => (
                <li key={record.id} className="w-28 shrink-0 sm:w-32">
                  <Sleeve record={record} className="shadow-spine" />
                  <div className="mt-2.5 truncate font-metadata text-metadata text-ink-muted">{record.title}</div>
                  <div className="mt-0.5 truncate font-caption text-caption text-ink-faint">{record.artist}</div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* --------------------------------------------------------------- Views */}
        <section className="px-6 pb-28 sm:px-10 xl:px-16">
          <Label>Four ways to look at a shelf</Label>
          <ul className="mt-8 border-t border-line-soft">
            {VIEWS.map((view, i) => (
              <li
                key={view.name}
                className="grid gap-x-10 gap-y-3 border-b border-line-soft py-8 sm:grid-cols-[auto_1fr] lg:grid-cols-[5rem_14rem_1fr]"
              >
                <span className="font-display-sm text-display-sm tabular-nums leading-none text-ink-faint">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2 className="font-record-lg text-record-lg text-ink">{view.name}</h2>
                <p className="max-w-2xl font-body-relaxed text-body-relaxed text-ink-muted">{view.note}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ------------------------------------------------------------- Pressing */}
        <section className="grid gap-14 px-6 pb-28 sm:px-10 lg:grid-cols-2 lg:items-center lg:gap-20 xl:px-16">
          <div>
            <Label>Everything a pressing can tell you</Label>
            <h2 className="mt-6 max-w-prose font-display-sm text-display-sm text-ink">
              A catalog number, a mastering credit, the night you last put it on.
            </h2>
            <p className="mt-5 max-w-prose font-body-relaxed text-body-relaxed text-ink-muted">
              Every record keeps the detail of the copy you actually own, editable in place on its own page.
              Log a listen with the date, the room and the system, and it joins the history.
            </p>
            <Link
              to="/library"
              className="mt-8 inline-block font-record-sm text-record-sm text-ink underline underline-offset-4 decoration-ink-faint transition-colors duration-150 hover:decoration-ink"
            >
              Open the collection →
            </Link>
          </div>

          <dl className="border-t border-line-soft">
            {PRESSING.map(([term, value]) => (
              <div key={term} className="flex items-baseline justify-between gap-6 border-b border-line-soft py-3.5">
                <dt><Label>{term}</Label></dt>
                <dd className="truncate font-record-sm text-record-sm text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* -------------------------------------------------------------- Closing */}
        <section className="px-6 pb-20 sm:px-10 xl:px-16">
          <div className="border-t border-line-soft pt-14">
            <h2 className="max-w-4xl font-display-sm text-display-sm text-ink sm:font-display-md sm:text-display-md lg:font-display lg:text-display">
              A record collection that lives in your browser, and nowhere else.
            </h2>

            <div className="mt-14 flex flex-col gap-12 sm:grid sm:grid-cols-[1fr_auto] sm:items-end sm:gap-6">
              <div className="flex flex-wrap items-end gap-x-16 gap-y-8 sm:gap-x-24">
                <div>
                  <span className="block font-display-md text-display-md sm:font-date sm:text-date tabular-nums leading-none text-ink">
                    {RECORDS.length}
                  </span>
                  <Label className="mt-3 block">Records</Label>
                </div>
                <div>
                  <span className="block font-display-md text-display-md sm:font-date sm:text-date tabular-nums leading-none text-ink">{plays}</span>
                  <Label className="mt-3 block">Listening sessions</Label>
                </div>
              </div>
              <Link
                to="/library"
                className="self-start font-record text-record text-ink underline underline-offset-4 decoration-ink-faint transition-colors duration-150 hover:decoration-ink sm:self-auto sm:justify-self-end sm:pb-3"
              >
                Open the collection →
              </Link>
            </div>
          </div>
        </section>

        <footer className="px-6 pb-16 sm:px-10 xl:px-16">
          <div className="flex flex-col gap-3 border-t border-line-soft pt-6 sm:flex-row sm:items-baseline sm:justify-between">
            <p className="max-w-prose font-caption text-caption text-ink-faint">
              Seeded with {RECORDS.length} albums from the 200 ranks of{' '}
              <a
                href="https://pitchfork.com/features/lists-and-guides/peoples-list-25th-anniversary/"
                className="underline underline-offset-4 transition-colors duration-150 hover:text-ink-muted"
              >
                Pitchfork’s 25th-anniversary readers’ poll
              </a>
              . Artwork remains the property of its rights holders.
            </p>
            <p className="font-caption text-caption text-ink-faint">No server. No accounts. Stored on your device.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
