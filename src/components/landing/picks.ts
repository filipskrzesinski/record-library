import collection from '@/data/pitchfork-200.json'
import type { ArtStyle, Palette } from '@/lib/types'

export interface Pick {
  id: string
  title: string
  artist: string
  year: number
  genre: string
  label: string
  coverUrl: string
  art: ArtStyle
  palette: Palette
}

/** Covers come straight from the seeded collection, so the page shows real records. */
const BY_ID = new Map<string, Pick>(
  collection.albums.map((album) => [album.id, { ...album, art: 'flat' as ArtStyle }]),
)

export const TOTAL = collection.albums.length

export function pick(...ids: string[]): Pick[] {
  return ids.map((id) => {
    const album = BY_ID.get(id)
    if (!album) throw new Error(`Landing page references a record that is not in the collection: ${id}`)
    return album
  })
}

/** Centre sleeve first; the rest alternate outward to either side of it. */
export const HERO = pick(
  'pitchfork-001',
  'pitchfork-003',
  'pitchfork-005',
  'pitchfork-008',
  'pitchfork-014',
  'pitchfork-011',
  'pitchfork-004',
)

export const GRID = pick(
  'pitchfork-006',
  'pitchfork-012',
  'pitchfork-002',
  'pitchfork-009',
  'pitchfork-007',
  'pitchfork-013',
)

export const SPINES = pick('pitchfork-010', 'pitchfork-016', 'pitchfork-021', 'pitchfork-028')

export const MINI_SHELF = pick('pitchfork-019', 'pitchfork-005', 'pitchfork-022')

export const HISTORY = pick('pitchfork-018', 'pitchfork-003', 'pitchfork-025', 'pitchfork-011')

/** The record whose pressing detail the page walks through. */
export const [FEATURED] = pick('pitchfork-004')
