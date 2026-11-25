import { useGSAP } from '@gsap/react'
import { ArrowRight, Check, MapPin, Search } from 'lucide-react'
import type { FormEvent } from 'react'
import { useRef, useState } from 'react'
import heroImage from '../assets/images/hero.jpg'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { EASE, gsap, SplitText } from '../lib/gsap'
import MagneticAction from './MagneticAction'

export type JobSearch = { keyword: string; location: string }
type HeroProps = { onSearch: (search: JobSearch) => void }

export default function Hero({ onSearch }: HeroProps) {
  const scope = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const reducedMotion = useReducedMotion()
  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('')

  useGSAP(() => {
    if (reducedMotion || !titleRef.current || !scope.current) return
    const split = new SplitText(titleRef.current, { type: 'words', wordsClass: 'hero-word' })
    const root = scope.current
    const timeline = gsap.timeline({ defaults: { ease: EASE } })
    timeline.from(split.words, { yPercent: 110, opacity: 0, duration: 0.78, stagger: 0.035 })
      .from(root.querySelectorAll('[data-hero-reveal]'), { y: 18, opacity: 0, duration: 0.65, stagger: 0.08 }, '-=0.35')
      .from(root.querySelectorAll('[data-hero-card]'), { y: 12, opacity: 0, duration: 0.55, stagger: 0.08 }, '-=0.25')
    return () => {
      timeline.kill()
      split.revert()
    }
  }, { scope, dependencies: [reducedMotion] })

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSearch({ keyword, location })
    document.querySelector('#featured-jobs')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
  }

  return (
    <section className="hero-section relative isolate min-h-[100svh] overflow-hidden pb-8 pt-28 sm:pt-32" id="top" ref={scope} aria-labelledby="hero-heading">
      <div className="hero-background absolute inset-0 -z-10" aria-hidden="true">
        <img src={heroImage} alt="" fetchPriority="high" />
      </div>
      <div className="hero-overlay pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
      <div className="site-container hero-layout grid flex-1 items-center">
        <div className="hero-copy-column relative z-10 py-8">
          <p className="eyebrow mb-5 flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[.14em] text-sky-300" data-hero-reveal>
            <span className="status-dot size-2 rounded-full bg-sky-300" aria-hidden="true" />
            Good people. Good work.
          </p>
          <h1 className="hero-heading mb-6 max-w-3xl font-heading text-[clamp(2.7rem,6vw,5.25rem)] leading-[.99] tracking-[-.045em] text-white" id="hero-heading" ref={titleRef}>
            A better hire starts with a real conversation.
          </h1>
          <p className="hero-description mb-8 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">
            Thoughtful recruitment for teams and people across Mumbai and beyond. Tell us what you need, and a recruiter will get back to you.
          </p>

          <form className="hero-search grid max-w-4xl gap-2 rounded-2xl border border-sky-200 bg-white p-2 shadow-[0_16px_44px_rgba(11,37,69,.2)] sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]" role="search" onSubmit={submitSearch} data-hero-reveal>
            <label className="search-field min-w-0 px-3 py-2">
              <span className="mb-1 block text-xs font-medium text-slate">Keyword</span>
              <span className="flex items-center gap-2">
                <Search size={16} className="shrink-0 text-action" aria-hidden="true" />
                <input aria-label="Job title or keyword" name="keyword" placeholder="Job title or skill" value={keyword} onChange={(event) => setKeyword(event.target.value)} />
              </span>
            </label>
            <label className="search-field min-w-0 border-t border-sky-100 px-3 py-2 sm:border-l sm:border-t-0 sm:pl-4">
              <span className="mb-1 block text-xs font-medium text-slate">Location</span>
              <span className="flex items-center gap-2">
                <MapPin size={16} className="shrink-0 text-action" aria-hidden="true" />
                <input aria-label="Location" name="location" placeholder="City or remote" value={location} onChange={(event) => setLocation(event.target.value)} />
              </span>
            </label>
            <MagneticAction className="button-primary hero-search-button" type="submit">
              Search jobs <ArrowRight size={17} aria-hidden="true" />
            </MagneticAction>
          </form>

          <div className="hero-trust mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/85" data-hero-reveal>
            <a className="inline-flex min-h-11 items-center gap-2 font-semibold text-white underline-offset-4 hover:underline" href="#employers">
              Hiring? Talk to us <ArrowRight size={16} aria-hidden="true" />
            </a>
            <span className="hidden h-5 w-px bg-white/40 sm:block" aria-hidden="true" />
            <span className="inline-flex items-center gap-1.5"><Check size={16} className="text-sky-300" aria-hidden="true" /> Reply within one working day</span>
          </div>
        </div>
      </div>

      <div className="site-container mt-8 flex items-center justify-between gap-4 border-t border-white/25 pt-4 text-xs text-white/75 sm:mt-10">
        <span>Recruitment across IT, finance, healthcare and operations</span>
        <a className="hidden min-h-11 items-center gap-2 font-medium text-white sm:flex" href="#industries">Explore our work <span aria-hidden="true">↓</span></a>
      </div>
    </section>
  )
}
