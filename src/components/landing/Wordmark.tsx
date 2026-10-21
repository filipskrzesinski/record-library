import { cn } from '@/lib/utils'

/** A record centred in its sleeve, drawn at the height of a line of type. */
export function RecordMark({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      aria-hidden
      className="shrink-0"
    >
      <rect x="1.4" y="1.4" width="13.2" height="13.2" rx="1" strokeWidth="1" />
      <circle cx="8" cy="8" r="4.3" strokeWidth="1" />
      <circle cx="8" cy="8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5 font-dialog text-dialog text-ink-strong', className)}>
      <RecordMark />
      Record Library
    </span>
  )
}
