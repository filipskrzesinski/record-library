import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface EditableProps {
  value?: string
  onSave: (value: string) => void
  placeholder?: string
  multiline?: boolean
  /** Let a long single-line value wrap instead of truncating. */
  wrap?: boolean
  type?: 'text' | 'date' | 'number'
  className?: string
}

/** Click the value, type, leave. Enter commits, Escape reverts. */
export function Editable({
  value,
  onSave,
  placeholder = '—',
  multiline = false,
  wrap = false,
  type = 'text',
  className,
}: EditableProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value ?? '')
  const areaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!editing) setDraft(value ?? '')
  }, [value, editing])

  useLayoutEffect(() => {
    const el = areaRef.current
    if (!el || !editing) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [draft, editing])

  function commit() {
    setEditing(false)
    const next = draft.trim()
    if (next !== (value ?? '').trim()) onSave(next)
  }

  function cancel() {
    setDraft(value ?? '')
    setEditing(false)
  }

  const shared = cn(
    '-mx-1 w-[calc(100%+8px)] rounded-[2px] bg-transparent px-1 text-left outline-none focus-visible:outline-none',
    className,
  )

  if (editing) {
    const box = cn(shared, 'bg-ink/4 shadow-[inset_0_-1px_0_0_var(--color-ink)]')
    return multiline ? (
      <textarea
        ref={areaRef}
        autoFocus
        rows={1}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Escape') cancel()
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) commit()
        }}
        className={cn(box, 'block resize-none overflow-hidden py-0.5 leading-[1.7]')}
      />
    ) : (
      <input
        autoFocus
        type={type}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Escape') cancel()
          if (e.key === 'Enter') commit()
        }}
        className={cn(box, 'block py-0', wrap ? 'h-auto' : 'h-[1.7em]')}
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className={cn(
        shared,
        'block cursor-text transition-colors duration-150 hover:bg-ink/5',
        multiline
          ? 'whitespace-pre-wrap py-0.5 leading-[1.7]'
          : wrap
            ? 'whitespace-normal'
            : 'h-[1.7em] truncate',
        !value?.trim() && 'text-ink-faint',
      )}
    >
      {value?.trim() || placeholder}
    </button>
  )
}
