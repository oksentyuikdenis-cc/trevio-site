import { useEffect, useRef } from 'react'

/** Nothing may stay hidden longer than this, whatever the observer does. */
const FAILSAFE_MS = 2000

/**
 * Reveals `.reveal` descendants as they scroll into view.
 *
 * Written as progressive enhancement rather than as an animation: the CSS
 * only hides anything once `js-anim` is on <html>, which this hook adds, so
 * a failure anywhere in the chain leaves the page fully readable rather than
 * blank. Three things can break that chain in practice, and all three are
 * handled here:
 *
 *  - No IntersectionObserver at all → everything is revealed immediately.
 *  - The page is loaded in a background tab. Observers do not deliver
 *    callbacks while a document is hidden, so a page opened in a new
 *    background tab would otherwise be blank on first switch to it.
 *  - Anything else unforeseen → the failsafe timer reveals whatever is left.
 *
 * The failure mode of an entrance animation must never be invisible content.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const targets = Array.from(root.querySelectorAll<HTMLElement>('.reveal'))
    if (targets.length === 0) return

    const revealAll = () => targets.forEach((el) => el.classList.add('is-visible'))

    if (typeof IntersectionObserver === 'undefined') {
      revealAll()
      return
    }

    document.documentElement.classList.add('js-anim')

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.1 },
    )

    targets.forEach((el) => observer.observe(el))

    let failsafe = window.setTimeout(() => {
      revealAll()
      observer.disconnect()
    }, FAILSAFE_MS)

    // A tab that starts hidden gets its timers throttled too, so restart the
    // clock the moment it actually becomes visible. Tracked in one slot and
    // replaced rather than stacked — every switch back would otherwise queue
    // another timer that outlives the component.
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return
      window.clearTimeout(failsafe)
      failsafe = window.setTimeout(revealAll, FAILSAFE_MS)
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      window.clearTimeout(failsafe)
      document.removeEventListener('visibilitychange', onVisible)
      observer.disconnect()
    }
  }, [])

  return ref
}
