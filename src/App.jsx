import { useJournalStore } from './store/useJournalStore'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import CycleStrip from './components/CycleStrip.jsx'
import Reframe from './components/Reframe.jsx'
import Features from './components/Features.jsx'
import Flow from './components/Flow.jsx'
import Privacy from './components/Privacy.jsx'
import Closing from './components/Closing.jsx'
import Footer from './components/Footer.jsx'
import JournalWorkspace from './components/journal/JournalWorkspace.jsx'
import GradientWaves from './components/ui/GradientWaves-JS-CSS.jsx'
import './App.css'

export default function App() {
  const currentView = useJournalStore((state) => state.currentView)

  if (currentView === 'journal') {
    return <JournalWorkspace />
  }

  return (
    <div className="landing-shell">
      <div className="landing-waves" aria-hidden="true">
        <GradientWaves
          horizonColor="#E8D8D2"
          waveColor="#C98F9A"
          crestColor="#F8F1EA"
          speed={0.25}
          amplitude={2.2}
          waveScale={0.6}
          waveRatio={0.85}
          swell={28.5}
          turbulence={10.5}
          tilt={1.05}
          zoom={1}
          height={5.5}
          fogDepth={15}
          detail="medium"
          brightness={0.9}
          opacity={0.25}
          grain
          grainIntensity={0.13}
          mouseInteraction
          parallaxStrength={0.59}
        />
      </div>

      <div className="landing-content">
        <Nav />
        <Hero />
        <CycleStrip />
        <Reframe />
        <Features />
        <Flow />
        <Privacy />
        <Closing />
        <Footer />
      </div>
    </div>
  )
}

