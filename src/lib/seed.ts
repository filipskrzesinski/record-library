import { isoDate } from './format'
import type { Album, Listen } from './types'
import collection from '../data/pitchfork-200.json'

const importedAt = Date.now()

export const SEED_ALBUMS: Album[] = collection.albums.map((album) => ({
  ...album,
  art: 'flat',
  addedAt: importedAt,
}))

const SETTINGS = [
  { location: 'Living room', system: 'Technics SL-1200GR → Yamaha A-S801 → Wharfedale Linton' },
  { location: 'Study', system: 'Rega Planar 3 → Cambridge CXA61 → KEF LS50 Meta' },
  { location: 'Living room', system: 'Thorens TD 160 → Marantz 2270 → JBL L100 Classic' },
  { location: 'Study', system: 'Rega Planar 3 → Schiit Mani 2 → Sennheiser HD 650' },
  { location: 'Kitchen', system: 'Wiim Mini → Audioengine A2+' },
]

const SESSION_NOTES = [
  'A quiet evening, listened all the way through.',
  'Put this on while making dinner. Stayed for the whole album.',
  'Morning coffee and no distractions.',
  'Had a friend over and pulled this off the shelf.',
  'Late-night listen at low volume.',
  'First time back to this in a while. Glad I made the time.',
  'Phone in the other room. Listened without interruptions.',
  'Rain outside. Just the right length for a slow afternoon.',
  'Kept coming back to the opening tracks.',
  'A full listen after work, before doing anything else.',
  'Played it again straight after finishing.',
  'Weekend listening with the windows open.',
]

/** The top of the listening history, most recent first. */
const RECENT_TITLES = [
  'Kid A',
  'Mezzanine',
  'In Colour',
  'Yankee Hotel Foxtrot',
  'To Pimp a Butterfly',
  'Merriweather Post Pavilion',
]

const GROUPS = 100

/** Days before import for each session of group i; session 0 is the group's most recent. */
function daysAgo(i: number, session: number) {
  return 1 + ((i * 17) % 90) + session * (9 + (i % 22))
}

// Coprime strides scatter the selected albums and repeat counts across the ranking.
const picks = Array.from({ length: GROUPS }, (_, i) => SEED_ALBUMS[(i * 73) % SEED_ALBUMS.length].id)

// Swap whole albums between groups so the most recent sessions play RECENT_TITLES in order,
// keeping every date and each album's share of listens.
const newestFirst = Array.from({ length: GROUPS }, (_, i) => i).sort((a, b) => daysAgo(a, 0) - daysAgo(b, 0) || a - b)
RECENT_TITLES.forEach((title, slot) => {
  const target = SEED_ALBUMS.find((album) => album.title === title)?.id
  const current = picks[newestFirst[slot]]
  if (!target || target === current) return
  for (let i = 0; i < GROUPS; i++) {
    if (picks[i] === current) picks[i] = target
    else if (picks[i] === target) picks[i] = current
  }
})

export const SEED_LISTENS: Listen[] = picks.flatMap((albumId, i) => {
  const bucket = (i * 37) % 100
  const count = bucket < 50 ? 1 : bucket < 75 ? 2 : bucket < 90 ? 3 : bucket < 97 ? 4 : 5
  return Array.from({ length: count }, (_, session) => {
    // Minutes apart so same-day sessions keep a stable order.
    const createdAt = importedAt - daysAgo(i, session) * 86_400_000 - i * 60_000
    const setting = SETTINGS[(i + session) % SETTINGS.length]
    const noteIndex = (i * 7 + session * 5) % SESSION_NOTES.length
    return {
      id: `sample-${albumId}-${session + 1}`,
      albumId,
      date: isoDate(createdAt),
      ...setting,
      notes: SESSION_NOTES[noteIndex],
      createdAt,
    }
  })
})

/** A generated sample session the user hasn't edited, safe to regenerate. */
export function isUntouchedSample(listen: Listen) {
  return (
    listen.id.startsWith('sample-') &&
    SESSION_NOTES.includes(listen.notes ?? '') &&
    SETTINGS.some((setting) => setting.location === listen.location && setting.system === listen.system)
  )
}
