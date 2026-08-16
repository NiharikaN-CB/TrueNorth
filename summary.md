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

---

## 🛠️ Commands & Configs
*   **Start Dev Server:** `npm run dev`
*   **Static Build Verification:** `npm run build`
*   **ESLint/TS Check:** `npm run lint`
