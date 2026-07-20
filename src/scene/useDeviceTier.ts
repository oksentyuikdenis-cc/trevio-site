import { useMemo } from 'react'

export type DeviceTier = 'high' | 'low'

/**
 * Cheap, synchronous capability heuristic — not a GPU benchmark, just enough
 * to keep the scene honest on real phones. Touch device *and* (small
 * viewport or few CPU cores) drops to the low tier: fewer particles, no
 * postprocessing, no physics fragments.
 */
export function useDeviceTier(): DeviceTier {
  return useMemo(() => {
    if (typeof window === 'undefined') return 'high'

    const cores = navigator.hardwareConcurrency ?? 4
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches
    const isSmallViewport = window.innerWidth < 768

    if (isCoarsePointer && (isSmallViewport || cores <= 4)) return 'low'
    return 'high'
  }, [])
}
