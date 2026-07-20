import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { button, folder, useControls } from 'leva'
import { SignalField } from '../scene/SignalField'
import { PUSH_MODES, SIGNAL_CONFIG, type PushMode, type SignalConfig } from '../scene/signalConfig'
import './sphere-lab.css'

const CANVAS_BG = '#0A0A0C'

interface SweepProps {
  enabled: boolean
  speed: number
  onPointer: (p: { x: number; y: number } | null) => void
}

/**
 * Drives a synthetic cursor in a slow Lissajous path across the sphere.
 * The whole point of the lab is being able to judge the effect *in motion* —
 * artifacts like tunnels, dents and dead layers are invisible in a still
 * frame and only show up as the cursor travels.
 */
function PointerSweep({ enabled, speed, onPointer }: SweepProps) {
  const last = useRef<{ x: number; y: number } | null>(null)

  useFrame((state) => {
    if (!enabled) {
      if (last.current !== null) {
        last.current = null
        onPointer(null)
      }
      return
    }
    const t = state.clock.elapsedTime * speed
    const next = { x: Math.sin(t * 0.9) * 0.75, y: Math.cos(t * 0.62) * 0.5 }
    last.current = next
    onPointer(next)
  })

  return null
}

export function SphereLab() {
  const [simulatedPointer, setSimulatedPointer] = useState<{ x: number; y: number } | null>(null)

  const { particleCount, showHud } = useControls('Scene', {
    particleCount: { value: 4000, min: 500, max: 12000, step: 500 },
    showHud: { value: true, label: 'show config' },
  })

  const { sweepEnabled, sweepSpeed } = useControls('Auto-sweep', {
    sweepEnabled: { value: false, label: 'enabled' },
    sweepSpeed: { value: 1, min: 0.1, max: 3, step: 0.1, label: 'speed' },
  })

  const cursor = useControls('Cursor', {
    pushMode: { value: SIGNAL_CONFIG.pushMode, options: PUSH_MODES },
    pointerRadius: { value: SIGNAL_CONFIG.pointerRadius, min: 0, max: 2.5, step: 0.05 },
    pointerGlowRadius: { value: SIGNAL_CONFIG.pointerGlowRadius, min: 0.05, max: 2.5, step: 0.05 },
    pointerStrength: { value: SIGNAL_CONFIG.pointerStrength, min: 0, max: 1.2, step: 0.01 },
    pointerSizeBoost: { value: SIGNAL_CONFIG.pointerSizeBoost, min: 0, max: 3, step: 0.05 },
    pointerTint: { value: SIGNAL_CONFIG.pointerTint, min: 0, max: 1, step: 0.05 },
    pointerLerp: { value: SIGNAL_CONFIG.pointerLerp, min: 0.01, max: 1, step: 0.01 },
  })

  const life = useControls('Sphere life', {
    ambientDrift: { value: SIGNAL_CONFIG.ambientDrift, min: 0, max: 0.4, step: 0.005 },
    restingGlow: { value: SIGNAL_CONFIG.restingGlow, min: 0, max: 1, step: 0.02 },
  })

  const intro = useControls('Intro', {
    introDuration: { value: SIGNAL_CONFIG.introDuration, min: 0.2, max: 12, step: 0.1 },
    introStagger: { value: SIGNAL_CONFIG.introStagger, min: 0, max: 0.9, step: 0.01 },
  })

  const config: SignalConfig = {
    pushMode: cursor.pushMode as PushMode,
    pointerRadius: cursor.pointerRadius,
    pointerGlowRadius: cursor.pointerGlowRadius,
    pointerStrength: cursor.pointerStrength,
    pointerSizeBoost: cursor.pointerSizeBoost,
    pointerTint: cursor.pointerTint,
    pointerLerp: cursor.pointerLerp,
    ambientDrift: life.ambientDrift,
    restingGlow: life.restingGlow,
    introDuration: intro.introDuration,
    introStagger: intro.introStagger,
  }

  useControls('Export', {
    ' ': folder({
      'copy config to clipboard': button(() => {
        const body = (Object.keys(config) as (keyof SignalConfig)[])
          .map((k) => {
            const v = config[k]
            return `  ${k}: ${typeof v === 'string' ? `'${v}'` : v},`
          })
          .join('\n')
        const snippet = `export const SIGNAL_CONFIG: SignalConfig = {\n${body}\n}\n`
        navigator.clipboard?.writeText(snippet)
        console.info(snippet)
      }),
    }),
  })

  return (
    <div className="lab">
      <Canvas
        className="lab__canvas"
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 9], fov: 36 }}
      >
        <color attach="background" args={[CANVAS_BG]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 2]} intensity={0.65} />
        <PointerSweep enabled={sweepEnabled} speed={sweepSpeed} onPointer={setSimulatedPointer} />
        {/* Centred and alone — no hero copy, no physics shards, no offset.
            Just the sphere, so nothing else can be blamed for what you see.
            `key` remounts on particle-count change (the buffers are built
            once per count); everything else updates without a remount so the
            intro doesn't restart on every slider tick. */}
        <SignalField
          key={particleCount}
          count={particleCount}
          reducedMotion={false}
          tier="high"
          config={config}
          simulatedPointer={simulatedPointer}
        />
      </Canvas>

      {showHud && (
        <div className="lab__hud">
          <strong>Sphere lab</strong>
          <p>
            Move the mouse over the sphere, or switch on <em>Auto-sweep</em> to watch it react
            hands-free. This page renders the same <code>SignalField</code> the site uses — tune
            here, then hit <em>copy config</em> and paste into <code>src/scene/signalConfig.ts</code>.
          </p>
          <p className="lab__hud-modes">
            <span>radial</span> swells outward · <span>viewDepth</span> dents inward ·{' '}
            <span>awayFromRay</span> tunnels through · <span>none</span> light only
          </p>
        </div>
      )}
    </div>
  )
}
