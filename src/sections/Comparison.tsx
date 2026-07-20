import { COMPARISON } from '../data/content'
import './Comparison.css'

export function Comparison() {
  return (
    <section className="section surface-light comparison" id="comparison">
      <div className="container">
        <div className="section-head">
          <p className="overline reveal">Against doing it by hand</p>
          <h2 className="h2 reveal">Most teams already do this. Once a quarter, badly.</h2>
          <p className="prose reveal">
            Someone exports the tickets, skims the reviews, and writes a deck. It takes a week, it covers two
            channels out of nine, and by the time it is presented the data is a month old.
          </p>
        </div>

        <table className="comparison__table reveal">
          <caption className="comparison__caption">
            Manual feedback review compared with Trevio, on a team of the size described below.
          </caption>
          <thead>
            <tr>
              <th scope="col">&nbsp;</th>
              <th scope="col">By hand</th>
              <th scope="col">With Trevio</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON.map((row) => (
              <tr key={row.metric}>
                <th scope="row">
                  <span className="comparison__metric">{row.metric}</span>
                  <span className="comparison__note">{row.note}</span>
                </th>
                <td className="comparison__manual">{row.manual}</td>
                <td className="comparison__trevio">{row.trevio}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
