# REVIEW-CHECKLIST.md

## Definition of Done — TrueNorth MVP

### Product & Scope

- [ ] The implementation matches the PRD.
- [ ] All 8 P0 features are functional.
- [ ] No out-of-scope feature has been introduced.
- [ ] No placeholder content remains in production UI.
- [ ] No lorem ipsum or unfinished UI remains.
- [ ] The core journal → reflection journey works end-to-end.
- [ ] First reflection can realistically be completed in under two minutes.

### Foundation

- [ ] Application runs locally.
- [ ] Application deploys successfully.
- [ ] Landing page loads without errors.
- [ ] Start Journaling opens the journal immediately.
- [ ] No account is required.

### Journal & Canvas

- [ ] User can type with text boxes.
- [ ] User can draw with a freehand pen.
- [ ] User can erase content.
- [ ] Undo works.
- [ ] Redo works.
- [ ] User can create pages.
- [ ] User can navigate between pages.
- [ ] User can return to a previous page with its state intact.
- [ ] Canvas works with mouse input.
- [ ] Canvas works with touch input.
- [ ] Paper background supports the approved dotted/blank aesthetic.
- [ ] Fabric.js logic remains isolated inside the canvas layer.

### Local Persistence

- [ ] Journal data is stored locally.
- [ ] Autosave occurs during normal editing.
- [ ] Autosave is debounced rather than persisted on every pointer movement.
- [ ] Autosave indicator communicates Saving / Saved / Offline — Saved locally / Unable to save states appropriately.
- [ ] Refresh restores content.
- [ ] Multiple pages restore correctly.
- [ ] User can delete a page or clear local journal data.
- [ ] No cloud journal database is introduced.

### AI Reflection

- [ ] Reflect is explicitly triggered by the user.
- [ ] Only required current-entry text is sent.
- [ ] Hand-drawn content does not require OCR in MVP.
- [ ] `/api/reflect` is server-side.
- [ ] API key is never exposed in client-side code.
- [ ] AI response is validated before display.
- [ ] Structured reflection contains the required fields.
- [ ] Loading state works.
- [ ] Provider/rate-limit/network/invalid-response failure states work.
- [ ] AI failure never deletes or overwrites journal data.
- [ ] Raw provider errors are not shown to users.
- [ ] Production logs do not contain raw journal content.

### AI Safety

- [ ] AI reflects the user's words.
- [ ] AI uses tentative language.
- [ ] AI does not diagnose mental-health conditions.
- [ ] AI does not diagnose or label another person.
- [ ] AI does not claim certainty about another person's intentions.
- [ ] AI does not predict relationship outcomes.
- [ ] AI does not tell the user to stay, leave, confront, or continue a relationship.
- [ ] AI distinguishes observations from facts.
- [ ] AI focuses on feelings, needs, values, and boundaries.
- [ ] Red-flag observations are clearly separated from general reflection.
- [ ] Red-flag observations remain non-definitive.

### Pattern Recognition

- [ ] Successful reflections contribute emotion/theme metadata locally.
- [ ] Pattern counts use local metadata.
- [ ] The complete journal history is not repeatedly sent to the AI.
- [ ] Patterns require sufficient evidence.
- [ ] Pattern wording uses observation language such as “You've mentioned...” or “A pattern that appears...”.
- [ ] Pattern wording does not make diagnostic or absolute claims.

### Checklists

- [ ] Checklists are optional.
- [ ] User can add a checklist to a page.
- [ ] Items can be checked/unchecked.
- [ ] Checklist state persists locally.
- [ ] Checklists do not turn the app into a task-management product.

### Decorative Assets

- [ ] Sticker picker works.
- [ ] Assets can be placed on the canvas.
- [ ] Assets can be moved.
- [ ] Assets can be resized.
- [ ] Asset state persists through canvas serialization.
- [ ] Only free/licensed assets are used.
- [ ] Decoration does not obscure writing or reflection.

### Responsive UX

- [ ] Desktop layout works.
- [ ] Laptop layout works.
- [ ] Tablet layout works.
- [ ] Mobile layout works.
- [ ] Mobile is not merely a shrunk desktop layout.
- [ ] Touch targets are large enough.
- [ ] Toolbar remains usable.
- [ ] Reflection is scrollable on mobile.
- [ ] Page navigation is easy on mobile.
- [ ] Decorative elements do not overlap writing on mobile.

### Visual Quality

- [ ] Palette uses the approved TrueNorth colors.
- [ ] Visual language is feminine, elegant, nostalgic, and personal.
- [ ] Warm paper surfaces and gentle contrast are present.
- [ ] Scrapbook/planner details feel curated rather than childish.
- [ ] Visuals feel nostalgic rather than futuristic.
- [ ] Decoration remains subordinate to reflection.
- [ ] “Reflect ✦” remains visually obvious.
- [ ] The product does not look like a generic dashboard.

### Accessibility

- [ ] Keyboard navigation works.
- [ ] Focus states are visible.
- [ ] Toolbar controls have accessible labels.
- [ ] Contrast is adequate.
- [ ] Meaning is not communicated by color alone.
- [ ] Buttons have clear labels/tooltips.
- [ ] Canvas controls have accessible text even when represented by icons.

### Security & Privacy

- [ ] `.env.local` is excluded from Git.
- [ ] `.env.example` contains variable names only.
- [ ] No credentials are committed.
- [ ] API keys remain server-side.
- [ ] Reflection requests are validated server-side.
- [ ] Request sizes are reasonably restricted.
- [ ] Raw journal content is not unnecessarily logged.
- [ ] Local journal deletion works.
- [ ] The user is clearly told about local storage.
- [ ] Journal text is never silently transmitted.

### Deployment & Beta

- [ ] Vercel deployment works.
- [ ] Production environment variables are configured securely.
- [ ] Core journey works on the deployed site.
- [ ] AI failure behavior has been tested.
- [ ] Mobile and desktop production behavior has been tested.
- [ ] Small beta test has been completed.
- [ ] Launch metrics can be measured without violating local-first privacy:
  - [ ] Time-to-value: under 2 minutes.
  - [ ] Activation target: 70%.

### Final Rule

Do not mark a feature complete because code exists. Mark it complete only after the relevant behavior has actually been verified.
