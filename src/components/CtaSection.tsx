import './CtaSection.css'

export function CtaSection() {
  return (
    <section id="cta" className="cta-section">
      <div className="landing-container">
        <svg
          className="cta-section__mark"
          width="28"
          height="28"
          viewBox="0 0 32 32"
          aria-hidden="true"
        >
          <circle cx="19" cy="15" r="5.5" fill="#E8A33D" />
          <circle cx="8" cy="9" r="1.3" fill="#5C5C66" />
          <circle cx="6" cy="21" r="1" fill="#5C5C66" />
          <circle cx="11" cy="24" r="1.4" fill="#5C5C66" />
          <circle cx="25" cy="24" r="1" fill="#5C5C66" />
        </svg>
        <h2 className="cta-section__heading">Ready to see your own signal?</h2>
        <p className="cta-section__body">
          Connect your feedback sources and see your first synthesized insight — evidence
          attached, no dashboard required.
        </p>
        <button type="button" className="cta-section__button">
          Explore Pulse
        </button>
      </div>
    </section>
  )
}
