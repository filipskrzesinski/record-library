import { useCallback, useState } from 'react'

/**
 * How many items of a long list to render: starts at `step` and grows by `step`
 * each time `more` is called. Changing `resetKey` (view, sort…) starts over.
 */
export function useIncremental(step: number, resetKey: string) {
  const [state, setState] = useState({ key: resetKey, count: step })
  const count = state.key === resetKey ? state.count : step

  const more = useCallback(
    () => setState((s) => ({ key: resetKey, count: (s.key === resetKey ? s.count : step) + step })),
    [resetKey, step],
  )

  return [count, more] as const
}
