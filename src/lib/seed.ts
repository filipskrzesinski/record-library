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

// Coprime strides scatter the selected albums and repeat counts across the ranking.
export const SEED_LISTENS: Listen[] = Array.from({ length: 100 }, (_, i) => {
  const album = SEED_ALBUMS[(i * 73) % SEED_ALBUMS.length]
  const bucket = (i * 37) % 100
  const count = bucket < 50 ? 1 : bucket < 75 ? 2 : bucket < 90 ? 3 : bucket < 97 ? 4 : 5
  return Array.from({ length: count }, (_, session) => {
    const daysAgo = 1 + ((i * 17) % 90) + session * (9 + (i % 22))
    const createdAt = importedAt - daysAgo * 86_400_000
    const setting = SETTINGS[(i + session) % SETTINGS.length]
    const noteIndex = (i * 7 + session * 5) % SESSION_NOTES.length
    return {
      id: `sample-${album.id}-${session + 1}`,
      albumId: album.id,
      date: new Date(createdAt).toISOString().slice(0, 10),
      ...setting,
      notes: SESSION_NOTES[noteIndex],
      createdAt,
    }
  })
}).flat()
