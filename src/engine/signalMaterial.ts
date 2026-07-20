import * as THREE from 'three'

/**
 * Point material for the signal field.
 *
 * Each particle carries three positions and the shader interpolates between
 * them from a single `uPhase` uniform: 0 = scattered inbox, 1 = clustered
 * themes, 2 = the three insights that survived prioritisation. Phase is
 * driven by scroll, so the animation cannot run ahead of the copy explaining
 * it — the reader is always looking at the stage the text is describing.
 */

export const vertexShader = /* glsl */ `
  uniform float uPhase;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uReduced;

  attribute vec3 aScatter;
  attribute vec3 aCluster;
  attribute vec3 aResolve;
  attribute vec3 aColor;
  attribute float aScale;
  attribute float aPromoted;
  attribute float aSeed;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Ease each leg separately so the midpoint (fully clustered) is a real
    // resting state the eye can read, not a moment passed through.
    vec3 pos;
    if (uPhase < 1.0) {
      float t = smoothstep(0.0, 1.0, uPhase);
      pos = mix(aScatter, aCluster, t);
    } else {
      float t = smoothstep(0.0, 1.0, uPhase - 1.0);
      pos = mix(aCluster, aResolve, t);
    }

    // Drift is strongest while scattered and settles as structure emerges —
    // the motion itself carries the "noise becoming order" idea, so it is
    // not decoration even in the resting states.
    float unrest = 1.0 - min(uPhase, 1.0) * 0.72;
    float d = uTime * 0.22 + aSeed * 6.2831;
    pos += vec3(sin(d), cos(d * 0.87), sin(d * 1.31)) * 0.16 * unrest * (1.0 - uReduced);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Perspective attenuation, clamped so nothing becomes a single
    // unreadable pixel or a blown-out disc at the extremes.
    float size = uSize * aScale * uPixelRatio * (9.0 / max(-mvPosition.z, 0.1));
    gl_PointSize = clamp(size, 1.0, 34.0);

    // Prioritisation made visible: what was not promoted dims as the field
    // resolves, so "we cut this down for you" is something you watch happen.
    float resolveT = smoothstep(0.0, 1.0, max(uPhase - 1.0, 0.0));
    float presence = mix(mix(1.0, 0.13, resolveT), 1.0, aPromoted);

    // Depth cue. Without it every particle is equally bright regardless of
    // distance, and the field flattens into a sticker instead of reading as
    // a volume — the single cheapest thing that makes a point cloud look
    // three-dimensional rather than like confetti on glass.
    float depth = smoothstep(20.0, 6.0, -mvPosition.z);

    vColor = mix(aColor, aColor * 1.5 + 0.12, resolveT * aPromoted);
    vAlpha = presence * (0.5 + 0.5 * aScale) * mix(0.35, 1.0, depth);
  }
`

export const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;

    // Soft core with a faster-falling halo: reads as luminous at 3px without
    // turning into a fuzzy blob when particles pile up in a cluster.
    float core = smoothstep(0.5, 0.0, d);
    float halo = smoothstep(0.5, 0.28, d);
    float a = (core * 0.55 + halo * 0.45) * vAlpha;

    gl_FragColor = vec4(vColor, a);
  }
`

export function createSignalMaterial(pixelRatio: number, reduced: boolean) {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uPhase: { value: 0 },
      uTime: { value: 0 },
      uSize: { value: 4.6 },
      uPixelRatio: { value: pixelRatio },
      uReduced: { value: reduced ? 1 : 0 },
    },
    transparent: true,
    depthWrite: false,
    // Additive keeps dense clusters reading as brighter mass rather than
    // flat overlap, which is the whole visual argument of the middle state.
    blending: THREE.AdditiveBlending,
  })
}
