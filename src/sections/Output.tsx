import { useState } from 'react'
import { AIInsightCard } from '../vendor/meridian/meridian.js'
import { INSIGHTS } from '../data/clusters'
import './Output.css'

/**
 * The product's actual output, rendered with the product's actual component
 * rather than a marketing redraw of it. On the light surface, because this is
 * the moment the page stops being a pitch and starts being a document.
 */
export function Output() {
  const [active, setActive] = useState(0)
  const insight = INSIGHTS[active]

  return (
    <section className="section surface-light output" id="output">
      <div className="container">
        <div className="section-head">
          <p className="overline reveal">What you actually get</p>
          <h2 className="h2 reveal">Three decisions. Each one showing its work.</h2>
          <p className="prose reveal">
            Not a dashboard of raw comments to go read. A short written claim, the numbers behind it, and the
            conversations that produced it — attached, not linked to somewhere you will never click.
          </p>
        </div>

        <div className="output__layout">
        <div
          className="output__tabs reveal"
          role="tablist"
          aria-label="Insights"
          aria-orientation="vertical"
        >
          <p className="output__tabs-title">This week's three</p>
          {INSIGHTS.map((item, i) => (
            <button
              key={item.id}
              role="tab"
              type="button"
              id={`insight-tab-${item.id}`}
              aria-selected={i === active}
              aria-controls={`insight-panel-${item.id}`}
              tabIndex={i === active ? 0 : -1}
              className={`output__tab${i === active ? ' is-active' : ''}`}
              onClick={() => setActive(i)}
              onKeyDown={(e) => {
                // Roving focus. The list is vertical at desktop width and
                // horizontal once it collapses, so both axes are accepted
                // rather than betting on which one the user will try.
                const forward = e.key === 'ArrowDown' || e.key === 'ArrowRight'
                const back = e.key === 'ArrowUp' || e.key === 'ArrowLeft'
                if (!forward && !back) return
                e.preventDefault()
                const next = forward
                  ? (i + 1) % INSIGHTS.length
                  : (i - 1 + INSIGHTS.length) % INSIGHTS.length
                setActive(next)
                document.getElementById(`insight-tab-${INSIGHTS[next].id}`)?.focus()
              }}
            >
              <span className="output__tab-index num">{String(i + 1).padStart(2, '0')}</span>
              <span className="output__tab-label">{item.title}</span>
            </button>
          ))}
        </div>

        <div
          className="output__panel reveal"
          role="tabpanel"
          id={`insight-panel-${insight.id}`}
          aria-labelledby={`insight-tab-${insight.id}`}
        >
          <AIInsightCard
            title={insight.title}
            scope={insight.scope}
            summary={insight.summary}
            impact={[...insight.impact]}
            evidence={insight.evidence.map((e) => ({ ...e }))}
          />
        </div>
        </div>

        <p className="output__note reveal">
          Sample data from a fictional workspace. The component is the one the product ships.
        </p>
      </div>
    </section>
  )
}
