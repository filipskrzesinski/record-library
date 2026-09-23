import { useState } from 'react'
import { AddAlbumDialog } from '@/components/AddAlbumDialog'
import { GridCard } from '@/components/GridCard'
import { SpineRow } from '@/components/SpineRow'
import { ToggleItem, TopBar } from '@/components/TopBar'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { useLibrary } from '@/lib/db'
import { usePersisted } from '@/lib/usePersisted'
import { SORTS, type SortKey, type ViewMode } from '@/lib/types'

export function Library() {
  const [sort, setSort] = usePersisted<SortKey>('sort', 'rank')
  const [desc, setDesc] = usePersisted('desc', false)
  const [view, setView] = usePersisted<ViewMode>('view', 'grid')
  const [adding, setAdding] = useState(false)
  const albums = useLibrary(sort, desc)

  const plays = albums?.reduce((sum, album) => sum + album.listens, 0) ?? 0

  return (
    <>
      <TopBar
        center={
          <>
            <ToggleItem active={view === 'grid'} onClick={() => setView('grid')}>
              Grid
            </ToggleItem>
            <ToggleItem active={view === 'list'} onClick={() => setView('list')}>
              List
            </ToggleItem>
          </>
        }
        right={
          <>
            <Select
              aria-label="Sort by"
              value={sort}
              onValueChange={setSort}
              options={SORTS.map((s) => ({ value: s.key, label: s.label }))}
              className="h-7"
            />
            <Button
              variant="outline"
              size="sm"
              aria-label={desc ? 'Descending' : 'Ascending'}
              onClick={() => setDesc(!desc)}
              className="w-7 px-0 text-[11px]"
            >
              {desc ? '↓' : '↑'}
            </Button>
            <Button variant="solid" size="sm" onClick={() => setAdding(true)}>
              Add
            </Button>
          </>
        }
      />

      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 px-6 pb-6 pt-12 sm:px-10 xl:px-16">
        <h1 className="heading text-[40px] leading-[40px]">Collection</h1>
        <div className="text-[11px] tabular-nums text-ink-muted">
          {albums ? `${albums.length} records · ${plays} plays` : ' '}
        </div>
      </div>

      <main className="px-6 pb-32 pt-6 sm:px-10 xl:px-16">
        {albums && albums.length === 0 && (
          <div className="flex flex-col items-center gap-5 py-32">
            <span className="font-serif text-[40px] font-light text-ink-faint">—</span>
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
            {albums.map((album, i) => (
              <div
                key={album.id}
                className="animate-card-fade-in motion-reduce:animate-none"
                style={{ animationDelay: `${Math.min(i, 6) * 30}ms` }}
              >
                <GridCard album={album} />
              </div>
            ))}
          </div>
        )}

        {albums && albums.length > 0 && view === 'list' && (
          <div key={`list-${sort}-${desc}`} className="record-list isolate flex flex-col gap-[5px] overflow-visible">
            {albums.map((album, i) => (
              <div
                key={album.id}
                className="record-list-item relative animate-rise overflow-visible"
                style={{ animationDelay: `${Math.min(i, 18) * 16}ms` }}
              >
                <SpineRow album={album} />
              </div>
            ))}
          </div>
        )}
      </main>

      <AddAlbumDialog open={adding} onOpenChange={setAdding} />
    </>
  )
}
