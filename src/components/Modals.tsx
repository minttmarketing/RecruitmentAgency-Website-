import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { ArrowRight, X } from 'lucide-react'
import type { Job } from '../data/jobs'

type ModalFrameProps = {
  titleId: string
  onClose: () => void
  children: ReactNode
}

function ModalFrame({ titleId, onClose, children }: ModalFrameProps) {
  const dialogRef = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      ))
      if (focusable.length === 0) {
        event.preventDefault()
        dialogRef.current.focus()
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className="modal-backdrop fixed inset-0 z-[70] grid place-items-center overflow-y-auto p-4 sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="modal-panel relative max-h-[calc(100svh-2rem)] w-full max-w-xl overflow-y-auto rounded-3xl border border-sky-200 bg-white p-6 shadow-[0_30px_90px_rgba(11,37,69,.28)] sm:p-8" role="dialog" aria-modal="true" aria-labelledby={titleId} ref={dialogRef} tabIndex={-1}>
        <button className="modal-close absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-mist text-navy transition-colors hover:bg-sky-100" ref={closeRef} type="button" aria-label="Close form" onClick={onClose}><X size={20} aria-hidden="true" /></button>
        {children}
      </section>
    </div>
  )
}

type ApplyModalProps = { job: Job; onClose: () => void }

export function ApplyModal({ job, onClose }: ApplyModalProps) {
  const [submitted, setSubmitted] = useState(false)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity()) return
    const payload = Object.fromEntries(new FormData(form).entries())
    console.log('Demo job application:', { ...payload, job: job.title })
    setSubmitted(true)
  }

  return (
    <ModalFrame titleId="apply-title" onClose={onClose}>
      {submitted ? (
        <div className="modal-success grid gap-4 py-10" role="status">
          <span className="grid size-12 place-items-center rounded-full bg-sky-100 text-action"><ArrowRight size={21} aria-hidden="true" /></span>
          <h2 className="font-heading text-3xl text-navy">Application details saved.</h2>
          <p className="text-sm leading-6 text-slate">This is a front-end demo. Your application has not been sent.</p>
          <button className="button-primary w-fit" type="button" onClick={onClose}>Close</button>
        </div>
      ) : (
        <>
          <p className="eyebrow mb-2">Apply for this role</p>
          <h2 className="max-w-md pr-10 font-heading text-3xl text-navy" id="apply-title">{job.title}</h2>
          <p className="mb-6 text-sm text-slate">{job.company} · {job.location}</p>
          <form className="grid gap-4" onSubmit={submit}>
            <label className="form-label">Full name<input className="form-control" name="name" required autoComplete="name" /></label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="form-label">Email<input className="form-control" type="email" name="email" required autoComplete="email" /></label>
              <label className="form-label">Phone<input className="form-control" type="tel" name="phone" required autoComplete="tel" /></label>
            </div>
            <label className="form-label">CV or resume<input className="form-control file-input" type="file" name="cv" accept=".pdf,.doc,.docx" required /></label>
            <label className="form-label">Short note<textarea className="form-control min-h-24 resize-y" name="note" rows={3} /></label>
            <button type="submit" className="button-primary mt-1 w-fit">Submit application <ArrowRight size={17} aria-hidden="true" /></button>
            <p className="mb-0 text-xs leading-5 text-slate">Demo only. Details are not emailed or stored.</p>
          </form>
        </>
      )}
    </ModalFrame>
  )
}

type UploadModalProps = { onClose: () => void }

export function UploadModal({ onClose }: UploadModalProps) {
  const [submitted, setSubmitted] = useState(false)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity()) return
    const payload = Object.fromEntries(new FormData(form).entries())
    console.log('Demo CV upload:', payload)
    setSubmitted(true)
  }

  return (
    <ModalFrame titleId="upload-title" onClose={onClose}>
      {submitted ? (
        <div className="modal-success grid gap-4 py-10" role="status">
          <span className="grid size-12 place-items-center rounded-full bg-sky-100 text-action"><ArrowRight size={21} aria-hidden="true" /></span>
          <h2 className="font-heading text-3xl text-navy">Thanks for sharing your CV.</h2>
          <p className="text-sm leading-6 text-slate">This front-end demo has not sent or stored your file.</p>
          <button className="button-primary w-fit" type="button" onClick={onClose}>Close</button>
        </div>
      ) : (
        <>
          <p className="eyebrow mb-2">For job seekers</p>
          <h2 className="mb-6 max-w-md pr-10 font-heading text-3xl text-navy" id="upload-title">Share your CV with our team.</h2>
          <form className="grid gap-4" onSubmit={submit}>
            <label className="form-label">Full name<input className="form-control" name="name" required autoComplete="name" /></label>
            <label className="form-label">Email<input className="form-control" name="email" type="email" required autoComplete="email" /></label>
            <label className="form-label">CV or resume<input className="form-control file-input" type="file" name="cv" accept=".pdf,.doc,.docx" required /></label>
            <button type="submit" className="button-primary mt-1 w-fit">Upload your CV <ArrowRight size={17} aria-hidden="true" /></button>
            <p className="mb-0 text-xs leading-5 text-slate">Your CV is shared with employers only with your permission.</p>
          </form>
        </>
      )}
    </ModalFrame>
  )
}
