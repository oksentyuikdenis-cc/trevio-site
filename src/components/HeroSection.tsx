import { useCallback, useEffect, useState } from 'react'
import { Scene } from '../scene/Scene'
import { Hero } from './Hero'
import { LoadingScreen } from './LoadingScreen'
import { SceneErrorBoundary } from './SceneErrorBoundary'
import './HeroSection.css'

const MIN_LOADING_MS = 400

export function HeroSection() {
  const [canvasReady, setCanvasReady] = useState(false)
  const [minTimeElapsed, setMinTimeElapsed] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), MIN_LOADING_MS)
    return () => clearTimeout(timer)
  }, [])

  const handleReady = useCallback(() => setCanvasReady(true), [])
  const loading = !(canvasReady && minTimeElapsed)

  return (
    <section id="top" className="hero-section">
      <SceneErrorBoundary onFailure={handleReady}>
        <Scene onReady={handleReady} />
      </SceneErrorBoundary>
      <Hero />
      <LoadingScreen visible={loading} />
    </section>
  )
}
