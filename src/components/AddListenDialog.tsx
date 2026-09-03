import { useState } from 'react'
import { createListen } from '@/lib/db'
import { isoDate } from '@/lib/format'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogTitle } from './ui/dialog'
import { Field } from './ui/field'
import { Input, Textarea } from './ui/input'

export function AddListenDialog({
  albumId,
  open,
  onOpenChange,
  lastSystem,
  lastLocation,
}: {
  albumId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  lastSystem?: string
  lastLocation?: string
}) {
  const [date, setDate] = useState(isoDate())
  const [location, setLocation] = useState('')
  const [system, setSystem] = useState('')
  const [notes, setNotes] = useState('')

  function reset() {
    setDate(isoDate())
    setLocation('')
    setSystem('')
    setNotes('')
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (!date) return
    await createListen({
      albumId,
      date,
      location: location.trim() || lastLocation,
      system: system.trim() || lastSystem,
      notes: notes.trim() || undefined,
    })
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset()
        onOpenChange(next)
      }}
    >
      <DialogContent className="w-[min(520px,calc(100vw-32px))]">
        <DialogTitle>New session</DialogTitle>
        <form onSubmit={submit} className="mt-7 grid grid-cols-2 gap-x-8 gap-y-5">
          <Field label="Date">
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </Field>
          <Field label="Location">
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={lastLocation}
            />
          </Field>
          <Field label="System" className="col-span-2">
            <Input value={system} onChange={(e) => setSystem(e.target.value)} placeholder={lastSystem} />
          </Field>
          <Field label="Notes" className="col-span-2">
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} autoFocus />
          </Field>
          <div className="col-span-2 mt-2 flex items-center justify-end gap-2">
            <Button type="button" variant="quiet" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="solid">
              Add
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
