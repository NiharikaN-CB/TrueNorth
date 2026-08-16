import Reveal from './Reveal.jsx'

const FEATURES = [
  {
    icon: '✎',
    bg: 'var(--gold-pink)',
    color: 'inherit',
    title: 'Write, draw, decorate',
    body: 'A tactile canvas with pen, text, and eraser tools on dotted paper — it feels like a notebook, not a form.',
  },
  {
    icon: '✦',
    bg: 'var(--berry)',
    color: '#fff',
    title: 'Gentle AI reflection',
    body: 'Press Reflect and receive a summary, your emotions named, a few open questions, and a small suggestion — never advice about what to do.',
  },
  {
    icon: '◐',
    bg: 'var(--cherub)',
    color: 'inherit',
    title: 'Patterns, over time',
    body: '"You\u2019ve mentioned feeling unsettled in several recent entries." Quiet observations, never diagnoses.',
  },
  {
    icon: '⌕',
    bg: 'var(--maroon)',
    color: 'var(--cashmere)',
    title: 'Something worth noticing',
    body: 'When your own words describe pressure or disregard, TrueNorth notices gently — and leaves the conclusion to you.',
  },
  {
    icon: '☑',
    bg: 'var(--gold-pink)',
    color: 'inherit',
    title: 'Optional checklists',
    body: 'How am I feeling? What do I need right now? Light structure for the nights a blank page feels like too much.',
  },
  {
    icon: '🎀',
    bg: 'var(--berry)',
    color: '#fff',
    title: 'Stickers & scrapbook details',
    body: 'Roses, shells, washi tape, torn-paper edges — small, curated ways to make each page feel like yours, not a dashboard.',
    wide: true,
  },
]

export default function Features() {
  return (
    <section className="features">
      <div className="wrap">
        <Reveal as="div" className="section-head">
          <div className="section-eyebrow">Inside the journal</div>
          <h2>A notebook that reflects back.</h2>
          <p>
            Every part of TrueNorth is built for one thing: getting you from "I can't stop
            thinking about this" to "I understand myself a little better," as gently as possible.
          </p>
        </Reveal>

        <div className="feature-grid">
          {FEATURES.map((f) => (
            <Reveal
              key={f.title}
              as="div"
              className={`feature-card${f.wide ? ' wide' : ''}`}
            >
              <div className="icon" style={{ background: f.bg, color: f.color }}>
                {f.icon}
              </div>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
