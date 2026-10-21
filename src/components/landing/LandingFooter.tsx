import { Link } from 'react-router-dom'
import { PITCHFORK_SOURCE_URL } from '@/lib/sources'
import { Wordmark } from './Wordmark'

const VIEW_LINKS = [
  { label: 'Grid', to: '/library?view=grid' },
  { label: 'List', to: '/library?view=list' },
  { label: 'Shelf', to: '/library?view=shelf' },
  { label: 'History', to: '/library?view=history' },
]

function ColumnLabel({ children }: { children: string }) {
  return <h2 className="font-label text-label uppercase text-ink-faint">{children}</h2>
}

const linkClass = 'font-small text-small text-ink-muted transition-colors duration-150 hover:text-ink'

export function LandingFooter() {
  return (
    <footer className="border-t border-line bg-paper px-6 pb-14 pt-16 sm:px-10 xl:px-16">
      <div className="mx-auto w-full max-w-[1120px]">
        <div className="grid gap-12 sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <Wordmark />
            <p className="mt-4 max-w-[34ch] font-small text-small text-ink-muted">
              A record collection that runs in the browser. Sleeves first, pressing detail intact, every
              listen written down.
            </p>
          </div>

          <div className="flex flex-col gap-3.5">
            <ColumnLabel>Views</ColumnLabel>
            {VIEW_LINKS.map((view) => (
              <Link key={view.to} to={view.to} className={linkClass}>
                {view.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3.5">
            <ColumnLabel>Collection</ColumnLabel>
            <Link to="/library" className={linkClass}>
              Open the library
            </Link>
            <a href={PITCHFORK_SOURCE_URL} target="_blank" rel="noreferrer" className={linkClass}>
              Readers&rsquo; list, 2021 ↗
            </a>
            <a href="#collection" className={linkClass}>
              What&rsquo;s on the shelf
            </a>
            <a href="#questions" className={linkClass}>
              Questions
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-line pt-6 font-caption text-caption text-ink-faint sm:flex-row sm:items-baseline sm:justify-between">
          <p>Local-first. No account, no server, nothing to sync.</p>
          <p>Album artwork remains the property of its respective rights holders.</p>
        </div>
      </div>
    </footer>
  )
}
