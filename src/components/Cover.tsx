import { GRAIN, coverStyle } from '@/lib/art'
import type { ArtStyle, Palette } from '@/lib/types'
import { cn } from '@/lib/utils'

export function Cover({
  art,
  palette,
  className,
}: {
  art: ArtStyle
  palette: Palette
  className?: string
}) {
  return (
    <div
      className={cn('relative isolate aspect-square overflow-hidden bg-well', className)}
      style={coverStyle(art, palette)}
    >
      <div
        className="absolute inset-0 opacity-[0.16] mix-blend-overlay"
        style={{ backgroundImage: GRAIN, backgroundSize: '140px 140px' }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(118deg,rgba(255,255,255,0.13)_0%,rgba(255,255,255,0)_36%,rgba(0,0,0,0.06)_100%)]" />
      <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12),inset_0_0_50px_rgba(0,0,0,0.12)]" />
    </div>
  )
}
