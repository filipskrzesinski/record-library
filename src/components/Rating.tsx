import { cn } from '@/lib/utils'

export function Rating({
  value = 0,
  onChange,
  className,
}: {
  value?: number
  onChange?: (value: number) => void
  className?: string
}) {
  const editable = Boolean(onChange)

  return (
    <div className={cn('flex items-center gap-1', className)} aria-label={`Rating ${value} of 5`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= value
        return (
          <button
            key={n}
            type="button"
            disabled={!editable}
            aria-label={`${n}`}
            onClick={() => onChange?.(n === value ? 0 : n)}
            className={cn(
              'h-[4px] w-[20px] rounded-full transition-colors duration-150',
              filled ? 'bg-ink' : 'bg-ink/12',
              editable && 'cursor-pointer',
              editable && !filled && 'hover:bg-ink/45',
              editable && filled && 'hover:bg-ink/70',
            )}
          />
        )
      })}
    </div>
  )
}
