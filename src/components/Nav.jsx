import { useJournalStore } from '../store/useJournalStore'

export default function Nav() {
  const openJournal = useJournalStore((state) => state.openJournal)
  const currentView = useJournalStore((state) => state.currentView)

  return (
    <nav className="nav">
      <div className="brand" onClick={openJournal} style={{ cursor: 'pointer' }}>
        <img className="brand-logo" src="/tn logo.jpeg" alt="TrueNorth logo" />
        <span className="brand-mark">TrueNorth</span>
        <span className="brand-tag">— a calmer way to date</span>
      </div>
      {currentView === 'landing' ? (
        <button className="nav-cta" onClick={openJournal}>
          Start journaling
        </button>
      ) : (
        <button className="nav-cta" onClick={() => useJournalStore.getState().openLanding()}>
          Home Page
        </button>
      )}
    </nav>
  )
}

