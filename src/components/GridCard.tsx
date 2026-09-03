import { Link } from 'react-router-dom'
import type { AlbumWithStats } from '@/lib/db'
import { Cover } from './Cover'

export function GridCard({ album }: { album: AlbumWithStats }) {
  return (
    <Link to={`/album/${album.id}`} className="group block outline-none">
      <Cover
        art={album.art}
        palette={album.palette}
        className="rounded-[3px] shadow-cover transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-soft)] group-hover:-translate-y-1.5 group-hover:shadow-cover-hover group-focus-visible:-translate-y-1.5 group-focus-visible:shadow-cover-hover"
      />
      <div className="mt-3">
        <div className="truncate font-serif text-[15px] font-light leading-snug tracking-[-0.01em] text-ink">
          {album.title}
        </div>
        <div className="mt-1 truncate text-[11px] leading-snug text-ink-muted">
          {album.artist}
          {album.year ? ` · ${album.year}` : ''}
        </div>
      </div>
    </Link>
  )
}
