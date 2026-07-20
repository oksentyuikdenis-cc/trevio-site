import { CLUSTERS } from '../data/clusters'
import { SOURCES, SOURCE_HEX, VOLUME_TOTAL } from '../data/sources'

/**
 * Builds the three positions every particle moves between, plus its colour
 * and role. One particle is one piece of customer feedback, and the geometry
 * is generated from the same numbers the page quotes — the shares in
 * sources.ts and the weights in clusters.ts — so the scene cannot drift out
 * of agreement with the copy next to it.
 *
 * Deterministic by design: a seeded PRNG means the composition is identical
 * on every load and on every machine, which matters when the page is going
 * to be shown from a projector rather than reloaded until it looks good.
 */

function mulberry32(seed: number) {
  return function random() {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Box–Muller, so clusters look like natural density falloff rather than discs. */
function gaussian(random: () => number): number {
  let u = 0
  let v = 0
  while (u === 0) u = random()
  while (v === 0) v = random()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

export interface ParticleBuffers {
  count: number
  scatter: Float32Array
  cluster: Float32Array
  resolve: Float32Array
  color: Float32Array
  scale: Float32Array
  promoted: Float32Array
  seed: Float32Array
}

/** Six theme centres, arranged as a loose ring so no cluster hides behind another. */
const CLUSTER_CENTERS: [number, number, number][] = [
  [-4.6, 1.5, 0.4],
  [-1.4, -1.9, -0.8],
  [2.0, 1.9, 0.2],
  [4.8, -0.7, -0.5],
  [-3.4, -2.4, 1.0],
  [0.6, 2.6, -1.1],
]

/** Three surviving insights, on a level row — the point is that they are comparable. */
const RESOLVE_NODES: [number, number, number][] = [
  [-3.9, 0, 0],
  [0, 0, 0],
  [3.9, 0, 0],
]

export function buildParticles(count = VOLUME_TOTAL): ParticleBuffers {
  const random = mulberry32(20260720)

  const scatter = new Float32Array(count * 3)
  const cluster = new Float32Array(count * 3)
  const resolve = new Float32Array(count * 3)
  const color = new Float32Array(count * 3)
  const scale = new Float32Array(count)
  const promoted = new Float32Array(count)
  const seed = new Float32Array(count)

  // Cumulative source shares, so a single random draw picks a channel with
  // the right frequency.
  const sourceCdf: number[] = []
  let acc = 0
  for (const s of SOURCES) {
    acc += s.share
    sourceCdf.push(acc)
  }

  // Same trick for themes. The tail beyond the last weight is the 29% of
  // feedback that never forms a theme — those particles stay scattered.
  const clusterCdf: number[] = []
  acc = 0
  for (const c of CLUSTERS) {
    acc += c.weight
    clusterCdf.push(acc)
  }

  const promotedIndices = CLUSTERS.map((c, i) => (c.promoted ? i : -1)).filter((i) => i >= 0)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3

    // ---- scatter: the inbox nobody reads ----
    // Tight enough to read as one dense mass of messages. Spread wider and
    // it turns into a starfield, which is a different idea entirely.
    scatter[i3] = (random() - 0.5) * 15
    scatter[i3 + 1] = (random() - 0.5) * 9
    scatter[i3 + 2] = (random() - 0.5) * 6

    // ---- channel colour ----
    const sr = random()
    let sIdx = sourceCdf.findIndex((v) => sr <= v)
    if (sIdx < 0) sIdx = SOURCES.length - 1
    const [r, g, b] = hexToRgb(SOURCE_HEX[SOURCES[sIdx].id])
    color[i3] = r
    color[i3 + 1] = g
    color[i3 + 2] = b

    // ---- theme assignment ----
    const cr = random()
    const cIdx = clusterCdf.findIndex((v) => cr <= v)

    if (cIdx < 0) {
      // Long tail: drifts inward a little but never coheres, and is gone by
      // the time the page is talking about decisions.
      cluster[i3] = scatter[i3] * 0.82
      cluster[i3 + 1] = scatter[i3 + 1] * 0.82
      cluster[i3 + 2] = scatter[i3 + 2] * 0.82
      resolve[i3] = scatter[i3] * 1.15
      resolve[i3 + 1] = scatter[i3 + 1] * 1.15 - 1.5
      resolve[i3 + 2] = scatter[i3 + 2] * 1.15
      promoted[i] = 0
      scale[i] = 0.55 + random() * 0.35
      seed[i] = random()
      continue
    }

    const center = CLUSTER_CENTERS[cIdx]
    // Heavier themes read as physically larger, not just more numerous.
    const spread = 0.62 + CLUSTERS[cIdx].weight * 3.4
    cluster[i3] = center[0] + gaussian(random) * spread
    cluster[i3 + 1] = center[1] + gaussian(random) * spread * 0.78
    cluster[i3 + 2] = center[2] + gaussian(random) * spread * 0.6

    const isPromoted = CLUSTERS[cIdx].promoted
    promoted[i] = isPromoted ? 1 : 0

    if (isPromoted) {
      const node = RESOLVE_NODES[promotedIndices.indexOf(cIdx)]
      const tight = 0.5
      resolve[i3] = node[0] + gaussian(random) * tight
      resolve[i3 + 1] = node[1] + gaussian(random) * tight * 0.92
      resolve[i3 + 2] = node[2] + gaussian(random) * tight * 0.7
    } else {
      // Cut in prioritisation: sinks and dims rather than vanishing, because
      // the product does not delete what it did not surface.
      resolve[i3] = cluster[i3] * 1.32
      resolve[i3 + 1] = cluster[i3 + 1] * 1.1 - 3.2
      resolve[i3 + 2] = cluster[i3 + 2] * 1.32
    }

    scale[i] = 0.7 + random() * 0.6
    seed[i] = random()
  }

  return { count, scatter, cluster, resolve, color, scale, promoted, seed }
}
