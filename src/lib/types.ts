export type ArtStyle = 'field' | 'bands' | 'orb' | 'horizon' | 'split' | 'arc' | 'prism' | 'flat'

export interface Palette {
  /** Body of the sleeve. */
  base: string
  /** Secondary form printed over the base. */
  accent: string
  /** Shadowed edge, also the bottom of the spine. */
  deep: string
  /** Type printed on the sleeve and spine. */
  ink: string
}

export interface Album {
  id: string
  title: string
  artist: string
  year?: number
  genre?: string
  label?: string
  catalog?: string
  pressing?: string
  format?: string
  speed?: string
  weight?: string
  country?: string
  master?: string
  condition?: string
  rating?: number
  notes?: string
  art: ArtStyle
  palette: Palette
  addedAt: number
}

export interface Listen {
  id: string
  albumId: string
  /** yyyy-mm-dd */
  date: string
  location?: string
  system?: string
  notes?: string
  createdAt: number
}

export type SortKey = 'added' | 'released' | 'artist' | 'title' | 'listens' | 'played'
export type ViewMode = 'grid' | 'list'

export const SORTS: { key: SortKey; label: string }[] = [
  { key: 'added', label: 'Date added' },
  { key: 'released', label: 'Release date' },
  { key: 'artist', label: 'Artist' },
  { key: 'title', label: 'Album' },
  { key: 'listens', label: 'Listens' },
  { key: 'played', label: 'Last played' },
]
