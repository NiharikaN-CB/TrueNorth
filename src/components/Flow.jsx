import Reveal from './Reveal.jsx'

const STEPS = [
  {
    stamp: '✎',
    title: 'Write it down',
    body: 'Open TrueNorth and answer one prompt: how are you feeling? No sign-up, no setup.',
  },
  {
    stamp: '✦',
    title: 'Press Reflect',
    body: 'Your entry is sent, just this once and only with your say-so, for a gentle reading.',
  },
  {
    stamp: '◐',
    title: 'See yourself clearly',
    body: 'Your feelings, named. A few questions worth sitting with. Nothing about them, everything about you.',
  },
  {
    stamp: '☾',
    title: 'Put your phone down',
    body: "Not because it's resolved — because you understand it a little better now. That's enough for tonight.",
  },
]

export default function Flow() {
  return (
    <section className="flow">
      <div className="wrap">
        <Reveal as="div" className="section-head">
          <div className="section-eyebrow">One evening, four minutes</div>
          <h2>From unsettled to grounded.</h2>
          <p>
            The whole loop, start to finish — most people reach their first reflection in under
            two minutes.
          </p>
        </Reveal>

        <div className="flow-rail">
          <div className="flow-line" />
          <div className="flow-steps">
            {STEPS.map((step) => (
              <Reveal as="div" className="flow-step" key={step.title}>
                <div className="flow-stamp">{step.stamp}</div>
                <h4>{step.title}</h4>
                <p>{step.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
