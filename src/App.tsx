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

function SeedFailed() {
  return (
    <div role="alert" className="px-6 py-16 text-ink">
      <p>The collection could not be loaded. Reload to try again.</p>
      <button className="mt-4 underline underline-offset-4" onClick={() => window.location.reload()}>Reload</button>
    </div>
  )
}

/** Gate for the pages that read the database. The landing page needs only bundled data. */
function Seeded({ state, children }: { state: 'loading' | 'ready' | 'failed'; children: ReactNode }) {
  if (state === 'failed') return <SeedFailed />
  if (state === 'loading') return null
  return <>{children}</>
}

export default function App() {
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading')

  useEffect(() => {
    ensureSeed().then(() => setState('ready')).catch((error) => {
      console.error('Could not initialize the record library', error)
      setState('failed')
    })
  }, [])

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/library"
          element={
            <Seeded state={state}>
              <Library />
            </Seeded>
          }
        />
        <Route
          path="/album/:id"
          element={
            <Seeded state={state}>
              <AlbumDetail />
            </Seeded>
          }
        />
        <Route path="*" element={<Landing />} />
      </Routes>
    </>
  )
}
