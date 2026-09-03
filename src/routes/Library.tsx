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
  const [sort, setSort] = usePersisted<SortKey>('sort', 'added')
  const [desc, setDesc] = usePersisted('desc', true)
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

      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3 border-b border-line px-4 pb-5 pt-12 sm:px-6 sm:pt-16">
        <h1 className="display text-[clamp(38px,7.5vw,80px)]">Collection</h1>
        <div className="label-xs pb-1.5">
          {albums ? `${albums.length} records · ${plays} plays` : ' '}
        </div>
      </div>

      <main className="px-4 pb-32 pt-8 sm:px-6 sm:pt-10">
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
            className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
          >
            {albums.map((album, i) => (
              <div
                key={album.id}
                className="animate-rise"
                style={{ animationDelay: `${Math.min(i, 14) * 20}ms` }}
              >
                <GridCard album={album} />
              </div>
            ))}
          </div>
        )}

        {albums && albums.length > 0 && view === 'list' && (
          <div key={`list-${sort}-${desc}`} className="flex flex-col gap-[5px]">
            {albums.map((album, i) => (
              <div
                key={album.id}
                className="animate-rise"
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
