import { useEffect, useRef, useState } from 'react'

/**
 * Adds a fade/slide-in transition when the element scrolls into view.
 * Returns a ref to attach to the element and a boolean for whether it's visible.
 */
export default function useReveal(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, inView]
}
