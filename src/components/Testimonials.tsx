import { ArrowLeft, ArrowRight } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { testimonials } from '../data/testimonials'
import { useReducedMotion } from '../hooks/useReducedMotion'

export default function Testimonials() {
  const [active, setActive] = useState(0)
  const reducedMotion = useReducedMotion()
  const current = testimonials[active]
  const go = (direction: number) => setActive((index) => (index + direction + testimonials.length) % testimonials.length)

  return (
    <section className="testimonials-section section-block bg-mist" aria-labelledby="testimonials-heading">
      <div className="site-container grid items-center gap-8 lg:grid-cols-[.75fr_1.25fr] lg:gap-16">
        <div>
          <p className="eyebrow">From people we work with</p>
          <h2 className="section-title" id="testimonials-heading">Good work speaks for itself.</h2>
          <p className="mt-4 text-xs text-slate">Demo testimonials, replace before launch.</p>
        </div>
        <div className="testimonial-panel relative min-h-[315px] rounded-3xl border border-sky-200 bg-white p-6 shadow-[0_18px_48px_rgba(11,37,69,.07)] sm:p-9" role="region" aria-roledescription="carousel" aria-label="Testimonials">
          <span className="quote-mark absolute right-6 top-1 font-heading text-8xl leading-none text-sky-200" aria-hidden="true">“</span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.name}
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: reducedMotion ? 0 : 0.35 }}
            >
              <blockquote className="relative z-10 mb-7 max-w-2xl pt-7 font-heading text-2xl leading-snug text-navy sm:text-3xl">“{current.quote}”</blockquote>
              <div className="grid gap-1"><strong className="text-sm text-navy">{current.name}</strong><span className="text-sm text-slate">{current.role}</span></div>
            </motion.div>
          </AnimatePresence>
          <div className="mt-8 flex items-center justify-between gap-4">
            <div className="flex gap-2" aria-label={`Testimonial ${active + 1} of ${testimonials.length}`}>
              {testimonials.map((item, index) => (
                <button type="button" className={`testimonial-dot min-h-11 min-w-11 rounded-full ${index === active ? 'is-active' : ''}`} key={item.name} aria-label={`Show testimonial ${index + 1}`} aria-pressed={index === active} onClick={() => setActive(index)} />
              ))}
            </div>
            <div className="flex gap-2">
              <button className="icon-button" type="button" aria-label="Previous testimonial" onClick={() => go(-1)}><ArrowLeft size={17} aria-hidden="true" /></button>
              <button className="icon-button" type="button" aria-label="Next testimonial" onClick={() => go(1)}><ArrowRight size={17} aria-hidden="true" /></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
