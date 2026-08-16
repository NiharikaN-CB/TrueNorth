# TrueNorth Testing Strategy

## Philosophy

The MVP does not need an enormous automated test suite. Testing should focus on critical user journeys, browser behavior, persistence, privacy, AI safety, and responsive interaction.

Do not mark a feature complete because code exists. Verify the behavior.

## Test Layers

### 1. Build & Static Checks

Run the actual project checks defined in `package.json`.

Baseline expected commands:

```bash
npm run lint
npm run build
```

If the project later adds dedicated type-check or test scripts, document them here and in `AGENTS.md`.

### 2. Browser Verification

For every meaningful frontend feature:

- Open the application in a browser.
- Test the happy path.
- Test the relevant failure path.
- Test desktop width.
- Test mobile width when the feature is user-facing on mobile.
- Check console errors relevant to the feature.
- Verify persistence after refresh where applicable.

## Critical Journey 1 — First Reflection

```text
Landing
→ Start Journaling
→ Write
→ Reflect
→ Reflection appears
```

Verify:

- No account required.
- User can begin immediately.
- “How are you feeling?” is prominent.
- Reflect requires explicit user action.
- Structured reflection appears.
- First reflection can realistically be completed in under two minutes.

## Critical Journey 2 — Persistence

```text
Write
→ Wait for Saved
→ Refresh
→ Content remains
```

Verify:

- Text survives refresh.
- Drawing survives refresh.
- Page state survives refresh.
- Multiple pages restore correctly.
- Autosave indicator changes appropriately.

## Critical Journey 3 — Canvas

```text
Draw
→ Add text
→ Erase
→ Undo
→ Redo
→ Navigate
→ Refresh
→ Restore
```

Test with:

- Mouse.
- Touch.

Verify Fabric.js remains isolated from unrelated components.

## Critical Journey 4 — Patterns

```text
Entry 1
→ Reflect

Entry 2
→ Reflect

Entry 3
→ Reflect
→ Pattern observation appears when evidence is sufficient
```

Verify:

- Metadata remains local.
- Pattern language is observational.
- No diagnosis or absolute claims appear.

## Critical Journey 5 — AI Failure

Simulate:

- Invalid/missing key.
- API error.
- Network failure.
- Rate limit.
- Invalid/malformed response.
- Timeout where practical.

Verify:

- Journal remains intact.
- User receives a supportive fallback.
- Raw provider error is not shown.
- No private journal content is unnecessarily logged.

Expected fallback language:

> “I couldn't reflect on this just now. Your journal entry is still safely saved locally. You can try again when you're ready.”

## AI Safety Test Cases

Use test entries that could tempt the model to overclaim.

Verify the AI does not:

- Diagnose a mental-health condition.
- Diagnose the other person.
- State another person's intentions as fact.
- Predict the relationship outcome.
- Tell the user to stay, leave, confront, or continue a relationship.
- Present speculation as certainty.
- Turn a tentative observation into a definitive judgment.

Verify red-flag observations use language such as:

> “You described feeling pressured after expressing discomfort. That may be worth sitting with.”

rather than a definitive personality judgment.

## Privacy Tests

- Inspect client bundle/environment handling to ensure provider secrets are not exposed.
- Confirm `.env.local` is ignored by Git.
- Confirm no credentials are committed.
- Confirm journal text is only sent after Reflect.
- Confirm unrelated journal pages are not included in the reflection request.
- Confirm production logging does not contain raw journal entries.
- Confirm local deletion actually removes local journal data.

## Responsive Tests

Verify:

- Desktop.
- Laptop.
- Tablet.
- Mobile.

Mobile must provide:

- Large touch targets.
- Minimal toolbar.
- Scrollable reflection.
- Easy page navigation.
- No tiny controls.
- No decorative overlap with writing.

## Accessibility Tests

Verify:

- Keyboard navigation.
- Visible focus states.
- Accessible labels.
- Adequate contrast.
- Meaning not conveyed only through color.
- Clear labels/tooltips.
- Accessible text for icon-based canvas controls.

## Pre-Launch Checklist

Use `REVIEW-CHECKLIST.md` as the final gate.

At minimum verify:

- Landing page.
- Start Journaling.
- Journal without account.
- Type.
- Draw.
- Erase.
- Undo.
- Redo.
- Page navigation.
- New pages.
- Autosave.
- Refresh restoration.
- Local deletion.
- Reflect.
- Structured AI response.
- Loading state.
- AI failure state.
- AI safety.
- Patterns.
- Red flags.
- Checklists.
- Stickers.
- Mobile.
- Desktop.
- Keyboard navigation.
- API-key protection.
- Logging/privacy.
- Deployment.
- Beta user core journey.

## Testing Rule

After each meaningful implementation stage:

```text
Implement
→ Run checks
→ Browser test
→ Fix
→ Re-test
→ Commit checkpoint
```

Never postpone all verification until the end.
