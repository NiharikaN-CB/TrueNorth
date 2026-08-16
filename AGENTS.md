# AGENTS.md

## Project Overview & Stack

**Product:** TrueNorth  
**Tagline:** A calmer way to date.  
**Description:** A private, women-centered digital journal and reflection companion for processing dating experiences.

TrueNorth helps a user move from:

> Something happened → I feel unsettled → I reflect on it → I understand myself better → I recover → I notice patterns over time.

The MVP is a responsive, local-first web application. It must feel like a beautiful private digital planner/notebook rather than a dating coach, therapy app, generic AI chatbot, or productivity system.

### Approved Stack

- Framework: Next.js + React + App Router
- Styling: Tailwind CSS
- Journal canvas: Fabric.js
- Client state: Zustand
- Local persistence: IndexedDB with one lightweight persistence strategy
- AI endpoint: Next.js server-side `/api/reflect` route
- AI provider: verified free-tier provider selected during implementation
- Hosting: Vercel free tier
- Repository: GitHub
- Export, if included: html2canvas + jsPDF
- Primary builder: Antigravity
- Planning/architecture: Claude
- UI/UX refinement: Lovable
- Debugging/explanations: ChatGPT
- Supporting tools: Gemini, Cursor, VS Code, v0, Replit

**Versions:** The source Technical Design does not pin exact package versions. Do not invent versions. Record the actual versions installed during Foundation in the project documentation.

## How I Should Think

### Plan → Execute → Verify

1. **Plan:** Before coding, briefly explain the approach, affected files, risks, and how the change will be verified. Ask for approval before coding. If the tool has Plan/Reflect mode, use it.
2. **Execute:** Implement one feature or small task at a time. Prefer the smallest implementation that satisfies the requirement.
3. **Verify:** Run the relevant tests, lint/format checks, and manual browser checks. For frontend work, verify the affected journey in a browser at desktop and mobile widths when applicable. Fix failures before moving on.
4. **Checkpoint:** After a stable milestone, create a Git commit/checkpoint.

Because this is a vibe-coded project, explain important technical decisions in simple language. Do not hide architectural changes behind generated code.

## What NOT To Do

- Do not rewrite unrelated files.
- Do not delete files without confirmation.
- Do not change the database/storage schema without checking compatibility with existing persisted data and explaining a migration/backup plan.
- Do not change architecture without explaining why first.
- Do not introduce a dependency unless it is necessary.
- Do not add out-of-scope features during MVP implementation.
- Do not skip tests or manual verification.
- Do not bypass configured hooks, formatters, linters, or quality gates.
- Do not use deprecated libraries/APIs when a maintained project-approved alternative exists.
- Do not replace working implementations merely for stylistic preference.
- Do not hard-code secrets or commit API keys.
- Never silently send journal text to an AI provider.
- Only send journal text after the user explicitly presses **Reflect**.
- Do not send unrelated stored journal pages or the complete journal history unless a future requirement explicitly calls for it.
- Never claim a feature works without actually testing it.
- Do not weaken TrueNorth's AI safety boundaries to produce a more dramatic response.
- Do not make the AI diagnose the user or another person, predict relationship outcomes, or tell the user to stay, leave, confront, or continue a relationship.
- Do not allow decorative elements to obscure writing or reflection.
- Do not let TrueNorth become a task-management/productivity app.
- Do not expose raw AI-provider errors or private journal content in production logs.

## Engineering Constraints

### Architecture

- Preserve the approved local-first architecture:
  `Browser UI → Zustand → IndexedDB`
  and, only after explicit **Reflect**:
  `Browser → /api/reflect → AI provider → structured reflection → Browser`.
- The server must not become a journal database.
- Keep Fabric.js logic isolated inside the journal canvas layer.
- Other UI components should communicate through application state rather than manipulating the Fabric instance directly wherever possible.
- Use a small AI provider abstraction so the free provider can be changed without rebuilding the journal application.
- Use one persistence strategy. Do not create overlapping storage systems.

### Privacy & Security

- API keys must exist only server-side.
- Secrets belong in hosting environment variables.
- `.env.local` must not be committed.
- `.env.example` contains variable names only.
- Validate reflection requests server-side.
- Validate AI responses before displaying them.
- Restrict reflection request sizes reasonably.
- Do not log raw journal entries in production.
- Do not expose raw provider errors to users.
- Provide a way to delete local journal data.
- Clearly communicate the local-storage model.

### Type Safety & Verification

- Use TypeScript types for Journal, JournalPage, CanvasState, Reflection, and PatternMetadata.
- Keep the response schema synchronized with runtime validation.
- Verify affected behavior after every meaningful change.
- Do not rely on TypeScript compilation alone for interactive canvas behavior.
- Test mouse and touch interaction for canvas features.

### Workflow Discipline

- Keep changes small and reviewable.
- Commit after stable milestones.
- Recommended checkpoints:
  - `checkpoint/foundation`
  - `checkpoint/canvas`
  - `checkpoint/storage`
  - `checkpoint/ai`
  - `checkpoint/patterns`
  - `checkpoint/p0-complete`
  - `checkpoint/polish`
  - `checkpoint/launch`

## Current State

**Project setup — nothing built yet.**

The product and technical design are approved for MVP implementation. The codebase should begin with Foundation before any P0 feature is considered complete.

## Roadmap

### Phase 1 — Foundation — 4 hours

- Create the Next.js project.
- Configure Tailwind CSS.
- Establish the TrueNorth visual tokens.
- Create the landing/welcome screen.
- Create the journal route/shell.
- Set up GitHub/version control.
- Create the first stable commit.
- Verify desktop and mobile rendering.

**Done when:** a beautiful but non-functional journal shell loads.

### Phase 2 — Must-have MVP Features

Implement the PRD's eight P0 features:

1. AI Reflection
2. Private / Local Autosave
3. Pattern Recognition
4. Creative Journal Canvas
5. Quick Journal Entry
6. Stickers & Decorative Assets
7. Gentle Red-Flag Detection
8. Checklists

Implementation order should follow the safer technical sequence:

1. Creative Canvas
2. Local Persistence / Autosave
3. AI Reflection
4. Pattern Recognition
5. Gentle Red-Flag Detection
6. Checklists
7. Stickers & Decorative Assets
8. Final integration and P0 verification

The user experience must remain centered on the core journal → reflection loop.

### Phase 3 — Visual Polish

- Finalize palette and typography.
- Paper texture.
- Seaside visual language.
- Responsive refinement.
- Animation.
- Empty states.
- Toolbar polish.
- Reflection cards.
- Mobile touch improvements.

### Phase 4 — Testing & Deployment

- Desktop testing.
- Mobile testing.
- Browser testing.
- AI failure testing.
- Local-storage testing.
- API-key exposure check.
- Accessibility checks.
- Final GitHub checkpoint.
- Vercel deployment.
- Small beta test.

### Nice-to-have, only after all P0 features are stable

- PNG/PDF export.
- Advanced page templates.
- Expanded sticker library.
- More sophisticated pattern visualization.
- Improved multi-page export.

If the build falls behind, use the documented emergency 20-hour fallback rather than randomly removing features.

## Commands

The Technical Design does not prescribe exact command strings or package versions. Use the actual commands produced by the chosen Next.js project setup and record them here after Foundation.

Expected command categories:

```bash
# Install dependencies
npm install

# Start local development
npm run dev

# Production build
npm run build

# Production start
npm run start

# Run the project's configured lint/check command
npm run lint
```

Do not invent additional scripts unless they are actually added to `package.json`.

## Definition of Done

The MVP is complete only when the critical technical and product requirements in `REVIEW-CHECKLIST.md` pass, including:

- Application runs locally.
- Application deploys successfully.
- No account is required.
- User can create journal pages.
- User can write, draw, erase, undo/redo, and navigate pages.
- Journal automatically saves locally and survives refresh.
- Local journal data can be deleted.
- User can use optional checklists and decorative assets.
- User can explicitly trigger AI reflection.
- AI returns validated structured content.
- AI failure does not destroy journal data.
- AI follows all safety boundaries.
- Pattern recognition works across entries.
- Red-flag observations remain tentative.
- Mobile and desktop experiences work.
- Basic accessibility requirements are met.
- API keys are not exposed.
- Unnecessary journal content is not sent to the AI.
- The core journey can be completed in under two minutes.
- A small beta test is completed.

## Living Documentation

Treat these as living project documents:

- `AGENTS.md` — master contract and current roadmap.
- `MEMORY.md` — session continuity and active phase.
- `REVIEW-CHECKLIST.md` — definition of done.
- `agent_docs/tech_stack.md` — canonical stack and commands.
- `agent_docs/code_patterns.md` — implementation patterns.
- `agent_docs/project_brief.md` — product vision and conventions.
- `agent_docs/product_requirements.md` — PRD-derived requirements.
- `agent_docs/testing.md` — testing strategy.

Update them when architecture, commands, dependencies, or important decisions materially change.
