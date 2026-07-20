import wordmark from '../assets/trevio-wordmark.svg'
import './Footer.css'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <img src={wordmark} alt="Trevio" width={84} height={20} />
          <p>Feedback intelligence for product teams.</p>
        </div>

        <nav className="footer__links" aria-label="Footer">
          <a href="#problem">Problem</a>
          <a href="#how">How it works</a>
          <a href="#output">Output</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
        </nav>

        <p className="footer__meta">
          Figures on this page come from a fictional sample workspace, used to show the product's output format.
        </p>
      </div>
    </footer>
  )
}
