# TrueNorth Tech Stack

## Canonical Stack

| Layer | Approved technology | Source status |
|---|---|---|
| Framework | Next.js + React + App Router | Approved |
| Styling | Tailwind CSS | Approved |
| Canvas | Fabric.js | Approved |
| Client state | Zustand | Approved |
| Persistence | IndexedDB | Approved |
| IndexedDB abstraction | Lightweight wrapper such as `idb-keyval`, or an appropriate minimal Zustand persistence approach | Choose one during implementation |
| AI endpoint | Next.js server-side API route `/api/reflect` | Approved |
| AI provider | Verified free-tier provider | Must be selected at implementation time |
| Hosting | Vercel free tier | Approved |
| Repository | GitHub | Approved |
| Export | html2canvas + jsPDF | Nice-to-have / only if time allows |
| Language | TypeScript | Required by architecture/data-model guidance |

## Version Policy

The Technical Design does not pin exact dependency versions. Do not invent them.

During Foundation:

1. Initialize the project using the current stable project setup appropriate for the approved stack.
2. Record the actual installed versions in `package.json`.
3. Keep those versions stable during MVP development unless a dependency issue requires a deliberate change.
4. Before upgrading a major dependency, read release notes, create a branch/checkpoint, run tests, and manually verify the core journey.

## Architecture

```text
Browser UI
   │
   ├── Next.js + React
   ├── Tailwind CSS
   └── Fabric.js
          │
          ▼
      Zustand
       /     \
      ▼       ▼
 IndexedDB  UI state
      │
      │ explicit "Reflect"
      ▼
 /api/reflect
      │
      ▼
Free AI Provider
      │
      ▼
Validated structured reflection
      │
      ▼
Browser → local storage
```

The server is an AI boundary, not a journal database.

## Project Structure

```text
truenorth/
├── app/
│   ├── page.tsx
│   ├── journal/
│   │   └── page.tsx
│   ├── patterns/
│   │   └── page.tsx
│   ├── api/
│   │   └── reflect/
│   │       └── route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── landing/
│   ├── journal/
│   │   ├── JournalCanvas.tsx
│   │   ├── JournalToolbar.tsx
│   │   ├── PageNavigation.tsx
│   │   ├── AutosaveIndicator.tsx
│   │   ├── StickerPicker.tsx
│   │   └── Checklist.tsx
│   ├── reflection/
│   │   ├── ReflectionPanel.tsx
│   │   ├── ReflectionSection.tsx
│   │   ├── EmotionTags.tsx
│   │   └── RedFlagObservation.tsx
│   └── shared/
├── lib/
│   ├── storage/
│   │   ├── journal-storage.ts
│   │   └── storage-types.ts
│   ├── canvas/
│   │   ├── fabric-config.ts
│   │   └── canvas-utils.ts
│   ├── ai/
│   │   ├── prompt.ts
│   │   ├── schema.ts
│   │   └── provider.ts
│   └── patterns/
│       └── pattern-utils.ts
├── types/
│   ├── journal.ts
│   ├── reflection.ts
│   └── canvas.ts
├── public/
│   ├── stickers/
│   ├── textures/
│   └── images/
├── docs/
├── .env.local
├── .env.example
├── README.md
├── AGENTS.md
└── package.json
```

## Data Model

### Journal

- `id`
- `version`
- `createdAt`
- `updatedAt`
- `pages[]`

### JournalPage

- `id`
- `journalId`
- `pageNumber`
- `createdAt`
- `updatedAt`
- `background`
- `canvasState`
- `reflection`
- `checklistItems`
- `metadata`

### CanvasState

Fabric.js should serialize the canvas into JSON:

- `version`
- `objects[]`
- `background`

Do not manually reconstruct every Fabric object if Fabric serialization can preserve the state.

### Reflection

- `generatedAt`
- `summary`
- `emotions[]`
- `gentleReflection`
- `questions[]`
- `recoverySuggestion`
- `patternObservation`
- `redFlags[]`

Each red flag contains:

- `observation`
- `reason`

### PatternMetadata

- `emotion`
- `theme`
- `occurrenceCount`
- `sourceEntryIds[]`
- `lastObservedAt`

Store only the minimum metadata required for local pattern observations.

## AI Response Contract

```ts
type Reflection = {
  summary: string
  emotions: string[]
  gentleReflection: string
  questions: string[]
  recoverySuggestion: string
  patternObservation: string | null
  redFlags: Array<{
    observation: string
    reason: string
  }>
}
```

Validate this response before displaying it.

## Visual Tokens

- Gold Pink: `#F7D7CD`
- Berry Blush: `#D79B95`
- Pastel Maroon: `#984343`
- Cherub: `#91BDC2`
- Cashmere: `#F1E4D9`

Visual direction: feminine, elegant, nostalgic, personal; rosy seaside sunset; handmade digital scrapbook/planner.

## Setup & Commands

The source documents do not prescribe exact CLI commands. Use the generated project's actual package scripts and record them in `AGENTS.md`.

Expected baseline:

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
```

Do not claim a command exists until it is present in `package.json`.

## Canonical Code Example: Client/Server Privacy Boundary

```ts
// Client-side: only send text after an explicit Reflect action.
// Never place the provider API key in this file.
const response = await fetch("/api/reflect", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text: currentEntryText }),
})
```

```ts
// Server-side: the provider secret stays on the server.
// Validate input before calling the provider.
export async function POST(request: Request) {
  const body = await request.json()
  // validate body.text and request size before provider call
  // call the provider using a server-side environment variable
  // validate structured output before returning it
}
```

## Canonical Code Example: Fabric Isolation

```tsx
// JournalCanvas owns the Fabric instance.
// Other components should communicate through application state.
export function JournalCanvas() {
  // initialize Fabric here
  // attach drawing/text/erase behavior here
  // serialize canvas changes into application state
  // clean up the Fabric instance on unmount
  return <div aria-label="Journal canvas" />
}
```

The exact implementation should follow the installed Fabric.js API and remain isolated.

## Dependency Governance

Do not introduce a library merely because an AI agent suggests it. First check whether the approved stack already solves the problem.

If a new dependency is genuinely necessary:

1. Explain why.
2. Check compatibility with the architecture.
3. Prefer maintained, lightweight packages.
4. Add it deliberately.
5. Test the affected flow.
