const STEPS = ['swipe', 'wait', 'overanalyze', 'ask a friend', 'reread the thread', 'repeat']

export default function CycleStrip() {
  return (
    <div className="cycle-strip">
      <div className="cycle-track">
        <CycleLoop />
        <CycleLoop />
      </div>
    </div>
  )
}

function CycleLoop() {
  return (
    <span>
      {STEPS.map((step) => (
        <span key={step}>
          {step} <b>→</b>{' '}
        </span>
      ))}
    </span>
  )
}
