import Dexie, { type Table } from 'dexie'
import { useLiveQuery } from 'dexie-react-hooks'
import type { Album, Listen, SortKey } from './types'
import { uid } from './utils'

class LibraryDB extends Dexie {
  albums!: Table<Album, string>
  listens!: Table<Listen, string>
  migrations!: Table<{ id: string }, string>

  constructor() {
    super('record-library')
    this.version(1).stores({
      albums: 'id, artist, title, year, addedAt',
      listens: 'id, albumId, date, createdAt',
    })
    this.version(2).stores({ migrations: 'id' })
  }
}

export const db = new LibraryDB()

export async function ensureSeed() {
  const migrationId = 'pitchfork-readers-200-v1'
  // v3 pins the most recent sample sessions to hand-picked records, dated in local time.
  const sessionsMigrationId = 'pitchfork-sample-sessions-v3'
  if ((await db.migrations.bulkGet([migrationId, sessionsMigrationId])).every(Boolean)) return
  const [{ SEED_ALBUMS, SEED_LISTENS, isUntouchedSample }, { untouchedDemoIds }] = await Promise.all([
    import('./seed'),
    import('./seed-migration'),
  ])
  await db.transaction('rw', db.albums, db.listens, db.migrations, async () => {
    // Recheck under the write lock: another tab may have finished importing.
    if (!await db.migrations.get(migrationId)) {
      const [albums, listens] = await Promise.all([db.albums.toArray(), db.listens.toArray()])
      const demoIds = untouchedDemoIds(albums, listens)
      await db.listens.where('albumId').anyOf(demoIds).delete()
      await db.albums.bulkDelete(demoIds)
      const existing = new Set(albums.map((album) => album.id))
      await db.albums.bulkAdd(SEED_ALBUMS.filter((album) => !existing.has(album.id)))
      await db.migrations.add({ id: migrationId })
    }
    if (!await db.migrations.get(sessionsMigrationId)) {
      // Regenerate earlier sample sessions; any the user has edited stay as they are.
      const stale = (await db.listens.toArray()).filter(isUntouchedSample).map((listen) => listen.id)
      await db.listens.bulkDelete(stale)
      const albumIds = new Set(await db.albums.toCollection().primaryKeys())
      const listenIds = new Set(await db.listens.toCollection().primaryKeys())
      await db.listens.bulkAdd(SEED_LISTENS.filter((listen) =>
        albumIds.has(listen.albumId) && !listenIds.has(listen.id),
      ))
      await db.migrations.add({ id: sessionsMigrationId })
    }
  })
}

/* ---------------------------------------------------------------- writes */

export async function createAlbum(input: Omit<Album, 'id' | 'addedAt'>) {
  const album: Album = { ...input, id: uid(), addedAt: Date.now() }
  await db.albums.add(album)
  return album.id
}

export async function updateAlbum(id: string, changes: Partial<Album>) {
  await db.albums.update(id, changes)
}

export async function deleteAlbum(id: string) {
  await db.transaction('rw', db.albums, db.listens, async () => {
    await db.listens.where('albumId').equals(id).delete()
    await db.albums.delete(id)
  })
}

export async function createListen(input: Omit<Listen, 'id' | 'createdAt'>) {
  const listen: Listen = { ...input, id: uid(), createdAt: Date.now() }
  await db.listens.add(listen)
  return listen.id
}

export async function updateListen(id: string, changes: Partial<Listen>) {
  await db.listens.update(id, changes)
}

export async function deleteListen(id: string) {
  await db.listens.delete(id)
}

/* ----------------------------------------------------------------- reads */

export interface AlbumWithStats extends Album {
  listens: number
  lastPlayed?: string
}

function withStats(albums: Album[], listens: Listen[]): AlbumWithStats[] {
  const counts = new Map<string, number>()
  const last = new Map<string, string>()
  for (const l of listens) {
    counts.set(l.albumId, (counts.get(l.albumId) ?? 0) + 1)
    const seen = last.get(l.albumId)
    if (!seen || l.date > seen) last.set(l.albumId, l.date)
  }
  return albums.map((a) => ({
    ...a,
    listens: counts.get(a.id) ?? 0,
    lastPlayed: last.get(a.id),
  }))
}

const collator = new Intl.Collator('en', { sensitivity: 'base', ignorePunctuation: true })

/** Strip a leading article so "The Dark Side of the Moon" files under D. */
function filingName(value: string) {
  return value.replace(/^(the|a|an)\s+/i, '')
}

export function sortAlbums(albums: AlbumWithStats[], sort: SortKey, desc: boolean) {
  const dir = desc ? -1 : 1
  const sorted = [...albums].sort((a, b) => {
    switch (sort) {
      case 'rank': {
        if (!a.source && !b.source) return collator.compare(a.title, b.title)
        if (!a.source) return 1
        if (!b.source) return -1
        return (a.source.rank - b.source.rank) * dir
      }
      case 'added':
        return (a.addedAt - b.addedAt) * dir
      case 'released':
        return ((a.year ?? 0) - (b.year ?? 0)) * dir || collator.compare(a.title, b.title)
      case 'artist':
        return (
          collator.compare(filingName(a.artist), filingName(b.artist)) * dir ||
          (a.year ?? 0) - (b.year ?? 0)
        )
      case 'title':
        return collator.compare(filingName(a.title), filingName(b.title)) * dir
      case 'listens':
        return (a.listens - b.listens) * dir || collator.compare(a.title, b.title)
      case 'played': {
        // Never played sits at the end regardless of direction.
        if (!a.lastPlayed && !b.lastPlayed) return collator.compare(a.title, b.title)
        if (!a.lastPlayed) return 1
        if (!b.lastPlayed) return -1
        return a.lastPlayed < b.lastPlayed ? -dir : a.lastPlayed > b.lastPlayed ? dir : 0
      }
      default:
        return 0
    }
  })
  return sorted
}

export function useLibrary(sort: SortKey, desc: boolean) {
  return useLiveQuery(
    async () => {
      const [albums, listens] = await Promise.all([db.albums.toArray(), db.listens.toArray()])
      return sortAlbums(withStats(albums, listens), sort, desc)
    },
    [sort, desc],
  )
}

export interface Session extends Listen {
  album: Album
}

/** Every listen joined to its album, newest first. */
export function useHistory() {
  return useLiveQuery(async () => {
    const [albums, listens] = await Promise.all([db.albums.toArray(), db.listens.toArray()])
    const byId = new Map(albums.map((album) => [album.id, album]))
    const sessions: Session[] = []
    for (const listen of listens) {
      const album = byId.get(listen.albumId)
      if (album) sessions.push({ ...listen, album })
    }
    return sessions.sort((a, b) =>
      a.date < b.date ? 1 : a.date > b.date ? -1 : b.createdAt - a.createdAt,
    )
  })
}

/** Wrapped so that `undefined` means loading and `{ album: undefined }` means missing. */
export function useAlbum(id: string | undefined) {
  return useLiveQuery(
    async () => ({ album: id ? await db.albums.get(id) : undefined }),
    [id],
  )
}

export function useListens(albumId: string | undefined) {
  return useLiveQuery(
    async () => {
      if (!albumId) return [] as Listen[]
      const rows = await db.listens.where('albumId').equals(albumId).toArray()
      return rows.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.createdAt - a.createdAt))
    },
    [albumId],
    [] as Listen[],
  )
}
