import { useCallback, useState } from 'react'

/** Tiny localStorage-backed useState for view preferences. */
export function usePersisted<T>(key: string, initial: T) {
  const storageKey = `record-library:${key}`

  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      return raw === null ? initial : (JSON.parse(raw) as T)
    } catch {
      return initial
    }
  })

  const update = useCallback(
    (next: T) => {
      setValue(next)
      try {
        localStorage.setItem(storageKey, JSON.stringify(next))
      } catch {
        /* private mode, ignore */
      }
    },
    [storageKey],
  )

  return [value, update] as const
}
