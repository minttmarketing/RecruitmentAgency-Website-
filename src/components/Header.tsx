import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { site } from '../data/site'
import { useReducedMotion } from '../hooks/useReducedMotion'
import MagneticAction from './MagneticAction'

const links = [
  ['Jobs', '#featured-jobs'],
  ['Employers', '#employers'],
  ['Job seekers', '#job-seekers'],
  ['Services', '#services'],
  ['About', '#how-it-works'],
  ['Contact', '#contact'],
] as const

type HeaderProps = { onPostJob: () => void }

export default function Header({ onPostJob }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  function postJob() {
    setMenuOpen(false)
    onPostJob()
  }

  return (
    <header className="site-header fixed inset-x-0 top-3 z-50 px-4 sm:px-6">
      <motion.div
        className={`nav-shell mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-2xl border px-3 py-2 sm:px-5 ${scrolled ? 'nav-shell--scrolled' : ''}`}
        animate={{ scale: scrolled ? 0.985 : 1 }}
        transition={{ duration: reducedMotion ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        <a className="brand-link flex shrink-0 items-center" href="#top" aria-label={`${site.name} home`}>
          <span className="font-heading text-xl font-medium tracking-tight text-navy">{site.name}</span>
        </a>

        <nav className="desktop-nav hidden items-center gap-5 lg:flex" aria-label="Main navigation">
          {links.map(([label, href]) => (
            <a className="nav-link relative py-3 text-sm text-navy" key={label} href={href}>{label}</a>
          ))}
          <MagneticAction className="button-primary nav-post-job" href="#employers">
            Post a job <ArrowRight size={16} aria-hidden="true" />
          </MagneticAction>
        </nav>

        <div className="flex items-center gap-1.5 lg:hidden">
          <MagneticAction className="button-primary nav-post-job" href="#employers">Post a job</MagneticAction>
          <button
            type="button"
            className="menu-toggle grid size-11 place-items-center rounded-xl border border-sky-200 bg-white text-navy"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-navigation"
            className="mobile-nav fixed inset-0 z-[40] flex flex-col justify-center gap-1 px-7 pt-16 lg:hidden"
            aria-label="Mobile navigation"
            initial={reducedMotion ? false : { opacity: 0, x: '10%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, x: '10%' }}
            transition={{ duration: reducedMotion ? 0 : 0.25 }}
          >
            {links.map(([label, href]) => (
              <a className="mobile-nav-link border-b border-sky-200 py-4 font-heading text-3xl text-navy" key={label} href={href} onClick={() => setMenuOpen(false)}>
                {label}
              </a>
            ))}
            <button type="button" className="button-primary mt-6 w-fit" onClick={postJob}>
              Talk to us about a role <ArrowRight size={18} aria-hidden="true" />
            </button>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
