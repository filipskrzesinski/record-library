import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function TopBar({
  left,
  center,
  right,
}: {
  /** Replaces the "Record Library" brand link on the left. */
  left?: ReactNode
  center?: ReactNode
  right?: ReactNode
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="grid h-11 grid-cols-[1fr_auto_1fr] items-center gap-6 px-6 sm:px-10 xl:px-16">
        <div className="flex items-center justify-self-start">
          {left ?? (
            <Link
              to="/"
              className="font-caption text-caption transition-colors duration-150 hover:text-ink-muted"
            >
              Record Library
            </Link>
          )}
        </div>
        <div className="flex items-center gap-5">{center}</div>
        <div className="flex items-center justify-end gap-2">{right}</div>
      </div>
    </header>
  )
}

export function ToggleItem({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 font-caption text-caption transition-colors duration-150 ${
        active ? 'text-ink' : 'text-ink-faint hover:text-ink-muted'
      }`}
    >
      <span
        className={`inline-block size-[9px] rounded-xs border transition-colors duration-150 ${
          active ? 'border-ink bg-ink' : 'border-ink-faint'
        }`}
      />
      {children}
    </button>
  )
}
