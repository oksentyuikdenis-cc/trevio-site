import { Nav } from './components/Nav'
import { HeroSection } from './components/HeroSection'
import { ProblemSection } from './components/ProblemSection'
import { CapabilitiesSection } from './components/CapabilitiesSection'
import { ShowcaseSection } from './components/ShowcaseSection'
import { DifferentiationSection } from './components/DifferentiationSection'
import { CtaSection } from './components/CtaSection'
import { Footer } from './components/Footer'

function App() {
  return (
    <div className="pulse-root page">
      <Nav />
      <main>
        <HeroSection />
        <ProblemSection />
        <CapabilitiesSection />
        <ShowcaseSection />
        <DifferentiationSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}

export default App
