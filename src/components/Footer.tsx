import { ArrowRight } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { site } from '../data/site'
import { useReducedMotion } from '../hooks/useReducedMotion'

type FooterProps = { onUpload: () => void }
const currentYear = new Date().getFullYear()

export default function Footer({ onUpload }: FooterProps) {
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const reducedMotion = useReducedMotion()
  const placeholders = ['Your work email', 'Get hiring notes', 'Join our monthly update']

  useEffect(() => {
    if (reducedMotion) return undefined
    const timer = window.setInterval(() => setPlaceholderIndex((index) => (index + 1) % placeholders.length), 2800)
    return () => window.clearInterval(timer)
  }, [reducedMotion, placeholders.length])

  function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity()) return
    const email = new FormData(form).get('newsletterEmail')
    console.log('Demo newsletter signup:', { email })
    setSubmitted(true)
    form.reset()
  }

  return (
    <footer className="site-footer bg-navy text-white">
      <div className="site-container py-12 sm:py-16">
        <div className="grid gap-10 border-b border-white/15 pb-10 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <a className="brand-link inline-flex items-center gap-2.5 text-white" href="#top">
              <span className="grid size-9 place-items-center rounded-full bg-sky-300 font-heading text-lg text-navy">N</span>
              <span className="font-semibold">{site.name}</span>
            </a>
            <p className="mt-4 max-w-sm text-sm leading-6 text-sky-100/80">{site.tagline}</p>
            <button className="footer-upload mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-sky-200" type="button" onClick={onUpload}>Share your CV <ArrowRight size={16} aria-hidden="true" /></button>
          </div>
          <div className="grid gap-8 sm:grid-cols-[.7fr_.8fr_1.5fr]">
            <div className="footer-links flex flex-col items-start gap-3"><strong>Explore</strong><a href="#featured-jobs">Jobs</a><a href="#services">Services</a><a href="#how-it-works">How it works</a></div>
            <div className="footer-links flex flex-col items-start gap-3"><strong>For you</strong><a href="#job-seekers">Job seekers</a><a href="#employers">Employers</a><a href="#employers">Post a job</a></div>
            <div className="footer-links flex flex-col items-start gap-3"><strong>Get in touch</strong><a href={`mailto:${site.email}`}>{site.email}</a><a href={`tel:${site.phone.replaceAll(' ', '')}`}>{site.phone}</a><span>{site.address}</span></div>
          </div>
        </div>

        <div className="newsletter-row grid gap-5 py-8 md:grid-cols-[1fr_auto] md:items-end">
          <div><p className="mb-1 font-heading text-2xl text-white">A useful note now and then.</p><p className="mb-0 text-sm text-sky-100/75">Hiring updates and new roles, sent occasionally.</p></div>
          <div className="min-w-0 md:w-[390px]">
            {submitted ? (
              <p className="mb-0 min-h-12 content-center text-sm font-medium text-sky-100" role="status">Thanks. Your address has been recorded in this demo.</p>
            ) : (
              <form className="newsletter-form flex min-h-12 items-center gap-2 rounded-full border border-white/20 bg-white/10 p-1.5" onSubmit={subscribe}>
                <label className="sr-only" htmlFor="newsletter-email">Email address</label>
                <input className="min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-sky-100/60" id="newsletter-email" name="newsletterEmail" type="email" placeholder={placeholders[placeholderIndex]} required />
                <button className="grid size-10 shrink-0 place-items-center rounded-full bg-sky-300 text-navy transition-colors hover:bg-white" type="submit" aria-label="Subscribe to newsletter"><ArrowRight size={18} aria-hidden="true" /></button>
              </form>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/15 pt-5 text-xs text-sky-100/75 sm:flex-row sm:items-center sm:justify-between">
          <span>© {currentYear} {site.name}</span>
          <span>{site.hours}</span>
          <a className="inline-flex min-h-11 items-center text-white" href="#top">Back to top ↑</a>
        </div>
      </div>
    </footer>
  )
}
