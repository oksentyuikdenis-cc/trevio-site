import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { buildParticles } from './particles'
import { createSignalMaterial } from './signalMaterial'
import { useDeviceTier } from './useDeviceTier'
import { useReducedMotion } from './useReducedMotion'
import { VOLUME_TOTAL } from '../data/sources'

interface FieldProps {
  /** 0 = scattered, 1 = clustered, 2 = resolved. Read live from a ref so
      scroll updates never trigger a React render. */
  phaseRef: React.RefObject<number>
  count: number
  reduced: boolean
}

function Field({ phaseRef, count, reduced }: FieldProps) {
  const { size, viewport } = useThree()
  const buffers = useMemo(() => buildParticles(count), [count])
  const material = useMemo(
    () => createSignalMaterial(Math.min(window.devicePixelRatio, 2), reduced),
    [reduced],
  )
  const groupRef = useRef<THREE.Points>(null)
  const smoothed = useRef(0)

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    // `position` is required by three even though the shader ignores it in
    // favour of the three named states; scatter doubles as the bounding box.
    g.setAttribute('position', new THREE.BufferAttribute(buffers.scatter, 3))
    g.setAttribute('aScatter', new THREE.BufferAttribute(buffers.scatter, 3))
    g.setAttribute('aCluster', new THREE.BufferAttribute(buffers.cluster, 3))
    g.setAttribute('aResolve', new THREE.BufferAttribute(buffers.resolve, 3))
    g.setAttribute('aColor', new THREE.BufferAttribute(buffers.color, 3))
    g.setAttribute('aScale', new THREE.BufferAttribute(buffers.scale, 1))
    g.setAttribute('aPromoted', new THREE.BufferAttribute(buffers.promoted, 1))
    g.setAttribute('aSeed', new THREE.BufferAttribute(buffers.seed, 1))
    return g
  }, [buffers])

  useEffect(() => () => {
    geometry.dispose()
    material.dispose()
  }, [geometry, material])

  // The field is authored for a wide viewport. On a phone it has to shrink
  // or the outer particles sit off-screen and the cluster ring reads as a
  // random smear.
  const fit = Math.min(1, viewport.width / 13)

  useFrame((state, delta) => {
    const target = phaseRef.current ?? 0
    // Critically-damped follow rather than a direct bind: scroll on a
    // trackpad arrives in jerky bursts, and binding straight to it makes
    // the field stutter. Frame-rate independent so it behaves the same at
    // 120Hz and on a throttled laptop.
    const k = 1 - Math.exp(-delta * (reduced ? 40 : 5.5))
    smoothed.current += (target - smoothed.current) * k

    material.uniforms.uPhase.value = smoothed.current
    if (!reduced) material.uniforms.uTime.value = state.clock.elapsedTime
    material.uniforms.uSize.value = 4.6 * Math.max(fit, 0.55)

    if (groupRef.current) {
      groupRef.current.scale.setScalar(fit)
      // A slow yaw keeps the cluster ring from reading as a flat diagram
      // without ever becoming a spinning-logo effect.
      groupRef.current.rotation.y = reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.08) * 0.13
    }
  })

  useEffect(() => {
    material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
  }, [material, size])

  return <points ref={groupRef} geometry={geometry} material={material} frustumCulled={false} />
}

interface SignalEngineProps {
  phaseRef: React.RefObject<number>
  /** False once the stage has scrolled out of view; stops the render loop. */
  active: boolean
  onReady?: () => void
  /** Raised when the GPU takes the context away, so the page can fall back. */
  onContextLost?: () => void
}

export function SignalEngine({ phaseRef, active, onReady, onContextLost }: SignalEngineProps) {
  const tier = useDeviceTier()
  const reduced = useReducedMotion()
  // A phone renders roughly a third of the particles. The composition still
  // reads because density, not absolute count, is what carries it.
  const count = tier === 'low' ? Math.round(VOLUME_TOTAL / 2.6) : VOLUME_TOTAL

  return (
    <Canvas
      className="signal-canvas"
      dpr={[1, tier === 'low' ? 1.5 : 2]}
      camera={{ position: [0, 0, 11.5], fov: 46 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      // Two thirds of this page has no scene behind it. Left on `always` the
      // renderer keeps drawing a field nobody can see for the entire rest of
      // the scroll — pure battery, and this thing has to survive a pitch on
      // an unplugged laptop.
      frameloop={active ? 'always' : 'never'}
      onCreated={({ gl }) => {
        // A dropped context (GPU switch, sleep/wake, driver reset, too many
        // live contexts) leaves a permanently black canvas. React error
        // boundaries never see it — it is a DOM event, not a render throw.
        gl.domElement.addEventListener(
          'webglcontextlost',
          (event) => {
            event.preventDefault()
            onContextLost?.()
          },
          { once: true },
        )
        onReady?.()
      }}
    >
      <Field phaseRef={phaseRef} count={count} reduced={reduced} />
    </Canvas>
  )
}
