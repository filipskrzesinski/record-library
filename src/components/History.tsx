import { Link } from 'react-router-dom'
import type { Session } from '@/lib/db'
import { ago } from '@/lib/format'
import { Cover } from './Cover'

const dayFormat = new Intl.DateTimeFormat('en', { weekday: 'short', month: 'short', day: 'numeric' })
const dayYearFormat = new Intl.DateTimeFormat('en', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })

/** Listen dates are calendar days; read them at local noon so no timezone shifts the day. */
function day(date: string) {
  return new Date(`${date}T12:00:00`)
}

/** "Tue, Sep 22 · yesterday"; the year only appears once it isn't this year. */
function dayLabel(date: string) {
  const when = day(date)
  const format = when.getFullYear() === new Date().getFullYear() ? dayFormat : dayYearFormat
  return `${format.format(when)} · ${ago(date)}`
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

/** A centred timeline, newest first, with sessions alternating either side of the line. */
export function History({ sessions, batch = Infinity }: { sessions: Session[]; batch?: number }) {
  let index = 0

  return (
    <div className="history relative mx-auto max-w-5xl">
      <div
        aria-hidden
        className="absolute bottom-1 top-10 left-3.5 w-px -translate-x-1/2 bg-line md:left-1/2"
      />

      {groupByDay(sessions).map((group) => (
        <section key={group.date} className="relative">
          <h2 className="relative flex pb-4 pt-8 md:justify-center">
            <time
              dateTime={group.date}
              className="bg-paper-high py-1 font-label text-label uppercase text-ink-faint md:px-3"
            >
              {dayLabel(group.date)}
            </time>
          </h2>

          <ol>
            {group.sessions.map((session) => {
              const i = index++
              return <Entry key={session.id} session={session} left={i % 2 === 0} delay={Math.min(i % batch, 12) * 24} />
            })}
          </ol>
        </section>
      ))}

      <div aria-hidden className="relative flex pt-6 md:justify-center">
        <span className="ml-2.5 size-2 rounded-pill bg-line md:ml-0" />
      </div>
    </div>
  )
}

function Entry({ session, left, delay }: { session: Session; left: boolean; delay: number }) {
  const { album } = session
  const where = [session.location, deck(session.system)].filter(Boolean).join(' · ')

  return (
    <li
      className="history-row group grid animate-rise grid-cols-[28px_minmax(0,1fr)] items-center gap-x-4 py-2 md:grid-cols-[minmax(0,1fr)_64px_minmax(0,1fr)] md:gap-x-0"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span
        aria-hidden
        className="col-start-1 row-start-1 size-2 justify-self-center rounded-pill bg-ink-faint/70 ring-4 ring-paper-high transition-colors duration-150 group-hover:bg-ink md:col-start-2"
      />

      <Link
        to={`/album/${album.id}`}
        className={`history-entry col-start-2 row-start-1 flex min-w-0 max-w-[min(100%,28rem)] items-center gap-4 rounded-lg p-2 transition-colors duration-150 hover:bg-ink/3 ${
          left
            ? 'md:col-start-1 pr-6 md:flex-row-reverse md:pl-6 md:pr-2 md:justify-self-end md:text-right'
            : 'pr-6 md:col-start-3 md:justify-self-start'
        }`}
      >
        <Cover
          art={album.art}
          palette={album.palette}
          src={album.coverUrl}
          className="history-thumb size-24 shrink-0 rounded-md shadow-spine"
        />
        <div className="min-w-0">
          <div className="truncate font-record-md text-record-md text-ink">{album.title}</div>
          <div className="truncate font-caption text-caption text-ink-muted">
            {album.artist}
            {album.year ? ` · ${album.year}` : ''}
          </div>
          {where && <div className="mt-0.5 truncate font-metadata text-metadata text-ink-faint">{where}</div>}
        </div>
      </Link>
    </li>
  )
}
