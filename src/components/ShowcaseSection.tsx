import './ShowcaseSection.css'

const EVIDENCE = [
  {
    initials: 'MK',
    quote: 'Checkout just spins and then logs me out. Tried three times.',
    source: 'Zendesk · Acme Corp',
  },
  {
    initials: 'RT',
    quote: 'Payment confirmation never loads on my saved card.',
    source: 'Intercom · Northwind',
  },
  {
    initials: 'JL',
    quote: 'Had to switch to a new card mid-checkout to get it to go through.',
    source: 'Call transcript · Vantage',
  },
]

export function ShowcaseSection() {
  return (
    <section id="showcase" className="showcase">
      <div className="landing-container">
        <div className="showcase__head">
          <p className="landing-eyebrow">See the receipts</p>
          <h2 className="landing-heading">Every claim, traceable to the conversation it came from.</h2>
          <p className="showcase__lead">
            An AI Insight Card never ships without its evidence attached. This is the actual
            component the product uses — not a mockup redrawn for marketing.
          </p>
        </div>

        <div className="showcase__card-wrap">
          <div className="pulse-insight-card">
            <div className="pulse-insight-card__head">
              <h3 className="pulse-insight-card__title">
                Mobile checkout failures spiking among Enterprise accounts
              </h3>
              <span className="pulse-ai-badge">
                <span className="pulse-ai-badge__spark" aria-hidden="true" />
                Generated
              </span>
            </div>
            <div className="pulse-insight-card__scope">
              Based on 34 conversations across 19 customers · Last 14 days
            </div>
            <p className="pulse-insight-card__body">
              Enterprise customers on iOS 17 are hitting a payment-confirmation timeout during
              checkout, most consistently when a saved card is used for the first time. The
              pattern started after last Tuesday's release and has grown 3.2× since.
            </p>
            <div className="pulse-insight-card__impact">
              <span>
                <strong>$84.2K ARR</strong> at risk
              </span>
              <span>
                <strong>12</strong> Enterprise accounts
              </span>
              <span>
                <strong>↑ 3.2×</strong> vs. last month
              </span>
            </div>
            <div className="pulse-insight-card__evidence">
              {EVIDENCE.map((chip) => (
                <div key={chip.initials} className="pulse-evidence-chip">
                  <span className="pulse-avatar" role="img" aria-label={chip.initials}>
                    {chip.initials}
                  </span>
                  <span>
                    "{chip.quote}"
                    <span className="pulse-evidence-chip__source">— {chip.source}</span>
                  </span>
                </div>
              ))}
            </div>
            <div className="pulse-insight-card__actions">
              <span className="pulse-btn pulse-btn--secondary">Mark as duplicate</span>
              <span className="pulse-btn pulse-btn--primary">Add to roadmap</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
