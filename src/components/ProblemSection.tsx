import './ProblemSection.css'

export function ProblemSection() {
  return (
    <section className="problem">
      <div className="landing-container problem__inner">
        <p className="landing-eyebrow">The problem</p>
        <h2 className="landing-heading">Your customers are already telling you what to build.</h2>
        <p className="problem__lead">
          It's just scattered across four hundred support tickets, a dozen App Store reviews,
          three sales call transcripts, and a Slack channel nobody has time to read. By the time a
          pattern is obvious enough for a human to notice, you've usually already shipped past it.
        </p>
      </div>
    </section>
  )
}
