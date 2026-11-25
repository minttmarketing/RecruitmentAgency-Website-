import { BentoGrid, BentoGridItem } from './ui/bento-grid'
import { ArrowRight, Check } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import type { FormEvent, PointerEvent } from 'react'
import employersImage from '../assets/images/employers.jpg'
import jobSeekersImage from '../assets/images/job-seekers.jpg'
import { faqs } from '../data/faqs'
import { jobs, type Job } from '../data/jobs'
import { services } from '../data/services'
import { site } from '../data/site'
import { candidateSteps, hiringSteps } from '../data/steps'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { gsap } from '../lib/gsap'
import { useGSAP } from '@gsap/react'
import MagneticAction from './MagneticAction'
import LazyMount from './LazyMount'
import { Button } from './ui/button'
import type { JobSearch } from './Hero'

const Testimonials = lazy(() => import('./Testimonials'))
const FAQSection = lazy(() => import('./FAQ'))

export type JobFilter = 'All roles' | Job['industry']

type HomeSectionsProps = {
  search: JobSearch
  filter: JobFilter
  onFilterChange: (filter: JobFilter) => void
  onApply: (job: Job) => void
  onUpload: () => void
  onPostJob: () => void
}

const sectors = ['IT', 'Finance', 'Healthcare', 'Engineering', 'Sales and marketing', 'Operations']

function Industries() {
  const repeated = [...sectors, ...sectors]
  return (
    <section className="industries-section overflow-hidden bg-mist py-6" id="industries" aria-label="Industries we recruit for">
      <div className="site-container mb-4 flex items-center justify-between gap-4 text-xs text-slate">
        <strong className="font-semibold text-navy">Good people for the work that matters</strong>
        <span>Recruiting across six sectors</span>
      </div>
      <ul className="sr-only">{sectors.map((sector) => <li key={sector}>{sector}</li>)}</ul>
      <div className="marquee-mask" aria-hidden="true">
        <div className="industry-track flex w-max items-center gap-8">
          {repeated.map((sector, index) => (
            <span className="inline-flex items-center gap-8 whitespace-nowrap font-heading text-xl text-navy sm:text-2xl" key={`${sector}-${index}`}>
              {sector}<i className="size-1.5 rounded-full bg-sky-400" />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function ServiceVisual({ type }: { type: (typeof services)[number]['visual'] }) {
  if (type === 'shortlist') {
    return (
      <div className="mini-ui shortlist-ui">
        <div className="mini-ui-heading"><span>Shortlist</span><strong>03</strong></div>
        {['Product Designer', 'Finance Lead', 'Project Manager'].map((role, index) => (
          <div className="mini-list-row" key={role}><i>{['P', 'F', 'M'][index]}</i><span>{role}</span><b>{index === 0 ? 'Ready' : 'Reviewed'}</b></div>
        ))}
      </div>
    )
  }
  if (type === 'contract') {
    return (
      <div className="mini-ui contract-ui">
        <div className="mini-ui-heading"><span>Assignment timeline</span><strong>12 weeks</strong></div>
        <div className="mini-timeline"><i /><i /><i /><i /></div>
        <div className="mini-timeline-labels"><span>Brief</span><span>Review</span><span>Start</span><span>Finish</span></div>
      </div>
    )
  }
  if (type === 'search') {
    return (
      <div className="mini-ui search-ui">
        <div className="search-spotlight"><span>Leadership search</span><strong>Director, Operations</strong><small>Confidential mandate</small></div>
        <div className="search-lines"><i /><i /><i /></div>
      </div>
    )
  }
  if (type === 'campus') {
    return (
      <div className="mini-ui campus-ui">
        <span>Intake plan</span>
        <div className="campus-count"><strong>24</strong><small>open placements</small></div>
        <div className="campus-bars"><i /><i /><i /><i /><i /><i /><i /></div>
      </div>
    )
  }
  if (type === 'insights') {
    return (
      <div className="mini-ui insights-ui">
        <div className="mini-ui-heading"><span>Market range</span><strong>₹ 8.5L – 11L</strong></div>
        <div className="insight-range"><i /><b /></div>
        <div className="insight-caption"><span>Entry</span><span>Experienced</span></div>
      </div>
    )
  }
  return (
    <div className="mini-ui screening-ui">
      <div className="mini-ui-heading"><span>Candidate review</span><strong>Complete</strong></div>
      {['Experience discussed', 'Availability confirmed', 'Role expectations'].map((item) => (
        <div className="screening-row" key={item}><Check size={14} aria-hidden="true" /><span>{item}</span></div>
      ))}
    </div>
  )
}

function Services() {
  return (
    <section className="section-block bg-white" id="services">
      <div className="site-container">
        <div className="section-intro mb-10 grid gap-5 md:grid-cols-[.8fr_1.2fr] md:items-end md:gap-10">
          <div>
            <p className="eyebrow">What we do</p>
            <h2 className="section-title max-w-xl">Recruitment that starts with a real conversation.</h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-slate">From a single specialist role to a planned intake, we take time to understand the people and the work behind every brief.</p>
        </div>

        <BentoGrid className="services-bento grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <BentoGridItem
              key={service.title}
              className="service-tile"
              title={<h3 className="m-0 font-heading text-xl font-medium text-navy sm:text-2xl">{service.title}</h3>}
              description={<p className="m-0 max-w-lg text-sm leading-6 text-slate">{service.description}</p>}
              header={<ServiceVisual type={service.visual} />}
            />
          ))}
        </BentoGrid>
      </div>
    </section>
  )
}

function ProcessTrack({ title, steps, label }: { title: string; steps: typeof hiringSteps; label: string }) {
  return (
    <article className="process-track relative rounded-3xl border border-sky-200 bg-white p-6 shadow-[0_12px_40px_rgba(11,37,69,.045)] sm:p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h3 className="m-0 font-heading text-2xl font-medium text-navy">{title}</h3>
        <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-action">{label}</span>
      </div>
      <ol className="relative grid gap-5">
        {steps.map((step, index) => (
          <li className="relative grid grid-cols-[36px_1fr] gap-4" key={step.title}>
            <span className="step-marker relative z-10 grid size-9 place-items-center rounded-full border border-sky-300 bg-white text-xs font-semibold text-action">{`0${index + 1}`}</span>
            <div className="pt-1">
              <strong className="block text-sm font-semibold text-navy">{step.title}</strong>
              <p className="mb-0 mt-1 text-sm leading-6 text-slate">{step.text}</p>
            </div>
          </li>
        ))}
        <span className="timeline-track absolute left-[17px] top-4 h-[calc(100%-32px)] w-px origin-top bg-sky-200" aria-hidden="true" />
        <span className="timeline-progress absolute left-[16px] top-4 h-[calc(100%-32px)] w-[3px] origin-top rounded-full bg-action" aria-hidden="true" />
      </ol>
    </article>
  )
}

function HowItWorks() {
  const scope = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

  useGSAP(() => {
    if (reducedMotion || !scope.current) return
    const lines = scope.current.querySelectorAll('.timeline-progress')
    const animations = Array.from(lines).map((line) => gsap.fromTo(line, { scaleY: 0 }, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: { trigger: line.parentElement, start: 'top 68%', end: 'bottom 52%', scrub: 0.6 },
    }))
    return () => animations.forEach((animation) => animation.scrollTrigger?.kill())
  }, { scope, dependencies: [reducedMotion] })

  return (
    <section className="section-block bg-mist" id="how-it-works" ref={scope}>
      <div className="site-container">
        <div className="mb-10 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl"><p className="eyebrow">A clear next step</p><h2 className="section-title">A steady process for both sides.</h2></div>
          <p className="mb-1 max-w-md text-sm leading-6 text-slate">You will know what happens next, who is responsible, and when to expect an update.</p>
        </div>
        <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
          <ProcessTrack title="For employers" label="Hiring" steps={hiringSteps} />
          <ProcessTrack title="For job seekers" label="Your next role" steps={candidateSteps} />
        </div>
      </div>
    </section>
  )
}

// DEMO CONTENT
const statItems = [
  { value: 48, suffix: '+', label: 'roles on the board this week' },
  { value: 12, suffix: ' days', label: 'average time to first shortlist' },
  { value: 86, suffix: '%', label: 'of clients return to hire again' },
]

function StatCounter({ value, suffix, label }: (typeof statItems)[number]) {
  const ref = useRef<HTMLSpanElement>(null)
  const reducedMotion = useReducedMotion()
  const [count, setCount] = useState(() => reducedMotion || typeof IntersectionObserver === 'undefined' ? value : 0)

  useEffect(() => {
    const element = ref.current
    if (!element) return undefined
    if (reducedMotion || typeof IntersectionObserver === 'undefined') {
      return undefined
    }

    let frame = 0
    let started = false
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started) return
      started = true
      const start = performance.now()
      const duration = 950
      const update = (now: number) => {
        const progress = Math.min((now - start) / duration, 1)
        setCount(Math.round(value * (1 - (1 - progress) ** 3)))
        if (progress < 1) frame = requestAnimationFrame(update)
      }
      frame = requestAnimationFrame(update)
      observer.disconnect()
    }, { threshold: 0.5 })
    observer.observe(element)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [reducedMotion, value])

  return (
    <div className="stat-item">
      <strong className="block font-heading text-4xl font-medium tracking-tight text-navy sm:text-5xl"><span ref={ref}>{reducedMotion ? value : count}</span>{suffix}</strong>
      <span className="mt-2 block max-w-[190px] text-sm leading-5 text-slate">{label}</span>
    </div>
  )
}

function StatsBand() {
  return (
    <section className="stats-band border-y border-sky-200 bg-white py-10 sm:py-12" aria-label="Recruitment statistics">
      <div className="site-container">
        <div className="grid gap-7 sm:grid-cols-3 sm:gap-4">
          {statItems.map((item) => <StatCounter key={item.label} {...item} />)}
        </div>
        <p className="mb-0 mt-6 text-xs text-slate">Demo figures for layout only. Replace with verified agency data before launch.</p>
      </div>
    </section>
  )
}

function FeaturedJobs({ search, filter, onFilterChange, onApply }: Pick<HomeSectionsProps, 'search' | 'filter' | 'onFilterChange' | 'onApply'>) {
  const categories: JobFilter[] = ['All roles', 'IT', 'Finance', 'Healthcare', 'Other']
  const visibleJobs = jobs.filter((job) => {
    const matchesIndustry = filter === 'All roles' || job.industry === filter
    const matchesKeyword = !search.keyword.trim() || `${job.title} ${job.company} ${job.industry}`.toLowerCase().includes(search.keyword.trim().toLowerCase())
    const matchesLocation = !search.location.trim() || job.location.toLowerCase().includes(search.location.trim().toLowerCase())
    return matchesIndustry && matchesKeyword && matchesLocation
  })

  return (
    <section className="section-block bg-white" id="featured-jobs">
      <div className="site-container">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="eyebrow">Featured opportunities</p><h2 className="section-title">Find work that fits your life.</h2></div>
          <a className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-action" href="#job-seekers">Looking for your next role? <ArrowRight size={16} aria-hidden="true" /></a>
        </div>

        <div className="job-filters flex flex-wrap gap-2 rounded-full bg-mist p-1.5" role="group" aria-label="Filter jobs by sector">
          {categories.map((category) => (
            <button type="button" className={`filter-button relative min-h-11 rounded-full px-4 text-sm font-semibold transition-colors ${filter === category ? 'text-white' : 'text-slate hover:text-navy'}`} key={category} aria-pressed={filter === category} onClick={() => onFilterChange(category)}>
              {filter === category && <motion.span className="active-filter-pill absolute inset-0 rounded-full bg-navy" layoutId="active-job-filter" transition={{ type: 'spring', stiffness: 380, damping: 32 }} aria-hidden="true" />}
              <span className="relative z-10">{category}</span>
            </button>
          ))}
        </div>

        <div className="jobs-list mt-5 divide-y divide-sky-100 border-y border-sky-200" aria-live="polite">
          <AnimatePresence mode="popLayout">
            {visibleJobs.map((job, index) => (
              <motion.article
                className="job-row group grid items-center gap-3 py-5 sm:grid-cols-[minmax(0,1.8fr)_minmax(100px,.8fr)_minmax(90px,.7fr)_auto] sm:gap-5 sm:px-3"
                key={job.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, delay: index * 0.025 }}
              >
                <div>
                  <h3 className="mb-1 font-sans text-base font-semibold text-navy">{job.title}</h3>
                  <p className="mb-0 text-sm text-slate">{job.company}</p>
                </div>
                <span className="text-sm text-slate">{job.location}</span>
                <span className="w-fit rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-medium text-navy">{job.type}</span>
                <button className="apply-button inline-flex min-h-11 items-center gap-2 justify-self-start font-semibold text-action sm:justify-self-end" type="button" onClick={() => onApply(job)}>
                  Apply <ArrowRight size={16} aria-hidden="true" />
                </button>
              </motion.article>
            ))}
          </AnimatePresence>
          {visibleJobs.length === 0 && <p className="py-8 text-sm text-slate">No roles match that search yet. Try another title or location.</p>}
        </div>
        <p className="mb-0 mt-4 text-xs text-slate">Example listings for review. Details may change before launch.</p>
      </div>
    </section>
  )
}

function EmployerEnquiry() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.checkValidity()) {
      setError('Please complete the required fields with a valid email address.')
      form.querySelector<HTMLElement>(':invalid')?.focus()
      return
    }
    const payload = Object.fromEntries(new FormData(form).entries())
    console.log('Demo employer enquiry:', payload)
    setError('')
    setSubmitted(true)
  }

  return (
    <section className="employer-section section-block scroll-mt-24 bg-sky-100" id="contact">
      <div className="site-container grid scroll-mt-24 gap-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-16" id="employers">
        <div className="max-w-lg">
          <p className="eyebrow">For employers</p>
          <h2 className="section-title">Tell us about the people you need.</h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate">Share a few details and a recruiter will get back to you within one working day.</p>
          <div className="mt-6 grid gap-2 text-sm text-navy">
            <span>Prefer a call?</span>
            <a className="min-h-11 w-fit content-center font-semibold text-action underline-offset-4 hover:underline" href={`tel:${site.phone.replaceAll(' ', '')}`}>{site.phone}</a>
          </div>
        </div>
        {submitted ? (
          <div className="grid content-center gap-3 rounded-3xl border border-sky-200 bg-white p-7 sm:p-9" role="status">
            <span className="grid size-12 place-items-center rounded-full bg-sky-100 text-action"><Check size={21} aria-hidden="true" /></span>
            <h3 className="mb-0 font-heading text-2xl text-navy">Thanks for reaching out.</h3>
            <p className="mb-0 text-sm leading-6 text-slate">Your enquiry is recorded in this demo. No email has been sent.</p>
            <button className="mt-2 min-h-11 w-fit font-semibold text-action" type="button" onClick={() => setSubmitted(false)}>Send another enquiry <ArrowRight className="ml-1 inline" size={16} aria-hidden="true" /></button>
          </div>
        ) : (
          <form className="employer-form grid gap-4 rounded-3xl border border-sky-200 bg-white p-5 shadow-[0_12px_38px_rgba(11,37,69,.06)] sm:p-7" noValidate onSubmit={submit} onChange={() => setError('')}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="form-label">Company<input className="form-control" name="company" required autoComplete="organization" /></label>
              <label className="form-label">Contact person<input className="form-control" name="contact" required autoComplete="name" /></label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="form-label">Email<input className="form-control" name="email" type="email" required autoComplete="email" /></label>
              <label className="form-label">Phone<input className="form-control" name="phone" type="tel" required autoComplete="tel" /></label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="form-label">Roles hiring for<input className="form-control" name="roles" required /></label>
              <label className="form-label">Headcount<select className="form-control" name="headcount" defaultValue="" required><option value="" disabled>Select one</option><option>1–2</option><option>3–5</option><option>6–10</option><option>More than 10</option></select></label>
            </div>
            <label className="form-label">Anything else we should know?<textarea className="form-control min-h-24 resize-y" name="message" rows={3} /></label>
            {error && <p className="mb-0 text-sm font-medium text-red-800" role="alert">{error}</p>}
            <Button className="button-primary w-fit" type="submit">Send enquiry <ArrowRight size={17} aria-hidden="true" /></Button>
            <p className="mb-0 text-xs leading-5 text-slate">Your details are only used to respond to your enquiry.</p>
          </form>
        )}
      </div>
    </section>
  )
}

function SpotlightCard({ audience, image, title, copy, cta, onClick }: { audience: string; image: string; title: string; copy: string; cta: string; onClick: () => void }) {
  const reducedMotion = useReducedMotion()

  function moveSpotlight(event: PointerEvent<HTMLElement>) {
    if (reducedMotion || !window.matchMedia('(min-width: 768px) and (pointer: fine)').matches) return
    const bounds = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`)
    event.currentTarget.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`)
  }

  return (
    <article className="spotlight-card group relative isolate min-h-[440px] overflow-hidden rounded-3xl border border-sky-200 bg-navy" onPointerMove={moveSpotlight}>
      <img className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" src={image} alt={audience.toLowerCase().includes('employer') ? 'Colleagues working together in a modern office' : 'Professional working at a laptop in a bright office'} width="900" height="600" loading="lazy" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy via-navy/70 to-navy/5" aria-hidden="true" />
      <div className="spotlight-glow absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
      <div className="flex min-h-[440px] flex-col justify-end p-6 text-white sm:p-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[.15em] text-sky-200">{audience}</p>
        <h3 className="mb-3 max-w-lg font-heading text-3xl leading-tight sm:text-4xl">{title}</h3>
        <p className="mb-6 max-w-lg text-sm leading-6 text-white/85">{copy}</p>
        <button className="button-light w-fit" type="button" onClick={onClick}>{cta}<ArrowRight size={17} aria-hidden="true" /></button>
      </div>
    </article>
  )
}

function AudienceCards({ onUpload, onPostJob }: Pick<HomeSectionsProps, 'onUpload' | 'onPostJob'>) {
  return (
    <section className="section-block bg-mist" id="job-seekers" aria-label="Recruitment services for employers and job seekers">
      <div className="site-container">
        <div className="mb-9 max-w-2xl"><p className="eyebrow">People on both sides</p><h2 className="section-title">Good recruitment works for everyone.</h2></div>
        <div className="grid gap-5 lg:grid-cols-2">
          <SpotlightCard audience="For employers" image={employersImage} title="Build a team that can move your work forward." copy="Tell us what you need, and a recruiter will help you plan the next step." cta="Post a job" onClick={onPostJob} />
          <SpotlightCard audience="For job seekers" image={jobSeekersImage} title="Find a role that fits what you want next." copy="Share your experience and we will talk through opportunities that make sense." cta="Upload your CV" onClick={onUpload} />
        </div>
      </div>
    </section>
  )
}

function FinalCTA({ onUpload, onPostJob }: Pick<HomeSectionsProps, 'onUpload' | 'onPostJob'>) {
  return (
    <section className="final-cta relative isolate overflow-hidden bg-navy py-16 text-white sm:py-20">
      <div className="cta-beams pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
      <div className="site-container relative flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[.16em] text-sky-200">A good next step starts here</p>
          <h2 className="mb-0 font-heading text-4xl leading-tight text-white sm:text-5xl">Let’s talk about the people you need, or the work you want.</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="button-light" type="button" onClick={onPostJob}>Post a job <ArrowRight size={17} aria-hidden="true" /></button>
          <MagneticAction className="button-outline-light" onClick={onUpload}>Upload your CV <ArrowRight size={17} aria-hidden="true" /></MagneticAction>
        </div>
      </div>
    </section>
  )
}

export default function HomeSections({ search, filter, onFilterChange, onApply, onUpload, onPostJob }: HomeSectionsProps) {
  return (
    <>
      <Industries />
      <Services />
      <HowItWorks />
      <StatsBand />
      <FeaturedJobs search={search} filter={filter} onFilterChange={onFilterChange} onApply={onApply} />
      <EmployerEnquiry />
      <AudienceCards onUpload={onUpload} onPostJob={onPostJob} />
      <LazyMount placeholder={<section className="section-block min-h-[360px] bg-mist" aria-hidden="true" />}>
        <Suspense fallback={<section className="section-block min-h-[360px] bg-mist" aria-busy="true" />}>
          <Testimonials />
        </Suspense>
      </LazyMount>
      <LazyMount placeholder={<section className="section-block min-h-[360px] bg-white" aria-hidden="true" />}>
        <Suspense fallback={<section className="section-block min-h-[360px] bg-white" aria-busy="true" />}>
          <FAQSection items={faqs} />
        </Suspense>
      </LazyMount>
      <FinalCTA onUpload={onUpload} onPostJob={onPostJob} />
    </>
  )
}
