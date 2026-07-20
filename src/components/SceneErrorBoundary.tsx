import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  onFailure?: () => void
}

interface State {
  failed: boolean
}

/**
 * A WebGL context failure (unsupported browser, driver crash, context loss)
 * should not blank the entire page — the hero copy is still worth showing on
 * a plain dark canvas. React error boundaries only catch render-phase
 * errors, which covers Three.js/R3F throwing during scene setup; it won't
 * catch errors inside WebGL's own async pipeline, but that's an acceptable
 * gap for a decorative background.
 */
export class SceneErrorBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    console.error('Scene failed to render, falling back to static background.', error)
    this.props.onFailure?.()
  }

  render() {
    if (this.state.failed) return null
    return this.props.children
  }
}
