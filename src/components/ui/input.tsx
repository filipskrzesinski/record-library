import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

const field =
  'w-full border-b border-line bg-transparent text-[13px] text-ink outline-none transition-colors placeholder:text-ink-faint hover:border-ink-faint focus:border-ink focus-visible:outline-none'

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return <input className={cn(field, 'h-8', className)} {...props} />
}

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return <textarea className={cn(field, 'block resize-none py-1.5 leading-[1.65]', className)} {...props} />
}
