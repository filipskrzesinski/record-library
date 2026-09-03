import { useState } from 'react'
import { ART_STYLES, PALETTES, coverStyle } from '@/lib/art'
import { createAlbum } from '@/lib/db'
import type { ArtStyle, Palette } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogTitle } from './ui/dialog'
import { Field } from './ui/field'
import { Input, Textarea } from './ui/input'
import { Rating } from './Rating'

const BLANK = {
  title: '',
  artist: '',
  year: '',
  genre: '',
  label: '',
  catalog: '',
  pressing: '',
  format: '',
  speed: '',
  weight: '',
  country: '',
  master: '',
  condition: '',
  notes: '',
}

export function AddAlbumDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated?: (id: string) => void
}) {
  const [form, setForm] = useState(BLANK)
  const [rating, setRating] = useState(0)
  const [art, setArt] = useState<ArtStyle>('field')
  const [palette, setPalette] = useState<Palette>(PALETTES[0].palette)

  const set = (key: keyof typeof BLANK) => (value: string) => setForm((f) => ({ ...f, [key]: value }))
  const valid = form.title.trim() && form.artist.trim()

  function reset() {
    setForm(BLANK)
    setRating(0)
    setArt('field')
    setPalette(PALETTES[0].palette)
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (!valid) return
    const year = Number.parseInt(form.year, 10)
    const id = await createAlbum({
      ...Object.fromEntries(
        Object.entries(form).map(([k, v]) => [k, v.trim() || undefined]),
      ),
      title: form.title.trim(),
      artist: form.artist.trim(),
      year: Number.isFinite(year) ? year : undefined,
      rating: rating || undefined,
      art,
      palette,
    })
    reset()
    onOpenChange(false)
    onCreated?.(id)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset()
        onOpenChange(next)
      }}
    >
      <DialogContent className="w-[min(660px,calc(100vw-32px))]">
        <DialogTitle>New record</DialogTitle>
        <form onSubmit={submit} className="mt-7 grid grid-cols-2 gap-x-8 gap-y-5">
          <Field label="Title" className="col-span-2">
            <Input value={form.title} onChange={(e) => set('title')(e.target.value)} autoFocus required />
          </Field>
          <Field label="Artist" className="col-span-2">
            <Input value={form.artist} onChange={(e) => set('artist')(e.target.value)} required />
          </Field>
          <Field label="Year">
            <Input
              value={form.year}
              onChange={(e) => set('year')(e.target.value)}
              inputMode="numeric"
              maxLength={4}
            />
          </Field>
          <Field label="Genre">
            <Input value={form.genre} onChange={(e) => set('genre')(e.target.value)} />
          </Field>
          <Field label="Label">
            <Input value={form.label} onChange={(e) => set('label')(e.target.value)} />
          </Field>
          <Field label="Catalog">
            <Input value={form.catalog} onChange={(e) => set('catalog')(e.target.value)} />
          </Field>
          <Field label="Format">
            <Input value={form.format} onChange={(e) => set('format')(e.target.value)} placeholder="LP" />
          </Field>
          <Field label="Speed">
            <Input value={form.speed} onChange={(e) => set('speed')(e.target.value)} placeholder="33⅓ RPM" />
          </Field>
          <Field label="Weight">
            <Input value={form.weight} onChange={(e) => set('weight')(e.target.value)} placeholder="180 g" />
          </Field>
          <Field label="Country">
            <Input value={form.country} onChange={(e) => set('country')(e.target.value)} />
          </Field>
          <Field label="Pressing" className="col-span-2">
            <Input value={form.pressing} onChange={(e) => set('pressing')(e.target.value)} />
          </Field>
          <Field label="Master" className="col-span-2">
            <Input value={form.master} onChange={(e) => set('master')(e.target.value)} />
          </Field>
          <Field label="Condition">
            <Input
              value={form.condition}
              onChange={(e) => set('condition')(e.target.value)}
              placeholder="NM / NM"
            />
          </Field>
          <div>
            <span className="label-xs mb-2 block">Rating</span>
            <div className="flex h-8 items-center">
              <Rating value={rating} onChange={setRating} />
            </div>
          </div>
          <Field label="Notes" className="col-span-2">
            <Textarea value={form.notes} onChange={(e) => set('notes')(e.target.value)} rows={2} />
          </Field>

          <div className="col-span-2">
            <span className="label-xs mb-3 block">Sleeve</span>
            <div className="flex flex-wrap gap-2">
              {ART_STYLES.map((style) => (
                <button
                  key={style}
                  type="button"
                  aria-label={style}
                  onClick={() => setArt(style)}
                  style={coverStyle(style, palette)}
                  className={cn(
                    'size-9 rounded-[2px] shadow-lift ring-1 ring-inset ring-[rgba(0,0,0,0.14)] transition-transform duration-150 hover:-translate-y-0.5',
                    art === style && 'outline outline-1 outline-offset-2 outline-ink',
                  )}
                />
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {PALETTES.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  aria-label={p.name}
                  onClick={() => setPalette(p.palette)}
                  style={{ backgroundImage: `linear-gradient(135deg, ${p.palette.base} 50%, ${p.palette.accent} 50%)` }}
                  className={cn(
                    'size-5 rounded-full ring-1 ring-inset ring-[rgba(0,0,0,0.16)] transition-transform duration-150 hover:scale-110',
                    palette.base === p.palette.base && 'outline outline-1 outline-offset-2 outline-ink',
                  )}
                />
              ))}
            </div>
          </div>

          <div className="col-span-2 mt-2 flex items-center justify-end gap-2">
            <Button type="button" variant="quiet" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="solid" disabled={!valid}>
              Add
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
