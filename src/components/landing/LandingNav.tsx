import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { PITCHFORK_SOURCE_URL } from '@/lib/sources'
import { Wordmark } from './Wordmark'

export function LandingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line-soft bg-paper-high/85 backdrop-blur-md">
      <div className="px-6 sm:px-10 xl:px-16">
        <div className="mx-auto flex h-14 w-full max-w-[1120px] items-center justify-between gap-6">
          <Link to="/" aria-label="Record Library">
            <Wordmark />
          </Link>
          <nav className="flex items-center gap-5">
            <a
              href={PITCHFORK_SOURCE_URL}
              target="_blank"
              rel="noreferrer"
              className="hidden font-caption text-caption text-ink-muted transition-colors duration-150 hover:text-ink sm:block"
            >
              The list ↗
            </a>
            <Button variant="solid" asChild>
              <Link to="/library">Open the library</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
