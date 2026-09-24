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
    <header className="sticky top-0 z-40 bg-paper">
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
        <div className="flex items-center gap-1">{center}</div>
        <div className="flex items-center justify-end gap-2">{right}</div>
      </div>
    </header>
  )
}

/** Icon-only toggle; `label` is used for the tooltip and screen readers. */
export function ToggleItem({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean
  onClick: () => void
  label: string
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={`inline-flex size-7 items-center justify-center rounded-md transition-colors duration-150 active:translate-y-px ${
        active ? 'text-ink' : 'text-ink-faint/55 hover:bg-ink/6 hover:text-ink-muted'
      }`}
    >
      {children}
    </button>
  )
}

const iconProps = { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'currentColor', 'aria-hidden': true } as const

export function GridIcon() {
  return (
    <svg {...iconProps}>
      <rect x="2" y="2" width="5" height="5" rx="1" />
      <rect x="9" y="2" width="5" height="5" rx="1" />
      <rect x="2" y="9" width="5" height="5" rx="1" />
      <rect x="9" y="9" width="5" height="5" rx="1" />
    </svg>
  )
}

export function ListIcon() {
  return (
    <svg {...iconProps}>
      <rect x="2" y="3" width="12" height="2" rx="0.5" />
      <rect x="2" y="7" width="12" height="2" rx="0.5" />
      <rect x="2" y="11" width="12" height="2" rx="0.5" />
    </svg>
  )
}

/** A centre line with entries alternating either side, like the history timeline. */
export function HistoryIcon() {
  return (
    <svg {...iconProps}>
      <rect x="7.25" y="1.5" width="1.5" height="13" rx="0.75" />
      <rect x="1.5" y="3" width="4.5" height="2.5" rx="0.75" />
      <rect x="10" y="6.75" width="4.5" height="2.5" rx="0.75" />
      <rect x="1.5" y="10.5" width="4.5" height="2.5" rx="0.75" />
    </svg>
  )
}

/** A front-facing cover flanked by two sleeves angled away, like the shelf itself. */
export function ShelfIcon() {
  return (
    <svg {...iconProps}>
      <polygon points="0.5,4.5 2.5,3.5 2.5,12.5 0.5,11.5" />
      <rect x="4" y="2.5" width="8" height="11" rx="1" />
      <polygon points="13.5,3.5 15.5,4.5 15.5,11.5 13.5,12.5" />
    </svg>
  )
}
