/**
 * Adapted from the Subframe Motion Library example "The other side"
 * (https://www.subframe.com/motion/card-flip), MIT © 2026 Subframe, itself
 * adapted from Kokonut UI, MIT © 2025 kokonutUI. Keeps the perspective and
 * backface turn; the example's hover-to-flip is dropped, since the sleeve is
 * the largest target on the page and should only turn when it is asked to.
 */
import { Cover } from './Cover'
import { LiquidRecord } from './LiquidRecord'
import type { Album } from '@/lib/types'

export function RecordFlip({
  album,
  flipped,
  onToggle,
}: {
  album: Album
  flipped: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      className="record-flip"
      data-flipped={flipped}
      aria-pressed={flipped}
      aria-label={flipped ? `Show the ${album.title} sleeve` : `Show the ${album.title} record`}
      onClick={onToggle}
    >
      <span className="record-flip-inner">
        <span className="record-flip-face" aria-hidden={flipped}>
          <Cover
            art={album.art}
            palette={album.palette}
            src={album.coverUrl}
            alt={`${album.title} by ${album.artist} album cover`}
            loading="eager"
            className="h-full w-full rounded-md"
          />
        </span>
        <span className="record-flip-face record-flip-back" aria-hidden={!flipped}>
          <LiquidRecord
            palette={album.palette}
            speed={album.speed}
            spinning={flipped}
            alt={`The ${album.title} record, turning on its sleeve`}
            className="h-full w-full rounded-md"
          />
        </span>
      </span>
    </button>
  )
}
