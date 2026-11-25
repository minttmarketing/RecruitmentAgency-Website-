import { useEffect, useRef, useState, type ReactNode } from 'react'

type Props = { children: ReactNode; rootMargin?: string; placeholder?: ReactNode }

export default function LazyMount({ children, rootMargin = '240px', placeholder = null }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const element = ref.current
    if (!element || typeof IntersectionObserver === 'undefined') return undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setActive(true)
      observer.disconnect()
    }, { rootMargin })
    observer.observe(element)
    return () => observer.disconnect()
  }, [rootMargin])

  return <div ref={ref}>{active ? children : placeholder}</div>
}
