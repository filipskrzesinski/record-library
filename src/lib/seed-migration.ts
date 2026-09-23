import type { Album, Listen } from './types'
import { SEED_ALBUMS, SEED_LISTENS } from './legacy-seed'

/** Only remove demo records that still exactly match the old seed. */
export function untouchedDemoIds(albums: Album[], listens: Listen[]) {
  return albums.filter((album) => {
    const original = SEED_ALBUMS.find((seed) => seed.id === album.id)
    if (!original) return false
    const keys = new Set([...Object.keys(original), ...Object.keys(album)] as (keyof Album)[])
    for (const key of keys) {
      if (key !== 'addedAt' && JSON.stringify(album[key]) !== JSON.stringify(original[key])) return false
    }

    const sessions = listens.filter((listen) => listen.albumId === album.id)
    const originals = SEED_LISTENS.filter((listen) => listen.albumId === album.id)
    // A missing, added, or edited session means the user has changed the demo.
    if (sessions.length !== originals.length) return false
    const remaining = [...originals]
    return sessions.every((listen) => {
      if (listen.id !== `seed-${album.id}-${listen.date}` || listen.createdAt !== new Date(listen.date).getTime()) return false
      const index = remaining.findIndex((seed) =>
        seed.notes === listen.notes && seed.location === listen.location && seed.system === listen.system,
      )
      if (index === -1) return false
      remaining.splice(index, 1)
      return true
    })
  }).map((album) => album.id)
}
