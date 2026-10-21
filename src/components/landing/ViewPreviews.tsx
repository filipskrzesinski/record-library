import { Cover } from '@/components/Cover'
import { spineStyle } from '@/lib/art'
import { SHOWCASE, type Showcase } from '@/lib/showcase'
import { CoverFan } from './CoverFan'

/** Sleeves lent to each preview. Decorative stand-ins for the real views. */
const GRID = SHOWCASE.slice(11, 17)
const LIST = SHOWCASE.slice(12, 18)
const SHELF = SHOWCASE.slice(13, 18)
/** Two sleeves and the rooms they played in, drawn from the sample sessions' settings. */
const PLAYED: { album: Showcase; where: string }[] = [
  { album: SHOWCASE[11], where: 'Living room' },
  { album: SHOWCASE[17], where: 'Study' },
]

const weekdayFormat = new Intl.DateTimeFormat('en', { weekday: 'long' })
const monthFormat = new Intl.DateTimeFormat('en', { month: 'long' })

/** A real, correctly formatted recent day for the history preview's date. */
const PLAYED_ON = new Date(Date.now() - 3 * 86_400_000)

export function GridPreview() {
  return (
    <div className="grid grid-cols-3 gap-x-4 gap-y-5" aria-hidden>
      {GRID.map((album) => (
        <div key={album.id} className="min-w-0">
          <Cover art="flat" palette={album.palette} src={album.coverUrl} className="rounded-md shadow-cover" />
          <div className="mt-2 truncate font-record-sm text-record-sm text-ink">{album.title}</div>
          <div className="truncate font-glyph text-glyph text-ink-muted">{album.artist}</div>
        </div>
      ))}
    </div>
  )
}

export function ListPreview() {
  return (
    <div className="flex flex-col gap-[4px]" aria-hidden>
      {LIST.map((album) => (
        <div
          key={album.id}
          style={{ ...spineStyle(album.palette), height: 38 }}
          className="flex items-center gap-3 overflow-hidden rounded-sm px-3 shadow-spine ring-1 ring-inset ring-sleeve-edge"
        >
          <span className="min-w-0 flex-1 truncate font-record-sm text-record-sm">{album.title}</span>
          <span className="hidden shrink-0 truncate font-glyph text-glyph opacity-70 sm:block">{album.artist}</span>
          <span className="w-8 shrink-0 text-right font-label text-label opacity-70">{album.year}</span>
        </div>
      ))}
    </div>
  )
}

export function ShelfPreview() {
  const centre = SHELF[(SHELF.length - 1) / 2]
  return (
    <div>
      <CoverFan albums={SHELF} scale="preview" />
      <div className="mt-4 text-center" aria-hidden>
        <div className="truncate font-record-sm text-record-sm text-ink">{centre.title}</div>
        <div className="truncate font-glyph text-glyph text-ink-muted">
          {centre.artist} · {centre.year}
        </div>
      </div>
    </div>
  )
}

export function HistoryPreview() {
  const when = PLAYED_ON

  return (
    <div className="flex items-start gap-5 sm:gap-7" aria-hidden>
      <div className="flex flex-none flex-col items-start gap-3">
        <span className="font-display-sm text-display-sm tabular-nums text-ink sm:font-display sm:text-display">
          {when.getDate()}
        </span>
        <span className="flex flex-col items-start gap-1 font-label text-label uppercase">
          <span className="text-ink">{weekdayFormat.format(when)}</span>
          <span className="text-ink-faint">{monthFormat.format(when)}</span>
        </span>
      </div>
      <div className="grid min-w-0 flex-1 grid-cols-2 gap-5">
        {PLAYED.map((session) => (
          <div key={session.album.id} className="min-w-0">
            <Cover
              art="flat"
              palette={session.album.palette}
              src={session.album.coverUrl}
              className="rounded-md shadow-cover"
            />
            <div className="mt-2 truncate font-glyph text-glyph text-ink-muted">{session.where}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
