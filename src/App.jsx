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
import './App.css'

export default function App() {
  const currentView = useJournalStore((state) => state.currentView)

  if (currentView === 'journal') {
    return <JournalWorkspace />
  }

  return (
    <div className="landing-shell">
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

