import { useEffect, useRef, useState } from 'react'
import { SOURCES, VOLUME_TOTAL, VOLUME_WINDOW_DAYS, CUSTOMER_COUNT } from '../data/sources'
import { LONG_TAIL_SHARE } from '../data/clusters'
import './Chaos.css'

/**
 * Counts up once, on first view. The count is the section's whole argument —
 * a static number reads as a claim, a number assembling itself in front of
 * you reads as volume. It respects reduced-motion by rendering the final
 * value immediately.
 */
function useCountUp(target: number, durationMs = 1400) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || typeof IntersectionObserver === 'undefined') {
      setValue(target)
      return
    }

    let raf = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min((now - start) / durationMs, 1)
          // Decelerating, so the number lands rather than stops.
          setValue(Math.round(target * (1 - Math.pow(1 - t, 3))))
          if (t < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )

    observer.observe(el)

    // Observers stay silent while the document is hidden, so a page loaded
    // in a background tab would show a permanent zero. The number matters
    // more than the animation of it.
    const failsafe = window.setTimeout(() => {
      observer.disconnect()
      setValue((v) => (v === 0 ? target : v))
    }, 2500)

    return () => {
      observer.disconnect()
      window.clearTimeout(failsafe)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [target, durationMs])

  return { ref, value }
}

export function Chaos() {
  const counter = useCountUp(VOLUME_TOTAL)

  return (
    <section className="section chaos" id="problem">
      <div className="container">
        <div className="section-head chaos__head">
          <p className="overline reveal">The problem</p>
          <h2 className="h2 reveal">
            Nobody has read all of it. Not once.
          </h2>
          <p className="prose reveal">
            Feedback does not arrive in one place, so no single person ever sees the whole picture. Support knows
            about the bugs. Sales knows what lost the deal. Nobody owns the overlap, and the overlap is where the
            roadmap lives.
          </p>
        </div>

        <div className="chaos__figure reveal">
          <span className="chaos__figure-value num" ref={counter.ref}>
            {counter.value.toLocaleString('en-US')}
          </span>
          <span className="chaos__figure-label">
            messages from {CUSTOMER_COUNT} customers in the last {VOLUME_WINDOW_DAYS} days
          </span>
        </div>

        <ul className="chaos__sources">
          {SOURCES.map((source, i) => (
            <li
              className="chaos__source reveal"
              key={source.id}
              style={{ '--reveal-delay': `${Math.min(i, 5) * 60}ms` } as React.CSSProperties}
            >
              <span className="chaos__dot" style={{ background: source.color }} aria-hidden="true" />
              <span className="chaos__source-name">{source.name}</span>
              <span className="chaos__source-detail">{source.detail}</span>
              <span className="chaos__source-share num">{Math.round(source.share * 100)}%</span>
            </li>
          ))}
        </ul>

        <p className="chaos__note reveal">
          Roughly {Math.round(LONG_TAIL_SHARE * 100)}% of it never forms a pattern at all. Reading it individually
          is how teams lose weeks and still guess.
        </p>
      </div>
    </section>
  )
}
