import { useEffect, useState, type ReactNode } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { ensureSeed } from '@/lib/db'
import { AlbumDetail } from '@/routes/AlbumDetail'
import { Landing } from '@/routes/Landing'
import { Library } from '@/routes/Library'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function useSeed() {
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading')

  useEffect(() => {
    ensureSeed().then(
      () => setState('ready'),
      (error) => {
        console.error('Could not initialize the record library', error)
        setState('failed')
      },
    )
  }, [])

  return state
}

/** The library routes wait for the seeded collection; the landing page does not. */
function Collection({ state, children }: { state: ReturnType<typeof useSeed>; children: ReactNode }) {
  if (state === 'failed') return (
    <div role="alert" className="px-6 py-16 text-ink">
      <p>The collection could not be loaded. Reload to try again.</p>
      <button className="mt-4 underline underline-offset-4" onClick={() => window.location.reload()}>Reload</button>
    </div>
  )

  if (state === 'loading') return null

  return <>{children}</>
}

export default function App() {
  // Seeding starts with the app, so it is already done behind the landing page by
  // the time anyone opens the collection.
  const seed = useSeed()

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/library" element={<Collection state={seed}><Library /></Collection>} />
        <Route path="/album/:id" element={<Collection state={seed}><AlbumDetail /></Collection>} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </>
  )
}
