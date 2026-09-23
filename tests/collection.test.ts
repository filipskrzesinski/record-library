import 'fake-indexeddb/auto'
import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { readdir } from 'node:fs/promises'
import sharp from 'sharp'
import Dexie from 'dexie'
import { db, ensureSeed, deleteAlbum, sortAlbums } from '../src/lib/db'
import { SEED_ALBUMS } from '../src/lib/seed'
import { SEED_ALBUMS as DEMO_ALBUMS, SEED_LISTENS as DEMO_LISTENS } from '../src/lib/legacy-seed'

afterEach(async () => {
  await db.delete({ disableAutoOpen: false })
})

test('all 200 ranks have complete sourced metadata and decodable local covers', async () => {
  assert.equal(SEED_ALBUMS.length, 200)
  assert.equal(new Set(SEED_ALBUMS.map((album) => album.id)).size, 200)
  assert.equal((await readdir('public/covers')).filter((name) => name.endsWith('.webp')).length, 200)
  for (const [i, album] of SEED_ALBUMS.entries()) {
    assert.equal(album.source?.rank, i + 1)
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
  assert.equal(SEED_ALBUMS[199].title, "Mama's Gun")
  assert.equal(SEED_ALBUMS[187].artist, 'Janelle Monáe')
})

test('fresh and concurrent initialization imports once without invented listening history', async () => {
  await Promise.all([ensureSeed(), ensureSeed(), ensureSeed()])
  assert.equal(await db.albums.count(), 200)
  assert.equal(await db.listens.count(), 0)
  assert.equal(await db.migrations.count(), 1)
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

  assert.equal(await db.albums.count(), 206)
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
  assert.equal(await db.albums.count(), 199)
  assert.equal((await db.albums.get('pitchfork-001'))?.notes, 'My notes')
  assert.equal((await db.albums.get('pitchfork-001'))?.rating, 4)
  assert.equal(await db.albums.get('pitchfork-002'), undefined)
  await db.albums.clear()
  await ensureSeed()
  assert.equal(await db.albums.count(), 0)
})

test('ranking sorts in both directions and leaves unranked user albums at the end', () => {
  const albums = [SEED_ALBUMS[199], { ...DEMO_ALBUMS[0] }, SEED_ALBUMS[0]].map((album) => ({ ...album, listens: 0 }))
  assert.deepEqual(sortAlbums(albums, 'rank', false).map((album) => album.id), ['pitchfork-001', 'pitchfork-200', 'kind-of-blue'])
  assert.deepEqual(sortAlbums(albums, 'rank', true).map((album) => album.id), ['pitchfork-200', 'pitchfork-001', 'kind-of-blue'])
})
