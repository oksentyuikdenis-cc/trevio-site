import './CapabilitiesSection.css'

const CAPABILITIES = [
  {
    index: '01',
    label: 'The wire',
    title: 'Every channel, one inbox',
    body: 'Tickets, App Store reviews, sales call transcripts, and Slack mentions arrive in one place as they happen — no manual tagging, no channel anyone forgot to check.',
  },
  {
    index: '02',
    label: 'The desk',
    title: 'Clustering and sentiment, done for you',
    body: 'Related mentions are grouped into one story before you ever see them. Duplicate reports don’t just look duplicate — they’re merged automatically.',
  },
  {
    index: '03',
    label: 'The front page',
    title: 'Insights that show their sources',
    body: 'Every conclusion ships with the conversations it came from attached. If you can’t see the evidence, it isn’t an insight yet — it’s a guess.',
  },
]

export function CapabilitiesSection() {
  return (
    <section id="capabilities" className="capabilities">
      <div className="landing-container">
        <div className="capabilities__head">
          <p className="landing-eyebrow">How Pulse works</p>
          <h2 className="landing-heading">From raw signal to a decision, in three steps.</h2>
        </div>
        <div className="capabilities__grid">
          {CAPABILITIES.map((item) => (
            <article key={item.index} className="capability-card">
              <p className="capability-card__index">{item.index}</p>
              <p className="capability-card__label">{item.label}</p>
              <h3 className="capability-card__title">{item.title}</h3>
              <p className="capability-card__body">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
