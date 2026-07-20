import { ICP } from '../data/content'
import './Audience.css'

export function Audience() {
  return (
    <section className="section audience" id="who">
      <div className="container">
        <div className="section-head">
          <p className="overline reveal">Who this is for</p>
          <h2 className="h2 reveal">Built for one situation, and honest about the rest.</h2>
        </div>

        <div className="audience__grid">
          <div className="audience__fits">
            {ICP.fits.map((fit, i) => (
              <article
                className="audience__fit reveal"
                key={fit.title}
                style={{ '--reveal-delay': `${i * 80}ms` } as React.CSSProperties}
              >
                <h3 className="h3">{fit.title}</h3>
                <p>{fit.body}</p>
              </article>
            ))}
          </div>

          {/* Saying who it is not for costs a little reach and buys a lot of
              credibility — a page that claims to fit everyone fits nobody. */}
          <aside className="audience__misfits reveal">
            <h3 className="audience__misfits-title">Probably not you if</h3>
            <ul>
              {ICP.misfits.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  )
}
