import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function TopBar({ center, right }: { center?: ReactNode; right?: ReactNode }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="grid h-11 grid-cols-[1fr_auto_1fr] items-center gap-6 px-4 sm:px-6">
        <Link
          to="/"
          className="justify-self-start text-[11px] transition-colors duration-150 hover:text-ink-muted"
        >
          Record Library
        </Link>
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
      className={`flex items-center gap-2 text-[11px] transition-colors duration-150 ${
        active ? 'text-ink' : 'text-ink-faint hover:text-ink-muted'
      }`}
    >
      <span
        className={`inline-block size-[9px] rounded-[1px] border transition-colors duration-150 ${
          active ? 'border-ink bg-ink' : 'border-ink-faint'
        }`}
      />
      {children}
    </button>
  )
}
