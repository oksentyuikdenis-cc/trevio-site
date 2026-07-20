import { Canvas, useThree } from '@react-three/fiber'
import { EffectComposer, Vignette } from '@react-three/postprocessing'
import { Physics } from '@react-three/rapier'
import { SignalField } from './SignalField'
import { Fragments } from './Fragments'
import { useDeviceTier, type DeviceTier } from './useDeviceTier'
import { useReducedMotion } from './useReducedMotion'

const CANVAS_BG = '#0A0A0C' // --pulse-color-neutral-0
const MAX_OFFSET_X = 1.9
const MIN_OFFSET_X = 0.4
const SPHERE_MARGIN = 1.1

interface SceneContentsProps {
  tier: DeviceTier
  reducedMotion: boolean
  particleCount: number
}

function SceneContents({ tier, reducedMotion, particleCount }: SceneContentsProps) {
  // `viewport.width` is in world units at the camera's target distance, so
  // this stays correct as the window resizes or rotates — a fixed offset
  // (the previous approach) works on a landscape desktop window but pushes
  // the whole signal past the frustum edge on a narrow or portrait one,
  // leaving only the physics fragments visible and no sphere at all.
  const viewportWidth = useThree((s) => s.viewport.width)
  const offsetX = Math.max(MIN_OFFSET_X, Math.min(MAX_OFFSET_X, viewportWidth / 2 - SPHERE_MARGIN))

  return (
    <>
      <color attach="background" args={[CANVAS_BG]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 2]} intensity={0.65} />
      <directionalLight position={[-2, -1, 1]} intensity={0.15} />

      {/* No HDRI environment map on purpose: this scene is fully procedural
          (no glTF/texture network fetches — see LoadingScreen), and an
          Environment preset would pull an HDR file from an external CDN,
          which is both an undisclosed dependency and a failure mode with no
          visible fallback. Two directional lights give the fragment shards
          enough falloff to read as faceted without it. */}

      {/* Offset off-center so the signal sits beside the editorial copy
          rather than washing out behind it — clamped so it can't clip off
          the frustum edge on narrow viewports. */}
      <group position={[offsetX, 0.3, 0]}>
        {tier === 'high' && !reducedMotion && (
          <Physics gravity={[0, 0, 0]}>
            <Fragments />
          </Physics>
        )}

        <SignalField count={particleCount} reducedMotion={reducedMotion} />
      </group>

      {/* Deliberately no Bloom: with an additive-blended point field, bloom
          amplifies overlap into an unreadable glowing blob rather than a
          restrained accent. The one glow moment lives entirely in the
          shader's own color mix (see signalMaterial), which is bounded and
          predictable. Vignette alone just frames the composition. */}
      {tier === 'high' && (
        <EffectComposer multisampling={0}>
          <Vignette eskil={false} offset={0.2} darkness={0.55} />
        </EffectComposer>
      )}
    </>
  )
}

interface SceneProps {
  onReady?: () => void
}

export function Scene({ onReady }: SceneProps) {
  const tier = useDeviceTier()
  const reducedMotion = useReducedMotion()
  // Kept deliberately sparse: enough to read as a field of individual points,
  // never dense enough to flatten into a solid, glowing disc. Restraint over
  // effects-stacking is the brief, not just the color palette.
  const particleCount = tier === 'low' ? 1400 : 4000

  return (
    <Canvas
      className="signal-canvas"
      aria-hidden="true"
      dpr={tier === 'low' ? 1 : [1, 2]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 9], fov: 36 }}
      onCreated={() => onReady?.()}
    >
      <SceneContents tier={tier} reducedMotion={reducedMotion} particleCount={particleCount} />
    </Canvas>
  )
}
