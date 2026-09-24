import { useEffect, useRef, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import type { Session } from '@/lib/db'
import { ago, plural } from '@/lib/format'
import { Cover } from './Cover'

const weekdayFormat = new Intl.DateTimeFormat('en', { weekday: 'long' })
const monthFormat = new Intl.DateTimeFormat('en', { month: 'long' })

/** Listen dates are calendar days; read them at local noon so no timezone shifts the day. */
function day(date: string) {
  return new Date(`${date}T12:00:00`)
}

/** "Today", "Yesterday", then "3d ago", "2w ago"… */
function relative(date: string) {
  const age = ago(date)
  if (age === 'today' || age === 'yesterday') return age[0].toUpperCase() + age.slice(1)
  return `${age} ago`
}

/** Sessions arrive newest first, so same-day listens are already adjacent. */
function groupByDay(sessions: Session[]) {
  const groups: { date: string; sessions: Session[] }[] = []
  for (const session of sessions) {
    const last = groups.at(-1)
    if (last?.date === session.date) last.sessions.push(session)
    else groups.push({ date: session.date, sessions: [session] })
  }
  return groups
}

/** Just the source component, e.g. "Rega Planar 3" out of the full signal chain. */
function deck(system?: string) {
  return system?.split('→')[0].trim()
}

/** A stack of days, newest first: a large date on the left, that day's records laid out beside it. */
export function History({ sessions, batch = Infinity }: { sessions: Session[]; batch?: number }) {
  let index = 0

  return (
    <div className="history">
      {groupByDay(sessions).map((group) => (
        <section
          key={group.date}
          className="flex w-full flex-col items-start gap-6 border-t border-line py-10 md:flex-row md:gap-16 md:py-16"
        >
          <DayHeading date={group.date} count={group.sessions.length} />

          <ol className="flex w-full min-w-0 grow basis-0 flex-col items-start gap-8 md:w-auto md:flex-row md:flex-wrap md:gap-x-10 md:gap-y-12">
            {group.sessions.map((session) => {
              const i = index++
              return <Entry key={session.id} session={session} delay={Math.min(i % batch, 12) * 24} />
            })}
          </ol>
        </section>
      ))}
    </div>
  )
}

function DayHeading({ date, count }: { date: string; count: number }) {
  const when = day(date)
  const month = monthFormat.format(when)
  const year = when.getFullYear()

  return (
    <h2 className="flex w-full flex-none flex-col items-start gap-3 md:w-64">
      <time dateTime={date} className="flex flex-col flex-nowrap items-start gap-3">
        <span className="font-date text-date leading-16 text-ink tabular-nums md:text-[128px] md:leading-[6.625rem]">
          {when.getDate()}
        </span>
        <span className="flex flex-col items-start gap-1 pt-3 font-label text-label uppercase">
          <span className="text-ink">{weekdayFormat.format(when)}</span>
          <span className="text-ink-faint">
            {year === new Date().getFullYear() ? month : `${month} ${year}`}
          </span>
        </span>
      </time>
      <span className="flex items-center gap-2 pl-1 font-caption text-caption text-ink-faint">
        <span>{relative(date)}</span>
        <span aria-hidden>·</span>
        <span>{plural(count, 'record')}</span>
      </span>
    </h2>
  )
}

function Entry({ session, delay }: { session: Session; delay: number }) {
  const { album } = session
  const where = [session.location, deck(session.system)].filter(Boolean).join(' · ')
  const frame = useRef<number | null>(null)

  useEffect(() => () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current)
  }, [])

  /** Nudge the artwork toward the cursor; the sleeve itself stays put and clips it. */
  function followPointer(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType === 'touch' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const link = event.currentTarget
    const thumb = link.querySelector('.history-thumb')
    if (!thumb) return
    const bounds = thumb.getBoundingClientRect()
    const x = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width) * 2 - 1))
    const y = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height) * 2 - 1))

    if (frame.current !== null) cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      link.style.setProperty('--shift-x', `${x * 6}px`)
      link.style.setProperty('--shift-y', `${y * 6}px`)
      frame.current = null
    })
  }

  function resetShift(event: PointerEvent<HTMLAnchorElement>) {
    if (frame.current !== null) cancelAnimationFrame(frame.current)
    frame.current = null
    event.currentTarget.style.removeProperty('--shift-x')
    event.currentTarget.style.removeProperty('--shift-y')
  }

  return (
    <li className="history-row w-full animate-rise md:w-56" style={{ animationDelay: `${delay}ms` }}>
      <Link
        to={`/album/${album.id}`}
        className="history-entry flex w-full flex-col items-start gap-8"
        onPointerEnter={followPointer}
        onPointerMove={followPointer}
        onPointerLeave={resetShift}
        onPointerCancel={resetShift}
      >
        <Cover
          art={album.art}
          palette={album.palette}
          src={album.coverUrl}
          alt={`${album.title} by ${album.artist}`}
          className="history-thumb w-full rounded-md shadow-cover"
        />
        <div className="flex w-full flex-col items-start">
          <span className="w-full font-record-lg text-record-lg text-ink">
            {album.title}
          </span>
          <span className="flex flex-col items-start gap-1">
            <span className="font-small text-small text-ink-muted">
              {album.artist}
              {album.year ? ` · ${album.year}` : ''}
            </span>
            {where && <span className="font-metadata text-metadata text-ink-faint">{where}</span>}
          </span>
        </div>
      </Link>
    </li>
  )
}
