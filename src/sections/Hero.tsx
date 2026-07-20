import { Button } from '../vendor/meridian/meridian.js'
import { VOLUME_TOTAL, VOLUME_WINDOW_DAYS, SOURCES } from '../data/sources'
import './Hero.css'

export function Hero() {
  return (
    <section className="section hero" id="top">
      <div className="container hero__inner">
        <p className="hero__eyebrow reveal">Feedback intelligence for product teams</p>

        <h1 className="hero__title reveal" style={{ '--reveal-delay': '80ms' } as React.CSSProperties}>
          Your customers already told you
          <br />
          <em>what to build next.</em>
        </h1>

        <p className="hero__lead prose reveal" style={{ '--reveal-delay': '160ms' } as React.CSSProperties}>
          It is spread across {SOURCES.length} channels, buried in {VOLUME_TOTAL.toLocaleString('en-US')} messages
          from the last {VOLUME_WINDOW_DAYS} days, and nobody has read it. Trevio does — and hands your team the
          three decisions worth making this week, each one traceable to the conversations behind it.
        </p>

        <div className="hero__actions reveal" style={{ '--reveal-delay': '240ms' } as React.CSSProperties}>
          <Button variant="primary" size="lg" onClick={() => document.getElementById('output')?.scrollIntoView()}>
            See what it produces
          </Button>
          <Button variant="ghost" size="lg" onClick={() => document.getElementById('pricing')?.scrollIntoView()}>
            Pricing
          </Button>
        </div>
      </div>

      <div className="hero__hint" aria-hidden="true">
        {/* Describes the sections, not the scene: on a machine without WebGL
            there is nothing to watch resolve, and a hint that promises
            something the page cannot deliver is worse than no hint. */}
        <span>Scroll — from noise to three decisions</span>
        <span className="hero__hint-line" />
      </div>
    </section>
  )
}
