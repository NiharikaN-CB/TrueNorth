import Reveal from './Reveal.jsx'

export default function Reframe() {
  return (
    <section className="reframe">
      <div className="wrap">
        <Reveal as="div" className="section-head">
          <div className="section-eyebrow">The shift</div>
          <h2>
            Stop decoding them.
            <br />
            Start understanding you.
          </h2>
          <p>
            Most nights end with the same question, aimed the wrong direction. TrueNorth points
            it back where it belongs.
          </p>
        </Reveal>

        <div className="reframe-grid">
          <Reveal as="div" className="reframe-card old">
            <div className="label">The usual spiral</div>
            <q>"What does this mean? Why did they say it like that? Am I overreacting?"</q>
          </Reveal>
          <Reveal as="div" className="reframe-card new">
            <div className="label">With TrueNorth</div>
            <q>"What did I actually feel tonight — and what does that tell me about what I need?"</q>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
