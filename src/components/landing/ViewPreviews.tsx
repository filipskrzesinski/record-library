import { Cover } from '@/components/Cover'
import { spineStyle } from '@/lib/art'
import { GRID, HISTORY, MINI_SHELF, SPINES } from './picks'

/** Sleeves at a glance, the way the grid lays them out. */
export function GridPreview() {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {GRID.map((album) => (
        <Cover
          key={album.id}
          art={album.art}
          palette={album.palette}
          src={album.coverUrl}
          className="rounded-md shadow-lift"
        />
      ))}
    </div>
  )
}

/** One line per record, the spine carrying the detail. */
export function ListPreview() {
  return (
    <div className="flex flex-col gap-[5px]">
      {SPINES.map((album) => (
        <div
          key={album.id}
          style={spineStyle(album.palette)}
          className="flex h-8 items-center gap-3 overflow-hidden rounded-sm px-3 shadow-spine ring-1 ring-inset ring-sleeve-edge"
        >
          <span className="truncate font-record-sm text-record-sm">{album.title}</span>
          <span className="ml-auto shrink-0 font-label text-label uppercase opacity-70">{album.year}</span>
        </div>
      ))}
    </div>
  )
}

/** The cover flow, one record facing front. */
export function ShelfPreview() {
  const [left, centre, right] = MINI_SHELF
  return (
    <div
      className="landing-mini-shelf flex items-center justify-center"
      style={{ perspective: '520px' }}
    >
      <Cover
        art={left.art}
        palette={left.palette}
        src={left.coverUrl}
        className="w-1/3 origin-right rounded-md shadow-spine"
      />
      <Cover
        art={centre.art}
        palette={centre.palette}
        src={centre.coverUrl}
        className="z-10 mx-2 w-2/5 rounded-md shadow-cover"
      />
      <Cover
        art={right.art}
        palette={right.palette}
        src={right.coverUrl}
        className="w-1/3 origin-left rounded-md shadow-spine"
      />
    </div>
  )
}

/** A day of listening: the date, then what went on the platter — the day rows
    from the history view, in small. */
export function HistoryPreview() {
  return (
    <div className="flex items-start gap-6">
      <div className="shrink-0">
        <div className="font-date text-date text-ink tabular-nums">14</div>
        <div className="flex flex-col gap-1 pt-3 font-label text-label uppercase">
          <span className="text-ink">Saturday</span>
          <span className="text-ink-faint">March</span>
        </div>
      </div>
      <div className="grid flex-1 grid-cols-3 gap-2.5">
        {HISTORY.slice(0, 3).map((album) => (
          <Cover
            key={album.id}
            art={album.art}
            palette={album.palette}
            src={album.coverUrl}
            className="rounded-md shadow-lift"
          />
        ))}
      </div>
    </div>
  )
}
