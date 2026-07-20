import './Hero.css'

export function Hero() {
  return (
    <div className="hero">
      <p className="hero__eyebrow">AI Customer Feedback Intelligence</p>
      <h1 className="hero__title">Every scattered signal, finally legible.</h1>
      <p className="hero__subhead">
        Pulse reads every ticket, review, and call transcript your customers leave behind, and
        turns it into the handful of decisions your team can act on today.
      </p>
      <div className="hero__actions">
        {/* Now that the page has real sections below it, this is a genuine
            in-page destination rather than a bare "#" href. */}
        <a className="hero__cta" href="#capabilities">
          Explore Pulse
        </a>
        <span className="hero__meta">Feedback intelligence, not another dashboard</span>
      </div>
    </div>
  )
}
