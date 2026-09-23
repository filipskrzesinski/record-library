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
    <Link to={`/album/${album.id}`} className="record-spine block overflow-visible rounded-sm shadow-spine">
      <div
        style={{ ...spineStyle(album.palette), height: spineHeight(album.format) }}
        className="flex items-center gap-4 overflow-hidden rounded-sm px-4 ring-1 ring-inset ring-sleeve-edge"
      >
        <div className="flex min-w-0 flex-1 items-baseline gap-3.5">
          <span className="truncate font-record-sm text-record-sm">
            {album.title}
          </span>
          <span className="truncate font-caption text-caption opacity-70">{album.artist}</span>
        </div>
        <div className="flex shrink-0 items-baseline gap-5 font-label text-label uppercase">
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
