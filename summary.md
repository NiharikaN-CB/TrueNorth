# TrueNorth Project Progress Summary

This file tracks the active roadmaps, technical achievements, and completed features for **TrueNorth**—"A calmer way to date."

---

## 🏗️ Completed Milestones

### Phase 1 — Foundation
*   **Environment Setup:** Configured Node.js LTS `v24.19.0` and NPM `v11.17.0`.
*   **Project Bootstrapped:** Next.js App Router `v16.3.1` initialized with TypeScript.
*   **Theme and Styles:** Configured Tailwind CSS v4 custom tokens (`gold-pink`, `berry-blush`, `pastel-maroon`, `cherub`, `cashmere`) and Google serif/sans fonts (`Playfair Display`, `Inter`).
*   **Landing Page (`src/app/page.tsx`):** Scrapbook-styled home portal containing accurate device-local privacy statements.
*   **Journal Shell (`src/app/journal/page.tsx`):** Responsive double-page notebook layout mockup.
*   **Version Control:** Set up `.gitignore` and pushed changes to remote repository: [TrueNorth Github](https://github.com/NiharikaN-CB/TrueNorth).

### Phase 2.1 — Fabric.js Setup & Integration
*   **Dependencies:** Installed `fabric` (`v7.4.0`).
*   **Isolated Component:** Created [JournalCanvas.tsx](file:///c:/Users/komal/Documents/MY%20CODES/@Projects/TrueNorth-Part4/src/components/journal/JournalCanvas.tsx) to host drawing paths and manage window resize listeners.
*   **SSR Safety:** Imported the canvas dynamically with `{ ssr: false }` inside [src/app/journal/page.tsx](file:///c:/Users/komal/Documents/MY%20CODES/@Projects/TrueNorth-Part4/src/app/journal/page.tsx) to bypass Node.js server pre-rendering.
*   **Cleanup Handler:** Implemented native `.dispose()` unmount hooks to prevent canvas duplicates.

### Phase 2.2 — Journal Tools
*   **Canvas Refactoring:** Wrapped `JournalCanvas` with `React.forwardRef` and `useImperativeHandle` to support parent-ref commands.
*   **Active Tool Switching:** Added dynamic properties changes (toggling pencil brushes, selection properties, and target selectors) responding to pen, text, and eraser modes.
*   **Interactive Text:** Implemented text placing on canvas empty space click, creating editable `IText` objects styled in Playfair Display serif.
*   **Eraser Tool:** Implemented click-to-delete events for easy item removal.
*   **Keyboard Deletion:** Configured window listeners for `Delete` / `Backspace` keypresses to discard active objects.
*   **Undo & Redo History:** Created local history stacks (`historyStack`, `historyIndex`) to restore states asynchronously using `loadFromJSON()`.
*   **Duplicate Event Guards:** Configured history event listeners to filter duplicate states (e.g. ignoring path additions from pen strokes and guarding restoration events during undo/redo actions).
*   **Toolbar Buttons Connected:** Wired up tool selection states and disabled properties of Undo/Redo button clicks dynamically.

### Phase 2.3 — Multi-page Journal Canvas
*   **Multi-page In-Memory State:** Maintained page canvas JSON strings in the parent page's state (`pages`, `currentPageIndex`).
*   **React Key-Based Mounting:** Configured `<JournalCanvas key={currentPageIndex} ... />` to force dynamic unmounting of inactive canvas instances (properly triggering Fabric `.dispose()` cleanup) and fresh mounting of target page states.
*   **State Restoration:** Enabled canvas state deserialization dynamically from parent pages state on mount using async `.loadFromJSON()`.
*   **Auto-update parent on Canvas modifications:** Wired the canvas `onCanvasChange` prop to trigger parent updates on drawing, typing, and eraser modifications.
*   **Accessible Navigation Controls:** Connected center Previous and Next page controls with appropriate disabled states and created a functional "New Page +" CTA button to append blank canvas templates.

### Phase 3 — Local Persistence & Autosave
*   **State & Storage Libraries:** Installed `zustand` (v5.0.3) for global in-memory state management and `idb-keyval` (v6.2.1) for asynchronous, browser-local IndexedDB storage.
*   **Zustand Store:** Created global state manager [journal-storage.ts](file:///c:/Users/komal/Documents/MY%20CODES/@Projects/TrueNorth-Part4/src/lib/storage/journal-storage.ts) to manage `pages` and `currentPageIndex`.
*   **Hydration Guard Flow:** Built a client-only mounting lifecycle guard (`hasHydrated`) to display a loading skeleton while reading from IndexedDB, preventing server-client pre-rendering warnings or database overwrite conflicts.
*   **Debounced Autosave (1s):** Implemented a debounced saving mechanism watching Zustand changes (scoped only to the `pages` content array to avoid unnecessary writes on page switches) that updates IndexedDB after 1000ms.
*   **Visual Save Status Indicator:** Designed a premium header indicator displaying real-time database write statuses (`Saving...`, `Saved locally ✓`, `Error saving ⚠`, `Offline`).
*   **Error Boundaries:** Configured fallbacks to gracefully recover from empty, malformed, or unavailable IndexedDB storage without corrupting in-memory user sessions.

### Phase 4 — AI Reflection
*   **Next.js Server-Side API (`/api/reflect`):** Created the server-side API route POST endpoint. Keeps Google Gemini API Key (`GEMINI_API_KEY`) strictly server-side, authenticating requests via the `x-goog-api-key` header.
*   **Zero-Dependency AI REST Client:** Configured native `fetch` POST requests querying Google Gemini (`gemini-2.5-flash` model family), passing a strict `responseSchema` to enforce JSON schema content returns.
*   **Structured Output Type Validation:** Added a robust custom type validator to parse and verify that the structured AI response contains the summary, emotions array, questions, and redFlags (modeled as observational considerations).
*   **Fabric.js Canvas Text Extractor:** Implemented client-side parser to extract text strings from canvas `itext` and `text` objects, completely filtering out coordinates, drawings, and metadata.
*   **Ephemeral Session Reflections:** Saved reflection results in a React local session state array to avoid expanding the IndexedDB storage schema unnecessarily.
*   **Tone & Terminology Guard:** Banned clinical/absolute labels ("toxic", "narcissistic") in prompts, framing observations tentatively. Labeled red flags in the UI as **"Observations to consider"** for a supportive, self-guided reflection experience.

### Phase 5 — Pattern Recognition
*   **Minimal Storage Schema:** Added `patternLogs: PatternLog[]` array to the Zustand store, persisting only reflection dates and normalized emotion tags in IndexedDB. Discarded summaries, full reflections, and questions, preserving privacy boundaries.
*   **Deduplication & Normalization:** Implemented a deduplication parser that trims, lowercases, and groups emotion strings. Guarantees that an emotion is counted at most once per reflection session.
*   **Single Dispatch Execution:** Wired `addPatternLog` purely inside the client-side Reflect click action handler upon successful validation. Disabled button inputs during execution to prevent React re-renders or double-clicks from duplicating logs.
*   **Private Client-Side Analytics:** Built local frequency aggregates and tentative observation metrics dynamically on the client, generating zero network queries. Shows recurring-emotion observations only after at least 2 reflection logs exist.
*   **Safe Clear History:** Configured confirmation modals warning that clearing history affects analytics only, leaving journal pages, drawings, and text content completely untouched.
*   **Insights Dashboard Page (`/patterns`):** Created the double-page scrapbook patterns layout displaying totals, emotion frequency bars, dynamic tentative observation lists, and safe reset options.

### Phase 6 — Checklists
*   **Page-Specific Checklist Store:** Added `checklists: string[][]` array state to the Zustand store. Ensures independent checkbox selection arrays aligned to each page index (`pages[idx] <-> checklists[idx]`).
*   **Independent Array Hydration:** Implemented safe Array instances loading guards using `Array.from` that safely truncates or pads checklists lengths without copying references.
*   **Curated Prompt Templates:** Configured 5 category prompt groups in the UI: Feelings, Needs, What felt good, What felt uncomfortable, and Values, mapped to unique stable IDs.
*   **Aesthetic Tabbed UI:** Built lightweight tabs toggle buttons in the toolbar footer allowing users to check/uncheck checkboxes. Selected prompts feature soft background fills matching the seaside color scheme without resetting the narrative text area.
*   **AI Consent & Privacy Boundaries:** Ensured checklist clicks only trigger local Zustand/IndexedDB saves, generating zero network calls. Appends selections to the Reflect prompt context as user-reported observations, instructing Gemini to keep interpretations tentative and non-clinical.

### Phase 7 — Stickers & Decorative Assets
*   **Fabric.js Loader & Isolation:** Extended the `JournalCanvasRef` with `addSticker(svgUrl)` to keep Fabric logic isolated. Loads vector elements using HTML `Image` elements to construct standard `FabricImage` instances.
*   **Sticker Asset Library:** Hand-crafted six inline vector graphics (Rose, Seashell, Bow, Star, Beach Wave, and Washi Tape) mapped to static base64 SVG URLs, ensuring offline capability.
*   **Scrapbook Sticker Picker Tray:** Built an aesthetic drawer tray component rendering below the canvas container. Sticker clicks automatically stamp the sticker centered relative to the canvas.
*   **State Persistence & Transform Tracks:** Persists sticker objects and transformations (dragging, resizing, and rotation) through standard canvas JSON persistence using Zustand and IndexedDB autosave. Reverts sticker placements and adjustments in history stacks (Undo/Redo) by listening to `object:modified` triggers.
*   **Accessibility Controls:** Assigned descriptive accessible titles, tabindex/focus selectors, and keyboard reachability triggers.

---

## 🛠️ Commands & Configs
*   **Start Dev Server:** `npm run dev`
*   **Static Build Verification:** `npm run build`
*   **ESLint/TS Check:** `npm run lint`
