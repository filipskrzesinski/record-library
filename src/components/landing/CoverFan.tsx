import type { CSSProperties } from 'react'
import { Cover } from '@/components/Cover'
import type { Showcase } from '@/lib/showcase'
import { cn } from '@/lib/utils'

/**
 * A still of the shelf: the middle sleeve faces front, the rest angle away on
 * either side. Decorative — the page's own links do the navigating — so the whole
 * fan is hidden from assistive technology.
 */
export function CoverFan({
  albums,
  scale = 'hero',
  className,
}: {
  albums: Showcase[]
  scale?: 'hero' | 'preview'
  className?: string
}) {
  const centre = (albums.length - 1) / 2
  const eager = scale === 'hero' ? 'eager' : 'lazy'

  return (
    <div className={cn('cover-fan', scale === 'preview' && 'cover-fan-sm', className)} aria-hidden>
      <div className="cover-fan-floor">
        {albums.map((album, i) => {
          const offset = i - centre
          return (
            <div
              key={album.id}
              className="cover-fan-item animate-card-fade-in rounded-md motion-reduce:animate-none"
              style={{ '--i': offset, animationDelay: `${Math.abs(offset) * 60 + 40}ms` } as CSSProperties}
            >
              <Cover art="flat" palette={album.palette} src={album.coverUrl} loading={eager} className="rounded-md" />
              <span className="cover-fan-haze rounded-md" />
              <span className="cover-fan-reflection">
                <Cover
                  art="flat"
                  palette={album.palette}
                  src={album.coverUrl}
                  loading={eager}
                  className="cover-fan-reflection-art rounded-md"
                />
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
