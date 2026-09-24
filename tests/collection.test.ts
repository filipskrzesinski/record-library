import 'fake-indexeddb/auto'
import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { readdir } from 'node:fs/promises'
import sharp from 'sharp'
import Dexie from 'dexie'
import { db, ensureSeed, deleteAlbum, sortAlbums } from '../src/lib/db'
import { isoDate } from '../src/lib/format'
import { SEED_ALBUMS, SEED_LISTENS } from '../src/lib/seed'
import { SEED_ALBUMS as DEMO_ALBUMS, SEED_LISTENS as DEMO_LISTENS } from '../src/lib/legacy-seed'

afterEach(async () => {
  await db.delete({ disableAutoOpen: false })
})

test('every seeded rank has complete sourced metadata and a decodable local cover', async () => {
  // The 2021 list has 200 ranks; Taylor Swift's three albums are left out.
  assert.equal(SEED_ALBUMS.length, 197)
  assert.equal(new Set(SEED_ALBUMS.map((album) => album.id)).size, 197)
  assert.equal((await readdir('public/covers')).filter((name) => name.endsWith('.webp')).length, 197)
  assert.ok(!SEED_ALBUMS.some((album) => album.artist === 'Taylor Swift'))
  for (const [i, album] of SEED_ALBUMS.entries()) {
    assert.ok(album.source && album.source.rank > (SEED_ALBUMS[i - 1]?.source?.rank ?? 0))
    assert.equal(album.id, `pitchfork-${String(album.source.rank).padStart(3, '0')}`)
    assert.ok(album.title && album.artist && album.year && album.genre && album.label)
    assert.ok(album.source.votes > 0)
    assert.ok(!/[Ã�]/.test(album.artist))
    assert.equal(new URL(album.source.metadataUrl).protocol, 'https:')
    assert.equal(new URL(album.source.coverSourceUrl).protocol, 'https:')
    assert.match(album.coverUrl!, /^\/covers\/pitchfork-\d{3}\.webp$/)
    const metadata = await sharp(`public${album.coverUrl}`).metadata()
    assert.equal(metadata.format, 'webp')
    assert.ok(metadata.width! >= 400 && metadata.height! >= 400, album.id)
    await sharp(`public${album.coverUrl}`).raw().toBuffer()
    assert.equal(album.rating, undefined)
    assert.equal(album.condition, undefined)
    assert.equal(album.pressing, undefined)
  }
  assert.equal(SEED_ALBUMS[0].title, 'Kid A')
  assert.equal(SEED_ALBUMS.at(-1)!.title, "Mama's Gun")
  assert.equal(SEED_ALBUMS.find((album) => album.source?.rank === 188)!.artist, 'Janelle Monáe')
})

test('sample sessions cover half the collection with varied dates and one to five listens', () => {
  const counts = new Map<string, number>()
  const albumIds = new Set(SEED_ALBUMS.map((album) => album.id))
  const dates = new Set<string>()
  for (const listen of SEED_LISTENS) {
    assert.ok(albumIds.has(listen.albumId))
    assert.ok(listen.location && listen.system && listen.notes)
    assert.ok(listen.createdAt < Date.now())
    assert.equal(listen.date, isoDate(listen.createdAt))
    counts.set(listen.albumId, (counts.get(listen.albumId) ?? 0) + 1)
    dates.add(listen.date)
  }
  assert.equal(counts.size, 100)
  assert.equal(SEED_LISTENS.length, 188)
  assert.equal(new Set(SEED_LISTENS.map((listen) => listen.id)).size, 188)
  assert.ok(dates.size > 60)
  assert.deepEqual([1, 2, 3, 4, 5].map((count) => [...counts.values()].filter((value) => value === count).length), [50, 25, 15, 7, 3])

  const title = new Map(SEED_ALBUMS.map((album) => [album.id, album.title]))
  const newest = [...SEED_LISTENS].sort((a, b) => b.createdAt - a.createdAt).slice(0, 6)
  assert.deepEqual(newest.map((listen) => title.get(listen.albumId)), [
    'Kid A', 'Mezzanine', 'In Colour', 'Yankee Hotel Foxtrot', 'To Pimp a Butterfly', 'Merriweather Post Pavilion',
  ])
})

test('regenerates untouched sample sessions from an earlier seed and keeps edited ones', async () => {
  await db.albums.bulkAdd(SEED_ALBUMS)
  await db.migrations.bulkAdd([{ id: 'pitchfork-readers-200-v1' }, { id: 'pitchfork-sample-sessions-v1' }])
  const oldSample = { ...SEED_LISTENS[0], id: 'sample-pitchfork-003-9', albumId: 'pitchfork-003' }
  const editedSample = { ...oldSample, id: 'sample-pitchfork-004-9', albumId: 'pitchfork-004', notes: 'Mine' }
  await db.listens.bulkAdd([oldSample, editedSample])
  await ensureSeed()
  assert.equal(await db.listens.get(oldSample.id), undefined)
  assert.deepEqual(await db.listens.get(editedSample.id), editedSample)
  assert.equal(await db.listens.count(), SEED_LISTENS.length + 1)
})

test('fresh and concurrent initialization imports albums and sample sessions once', async () => {
  await Promise.all([ensureSeed(), ensureSeed(), ensureSeed()])
  assert.equal(await db.albums.count(), 197)
  assert.equal(await db.listens.count(), 188)
  assert.equal(await db.migrations.count(), 2)
})

test('existing collections receive sample sessions without overwriting listens or reviving deleted albums', async () => {
  await db.albums.bulkAdd(SEED_ALBUMS)
  await db.migrations.add({ id: 'pitchfork-readers-200-v1' })
  const deletedAlbumId = SEED_LISTENS[0].albumId
  await deleteAlbum(deletedAlbumId)
  const existingSample = { ...SEED_LISTENS[1], notes: 'My edited session' }
  const userListen = { ...existingSample, id: 'my-listen', notes: 'My own session' }
  await db.listens.bulkAdd([existingSample, userListen])
  await Promise.all([ensureSeed(), ensureSeed()])
  assert.equal(await db.albums.count(), 196)
  assert.equal(await db.listens.where('albumId').equals(deletedAlbumId).count(), 0)
  assert.deepEqual(await db.listens.get(existingSample.id), existingSample)
  assert.deepEqual(await db.listens.get(userListen.id), userListen)
  const expected = SEED_LISTENS.filter((listen) => listen.albumId !== deletedAlbumId).length + 1
  assert.equal(await db.listens.count(), expected)

  await db.listens.delete(existingSample.id)
  await ensureSeed()
  assert.equal(await db.listens.get(existingSample.id), undefined)
  assert.equal(await db.listens.count(), expected - 1)
})

test('upgrades a version 1 library and replaces only untouched demo records', async () => {
  const old = new Dexie('record-library')
  old.version(1).stores({ albums: 'id, artist, title, year, addedAt', listens: 'id, albumId, date, createdAt' })
  await old.table('albums').bulkAdd(structuredClone(DEMO_ALBUMS))
  await old.table('listens').bulkAdd(structuredClone(DEMO_LISTENS))
  old.close()

  // Existing user records, metadata edits, new sessions, and edited/deleted demo sessions survive.
  const userAlbum = { ...DEMO_ALBUMS[0], id: 'my-record', title: 'My record' }
  await db.albums.add(userAlbum)
  await db.albums.update('kind-of-blue', { notes: 'My own notes' })
  const userListen = { id: 'my-listen', albumId: 'aja', date: '2026-01-01', createdAt: 123, notes: 'My session' }
  await db.listens.add(userListen)
  const edited = DEMO_LISTENS.find((listen) => listen.albumId === 'folk-singer')!
  await db.listens.update(edited.id, { notes: 'Updated session' })
  const removed = DEMO_LISTENS.find((listen) => listen.albumId === 'cafe-blue')!
  await db.listens.delete(removed.id)
  const redated = DEMO_LISTENS.find((listen) => listen.albumId === 'saxophone-colossus')!
  await db.listens.update(redated.id, { date: '2026-01-02' })
  await ensureSeed()

  assert.equal(await db.albums.count(), 203)
  assert.deepEqual(await db.albums.get('my-record'), userAlbum)
  assert.equal((await db.albums.get('kind-of-blue'))?.notes, 'My own notes')
  assert.deepEqual(await db.listens.get('my-listen'), userListen)
  assert.equal((await db.listens.get(edited.id))?.notes, 'Updated session')
  assert.ok(await db.albums.get('cafe-blue'))
  assert.equal((await db.listens.get(redated.id))?.date, '2026-01-02')
  assert.equal(await db.albums.get('dark-side-of-the-moon'), undefined)
  assert.equal(await db.listens.where('albumId').equals('dark-side-of-the-moon').count(), 0)
})

test('reload preserves imported album edits and does not resurrect deleted records', async () => {
  await ensureSeed()
  await db.albums.update('pitchfork-001', { notes: 'My notes', rating: 4 })
  await deleteAlbum('pitchfork-002')
  await ensureSeed()
  assert.equal(await db.albums.count(), 196)
  assert.equal((await db.albums.get('pitchfork-001'))?.notes, 'My notes')
  assert.equal((await db.albums.get('pitchfork-001'))?.rating, 4)
  assert.equal(await db.albums.get('pitchfork-002'), undefined)
  await db.albums.clear()
  await ensureSeed()
  assert.equal(await db.albums.count(), 0)
})

test('ranking sorts in both directions and leaves unranked user albums at the end', () => {
  const albums = [SEED_ALBUMS.at(-1)!, { ...DEMO_ALBUMS[0] }, SEED_ALBUMS[0]].map((album) => ({ ...album, listens: 0 }))
  assert.deepEqual(sortAlbums(albums, 'rank', false).map((album) => album.id), ['pitchfork-001', 'pitchfork-200', 'kind-of-blue'])
  assert.deepEqual(sortAlbums(albums, 'rank', true).map((album) => album.id), ['pitchfork-200', 'pitchfork-001', 'kind-of-blue'])
})
