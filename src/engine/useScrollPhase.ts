import { useEffect, useRef } from 'react'

/**
 * Maps scroll progress through the dark stage onto the scene's 0–2 phase,
 * writing into a ref rather than state — the value changes on every scroll
 * frame and must never cause a React render.
 *
 * The mapping is strictly linear: equal scroll always buys equal movement.
 *
 * It used to hold the field still across three plateaus — the first fifth of
 * the stage, the middle, and the last — so that a reader stopped at a given
 * section saw a settled composition rather than a half-finished morph. That
 * reasoning does not survive contact with actually scrolling it. The stalls
 * read as the animation jamming and needing to be pushed, which is a far
 * worse impression than a field caught mid-transition.
 */
export function useScrollPhase(stageRef: React.RefObject<HTMLElement | null>) {
  const phaseRef = useRef(0)

  useEffect(() => {
    let frame = 0

    const measure = () => {
      frame = 0
      const el = stageRef.current
      if (!el) return

      const rect = el.getBoundingClientRect()
      const scrolled = -rect.top
      const travel = rect.height - window.innerHeight
      if (travel <= 0) return

      const t = Math.min(Math.max(scrolled / travel, 0), 1)

      // Top of the stage is fully scattered, the bottom is fully resolved,
      // and the halfway point is the clustered state. Nothing in between is
      // held.
      phaseRef.current = t * 2
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(measure)
    }

    // A hidden tab runs no animation frames, so a scroll that happened while
    // the page was in the background leaves the queued measurement stranded.
    // Re-measure on return rather than waiting for the next scroll.
    const onVisible = () => {
      if (document.visibilityState === 'visible') measure()
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [stageRef])

  return phaseRef
}
