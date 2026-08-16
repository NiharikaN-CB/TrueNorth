import Reveal from './Reveal.jsx'

const POINTS = [
  'Everything is stored locally, on your device, in your browser — never in the cloud.',
  'The AI only sees a page when you press Reflect. Nothing is sent automatically.',
  'Your journal is never used to train anything, sold, or shared.',
  'Delete any entry, or your entire journal, at any time — permanently.',
]

export default function Privacy() {
  return (
    <section className="privacy">
      <div className="wrap">
        <Reveal as="div" className="privacy-box">
          <div className="privacy-copy">
            <h2>Your journal is yours. Full stop.</h2>
            <p>
              No servers hold onto what you write. No account means no record tied to your name.
              The only thing that ever leaves your device is the entry you choose to reflect on —
              and even then, it's never saved.
            </p>
          </div>
          <ul className="privacy-list">
            {POINTS.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
