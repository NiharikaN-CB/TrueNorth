# MEMORY.md

## 🏗️ Active Phase & Goal

**Current phase:** Phase 2 — Must-have MVP Features (Starting: Creative Canvas & Persistence)

**Goal:** Implement the creative journal canvas layer (Fabric.js text,Pen, Eraser, Stickers picker) and local persistence (autosave / Zustand / IndexedDB key-value).

**Current state:** Phase 1 — Foundation is complete. The landing page and mock journal shell load reliably and compile cleanly. Local Git is set up and pushed to remote origin.

**Next milestone:** Set up the Zustand store, implement the Fabric.js canvas layer, and wire up debounced local persistence.

## Product North Star

TrueNorth — **“A calmer way to date.”**

The central product hypothesis is that a user can move from:

> “Something happened and I can't stop thinking about it.”

to:

> “I understand what I'm feeling a little better, and I can put my phone down.”

The experience should feel like opening a private notebook, not entering another productivity system.

## User

Primary user: Maya — a young woman navigating modern dating who wants a private, low-friction space to process dating experiences without being told what to do.

## Core Principles

- Focus on the user's feelings, needs, boundaries, and values.
- Do not decode or diagnose another person.
- Keep journaling local by default.
- AI is invoked only after explicit **Reflect** interaction.
- Keep the experience under two minutes to first reflection.
- Make the journal itself the onboarding.
- Reliability comes before visual polish; visual polish comes before optional extras.
- Preserve the feminine, elegant, nostalgic, personal, rosy-seaside scrapbook/planner identity.

## Approved Architecture

Browser UI → Zustand → IndexedDB

Explicit Reflect → `/api/reflect` → free AI provider → validated structured reflection → browser → local storage.

No accounts, cloud journal database, or server-side journal persistence in MVP.

## Tool Roles

- Antigravity: primary implementation/build/debug loop.
- Claude: planning, architecture, task decomposition, major refactor review.
- Lovable: visual/UI refinement after functionality is stable.
- ChatGPT: debugging and explanations.
- Gemini, Cursor, VS Code, v0, Replit: supporting/backup roles.

## Stable Checkpoints

Use Git checkpoints after:

- Foundation
- Canvas
- Storage
- AI
- Patterns
- P0 complete
- Polish
- Launch

## Open Decisions From Source Documents

These must be verified or finalized during implementation rather than guessed:

- Exact free AI provider and current free-tier limits.
- Exact AI model.
- Exact AI prompt.
- Exact JSON validation implementation.
- Exact red-flag categories.
- Exact decorative asset library.
- Exact checklist templates.
- Whether PNG/PDF export fits within the 40-hour build.
- Privacy-preserving analytics/measurement approach.
- Browser/device matrix for beta testing.

## Session Rule

At the beginning of each implementation session:

1. Read `AGENTS.md`.
2. Read this file.
3. Read the relevant `agent_docs/` file.
4. Confirm the current phase and next smallest task.
5. Plan before editing.
