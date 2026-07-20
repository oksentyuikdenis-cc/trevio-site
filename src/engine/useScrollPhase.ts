import { useEffect, useRef } from 'react'

/**
 * Maps scroll progress through the dark stage onto the scene's 0–2 phase,
 * writing into a ref rather than state — the value changes on every scroll
 * frame and must never cause a React render.
 *
 * The mapping is deliberately not linear across the whole stage. Each of the
 * three sections owns roughly one resting state, with the transitions
 * happening in the gaps between them, so a reader stopped at "Cluster" is
 * looking at a clustered field rather than something mid-morph.
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

      // Hold scattered through the hero, morph, hold clustered through the
      // problem section, morph, hold resolved through the steps.
      let phase: number
      if (t < 0.2) phase = 0
      else if (t < 0.44) phase = (t - 0.2) / 0.24
      else if (t < 0.6) phase = 1
      else if (t < 0.84) phase = 1 + (t - 0.6) / 0.24
      else phase = 2

      phaseRef.current = phase
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
