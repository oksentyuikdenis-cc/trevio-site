import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import * as THREE from 'three'
import './signalMaterial'
import type { SignalMaterialImpl } from './signalMaterial'
import type { DeviceTier } from './useDeviceTier'
import { PUSH_MODE_ID, SIGNAL_CONFIG, type SignalConfig } from './signalConfig'

interface SignalFieldProps {
  count: number
  reducedMotion: boolean
  tier: DeviceTier
  /** Overrides the tuned defaults — used by the sandbox page. */
  config?: SignalConfig
  /**
   * Drives the cursor from code instead of the real pointer, so the effect
   * can be inspected in motion without a mouse. Values are in the same
   * normalised device coordinates R3F uses: -1..1 on both axes.
   */
  simulatedPointer?: { x: number; y: number } | null
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

export function SignalField({
  count,
  reducedMotion,
  tier,
  config = SIGNAL_CONFIG,
  simulatedPointer = null,
}: SignalFieldProps) {
  const { start, target, seed, placeholder } = useSignalGeometry(count)
  const materialRef = useRef<SignalMaterialImpl>(null)
  const groupRef = useRef<THREE.Group>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const dpr = useThree((s) => s.viewport.dpr)
  const { gl } = useThree()

  // Cursor repulsion is a mouse feature, not a touch one — real hover has no
  // touch equivalent, and gating it to the high tier keeps the extra raycast
  // off phones/tablets entirely. `pointerActive` stays false until a real
  // pointermove fires, so the effect never "snaps" toward wherever R3F's
  // default (0,0) pointer happens to project on first paint.
  const pointerEnabled = tier === 'high' && !reducedMotion
  const pointerActive = useRef(false)
  const raycaster = useRef(new THREE.Raycaster())
  const inverseGroupMatrix = useRef(new THREE.Matrix4())
  const localRayOrigin = useRef(new THREE.Vector3())
  const localRayDir = useRef(new THREE.Vector3())
  const smoothedRayOrigin = useRef(new THREE.Vector3(9999, 9999, 9999))
  const smoothedRayDir = useRef(new THREE.Vector3(0, 1, 0))
  const simulatedNdc = useRef(new THREE.Vector2())

  useEffect(() => {
    if (!pointerEnabled) return
    const el = gl.domElement
    const handlePointerMove = () => {
      pointerActive.current = true
    }
    el.addEventListener('pointermove', handlePointerMove)
    return () => el.removeEventListener('pointermove', handlePointerMove)
  }, [gl, pointerEnabled])

  // Kept separate from the animation effect below: a DPR change (e.g. the
  // window drags to a different-density monitor) should just update point
  // size, not replay the whole noise -> signal intro.
  useEffect(() => {
    if (materialRef.current) materialRef.current.uPixelRatio = Math.min(dpr, 2)
  }, [dpr])

  // Push every tunable straight through to the shader whenever the config
  // changes, so the sandbox's sliders take effect without remounting the
  // scene (a remount would restart the intro on every slider tick).
  useEffect(() => {
    const material = materialRef.current
    if (!material) return
    material.uPointerRadius = config.pointerRadius
    material.uPointerGlowRadius = config.pointerGlowRadius
    material.uPointerStrength = config.pointerStrength
    material.uPointerSizeBoost = config.pointerSizeBoost
    material.uPointerTint = config.pointerTint
    material.uPushMode = PUSH_MODE_ID[config.pushMode]
    material.uAmbientDrift = config.ambientDrift
    material.uIntroStagger = config.introStagger
  }, [config])

  useEffect(() => {
    const material = materialRef.current
    if (!material) return

    if (reducedMotion) {
      // Settle immediately: no build-up, no ongoing drift.
      material.uProgress = 1
      material.uGlow = config.restingGlow
      return
    }


    material.uProgress = 0
    material.uGlow = 0
    const progressProxy = { value: 0 }
    const glowProxy = { value: 0 }

    // 2x the original build — every stage scaled together (delay, main
    // convergence, glow overlap, glow settle) so the choreography stays in
    // the same proportions, just stretched.
    const tl = gsap.timeline({ delay: 0.5 })
    tl.to(progressProxy, {
      value: 1,
      duration: config.introDuration,
      // expo.out, not power3.out: with the duration doubled, power3.out left
      // the field sitting in its visually-diffuse range (progress <~0.97)
      // for ~3.6s of the 5.2s, creeping so slowly it read as dim particles
      // frozen around the sphere. expo.out front-loads harder — the sphere
      // reads as converged by ~2.6s (same as the original build felt) while
      // motion still eases out across the full, longer duration.
      ease: 'expo.out',
      onUpdate: () => {
        if (materialRef.current) materialRef.current.uProgress = progressProxy.value
      },
    })
    tl.to(
      glowProxy,
      {
        value: 1,
        duration: 1.0,
        ease: 'power2.out',
        onUpdate: () => {
          if (materialRef.current) materialRef.current.uGlow = glowProxy.value
        },
      },
      '-=0.9',
    )
    tl.to(glowProxy, {
      // Resting glow, not an off state — keeps the settled sphere warm
      // instead of falling back to the flat grey base color.
      value: config.restingGlow,
      duration: 2.8,
      ease: 'power2.in',
      onUpdate: () => {
        if (materialRef.current) materialRef.current.uGlow = glowProxy.value
      },
    })

    return () => {
      tl.kill()
    }
    // Only the intro's own timings belong here. Depending on the whole config
    // would replay the intro every time a sandbox slider moves.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, config.introDuration, config.restingGlow])

  useFrame((state) => {
    // prefers-reduced-motion means exactly that: nothing moves per-frame,
    // not even the "subtle" pointer parallax. The material is already
    // settled into its static state by the effect above.
    if (reducedMotion) return

    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime
    }

    // Ambient auto-rotate + pointer parallax + cursor repulsion are all
    // "you have a mouse" features — skipped entirely on touch/low-tier so
    // there's no per-frame raycast cost on phones, and the sphere is simply
    // still (aside from its own shader-driven breathing drift) there.
    if (!pointerEnabled) return

    if (groupRef.current) {
      pointer.current.x += (state.pointer.x - pointer.current.x) * 0.02
      pointer.current.y += (state.pointer.y - pointer.current.y) * 0.02
      groupRef.current.rotation.y = pointer.current.x * 0.18 + state.clock.elapsedTime * 0.015
      groupRef.current.rotation.x = -pointer.current.y * 0.12
    }

    if (materialRef.current && groupRef.current) {
      if (simulatedPointer || pointerActive.current) {
        const ndc = simulatedPointer
          ? simulatedNdc.current.set(simulatedPointer.x, simulatedPointer.y)
          : state.pointer
        raycaster.current.setFromCamera(ndc, state.camera)
        // The group's rotation was just mutated above this frame; force the
        // matrix current before converting, or this reads last frame's
        // (stale) transform.
        groupRef.current.updateMatrixWorld()
        inverseGroupMatrix.current.copy(groupRef.current.matrixWorld).invert()
        // The whole cursor ray in the group's local space — not a single
        // point on the sphere's near surface. The shader measures screen
        // distance to this ray, so the far hemisphere is included too and
        // never gets left behind as a static layer.
        localRayOrigin.current.copy(raycaster.current.ray.origin).applyMatrix4(inverseGroupMatrix.current)
        localRayDir.current
          .copy(raycaster.current.ray.direction)
          .transformDirection(inverseGroupMatrix.current)
          .normalize()

        // Trails gently rather than snapping to the cursor.
        smoothedRayOrigin.current.lerp(localRayOrigin.current, config.pointerLerp)
        smoothedRayDir.current.lerp(localRayDir.current, config.pointerLerp).normalize()
      }
      materialRef.current.uPointerRayOrigin = smoothedRayOrigin.current
      materialRef.current.uPointerRayDir = smoothedRayDir.current
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
