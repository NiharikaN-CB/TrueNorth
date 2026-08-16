import Reveal from './Reveal.jsx'

export default function Closing() {
  return (
    <section className="closing">
      <div className="wrap">
        <Reveal as="span" className="script">
          write it. feel it. put it down.
        </Reveal>
        <Reveal as="h2">Your next entry is one tap away.</Reveal>
        <Reveal as="a" href="#start" className="btn-primary">
          Start journaling — it's free
        </Reveal>
        <Reveal as="p" className="hero-note">
          Takes less than two minutes. Nothing to install, nothing to remember a password for.
        </Reveal>
      </div>
    </section>
  )
}
