import { ChevronDown } from 'lucide-react'
import { motion } from 'motion/react'
import type { FAQ } from '../data/faqs'
import { useReducedMotion } from '../hooks/useReducedMotion'

type FAQProps = { items: FAQ[] }

export default function FAQSection({ items }: FAQProps) {
  const reducedMotion = useReducedMotion()

  return (
    <section className="section-block bg-white" id="faq">
      <div className="site-container grid gap-9 lg:grid-cols-[.7fr_1.3fr] lg:gap-16">
        <div className="max-w-md">
          <p className="eyebrow">Clear answers</p>
          <h2 className="section-title">A few things people ask us.</h2>
          <p className="mt-4 text-sm leading-6 text-slate">If your question is not here, talk to a recruiter and we will give you a straight answer.</p>
          <a className="mt-4 inline-flex min-h-11 items-center font-semibold text-action underline-offset-4 hover:underline" href="#contact">Contact Northbridge Talent</a>
        </div>
        <div className="divide-y divide-sky-200 border-y border-sky-200">
          {items.map((item, index) => (
            <motion.details
              className="faq-item group py-1"
              key={item.question}
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.04 }}
            >
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-4 text-left font-semibold text-navy">
                <span>{item.question}</span>
                <ChevronDown className="faq-chevron shrink-0 text-action transition-transform duration-200 group-open:rotate-180" size={18} aria-hidden="true" />
              </summary>
              <p className="max-w-2xl pb-5 pr-8 text-sm leading-6 text-slate">{item.answer}</p>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  )
}
