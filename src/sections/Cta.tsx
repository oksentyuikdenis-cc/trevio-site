import { useState } from 'react'
import { Button } from '../vendor/meridian/meridian.js'
import './Cta.css'

const CONTACT = 'hello@trevio.app'

/**
 * There is no backend behind this page, so the form composes a real mail
 * rather than pretending to submit and showing a success message it cannot
 * honour. A fake "thanks, we'll be in touch" on a page whose whole argument
 * is evidence and traceability would be the wrong first impression.
 *
 * The QR code that used to sit here was generated against the published URL
 * before this rebuild, so until the new site is actually deployed it walks a
 * scanner from this page to the previous one. Regenerate and reinstate it
 * once the deploy has landed and the URL is confirmed.
 */
export function Cta() {
  const [email, setEmail] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent('Trevio early access')
    const body = encodeURIComponent(
      `Hi — I'd like early access to Trevio.\n\nWork email: ${email}\nCompany:\nWhere our feedback lives today:\n`,
    )
    window.location.href = `mailto:${CONTACT}?subject=${subject}&body=${body}`
  }

  return (
    <section className="section cta" id="cta">
      <div className="container cta__inner">
        <div className="cta__lead">
          <h2 className="h2 reveal">Find out what your customers have been telling you.</h2>
          <p className="prose reveal">
            Early access is running with a small number of teams. Connect one source, and you will see your first
            ranked themes in the same session.
          </p>
        </div>

        <form className="cta__form reveal" onSubmit={submit}>
          <label className="cta__label" htmlFor="cta-email">
            Work email
          </label>
          <div className="cta__row">
            <input
              id="cta-email"
              className="cta__input"
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button variant="primary" size="lg" type="submit">
              Request access
            </Button>
          </div>
          <p className="cta__hint">
            Opens your mail client — no list, no drip sequence. Or write to{' '}
            <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
          </p>
        </form>
      </div>
    </section>
  )
}
