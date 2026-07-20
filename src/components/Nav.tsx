import { useEffect, useState } from 'react'
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

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      {open ? (
        <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      ) : (
        <path
          d="M3 6H17M3 10H17M3 14H17"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      )}
    </svg>
  )
}

const LINKS = [
  { href: '#capabilities', label: 'How it works' },
  { href: '#showcase', label: 'Product' },
  { href: '#differentiation', label: 'Why Pulse' },
]

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)

  // A resize past the mobile breakpoint (e.g. rotating a phone to landscape,
  // or a tablet in a split-view app switching width) should not leave the
  // drawer stranded open with no way to see the now-visible desktop links.
  useEffect(() => {
    if (!menuOpen) return

    const mq = window.matchMedia('(min-width: 769px)')
    const handleChange = () => setMenuOpen(false)
    mq.addEventListener('change', handleChange)
    return () => mq.removeEventListener('change', handleChange)
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [menuOpen])

  return (
    <header className="nav">
      <a className="nav__brand" href="#top">
        <SignalMark />
        Pulse
      </a>
      <nav className="nav__links" aria-label="Primary">
        {LINKS.map((link) => (
          <a key={link.href} className="nav__link" href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
      <div className="nav__actions">
        <button type="button" className="nav__cta">
          Explore Pulse
        </button>
        <button
          type="button"
          className="nav__menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <MenuIcon open={menuOpen} />
        </button>
      </div>
      <nav
        id="mobile-nav-menu"
        className="nav__mobile-menu"
        data-open={menuOpen}
        aria-label="Primary"
        aria-hidden={!menuOpen}
      >
        {LINKS.map((link) => (
          <a
            key={link.href}
            className="nav__mobile-link"
            href={link.href}
            tabIndex={menuOpen ? 0 : -1}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
