import './Nav.css'

function SignalMark() {
  return (
    <svg className="nav__mark" width="22" height="22" viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="7" fill="#0A0A0C" />
      <circle cx="19" cy="15" r="5.5" fill="#E8A33D" />
      <circle cx="8" cy="9" r="1.3" fill="#5C5C66" />
      <circle cx="6" cy="21" r="1" fill="#5C5C66" />
      <circle cx="11" cy="24" r="1.4" fill="#5C5C66" />
      <circle cx="25" cy="24" r="1" fill="#5C5C66" />
    </svg>
  )
}

export function Nav() {
  return (
    <header className="nav">
      <a className="nav__brand" href="#top">
        <SignalMark />
        Pulse
      </a>
      <nav className="nav__links" aria-label="Primary">
        <a className="nav__link" href="#capabilities">
          How it works
        </a>
        <a className="nav__link" href="#showcase">
          Product
        </a>
        <a className="nav__link" href="#differentiation">
          Why Pulse
        </a>
      </nav>
      <div className="nav__actions">
        <button type="button" className="nav__cta">
          Explore Pulse
        </button>
      </div>
    </header>
  )
}
