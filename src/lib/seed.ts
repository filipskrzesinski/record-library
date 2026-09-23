import type { Album } from './types'
import collection from '../data/pitchfork-200.json'

const importedAt = Date.now()

export const SEED_ALBUMS: Album[] = collection.albums.map((album) => ({
  ...album,
  art: 'flat',
  addedAt: importedAt,
}))
