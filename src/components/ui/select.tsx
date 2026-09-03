import * as SelectPrimitive from '@radix-ui/react-select'
import { cn } from '@/lib/utils'

export function Select<T extends string>({
  value,
  onValueChange,
  options,
  className,
  'aria-label': ariaLabel,
}: {
  value: T
  onValueChange: (value: T) => void
  options: { value: T; label: string }[]
  className?: string
  'aria-label'?: string
}) {
  return (
    <SelectPrimitive.Root value={value} onValueChange={(v) => onValueChange(v as T)}>
      <SelectPrimitive.Trigger
        aria-label={ariaLabel}
        className={cn(
          'inline-flex h-8 items-center gap-2 rounded-[3px] bg-raised px-3 text-[11px] text-ink shadow-lift ring-1 ring-line outline-none transition-colors hover:bg-paper-high hover:ring-ink-faint/70 data-[state=open]:ring-ink-faint',
          className,
        )}
      >
        <SelectPrimitive.Value />
        <SelectPrimitive.Icon className="text-[9px] leading-none text-ink-faint">▾</SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={6}
          align="end"
          className="z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-[4px] bg-paper-high p-1 shadow-float ring-1 ring-line-soft data-[state=open]:animate-pop-in"
        >
          <SelectPrimitive.Viewport>
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                className="cursor-pointer select-none rounded-[2px] px-2.5 py-1.5 text-[11px] text-ink-muted outline-none transition-colors data-[highlighted]:bg-ink/6 data-[highlighted]:text-ink data-[state=checked]:text-ink"
              >
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}
