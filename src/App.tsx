import { useEffect, useState, type ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
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

/**
 * Opens the database before the collection is read. The landing page needs none of
 * this, so it paints without waiting on the first import.
 */
function Seeded({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    ensureSeed().then(() => setReady(true)).catch((error) => {
      console.error('Could not initialize the record library', error)
      setFailed(true)
    })
  }, [])

  if (failed) return (
    <div role="alert" className="px-6 py-16 text-ink">
      <p>The collection could not be loaded. Reload to try again.</p>
      <button className="mt-4 underline underline-offset-4" onClick={() => window.location.reload()}>Reload</button>
    </div>
  )

  if (!ready) return null

  return children
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/library" element={<Seeded><Library /></Seeded>} />
        <Route path="/album/:id" element={<Seeded><AlbumDetail /></Seeded>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
