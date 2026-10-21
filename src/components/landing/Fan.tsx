import type { CSSProperties } from 'react'
import { Cover } from '@/components/Cover'
import { HERO } from './picks'

/** Centre sleeve, then one to the right, one to the left, and so on outward. */
const ORDER = HERO.map((album, index) => ({
  album,
  offset: index === 0 ? 0 : (index % 2 === 1 ? 1 : -1) * Math.ceil(index / 2),
}))

/**
 * The hero's run of sleeves: the library's own cover flow, held still. The centre
 * record faces front and its neighbours turn away, so the depth of the collection
 * reads before a single word of the page does.
 */
export function Fan() {
  return (
    <div className="landing-fan" aria-hidden>
      <div className="landing-fan-floor">
        {ORDER.map(({ album, offset }) => (
          <div
            key={album.id}
            className="landing-sleeve rounded-md"
            style={{ '--i': offset, zIndex: 10 - Math.abs(offset) } as CSSProperties}
          >
            <Cover
              art={album.art}
              palette={album.palette}
              src={album.coverUrl}
              loading="eager"
              className="rounded-md"
            />
            <span className="landing-haze rounded-md" />
            <span className="landing-reflection">
              <Cover
                art={album.art}
                palette={album.palette}
                src={album.coverUrl}
                loading="eager"
                className="landing-reflection-art rounded-md"
              />
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
