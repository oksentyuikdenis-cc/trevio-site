/**
 * Single source of truth for every tunable number in the signal sphere.
 *
 * The sandbox page (`/sandbox.html`) edits a copy of this live; the site
 * renders the defaults below. Once a set of values feels right in the
 * sandbox, paste them here and the hero picks them up — the two never
 * diverge into separate implementations.
 */
export interface SignalConfig {
  /** How the cursor displaces particles it touches. */
  pushMode: PushMode
  /** World-space reach of the cursor's *displacement*. Sphere radius is 0.95. */
  pointerRadius: number
  /**
   * Spread of the cursor's *light* — tint, brightness and point size — as a
   * gaussian sigma. Deliberately separate from `pointerRadius`: the glow has
   * no cut-off distance at all, which is what stops a visible disc forming
   * around the cursor. Roughly, the light fades out around 3× this value.
   */
  pointerGlowRadius: number
  /** Maximum displacement of a particle at the very centre of the cursor. */
  pointerStrength: number
  /** Extra point-size multiplier at full cursor influence. */
  pointerSizeBoost: number
  /** How far the affected particles shift toward the accent color (0–1). */
  pointerTint: number
  /** How fast the cursor point catches up to the real cursor (0–1 per frame). */
  pointerLerp: number

  /** Residual per-particle motion once settled — 0 makes the sphere freeze. */
  ambientDrift: number
  /** Glow level the sphere rests at after the intro finishes. */
  restingGlow: number

  /** Seconds for the noise → signal intro. */
  introDuration: number
  /** Spread of per-particle start delays, as a fraction of the intro. */
  introStagger: number
}

/**
 * Displacement direction. Each mode has a characteristic failure, recorded
 * here because all three have been tried on this scene:
 *
 * - `radial`  — outward along each particle's own radius from the sphere
 *   centre. The shell stays a shell; it simply swells. No known artifact.
 * - `viewDepth` — along the camera ray, i.e. pushed into the screen.
 *   Particles recede, shrink (point size scales with 1/z) and pile up,
 *   leaving a dark blurred dent under the cursor.
 * - `awayFromRay` — radially away from the cursor's ray axis. Near and far
 *   hemispheres separate and a tunnel opens straight through the sphere.
 * - `none` — no displacement at all; the cursor is purely a light. Cannot
 *   produce any geometric artifact, by construction.
 */
export type PushMode = 'radial' | 'viewDepth' | 'awayFromRay' | 'none'

export const PUSH_MODES: PushMode[] = ['radial', 'viewDepth', 'awayFromRay', 'none']

/** Numeric encoding handed to the shader as `uPushMode`. */
export const PUSH_MODE_ID: Record<PushMode, number> = {
  radial: 0,
  viewDepth: 1,
  awayFromRay: 2,
  none: 3,
}

export const SIGNAL_CONFIG: SignalConfig = {
  pushMode: 'radial',
  // Tuned by hand in the sandbox: a tight, bright pinpoint of influence
  // rather than a broad swell — small radius, but a firmer push and full
  // accent tint inside it, so the cursor reads as a sharp highlight.
  pointerRadius: 0.2,
  // ~3x the push radius: the light spreads well past the particles that
  // actually move, so the moving area has no lit rim marking its edge.
  pointerGlowRadius: 0.55,
  pointerStrength: 0.41,
  pointerSizeBoost: 0.2,
  pointerTint: 1.0,
  pointerLerp: 0.12,

  ambientDrift: 0.09,
  restingGlow: 0.68,

  introDuration: 3.2,
  introStagger: 0.39,
}
