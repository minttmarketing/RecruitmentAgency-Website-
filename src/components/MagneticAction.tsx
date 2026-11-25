import { useMotionValue, useSpring, motion } from 'motion/react'
import type { PointerEvent, ReactNode } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

type Props = {
  children: ReactNode
  className: string
  href?: string
  type?: 'button' | 'submit'
  onClick?: () => void
  ariaLabel?: string
}

export default function MagneticAction({ children, className, href, type = 'button', onClick, ariaLabel }: Props) {
  const reducedMotion = useReducedMotion()
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 20 })
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 20 })

  function move(event: PointerEvent<HTMLElement>) {
    if (reducedMotion || !window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches) return
    const bounds = event.currentTarget.getBoundingClientRect()
    x.set((event.clientX - bounds.left - bounds.width / 2) * 0.12)
    y.set((event.clientY - bounds.top - bounds.height / 2) * 0.12)
  }

  function reset() {
    x.set(0)
    y.set(0)
  }

  const style = { x, y }
  const motionProps = { style, onPointerMove: move, onPointerLeave: reset }

  if (href) {
    return <motion.a className={className} href={href} aria-label={ariaLabel} {...motionProps}>{children}</motion.a>
  }

  return <motion.button className={className} type={type} onClick={onClick} aria-label={ariaLabel} {...motionProps}>{children}</motion.button>
}
