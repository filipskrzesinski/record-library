import { Link } from 'react-router-dom'
import { spineStyle } from '@/lib/art'
import type { AlbumWithStats } from '@/lib/db'

/** A double album stands taller on the shelf than a single. */
function spineHeight(format?: string) {
  if (!format) return 42
  if (format.startsWith('3')) return 52
  if (format.startsWith('2')) return 47
  return 42
}

export function SpineRow({ album }: { album: AlbumWithStats }) {
  return (
    <Link to={`/album/${album.id}`} className="group block outline-none">
      <div
        style={{ ...spineStyle(album.palette), height: spineHeight(album.format) }}
        className="flex items-center gap-4 overflow-hidden rounded-[2px] px-4 shadow-spine ring-1 ring-inset ring-[rgba(0,0,0,0.16)] transition-[transform,box-shadow] duration-200 ease-[var(--ease-out-soft)] group-hover:translate-x-1 group-hover:shadow-spine-hover group-focus-visible:translate-x-1"
      >
        <div className="flex min-w-0 flex-1 items-baseline gap-3.5">
          <span className="truncate font-serif text-[15px] font-light tracking-[-0.01em]">
            {album.title}
          </span>
          <span className="truncate text-[11px] opacity-70">{album.artist}</span>
        </div>
        <div className="flex shrink-0 items-baseline gap-5 text-[10px] uppercase tracking-[0.09em]">
          <span className="hidden max-w-[220px] truncate opacity-45 lg:block">
            {[album.label, album.catalog].filter(Boolean).join(' · ')}
          </span>
          <span className="hidden w-8 text-right opacity-60 sm:block">{album.format}</span>
          <span className="w-9 text-right opacity-70">{album.year ?? ''}</span>
          <span className="w-7 text-right opacity-45">{album.listens ? `${album.listens}×` : '—'}</span>
        </div>
      </div>
    </Link>
  )
}
