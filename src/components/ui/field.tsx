import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Field({
  label,
  children,
  className,
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <label className={cn('block', className)}>
      <span className="label-xs mb-2 block">{label}</span>
      {children}
    </label>
  )
}
