import * as THREE from 'three'
import { shaderMaterial } from '@react-three/drei'
import { extend, type ThreeElement } from '@react-three/fiber'
import { PUSH_MODE_ID, SIGNAL_CONFIG } from './signalConfig'

// "Signal from noise": each point starts at a scattered `aStart` position and
// is driven toward a precise `aTarget` position (a point on a fibonacci sphere
// lattice — the "signal") as `uProgress` advances from 0 -> 1. Per-particle
// stagger (via `aSeed`) keeps thousands of points from moving in lockstep,
// which is what reads as "physical" rather than "scripted". Color only shifts
// toward the accent while `uGlow` is non-zero — the one deliberate glow
// moment, not an ambient effect.
const vertexShader = /* glsl */ `
  attribute vec3 aStart;
  attribute vec3 aTarget;
  attribute float aSeed;

  uniform float uProgress;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform vec3 uPointerRayOrigin;
  uniform vec3 uPointerRayDir;
  uniform float uPointerRadius;
  uniform float uPointerGlowRadius;
  uniform float uPointerStrength;
  uniform float uPointerSizeBoost;
  uniform float uPushMode;
  uniform float uAmbientDrift;
  uniform float uIntroStagger;

  varying float vProgress;
  varying float vSeed;
  varying float vPointerInfluence;

  // Perlin's "smootherstep" — zero first *and* second derivative at both
  // ends, unlike smoothstep (zero first derivative only). Reads as a soft
  // gradient fading into nothing rather than a disc with an edge.
  float smootherstep(float edge0, float edge1, float x) {
    float t = clamp((x - edge0) / max(edge1 - edge0, 0.0001), 0.0, 1.0);
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
  }

  void main() {
    // Per-particle start delay, as a fraction of uProgress. Deliberately
    // small: this is a fraction of total duration, so when the intro was
    // stretched to 2x the window widened in real seconds too, leaving the
    // last particles still scattered and dim (alpha is driven by this same
    // stagger value below) long after the sphere looked settled — which
    // reads as stray dim dots that never move, not as a build-up.
    float delay = aSeed * uIntroStagger;
    float stagger = clamp((uProgress - delay) / max(1.0 - delay, 0.0001), 0.0, 1.0);
    vec3 pos = mix(aStart, aTarget, stagger);

    // Ambient drift decays as a particle settles, but never to a standstill.
    // The settled floor used to be 0.035 — small enough that once the intro
    // finished the whole sphere froze, and only the patch under the cursor
    // ever moved again. A living field needs every particle still breathing,
    // so the floor is now large enough to read as motion on its own.
    float drift = (1.0 - stagger) * 0.4 + uAmbientDrift;
    // Each particle gets its own speed as well as its own phase — a single
    // shared frequency makes thousands of points pulse in visible unison,
    // which reads as a screensaver rather than a field of separate signals.
    float rate = mix(0.6, 1.25, fract(aSeed * 3.71));
    pos.x += sin(uTime * 0.55 * rate + aSeed * 62.0) * drift;
    pos.y += cos(uTime * 0.47 * rate + aSeed * 41.0) * drift;
    pos.z += sin(uTime * 0.39 * rate + aSeed * 27.0) * drift * 0.7;

    // --- Cursor interaction ---
    //
    // WHAT reacts is decided in screen space: distance from the particle to
    // the cursor's ray (camera through pointer). Every particle the cursor
    // visually overlaps qualifies, near hemisphere and far hemisphere alike.
    // Measuring to a single point on the near surface instead (an earlier
    // attempt) left the whole back half outside the radius — so when the
    // front particles moved aside they exposed a static, greyer layer behind
    // them, which read as the sphere being split into a live top and a dead
    // bottom.
    //
    // WHICH WAY they move is switchable (uPushMode) so the sandbox page can
    // compare the options side by side; see signalConfig.ts for the failure
    // mode each one is known to produce.
    vec3 toParticle = pos - uPointerRayOrigin;
    float rayT = dot(toParticle, uPointerRayDir);
    vec3 closestOnRay = uPointerRayOrigin + uPointerRayDir * rayT;
    vec3 toRay = pos - closestOnRay;
    float pointerDist = length(toRay);
    // Two separate falloffs, deliberately.
    //
    // push is bounded: it must reach exactly zero at uPointerRadius, or
    // particles anywhere on the sphere would drift. A hard-bounded curve is
    // correct for displacement.
    //
    // glow drives everything you can SEE - tint, brightness, point size.
    // It uses a gaussian, which has no boundary at all: it decays forever
    // and never reaches zero, so there is no distance at which the effect
    // visibly stops. Sharing the bounded curve for both is what drew a
    // visible disc around the cursor - the eye reads the point where the
    // brightening cuts off as an edge, however smooth the curve is up to it.
    float push = smootherstep(uPointerRadius, 0.0, pointerDist);
    float sigma = max(uPointerGlowRadius, 0.0001);
    float glow = exp(-(pointerDist * pointerDist) / (2.0 * sigma * sigma));

    float posLen = length(pos);
    vec3 outwardDir = posLen > 0.0001 ? pos / posLen : vec3(0.0, 1.0, 0.0);
    vec3 awayFromRayDir = pointerDist > 0.0001 ? toRay / pointerDist : vec3(0.0, 1.0, 0.0);

    vec3 pushDir = outwardDir;                                  // 0 = radial
    if (uPushMode > 2.5)      pushDir = vec3(0.0);               // 3 = none
    else if (uPushMode > 1.5) pushDir = awayFromRayDir;          // 2 = awayFromRay
    else if (uPushMode > 0.5) pushDir = uPointerRayDir;          // 1 = viewDepth

    // +/-35% per-particle variance (aSeed) so particles at the same distance
    // don't move in lockstep — an exactly uniform push is what reads as a
    // generic/templated effect rather than a field of individual points.
    float pushVariance = mix(0.65, 1.35, fract(aSeed * 7.13));
    // Hard ceiling at uPointerStrength regardless of variance, so no particle
    // is ever flung far enough past the sphere to visually detach from it.
    float pushAmount = min(push * uPointerStrength * pushVariance, uPointerStrength);
    pos += pushDir * pushAmount;

    vProgress = stagger;
    vSeed = aSeed;
    vPointerInfluence = glow;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    // Particles under the cursor also grow slightly. Together with the
    // brightening in the fragment shader this makes the cursor read as a
    // light passing over the field — so the affected area gets denser and
    // warmer, never darker. Any residual thinning from the displacement is
    // visually compensated rather than showing up as a bald patch.
    float size = mix(1.6, 3.2, aSeed) * uPixelRatio * (1.0 + glow * uPointerSizeBoost);
    // Reference distance matches the camera's actual distance from the
    // signal (see Scene.tsx, camera z=9) so size reads as ~pixels at that
    // distance, not an arbitrary multiplier that balloons every point into
    // a screen-filling sprite.
    gl_PointSize = size * (9.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uBaseColor;
  uniform vec3 uAccentColor;
  uniform float uGlow;
  uniform float uPointerTint;

  varying float vProgress;
  varying float vSeed;
  varying float vPointerInfluence;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    float alpha = smoothstep(0.5, 0.0, d);
    vec3 color = mix(uBaseColor, uAccentColor, vProgress * uGlow);
    // The gradient: particles nearest the cursor warm toward the accent
    // color and brighten, fading smoothly back to normal at the influence
    // radius — the cursor "lights up" the field it disturbs instead of only
    // pushing it, which is what kept this from reading as a finished effect.
    // Squaring the (already edgeless) gaussian pulls the tint's own falloff
    // even flatter at the tail, so the warm area dissolves into the field
    // instead of ending somewhere the eye can pick out as a rim.
    float tintFalloff = vPointerInfluence * vPointerInfluence;
    color = mix(color, uAccentColor, tintFalloff * uPointerTint);
    // Settled end raised from 0.6: at 0.6, combined with the grey base color,
    // a fully converged particle still read as dim/greyed-out unless the
    // cursor happened to be on it.
    float finalAlpha = alpha * mix(0.18, 0.75, vProgress) * mix(0.7, 1.0, vSeed);
    finalAlpha += alpha * tintFalloff * 0.35;

    gl_FragColor = vec4(color, finalAlpha);
  }
`

export const SignalMaterial = shaderMaterial(
  {
    uProgress: 0,
    uTime: 0,
    uGlow: 0,
    uPixelRatio: 1,
    // Parked far outside the scene until a real pointermove arrives, and
    // offset on axes the direction doesn't run along, so the "off" ray never
    // passes near the sphere.
    uPointerRayOrigin: new THREE.Vector3(9999, 9999, 9999),
    uPointerRayDir: new THREE.Vector3(0, 1, 0),
    // Defaults mirror SIGNAL_CONFIG so the material looks identical whether
    // or not anything overrides it; the sandbox drives these live.
    uPointerRadius: SIGNAL_CONFIG.pointerRadius,
    uPointerGlowRadius: SIGNAL_CONFIG.pointerGlowRadius,
    uPointerStrength: SIGNAL_CONFIG.pointerStrength,
    uPointerSizeBoost: SIGNAL_CONFIG.pointerSizeBoost,
    uPointerTint: SIGNAL_CONFIG.pointerTint,
    uPushMode: PUSH_MODE_ID[SIGNAL_CONFIG.pushMode],
    uAmbientDrift: SIGNAL_CONFIG.ambientDrift,
    uIntroStagger: SIGNAL_CONFIG.introStagger,
    uBaseColor: new THREE.Color('#3A3A41'),
    uAccentColor: new THREE.Color('#E8A33D'),
  },
  vertexShader,
  fragmentShader,
)

extend({ SignalMaterial })

export type SignalMaterialImpl = InstanceType<typeof SignalMaterial>

declare module '@react-three/fiber' {
  interface ThreeElements {
    signalMaterial: ThreeElement<typeof SignalMaterial>
  }
}
