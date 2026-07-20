import { useEffect, useRef, useState } from 'react'
import { Button } from '../vendor/meridian/meridian.js'
import wordmark from '../assets/trevio-wordmark.svg'
import './Nav.css'

const LINKS = [
  { href: '#problem', label: 'Problem' },
  { href: '#how', label: 'How it works' },
  { href: '#output', label: 'Output' },
  { href: '#pricing', label: 'Pricing' },
]

export function Nav() {
  // The bar is transparent over the hero and gains a surface once the hero
  // is behind you — a solid bar from the first pixel would cut the scene off
  // at the top for no reason.
  const [condensed, setCondensed] = useState(false)
  const [open, setOpen] = useState(false)
  const frame = useRef(0)
  // Progress is written straight to the element's transform. Routing a
  // per-frame value through state would re-render the whole bar sixty times
  // a second to move one bar by a pixel.
  const progressRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const measure = () => {
      frame.current = 0
      const scrolled = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      // Only a crossing flips state, so this re-renders twice per page, not
      // once per frame.
      setCondensed(scrolled > window.innerHeight * 0.72)
      if (progressRef.current) {
        const p = total > 0 ? Math.min(scrolled / total, 1) : 0
        progressRef.current.style.transform = `scaleX(${p})`
      }
    }
    const onScroll = () => {
      if (frame.current) return
      frame.current = requestAnimationFrame(measure)
    }
    // Frames do not run in a hidden tab, so a queued measurement can be left
    // stranded and the bar would come back stale.
    const onVisible = () => {
      if (document.visibilityState === 'visible') measure()
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  // A menu that stays open behind you after a jump is a bug users blame
  // themselves for.
  useEffect(() => {
    if (!open) return
    const close = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [open])

  return (
    <header className={`nav${condensed ? ' is-condensed' : ''}${open ? ' is-open' : ''}`}>
      <div className="nav__bar">
        <a className="nav__brand" href="#top" aria-label="Trevio — back to top">
          <img src={wordmark} alt="" width={92} height={22} />
        </a>

        <nav className="nav__links" aria-label="Sections">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setOpen(false)
              document.getElementById('cta')?.scrollIntoView()
            }}
          >
            Get early access
          </Button>
        </div>

        <button
          className="nav__toggle"
          type="button"
          aria-expanded={open}
          aria-controls="nav-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>

      <div className="nav__progress" aria-hidden="true">
        <span ref={progressRef} style={{ transform: 'scaleX(0)' }} />
      </div>

      <div className="nav__menu" id="nav-menu" hidden={!open}>
        {LINKS.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </a>
        ))}
        <Button
          variant="primary"
          size="md"
          onClick={() => {
            setOpen(false)
            document.getElementById('cta')?.scrollIntoView()
          }}
        >
          Get early access
        </Button>
      </div>
    </header>
  )
}
