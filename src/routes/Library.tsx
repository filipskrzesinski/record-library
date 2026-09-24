import { useState } from 'react'
import { AddAlbumDialog } from '@/components/AddAlbumDialog'
import { GridCard } from '@/components/GridCard'
import { History } from '@/components/History'
import { LoadMore } from '@/components/LoadMore'
import { Shelf } from '@/components/Shelf'
import { SpineRow } from '@/components/SpineRow'
import { GridIcon, HistoryIcon, ListIcon, ShelfIcon, ToggleItem, TopBar } from '@/components/TopBar'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { useHistory, useLibrary } from '@/lib/db'
import { useIncremental } from '@/lib/useIncremental'
import { usePersisted } from '@/lib/usePersisted'
import { SORTS, type SortKey, type ViewMode } from '@/lib/types'

/** Items rendered per batch; more load as you scroll near the end. Shelf renders everything. */
const BATCH = { grid: 25, list: 50, shelf: Infinity, history: 10 } satisfies Record<ViewMode, number>

export function Library() {
  const [sort, setSort] = usePersisted<SortKey>('sort', 'rank')
  const [desc, setDesc] = usePersisted('desc', false)
  const [view, setView] = usePersisted<ViewMode>('view', 'shelf')
  const [adding, setAdding] = useState(false)
  const albums = useLibrary(sort, desc)
  const sessions = useHistory()
  const [shown, showMore] = useIncremental(BATCH[view], `${view}-${sort}-${desc}`)
  const batch = BATCH[view]

  const plays = albums?.reduce((sum, album) => sum + album.listens, 0) ?? 0

  return (
    <>
      <TopBar
        center={
          <>
            <ToggleItem label="Grid" active={view === 'grid'} onClick={() => setView('grid')}>
              <GridIcon />
            </ToggleItem>
            <ToggleItem label="List" active={view === 'list'} onClick={() => setView('list')}>
              <ListIcon />
            </ToggleItem>
            <ToggleItem label="Shelf" active={view === 'shelf'} onClick={() => setView('shelf')}>
              <ShelfIcon />
            </ToggleItem>
            <ToggleItem label="History" active={view === 'history'} onClick={() => setView('history')}>
              <HistoryIcon />
            </ToggleItem>
          </>
        }
        right={
          <>
            {/* History is always chronological, so sorting doesn't apply. */}
            <div className={`flex items-center ${view === 'history' ? 'invisible' : ''}`}>
              <Button
                variant="quiet"
                size="sm"
                aria-label={desc ? 'Descending' : 'Ascending'}
                onClick={() => setDesc(!desc)}
                className="w-7 px-0"
              >
                {desc ? '↓' : '↑'}
              </Button>
              <Select
                aria-label="Sort by"
                value={sort}
                onValueChange={setSort}
                options={SORTS.map((s) => ({ value: s.key, label: s.label }))}
                className="h-7"
              />
            </div>
            <Button variant="quiet" size="sm" className="-mr-2.5" onClick={() => setAdding(true)}>
              Add
            </Button>
          </>
        }
      />

      <div className="flex flex-col items-center px-6 pb-6 pt-12 sm:px-10 xl:px-16">
        <h1 className="sr-only">Collection</h1>
        <div className="font-caption text-caption tabular-nums text-overlay">
          {albums ? `${albums.length} records · ${plays} plays` : ' '}
        </div>
      </div>

      <main className="px-6 pb-32 pt-6 sm:px-10 xl:px-16">
        {albums && albums.length === 0 && (
          <div className="flex flex-col items-center gap-5 py-32">
            <span className="font-empty text-empty text-ink-faint">—</span>
            <Button variant="outline" onClick={() => setAdding(true)}>
              Add a record
            </Button>
          </div>
        )}

        {albums && albums.length > 0 && view === 'grid' && (
          <div
            key={`grid-${sort}-${desc}`}
            className="record-grid grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5"
          >
            {albums.slice(0, shown).map((album, i) => (
              <div
                key={album.id}
                className="animate-card-fade-in motion-reduce:animate-none"
                style={{ animationDelay: `${Math.min(i % batch, 6) * 30}ms` }}
              >
                <GridCard album={album} />
              </div>
            ))}
          </div>
        )}

        {albums && albums.length > 0 && view === 'list' && (
          <div key={`list-${sort}-${desc}`} className="record-list isolate flex flex-col gap-[5px] overflow-visible">
            {albums.slice(0, shown).map((album, i) => (
              <div
                key={album.id}
                className="record-list-item relative animate-rise overflow-visible"
                style={{ animationDelay: `${Math.min(i % batch, 18) * 16}ms` }}
              >
                <SpineRow album={album} />
              </div>
            ))}
          </div>
        )}

        {albums && albums.length > 0 && view === 'shelf' && (
          <div className="-mx-6 sm:-mx-10 xl:-mx-16">
            <Shelf key={`shelf-${sort}-${desc}`} albums={albums} />
          </div>
        )}

        {albums && albums.length > 0 && view === 'history' && sessions && (
          sessions.length > 0 ? (
            <History sessions={sessions.slice(0, shown)} batch={batch} />
          ) : (
            <div className="flex justify-center py-32">
              <span className="font-empty text-empty text-ink-faint">—</span>
            </div>
          )
        )}

        {albums && view !== 'shelf' && shown < (view === 'history' ? (sessions?.length ?? 0) : albums.length) && (
          <LoadMore key={shown} onVisible={showMore} />
        )}
      </main>

      <AddAlbumDialog open={adding} onOpenChange={setAdding} />
    </>
  )
}
