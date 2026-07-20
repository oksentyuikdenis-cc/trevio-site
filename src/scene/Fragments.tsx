import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { InstancedRigidBodies, type InstancedRigidBodyProps, type RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'

const FRAGMENT_COUNT = 9
const CONTAINMENT_RADIUS = 1.9
const HARD_LIMIT_RADIUS = CONTAINMENT_RADIUS * 1.6

/**
 * A handful of real Rapier rigid bodies — small glass-like shards tumbling
 * under actual angular/linear velocity and damping, softly contained near
 * the signal core. This is the "real physics" element: a few bodies
 * simulated honestly, rather than pretending to run physics across
 * thousands of shader-driven particles (that's `SignalField`'s job).
 */
export function Fragments() {
  const bodiesRef = useRef<(RapierRigidBody | null)[]>(null)

  const instances = useMemo<InstancedRigidBodyProps[]>(() => {
    return Array.from({ length: FRAGMENT_COUNT }, (_, i) => {
      const radius = 1.3 + Math.random() * 0.5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      return {
        key: `fragment-${i}`,
        position: [
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi),
        ],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
      }
    })
  }, [])

  const initializedRef = useRef(false)

  useEffect(() => {
    if (initializedRef.current) return
    const bodies = bodiesRef.current
    if (!bodies) return
    initializedRef.current = true

    for (const body of bodies) {
      if (!body) continue
      body.applyImpulse(
        { x: (Math.random() - 0.5) * 0.02, y: (Math.random() - 0.5) * 0.02, z: (Math.random() - 0.5) * 0.02 },
        true,
      )
      body.applyTorqueImpulse(
        { x: (Math.random() - 0.5) * 0.01, y: (Math.random() - 0.5) * 0.01, z: (Math.random() - 0.5) * 0.01 },
        true,
      )
    }
  }, [])

  useFrame(() => {
    const bodies = bodiesRef.current
    if (!bodies) return

    for (const body of bodies) {
      if (!body) continue
      const t = body.translation()
      const dist = Math.hypot(t.x, t.y, t.z)
      if (dist <= CONTAINMENT_RADIUS) continue

      const dir = { x: t.x / dist, y: t.y / dist, z: t.z / dist }

      if (dist > HARD_LIMIT_RADIUS) {
        // Safety net: a fragment that outran the soft spring (e.g. it left
        // the boundary with real velocity) gets teleported back rather than
        // left to drift into the copy indefinitely. Rare in practice, but
        // never visible if it happens.
        const settleRadius = CONTAINMENT_RADIUS * 0.7
        body.setTranslation(
          { x: dir.x * settleRadius, y: dir.y * settleRadius, z: dir.z * settleRadius },
          true,
        )
        body.setLinvel({ x: 0, y: 0, z: 0 }, true)
        body.setAngvel({ x: 0, y: 0, z: 0 }, true)
        continue
      }

      // Soft spring back toward the core — keeps the shards near the signal
      // without a heavy trimesh boundary collider.
      const pull = (dist - CONTAINMENT_RADIUS) * 0.0022
      body.applyImpulse({ x: -dir.x * pull, y: -dir.y * pull, z: -dir.z * pull }, true)
    }
  })

  return (
    <InstancedRigidBodies
      ref={bodiesRef}
      instances={instances}
      colliders="hull"
      linearDamping={0.9}
      angularDamping={0.75}
      gravityScale={0}
    >
      <instancedMesh args={[undefined, undefined, FRAGMENT_COUNT]} count={FRAGMENT_COUNT}>
        <octahedronGeometry args={[0.11, 0]} />
        <meshStandardMaterial
          color={new THREE.Color('#3A3A41')}
          metalness={0.65}
          roughness={0.3}
          emissive={new THREE.Color('#E8A33D')}
          emissiveIntensity={0.06}
        />
      </instancedMesh>
    </InstancedRigidBodies>
  )
}
