import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { AlbumWithStats } from '@/lib/db'
import { usePersisted } from '@/lib/usePersisted'
import { Cover } from './Cover'

/** Horizontal scroll distance that advances the shelf by one record. */
const STEP = 96
/** Sleeves rendered on each side of the focused one (the CSS fades them out before this). */
const REACH = 14
/** Accumulated vertical wheel delta that flips one record. */
const WHEEL_THRESHOLD = 40

/**
 * Cover-flow shelf. A native horizontal scroller (with one snap point per record) drives
 * a sticky 3D stage: scroll position becomes the fractional `--pos`, and every sleeve
 * derives its angle, depth and offset from `--i - --pos` in CSS.
 */
export function Shelf({ albums }: { albums: AlbumWithStats[] }) {
  const navigate = useNavigate()
  const [savedId, setSavedId] = usePersisted<string | null>('shelf-album', null)
  const [initial] = useState(() => Math.max(0, albums.findIndex((album) => album.id === savedId)))
  const [active, setActive] = useState(initial)

  const scroller = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const target = useRef(initial)
  const frame = useRef<number | null>(null)

  const last = albums.length - 1
  const focusedIndex = Math.min(active, last)
  const current = albums[focusedIndex]

  const go = useCallback(
    (index: number) => {
      const el = scroller.current
      if (!el) return
      const next = Math.max(0, Math.min(last, index))
      target.current = next
      const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      el.scrollTo({ left: next * STEP, behavior: smooth ? 'smooth' : 'auto' })
    },
    [last],
  )

  function sync() {
    if (frame.current !== null) return
    frame.current = requestAnimationFrame(() => {
      frame.current = null
      const el = scroller.current
      if (!el) return
      const pos = Math.max(0, Math.min(last, el.scrollLeft / STEP))
      stage.current?.style.setProperty('--pos', pos.toFixed(3))
      setActive(Math.round(pos))
    })
  }

  // Open on the record that was focused last time (e.g. when coming back from its page).
  useLayoutEffect(() => {
    const el = scroller.current
    if (!el) return
    el.scrollLeft = initial * STEP
    stage.current?.style.setProperty('--pos', String(initial))
  }, [initial])

  useEffect(() => () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current)
  }, [])

  useEffect(() => {
    if (current) setSavedId(current.id)
  }, [current, setSavedId])

  // A plain mouse wheel only scrolls vertically: flip records with it, but let the page
  // scroll once the shelf is at either end.
  useEffect(() => {
    const el = scroller.current
    if (!el) return
    let accumulated = 0

    function onWheel(event: WheelEvent) {
      if (event.ctrlKey || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return
      const direction = Math.sign(event.deltaY)
      if ((direction < 0 && target.current <= 0) || (direction > 0 && target.current >= last)) return
      event.preventDefault()
      accumulated += event.deltaY
      if (Math.abs(accumulated) < WHEEL_THRESHOLD) return
      accumulated = 0
      go(target.current + direction)
    }

    function onScrollEnd() {
      target.current = Math.round(el!.scrollLeft / STEP)
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('scrollend', onScrollEnd)
    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('scrollend', onScrollEnd)
    }
  }, [go, last])

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowRight') go(target.current + 1)
    else if (event.key === 'ArrowLeft') go(target.current - 1)
    else if (event.key === 'Home') go(0)
    else if (event.key === 'End') go(last)
    else if (event.key === 'Enter' && event.target === event.currentTarget && current) {
      navigate(`/album/${current.id}`)
    } else return
    event.preventDefault()
  }

  const from = Math.max(0, focusedIndex - REACH)
  const to = Math.min(albums.length, focusedIndex + REACH + 1)

  return (
    <section className="shelf animate-card-fade-in motion-reduce:animate-none" aria-label="Shelf">
      <div
        ref={scroller}
        className="shelf-scroller"
        tabIndex={0}
        aria-label="Records. Use the arrow keys to browse and Enter to open."
        onScroll={sync}
        onKeyDown={onKeyDown}
      >
        <div className="shelf-track" style={{ width: `calc(100cqw + ${last * STEP}px)` }}>
          {albums.map((album, i) => (
            <span key={album.id} className="shelf-snap" style={{ left: i * STEP }} />
          ))}

          <div ref={stage} className="shelf-stage">
            <div className="shelf-floor">
              {albums.slice(from, to).map((album, offset) => {
                const i = from + offset
                const focused = i === focusedIndex
                return (
                  <Link
                    key={album.id}
                    to={`/album/${album.id}`}
                    tabIndex={focused ? 0 : -1}
                    aria-hidden={!focused}
                    aria-label={`${album.title} by ${album.artist}`}
                    className="shelf-item rounded-md"
                    style={{ '--i': i } as CSSProperties}
                    onClick={(event) => {
                      if (focused) return
                      event.preventDefault()
                      go(i)
                    }}
                  >
                    <Cover
                      art={album.art}
                      palette={album.palette}
                      src={album.coverUrl}
                      loading="eager"
                      className="rounded-md"
                    />
                    <span className="shelf-haze rounded-md" />
                    <span className="shelf-reflection" aria-hidden>
                      <Cover
                        art={album.art}
                        palette={album.palette}
                        src={album.coverUrl}
                        loading="eager"
                        className="shelf-reflection-art rounded-md"
                      />
                    </span>
                  </Link>
                )
              })}
            </div>

            {current && (
              <div className="shelf-caption flex flex-col items-center px-6 text-center" aria-live="polite">
                <div className="max-w-full truncate font-record text-record text-ink">{current.title}</div>
                <div className="mt-1 max-w-full truncate font-metadata text-metadata text-ink-muted">
                  {current.artist}
                  {current.year ? ` · ${current.year}` : ''}
                </div>
                <div className="mt-3 font-caption text-caption tabular-nums text-ink-faint">
                  {focusedIndex + 1} / {albums.length}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
