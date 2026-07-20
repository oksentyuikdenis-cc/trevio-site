import * as THREE from 'three'
import { shaderMaterial } from '@react-three/drei'
import { extend, type ThreeElement } from '@react-three/fiber'

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

  varying float vProgress;
  varying float vSeed;

  void main() {
    float stagger = clamp((uProgress - aSeed * 0.3) / max(1.0 - aSeed * 0.3, 0.0001), 0.0, 1.0);
    vec3 pos = mix(aStart, aTarget, stagger);

    // Ambient drift fades out as a particle settles into the signal shape —
    // motion that decays rather than snapping to a stop.
    float drift = (1.0 - stagger) * 0.4 + 0.035;
    pos.x += sin(uTime * 0.55 + aSeed * 62.0) * drift;
    pos.y += cos(uTime * 0.47 + aSeed * 41.0) * drift;
    pos.z += sin(uTime * 0.39 + aSeed * 27.0) * drift * 0.7;

    vProgress = stagger;
    vSeed = aSeed;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    float size = mix(1.6, 3.2, aSeed) * uPixelRatio;
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

  varying float vProgress;
  varying float vSeed;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    float alpha = smoothstep(0.5, 0.0, d);
    vec3 color = mix(uBaseColor, uAccentColor, vProgress * uGlow);
    float finalAlpha = alpha * mix(0.18, 0.6, vProgress) * mix(0.7, 1.0, vSeed);

    gl_FragColor = vec4(color, finalAlpha);
  }
`

export const SignalMaterial = shaderMaterial(
  {
    uProgress: 0,
    uTime: 0,
    uGlow: 0,
    uPixelRatio: 1,
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
