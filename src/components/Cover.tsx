import { useState } from 'react'
import { GRAIN, coverStyle } from '@/lib/art'
import type { ArtStyle, Palette } from '@/lib/types'
import { cn } from '@/lib/utils'

export function Cover({
  art,
  palette,
  src,
  alt = '',
  loading = 'lazy',
  className,
}: {
  art: ArtStyle
  palette: Palette
  src?: string
  alt?: string
  loading?: 'eager' | 'lazy'
  className?: string
}) {
  const [failedSrc, setFailedSrc] = useState<string>()
  const showImage = src && src !== failedSrc
  return (
    <div
      className={cn('relative isolate aspect-square overflow-hidden bg-well', className)}
      style={coverStyle(art, palette)}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          width={600}
          height={600}
          className="absolute inset-0 h-full w-full object-contain"
          onError={() => setFailedSrc(src)}
        />
      ) : (
        <>
          <div
            className="absolute inset-0 opacity-[0.16] mix-blend-overlay"
            style={{ backgroundImage: GRAIN, backgroundSize: '140px 140px' }}
          />
          <div className="absolute inset-0 bg-sleeve-sheen" />
          <div className="absolute inset-0 shadow-sleeve-texture" />
        </>
      )}
    </div>
  )
}
