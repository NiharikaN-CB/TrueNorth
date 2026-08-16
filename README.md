# TrueNorth — Landing Page (React)

A React + Vite conversion of the TrueNorth marketing landing page: "A calmer way to date."

## Getting started

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
npm run preview   # serve the production build locally
```

The production build is output to `dist/`, ready to deploy to Vercel, Netlify, or any static host.

## Project structure

```
truenorth-react/
├── index.html                 Vite entry HTML (fonts + root div)
├── src/
│   ├── main.jsx                React root/render
│   ├── App.jsx                 Composes all page sections
│   ├── App.css                 Section-level styles
│   ├── index.css               Design tokens, reset, base styles
│   ├── hooks/
│   │   └── useReveal.js        IntersectionObserver hook for scroll-reveal
│   └── components/
│       ├── Reveal.jsx          Reusable scroll-reveal wrapper
│       ├── Nav.jsx
│       ├── Hero.jsx            Signature "desk scene" illustration
│       ├── CycleStrip.jsx      Scrolling marquee of the overthinking cycle
│       ├── Reframe.jsx         "Old spiral vs. new question" cards
│       ├── Features.jsx        P0 feature grid (data-driven)
│       ├── Flow.jsx            4-step journey (write → reflect → understand → recover)
│       ├── Privacy.jsx         Local-first privacy reassurance block
│       ├── Closing.jsx         Final CTA
│       └── Footer.jsx
└── package.json
```

## Notes

- No backend or routing — this is the marketing shell only. The `Start journaling` CTAs
  scroll to the hero; they aren't wired to the actual journal app yet.
- Design tokens (colors, fonts) live in `src/index.css` under `:root` — update them there
  to restyle the whole app consistently.
- Fonts (Fraunces, Caveat, Inter) load from Google Fonts via `<link>` tags in `index.html`.
