import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import type { Job } from './data/jobs'
import { useReducedMotion } from './hooks/useReducedMotion'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import type { JobSearch } from './components/Hero'
import type { JobFilter } from './components/HomeSections'
import Header from './components/Header'
import Hero from './components/Hero'
import LazyMount from './components/LazyMount'
import { ApplyModal, UploadModal } from './components/Modals'

const HomeSections = lazy(() => import('./components/HomeSections'))
const Footer = lazy(() => import('./components/Footer'))

function HomePage() {
  const reducedMotion = useReducedMotion()
  const lenisRef = useSmoothScroll(reducedMotion)
  const [filter, setFilter] = useState<JobFilter>('All roles')
  const [search, setSearch] = useState<JobSearch>({ keyword: '', location: '' })
  const [activeJob, setActiveJob] = useState<Job | null>(null)
  const [uploadOpen, setUploadOpen] = useState(false)
  const triggerRef = useRef<HTMLElement | null>(null)
  const modalOpen = activeJob !== null || uploadOpen

  useEffect(() => {
    const lenis = lenisRef.current
    if (modalOpen) lenis?.stop()
    else lenis?.start()
  }, [modalOpen, lenisRef])

  useEffect(() => {
    if (!modalOpen) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [modalOpen])

  const rememberFocus = useCallback(() => {
    const active = document.activeElement
    triggerRef.current = active instanceof HTMLElement ? active : null
  }, [])

  const restoreFocus = useCallback(() => {
    window.setTimeout(() => triggerRef.current?.focus(), 0)
  }, [])

  const openApply = useCallback((job: Job) => {
    rememberFocus()
    setActiveJob(job)
  }, [rememberFocus])

  const openUpload = useCallback(() => {
    rememberFocus()
    setUploadOpen(true)
  }, [rememberFocus])

  const closeApply = useCallback(() => {
    setActiveJob(null)
    restoreFocus()
  }, [restoreFocus])

  const closeUpload = useCallback(() => {
    setUploadOpen(false)
    restoreFocus()
  }, [restoreFocus])

  const postJob = useCallback(() => {
    document.querySelector('#employers')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
  }, [reducedMotion])

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header onPostJob={postJob} />
      <main id="main-content">
        <Hero onSearch={(values) => { setSearch(values); setFilter('All roles') }} />
        <Suspense fallback={<div className="min-h-[65vh] bg-mist" aria-hidden="true" />}>
          <HomeSections search={search} filter={filter} onFilterChange={setFilter} onApply={openApply} onUpload={openUpload} onPostJob={postJob} />
        </Suspense>
      </main>
      <LazyMount rootMargin="320px" placeholder={<div className="min-h-72 bg-navy" aria-hidden="true" />}>
        <Suspense fallback={<div className="min-h-72 bg-navy" aria-busy="true" />}>
          <Footer onUpload={openUpload} />
        </Suspense>
      </LazyMount>
      {activeJob && <ApplyModal job={activeJob} onClose={closeApply} />}
      {uploadOpen && <UploadModal onClose={closeUpload} />}
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  )
}
