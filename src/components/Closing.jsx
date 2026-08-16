import Reveal from './Reveal.jsx'
import { useJournalStore } from '../store/useJournalStore'

export default function Closing() {
  const openJournal = useJournalStore((state) => state.openJournal)

  return (
    <section className="closing">
      <div className="wrap">
        <Reveal as="span" className="script">
          write it. feel it. put it down.
        </Reveal>
        <Reveal as="h2">Your next entry is one tap away.</Reveal>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
          <button onClick={openJournal} className="btn-primary">
            Start journaling — it's free
          </button>
        </div>
        <Reveal as="p" className="hero-note">
          Takes less than two minutes. Nothing to install, nothing to remember a password for.
        </Reveal>
      </div>
    </section>
  )
}
