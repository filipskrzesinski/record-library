import { useEffect, useRef, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import type { AlbumWithStats } from '@/lib/db'
import { Cover } from './Cover'

export function GridCard({ album }: { album: AlbumWithStats }) {
  const surface = useRef<HTMLDivElement>(null)
  const frame = useRef<number | null>(null)

  useEffect(() => () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current)
  }, [])

  function followPointer(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType === 'touch' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    // Measure the stationary link, not the tilted artwork, to avoid feedback jitter.
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width) * 2 - 1))
    const y = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.width) * 2 - 1))

    if (frame.current !== null) cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      surface.current?.style.setProperty('--tilt-x', `${-y * 4}deg`)
      surface.current?.style.setProperty('--tilt-y', `${x * 4}deg`)
      frame.current = null
    })
  }

  function resetTilt() {
    if (frame.current !== null) cancelAnimationFrame(frame.current)
    frame.current = null
    surface.current?.style.removeProperty('--tilt-x')
    surface.current?.style.removeProperty('--tilt-y')
  }

  return (
    <Link
      to={`/album/${album.id}`}
      className="record-card block rounded-[3px]"
      onPointerEnter={followPointer}
      onPointerMove={followPointer}
      onPointerLeave={resetTilt}
      onPointerCancel={resetTilt}
    >
      <div ref={surface} className="record-card-surface pointer-events-none">
        <Cover
          art={album.art}
          palette={album.palette}
          src={album.coverUrl}
          className="record-card-art rounded-[3px] shadow-cover"
        />
      </div>
      <div className="mt-3">
        <div className="truncate font-serif text-[20px] font-light leading-[24px] tracking-[-0.01em] text-ink">
          {album.title}
        </div>
        <div className="mt-1 truncate text-[11px] leading-[15px] text-ink-muted">
          {album.artist}
          {album.year ? ` · ${album.year}` : ''}
        </div>
      </div>
    </Link>
  )
}
