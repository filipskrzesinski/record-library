const DAY = 86_400_000

export function isoDate(ts: number | Date = new Date()) {
  const d = ts instanceof Date ? ts : new Date(ts)
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 10)
}

/** Compact age used next to dates: 3d, 2w, 5mo, 1y. */
export function ago(value: string | number | undefined) {
  if (value === undefined) return ''
  const then = typeof value === 'number' ? value : new Date(`${value}T12:00:00`).getTime()
  if (Number.isNaN(then)) return ''
  const days = Math.max(0, Math.round((Date.now() - then) / DAY))
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days}d`
  if (days < 31) return `${Math.round(days / 7)}w`
  if (days < 365) return `${Math.round(days / 30)}mo`
  const years = days / 365
  return `${years < 10 ? years.toFixed(1).replace(/\.0$/, '') : Math.round(years)}y`
}

export function plural(n: number, one: string, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`
}
