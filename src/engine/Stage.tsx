import { Suspense, lazy, useEffect, useRef, useState, type ReactNode } from 'react'
import { SceneErrorBoundary } from './SceneErrorBoundary'
import { StaticFallback } from './StaticFallback'
import { useScrollPhase } from './useScrollPhase'
import './Stage.css'

/**
 * Three.js is about 900kB of the bundle — more than everything else on the
 * page combined. Loading it lazily means the headline, the copy and the CTA
 * paint on the first pass and the scene arrives a moment later, instead of
 * every word on the page waiting on a renderer. The static field stands in
 * until it lands, so there is never an empty hero.
 */
const SignalEngine = lazy(() =>
  import('./SignalEngine').then((m) => ({ default: m.SignalEngine })),
)

/**
 * Probes for a real WebGL context once, up front. Checking that the API
 * exists is not enough — a machine can expose WebGL and still refuse to hand
 * out a context (blocklisted driver, exhausted context pool, remote desktop),
 * and that failure would otherwise surface as a blank hero on someone else's
 * laptop.
 */
function hasWebGL(): boolean {
  if (import.meta.env.DEV && new URLSearchParams(location.search).has('nowebgl')) return false
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      window.WebGLRenderingContext && (canvas.getContext('webgl2') || canvas.getContext('webgl')),
    )
  } catch {
    return false
  }
}

export function Stage({ children }: { children: ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const phaseRef = useScrollPhase(stageRef)
  const [webgl, setWebgl] = useState<boolean | null>(null)
  const [failed, setFailed] = useState(false)
  const [active, setActive] = useState(true)

  useEffect(() => setWebgl(hasWebGL()), [])

  // The scene only exists behind the first three sections. Everything below
  // is ordinary DOM, so the renderer is told to stop rather than draw frames
  // into a viewport it no longer occupies.
  useEffect(() => {
    const el = sceneRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: '120px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [webgl])

  const showScene = webgl === true && !failed

  return (
    <div className="stage" ref={stageRef}>
      <div className="stage__scene">
        <div className="stage__scene-inner" ref={sceneRef}>
          {showScene ? (
            <SceneErrorBoundary onFailure={() => setFailed(true)}>
              <Suspense fallback={<StaticFallback />}>
                <SignalEngine
                  phaseRef={phaseRef}
                  active={active}
                  onContextLost={() => setFailed(true)}
                />
              </Suspense>
            </SceneErrorBoundary>
          ) : (
            webgl !== null && <StaticFallback />
          )}
          <div className="stage__scrim" aria-hidden="true" />
        </div>
      </div>
      <div className="stage__content">{children}</div>
    </div>
  )
}
