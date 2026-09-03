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

  useEffect(() => {
    ensureSeed().finally(() => setReady(true))
  }, [])

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
