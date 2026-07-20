import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import * as THREE from 'three'
import './signalMaterial'
import type { SignalMaterialImpl } from './signalMaterial'

interface SignalFieldProps {
  count: number
  reducedMotion: boolean
}

/**
 * Builds the noise (`aStart`) and signal (`aTarget`) positions for every
 * particle. Targets sit on a fibonacci sphere lattice — an evenly
 * distributed, precise point cloud, which is what "signal" should look like
 * next to the chaos of `aStart`.
 */
function useSignalGeometry(count: number) {
  return useMemo(() => {
    const start = new Float32Array(count * 3)
    const target = new Float32Array(count * 3)
    const seed = new Float32Array(count)
    const placeholder = new Float32Array(count * 3)

    const goldenAngle = Math.PI * (3 - Math.sqrt(5))
    const sphereRadius = 0.95

    for (let i = 0; i < count; i++) {
      // Scattered noise position: random point inside a larger volume.
      const r = 2.5 + Math.random() * 2.1
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      start[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      start[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      start[i * 3 + 2] = r * Math.cos(phi)

      // Precise target position: fibonacci sphere lattice point.
      const y = 1 - (i / Math.max(count - 1, 1)) * 2
      const radiusAtY = Math.sqrt(Math.max(1 - y * y, 0))
      const angle = goldenAngle * i
      target[i * 3] = Math.cos(angle) * radiusAtY * sphereRadius
      target[i * 3 + 1] = y * sphereRadius
      target[i * 3 + 2] = Math.sin(angle) * radiusAtY * sphereRadius

      seed[i] = Math.random()
    }

    // `position` is required by BufferGeometry/Points bookkeeping even though
    // the vertex shader drives the real position from aStart/aTarget.
    placeholder.set(start)

    return { start, target, seed, placeholder }
  }, [count])
}

export function SignalField({ count, reducedMotion }: SignalFieldProps) {
  const { start, target, seed, placeholder } = useSignalGeometry(count)
  const materialRef = useRef<SignalMaterialImpl>(null)
  const groupRef = useRef<THREE.Group>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const dpr = useThree((s) => s.viewport.dpr)

  // Kept separate from the animation effect below: a DPR change (e.g. the
  // window drags to a different-density monitor) should just update point
  // size, not replay the whole noise -> signal intro.
  useEffect(() => {
    if (materialRef.current) materialRef.current.uPixelRatio = Math.min(dpr, 2)
  }, [dpr])

  useEffect(() => {
    const material = materialRef.current
    if (!material) return

    if (reducedMotion) {
      // Settle immediately: no build-up, no ongoing drift.
      material.uProgress = 1
      material.uGlow = 0.18
      return
    }

    material.uProgress = 0
    material.uGlow = 0
    const progressProxy = { value: 0 }
    const glowProxy = { value: 0 }

    const tl = gsap.timeline({ delay: 0.25 })
    tl.to(progressProxy, {
      value: 1,
      duration: 2.6,
      ease: 'power3.out',
      onUpdate: () => {
        if (materialRef.current) materialRef.current.uProgress = progressProxy.value
      },
    })
    tl.to(
      glowProxy,
      {
        value: 1,
        duration: 0.5,
        ease: 'power2.out',
        onUpdate: () => {
          if (materialRef.current) materialRef.current.uGlow = glowProxy.value
        },
      },
      '-=0.45',
    )
    tl.to(glowProxy, {
      value: 0.18,
      duration: 1.4,
      ease: 'power2.in',
      onUpdate: () => {
        if (materialRef.current) materialRef.current.uGlow = glowProxy.value
      },
    })

    return () => {
      tl.kill()
    }
  }, [reducedMotion])

  useFrame((state) => {
    // prefers-reduced-motion means exactly that: nothing moves per-frame,
    // not even the "subtle" pointer parallax. The material is already
    // settled into its static state by the effect above.
    if (reducedMotion) return

    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime
    }

    if (groupRef.current) {
      // Subtle pointer-driven parallax — restrained range, eased approach.
      pointer.current.x += (state.pointer.x - pointer.current.x) * 0.02
      pointer.current.y += (state.pointer.y - pointer.current.y) * 0.02
      groupRef.current.rotation.y = pointer.current.x * 0.18 + state.clock.elapsedTime * 0.015
      groupRef.current.rotation.x = -pointer.current.y * 0.12
    }
  })

  return (
    <group ref={groupRef}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[placeholder, 3]} />
          <bufferAttribute attach="attributes-aStart" args={[start, 3]} />
          <bufferAttribute attach="attributes-aTarget" args={[target, 3]} />
          <bufferAttribute attach="attributes-aSeed" args={[seed, 1]} />
        </bufferGeometry>
        <signalMaterial
          ref={materialRef}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}
