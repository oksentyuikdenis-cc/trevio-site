import { STEPS } from '../data/content'
import { CLUSTERS, LONG_TAIL_SHARE } from '../data/clusters'
import './Steps.css'

export function Steps() {
  return (
    <section className="section steps" id="how">
      <div className="container">
        <div className="section-head">
          <p className="overline reveal">How it works</p>
          <h2 className="h2 reveal">Three steps, and the last one is the point.</h2>
          <p className="prose reveal">
            Collecting feedback is a solved problem — most teams already have too much of it. What is missing is
            everything that happens after collection.
          </p>
        </div>

        <ol className="steps__list">
          {STEPS.map((step, i) => (
            <li
              className="step reveal"
              key={step.index}
              style={{ '--reveal-delay': `${i * 90}ms` } as React.CSSProperties}
            >
              <div className="step__meta">
                <span className="step__index num">{step.index}</span>
                <span className="step__label">{step.label}</span>
              </div>
              <h3 className="h3 step__title">{step.title}</h3>
              <p className="step__body">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="steps__ledger reveal">
          <p className="steps__ledger-title">
            What the scene behind this is doing, in numbers
          </p>
          <ul className="steps__ledger-list">
            {CLUSTERS.map((c) => (
              <li key={c.id} className={c.promoted ? 'is-promoted' : undefined}>
                <span className="steps__ledger-label">{c.label}</span>
                <span className="steps__ledger-weight num">{Math.round(c.weight * 100)}%</span>
                <span className="steps__ledger-state">{c.promoted ? 'Surfaced' : 'Held'}</span>
              </li>
            ))}
            <li className="is-tail">
              <span className="steps__ledger-label">No pattern found</span>
              <span className="steps__ledger-weight num">{Math.round(LONG_TAIL_SHARE * 100)}%</span>
              <span className="steps__ledger-state">Searchable</span>
            </li>
          </ul>
          <p className="steps__ledger-note">
            Six themes, three surfaced. A tool that promises to turn all of your feedback into neat categories is
            describing a tidier world than the one your customers live in.
          </p>
        </div>
      </div>
    </section>
  )
}
