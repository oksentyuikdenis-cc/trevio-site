import { Nav } from './ui/Nav'
import { Stage } from './engine/Stage'
import { Hero } from './sections/Hero'
import { Chaos } from './sections/Chaos'
import { Steps } from './sections/Steps'
import { Output } from './sections/Output'
import { Comparison } from './sections/Comparison'
import { Audience } from './sections/Audience'
import { Pricing } from './sections/Pricing'
import { Faq } from './sections/Faq'
import { Cta } from './sections/Cta'
import { Footer } from './sections/Footer'
import { useReveal } from './ui/useReveal'

export function App() {
  const ref = useReveal<HTMLDivElement>()

  return (
    <div ref={ref}>
      <a className="skip-link" href="#problem">
        Skip to content
      </a>
      <Nav />
      <main>
        {/* Sections 1–3 share one sticky WebGL stage; the scene's state is
            driven by how far through them the reader has scrolled. */}
        <Stage>
          <Hero />
          <Chaos />
          <Steps />
        </Stage>

        {/* The light block: the product's output, and the case for it. */}
        <Output />
        <Comparison />

        <Audience />
        <Pricing />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </div>
  )
}
