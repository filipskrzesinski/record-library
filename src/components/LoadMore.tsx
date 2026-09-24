import { useEffect, useRef } from 'react'

/**
 * Invisible marker placed after the rendered items; calls `onVisible` as it nears the viewport.
 * Remount it (via `key`) after each batch so a still-visible marker fires again.
 */
export function LoadMore({ onVisible }: { onVisible: () => void }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) onVisible()
      },
      { rootMargin: '0px 0px 200px 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [onVisible])

  return <div ref={ref} aria-hidden className="h-px" />
}
