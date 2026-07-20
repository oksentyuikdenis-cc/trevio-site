import './StaticFallback.css'

/**
 * Shown when WebGL is unavailable or the scene throws. Not a placeholder
 * graphic — it is the same idea rendered in CSS: nine channel colours,
 * dispersed, converging toward three points. A projector at a venue nobody
 * tested on is a realistic failure case, and the page has to still make its
 * argument when the expensive part is gone.
 */
export function StaticFallback() {
  return <div className="static-field" aria-hidden="true" />
}
