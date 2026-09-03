import { useEffect, useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AddListenDialog } from '@/components/AddListenDialog'
import { Cover } from '@/components/Cover'
import { Editable } from '@/components/Editable'
import { Rating } from '@/components/Rating'
import { TopBar } from '@/components/TopBar'
import { Button } from '@/components/ui/button'
import {
  deleteAlbum,
  deleteListen,
  updateAlbum,
  updateListen,
  useAlbum,
  useListens,
} from '@/lib/db'
import { ago, isoDate } from '@/lib/format'
import type { Album, Listen } from '@/lib/types'

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[86px_minmax(0,1fr)] items-baseline gap-5 border-t border-line py-2.5 sm:grid-cols-[104px_minmax(0,1fr)]">
      <dt className="label-xs">{label}</dt>
      <dd className="min-w-0 text-[12.5px]">{children}</dd>
    </div>
  )
}

export function AlbumDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const query = useAlbum(id)
  const listens = useListens(id)
  const [adding, setAdding] = useState(false)
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    if (!confirming) return
    const timer = setTimeout(() => setConfirming(false), 4000)
    return () => clearTimeout(timer)
  }, [confirming])

  if (!query) return null

  const album = query.album

  if (!album) {
    return (
      <>
        <TopBar />
        <div className="flex flex-col items-center gap-5 py-40">
          <span className="font-serif text-[40px] font-light text-ink-faint">—</span>
          <Button variant="outline" onClick={() => navigate('/')}>
            Collection
          </Button>
        </div>
      </>
    )
  }

  const save = (key: keyof Album) => (value: string) =>
    updateAlbum(album.id, { [key]: value || undefined })

  const saveYear = (value: string) => {
    const year = Number.parseInt(value, 10)
    updateAlbum(album.id, { year: Number.isFinite(year) ? year : undefined })
  }

  const lastPlayed = listens[0]?.date

  return (
    <>
      <TopBar
        center={
          <Link
            to="/"
            className="text-[11px] text-ink-faint transition-colors duration-150 hover:text-ink"
          >
            ← Collection
          </Link>
        }
        right={
          <Button
            variant={confirming ? 'danger' : 'quiet'}
            size="sm"
            onClick={() => {
              if (!confirming) return setConfirming(true)
              deleteAlbum(album.id).then(() => navigate('/'))
            }}
          >
            {confirming ? 'Confirm' : 'Delete'}
          </Button>
        }
      />

      <div className="border-b border-line px-4 pb-5 pt-12 sm:px-6 sm:pt-16">
        <Editable
          value={album.title}
          onSave={(value) => value && updateAlbum(album.id, { title: value })}
          wrap
          className="display max-w-[16ch] text-[clamp(34px,6.5vw,72px)]"
        />
        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1">
          <div className="min-w-0 max-w-[36ch] flex-1 text-[13px] text-ink-muted">
            <Editable
              value={album.artist}
              onSave={(value) => value && updateAlbum(album.id, { artist: value })}
              wrap
            />
          </div>
          <div className="label-xs">
            {[album.year, album.label, album.catalog].filter(Boolean).join(' · ')}
          </div>
        </div>
      </div>

      <div className="grid gap-10 px-4 pt-10 sm:px-6 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:gap-16">
        <div className="animate-rise self-start lg:sticky lg:top-20">
          <Cover art={album.art} palette={album.palette} className="rounded-[3px] shadow-cover" />
          <div className="mt-6 flex items-center justify-between gap-4">
            <Rating
              value={album.rating}
              onChange={(rating) => updateAlbum(album.id, { rating: rating || undefined })}
            />
            <span className="label-xs">{listens.length ? `${listens.length}×` : 'Unplayed'}</span>
          </div>
        </div>

        <div className="min-w-0 animate-rise" style={{ animationDelay: '60ms' }}>
          <dl className="border-b border-line">
            <Row label="Released">
              <Editable value={album.year ? String(album.year) : ''} onSave={saveYear} />
            </Row>
            <Row label="Genre">
              <Editable value={album.genre} onSave={save('genre')} />
            </Row>
            <Row label="Label">
              <Editable value={album.label} onSave={save('label')} />
            </Row>
            <Row label="Catalog">
              <Editable value={album.catalog} onSave={save('catalog')} />
            </Row>
            <Row label="Pressing">
              <Editable value={album.pressing} onSave={save('pressing')} wrap />
            </Row>
            <Row label="Master">
              <Editable value={album.master} onSave={save('master')} wrap />
            </Row>
            <Row label="Format">
              <Editable value={album.format} onSave={save('format')} />
            </Row>
            <Row label="Speed">
              <Editable value={album.speed} onSave={save('speed')} />
            </Row>
            <Row label="Weight">
              <Editable value={album.weight} onSave={save('weight')} />
            </Row>
            <Row label="Country">
              <Editable value={album.country} onSave={save('country')} />
            </Row>
            <Row label="Condition">
              <Editable value={album.condition} onSave={save('condition')} />
            </Row>
            <Row label="Added">
              <span className="text-ink-muted">
                {isoDate(album.addedAt)}
                <span className="text-ink-faint"> · {ago(album.addedAt)}</span>
              </span>
            </Row>
            <Row label="Played">
              {lastPlayed ? (
                <span className="text-ink-muted">
                  {lastPlayed}
                  <span className="text-ink-faint"> · {ago(lastPlayed)}</span>
                </span>
              ) : (
                <span className="text-ink-faint">—</span>
              )}
            </Row>
            <Row label="Notes">
              <Editable value={album.notes} onSave={save('notes')} multiline />
            </Row>
          </dl>
        </div>
      </div>

      <section className="mt-16 px-4 pb-32 sm:px-6">
        <div className="flex items-center justify-between gap-6 border-b border-ink/25 pb-2.5">
          <h2 className="label-xs">Sessions · {listens.length}</h2>
          <Button variant="outline" size="sm" onClick={() => setAdding(true)}>
            Add
          </Button>
        </div>

        {listens.length === 0 ? (
          <p className="border-t border-line py-4 text-[13px] text-ink-faint">—</p>
        ) : (
          <ul>
            {listens.map((listen) => (
              <SessionRow key={listen.id} listen={listen} />
            ))}
          </ul>
        )}
      </section>

      <AddListenDialog
        albumId={album.id}
        open={adding}
        onOpenChange={setAdding}
        lastSystem={listens[0]?.system}
        lastLocation={listens[0]?.location}
      />
    </>
  )
}

function SessionRow({ listen }: { listen: Listen }) {
  const save = (key: keyof Listen) => (value: string) =>
    updateListen(listen.id, { [key]: value || undefined })

  return (
    <li className="group relative grid grid-cols-1 items-start gap-x-8 gap-y-2 border-t border-line py-3.5 transition-colors duration-150 hover:bg-ink/[0.02] md:grid-cols-[132px_minmax(0,1fr)_minmax(0,300px)]">
      <div className="text-[11px] text-ink-muted">
        <Editable
          type="date"
          value={listen.date}
          onSave={(value) => value && updateListen(listen.id, { date: value })}
        />
        <div className="label-xs mt-0.5">{ago(listen.date)}</div>
      </div>

      <div className="min-w-0 text-[13px]">
        <Editable value={listen.notes} onSave={save('notes')} placeholder="Notes" multiline />
      </div>

      <div className="min-w-0 text-[11px] text-ink-faint md:text-right">
        <Editable
          value={listen.location}
          onSave={save('location')}
          placeholder="Location"
          className="md:text-right"
        />
        <div className="mt-1">
          <Editable
            value={listen.system}
            onSave={save('system')}
            placeholder="System"
            wrap
            className="md:text-right"
          />
        </div>
      </div>

      <Button
        variant="danger"
        size="xs"
        className="-ml-1.5 mt-1.5 opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100 md:absolute md:bottom-3.5 md:left-0 md:mt-0"
        onClick={() => deleteListen(listen.id)}
      >
        Remove
      </Button>
    </li>
  )
}
