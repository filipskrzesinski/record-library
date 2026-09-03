import type { ComponentProps } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const button = cva(
  'inline-flex select-none items-center justify-center whitespace-nowrap rounded-[3px] uppercase tracking-[0.11em] transition-[background-color,color,box-shadow,transform] duration-150 ease-[var(--ease-out-soft)] active:translate-y-px disabled:pointer-events-none disabled:opacity-40',
  {
    variants: {
      variant: {
        solid: 'bg-ink text-paper-high shadow-lift hover:bg-ink/88',
        outline: 'bg-raised text-ink shadow-lift ring-1 ring-line hover:bg-paper-high hover:ring-ink-faint/70',
        quiet: 'text-ink-muted hover:bg-ink/6 hover:text-ink',
        danger: 'text-ink-faint hover:bg-danger/8 hover:text-danger',
      },
      size: {
        xs: 'h-5 px-1.5 text-[9.5px]',
        sm: 'h-7 px-2.5 text-[10px]',
        md: 'h-8 px-3.5 text-[10px]',
      },
    },
    defaultVariants: { variant: 'outline', size: 'md' },
  },
)

export function Button({
  className,
  variant,
  size,
  asChild,
  ...props
}: ComponentProps<'button'> & VariantProps<typeof button> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(button({ variant, size }), className)} {...props} />
}
