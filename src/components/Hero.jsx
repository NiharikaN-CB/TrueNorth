import Reveal from './Reveal.jsx'
import { useJournalStore } from '../store/useJournalStore'

export default function Hero() {
  const openJournal = useJournalStore((state) => state.openJournal)

  return (
    <section className="hero" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Subtle beach video background loop placeholder */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          opacity: 0.15,
          pointerEvents: 'none',
        }}
      >
        <source src="/hero-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="wrap hero-grid" style={{ position: 'relative', zIndex: 1 }}>
        <div>
          <div className="eyebrow">Private &amp; local, always</div>
          <h1>
            A calmer<br />way to <em>date.</em>
          </h1>
          <p className="lede">
            Somewhere between the last text and the overthinking, there's a quieter question
            worth asking: not what they meant, but how you feel. TrueNorth is a private journal
            that helps you find out.
          </p>
          <div className="hero-ctas">
            <button onClick={openJournal} className="btn-primary" id="start">
              Start journaling — it's free
            </button>
          </div>
          <p className="hero-note" style={{ marginTop: '20px' }}>
            No account. No cloud. <b>Everything stays on your device</b> until you choose to reflect.
          </p>
        </div>

        <Reveal className="desk">
          <div className="tape t1" />
          <div className="journal-page">
            <div className="date">Tuesday, 9:47 PM</div>
            <div className="prompt">How are you feeling?</div>
            <div className="handwriting">
              He said he'd text after work... it's been six hours. I keep re-reading the last
              message like it'll say something new.
            </div>
            <div className="tape t2" />
          </div>
          <div className="sticker s1">🐚</div>
          <div className="sticker s2">🌹</div>
          <div className="reflect-card">
            <div className="mark">Gentle reflection</div>
            <p>
              It sounds like the silence is doing more talking than he is — and that's left you
              feeling unsettled and a little small.
            </p>
            <div className="chips">
              <span className="chip">uneasy</span>
              <span className="chip">waiting</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
