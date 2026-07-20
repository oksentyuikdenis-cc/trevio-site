import './LoadingScreen.css'

interface LoadingScreenProps {
  visible: boolean
}

/**
 * No fabricated progress percentage — there's no real byte-level asset load
 * to report (the scene is procedural, not glTF/texture-driven), and Pulse's
 * own design system rules out faking certainty it doesn't have. A quiet
 * breathing indicator covers the WebGL context init instead of a blank
 * canvas flash.
 */
export function LoadingScreen({ visible }: LoadingScreenProps) {
  return (
    <div className="loading-screen" data-visible={visible}>
      <div className="loading-screen__dot" />
      <span className="loading-screen__label">Preparing view</span>
    </div>
  )
}
