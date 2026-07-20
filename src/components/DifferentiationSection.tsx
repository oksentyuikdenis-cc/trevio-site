import './DifferentiationSection.css'

const POINTS = [
  {
    title: 'Confidence you can check, not just trust',
    body: 'Sample size comes first — "based on 34 conversations" — before any qualitative label. Low-confidence matches route to a human review queue instead of getting auto-merged.',
  },
  {
    title: 'One synthesized story, not four hundred rows',
    body: 'Clustering, sentiment, and prioritization happen before you open the tool. What you see first is already a decision, not a list waiting to be triaged.',
  },
  {
    title: 'Built for the decision, not the dashboard',
    body: 'No streaks, no engagement gamification. Pulse is used because it saves real time — not because it manufactures a reason to log back in.',
  },
]

export function DifferentiationSection() {
  return (
    <section id="differentiation" className="differentiation">
      <div className="landing-container">
        <div className="differentiation__grid">
          <div>
            <p className="landing-eyebrow">Why not just another list</p>
            <h2 className="landing-heading">Less browsing. More deciding.</h2>
            <p className="differentiation__lead">
              Most feedback tools ask you to browse and vote on a list. Pulse's job is to make
              that browsing unnecessary — the synthesis happens before you ever open it.
            </p>
          </div>
          <ul className="differentiation__points">
            {POINTS.map((point) => (
              <li key={point.title} className="differentiation__point">
                <p className="differentiation__point-title">{point.title}</p>
                <p className="differentiation__point-body">{point.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
