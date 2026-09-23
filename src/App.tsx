import { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { ensureSeed } from '@/lib/db'
import { AlbumDetail } from '@/routes/AlbumDetail'
import { Library } from '@/routes/Library'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
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

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Library />} />
        <Route path="/album/:id" element={<AlbumDetail />} />
        <Route path="*" element={<Library />} />
      </Routes>
    </>
  )
}
