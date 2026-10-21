import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Fades its children up the first time they reach the viewport. Content is shown
 * outright when motion is reduced or IntersectionObserver is unavailable, so the
 * page never depends on the animation running.
 */
export function Reveal({
  as: Comp = 'div',
  delay = 0,
  className,
  children,
}: {
  as?: ElementType
  /** Milliseconds to stagger this element behind its neighbours. */
  delay?: number
  className?: string
  children: ReactNode
}) {
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(
    () =>
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    if (shown) return
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setShown(true)
        observer.disconnect()
      },
      { rootMargin: '0px 0px -12% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [shown])

  return (
    <Comp
      ref={ref}
      data-shown={shown}
      style={shown ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn('reveal', className)}
    >
      {children}
    </Comp>
  )
}
