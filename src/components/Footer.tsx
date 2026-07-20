import './Footer.css'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="landing-container footer__inner">
        <a className="footer__brand" href="#top">
          Pulse
        </a>
        <nav className="footer__links" aria-label="Footer">
          <a className="footer__link" href="#capabilities">
            How it works
          </a>
          <a className="footer__link" href="#showcase">
            Product
          </a>
          <a className="footer__link" href="#differentiation">
            Why Pulse
          </a>
        </nav>
        <span className="footer__copyright">© {year} Pulse. Feedback intelligence, not another dashboard.</span>
      </div>
    </footer>
  )
}
