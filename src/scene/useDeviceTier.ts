import { useMemo } from 'react'

export type DeviceTier = 'high' | 'low'

/**
 * iPadOS reports its UA as a Mac since iOS 13 (desktop-site request is the
 * default), so a plain UA sniff sees "Macintosh" and a `hardwareConcurrency`
 * of 8 — indistinguishable from a real MacBook by cores alone. The
 * multi-touch check is the standard disambiguator: no Mac has a touchscreen.
 */
function isIPad(): boolean {
  return navigator.maxTouchPoints > 1 && /Mac/.test(navigator.platform)
}

/**
 * Cheap, synchronous capability heuristic — not a GPU benchmark, just enough
 * to keep the scene honest on real phones and tablets. Touch device *and*
 * (small viewport, few CPU cores, or an iPad) drops to the low tier: fewer
 * particles, no postprocessing, no physics fragments.
 */
export function useDeviceTier(): DeviceTier {
  return useMemo(() => {
    if (typeof window === 'undefined') return 'high'

    const cores = navigator.hardwareConcurrency ?? 4
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches
    const isSmallViewport = window.innerWidth < 768

    if (isCoarsePointer && (isSmallViewport || cores <= 4 || isIPad())) return 'low'
    return 'high'
  }, [])
}
