import { FAQ } from '../data/content'
import './Faq.css'

/**
 * Native <details>, deliberately. It is keyboard operable, announced
 * correctly, searchable by the browser's find-in-page, and works with no
 * JavaScript at all — none of which a hand-rolled accordion gets for free.
 */
export function Faq() {
  return (
    <section className="section faq" id="faq">
      <div className="container">
        <div className="section-head">
          <p className="overline reveal">Objections</p>
          <h2 className="h2 reveal">The questions people actually ask.</h2>
        </div>

        <div className="faq__list">
          {FAQ.map((item, i) => (
            <details
              className="faq__item reveal"
              key={item.q}
              style={{ '--reveal-delay': `${Math.min(i, 4) * 60}ms` } as React.CSSProperties}
            >
              <summary className="faq__q">
                <span>{item.q}</span>
                <span className="faq__marker" aria-hidden="true" />
              </summary>
              <p className="faq__a">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
