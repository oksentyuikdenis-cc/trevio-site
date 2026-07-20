import { Button } from '../vendor/meridian/meridian.js'
import { PILOT, PRICING_MODEL } from '../data/content'
import './Pricing.css'

export function Pricing() {
  return (
    <section className="section pricing" id="pricing">
      <div className="container">
        <div className="section-head">
          <p className="overline reveal">Pricing</p>
          <h2 className="h2 reveal">Nothing to pay yet, and a model we can defend.</h2>
          <p className="prose reveal">
            We have not priced this, because nobody has used it long enough for a number to mean anything. What we
            have decided is what the number will be based on — and that turns out to be the part worth arguing
            about.
          </p>
        </div>

        <div className="pricing__layout">
          <article className="pilot reveal">
            <span className="pilot__flag">Open now · {PILOT.slots} slots</span>
            <h3 className="pilot__title">{PILOT.headline}</h3>
            <p className="pilot__body">{PILOT.body}</p>

            <div className="pilot__terms">
              <div>
                <p className="pilot__terms-label">You get</p>
                <ul>
                  {PILOT.gives.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="pilot__terms-label">We ask</p>
                <ul>
                  {PILOT.asks.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={() => document.getElementById('cta')?.scrollIntoView()}
            >
              Apply as a design partner
            </Button>
          </article>

          <aside className="model reveal">
            <p className="model__label">What we will charge on</p>
            <ul className="model__list">
              {PRICING_MODEL.charges.map((item) => (
                <li key={item.label}>
                  <span className="model__item">{item.label}</span>
                  <span className="model__note">{item.note}</span>
                </li>
              ))}
            </ul>

            <p className="model__label model__label--never">What we will never charge on</p>
            <ul className="model__list model__list--never">
              {PRICING_MODEL.never.map((item) => (
                <li key={item.label}>
                  <span className="model__item">{item.label}</span>
                  <span className="model__note">{item.note}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>

        <p className="pricing__note reveal">
          The numbers get set with the pilot teams, against what this work costs them today — not against a
          competitor's price sheet.
        </p>
      </div>
    </section>
  )
}
