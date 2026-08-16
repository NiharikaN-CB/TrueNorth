# TrueNorth Code Patterns

## Architecture Pattern

**Chosen pattern:** Single Next.js application with clear UI, state, persistence, canvas, AI, pattern, and type boundaries.

```text
UI
 ↓
Zustand/application state
 ↓
Storage / feature utilities
 ↓
IndexedDB

Explicit Reflect
 ↓
Next.js /api/reflect
 ↓
AI provider adapter
 ↓
Validated Reflection
 ↓
Zustand + IndexedDB
```

Do not create a separate FastAPI/Express backend for the MVP.

## Data Fetching

Use a minimal `fetch` call from the client to the Next.js `/api/reflect` route for AI reflection.

Rules:

- No automatic reflection requests.
- No background sending of journal text.
- No request on every keystroke.
- Send only the current entry text required for reflection.
- Show loading state.
- Validate the response.
- Preserve the journal if the request fails.

Do not add a data-fetching framework unless a real requirement emerges.

## State Management

**Chosen tool:** Zustand.

Keep state small and explicit. Separate:

- current page
- canvas/page state
- reflection state
- UI state

IndexedDB is persistence, not a second competing application state system.

## File Naming

Follow the project structure and existing conventions:

- React components: `PascalCase.tsx`
- Utilities/services: `kebab-case.ts`
- Type files: `kebab-case.ts`
- Next.js route files: framework convention such as `route.ts`
- Styles: project/framework convention

Do not rename existing files solely for stylistic preference.

## Component Boundaries

### JournalCanvas

Owns:

- Fabric initialization.
- Pen.
- Text.
- Eraser.
- Object movement/resizing.
- Canvas serialization.
- Undo/redo integration.
- Touch interaction.
- Fabric cleanup.

Does not own:

- AI calls.
- IndexedDB implementation.
- Pattern recognition.
- Global navigation logic.

### JournalToolbar

Owns tool selection UI and accessible labels. It should communicate selected tool state rather than directly owning unrelated persistence.

### AutosaveIndicator

Reflects persistence state:

- Saving...
- Saved ✓
- Offline — Saved locally
- Unable to save

It must remain visually quiet.

### ReflectionPanel

Owns presentation of validated reflection data.

It must not:

- fabricate missing fields;
- make stronger claims than the AI response;
- turn observations into diagnoses;
- make relationship decisions for the user.

### StickerPicker

Selects curated static assets. The canvas layer handles placement and serialization.

### Checklist

Provides optional structured prompts. It must not turn the journal into task management.

## Storage Pattern

Debounce writes.

```text
Canvas change
   ↓
mark page dirty
   ↓
wait for debounce
   ↓
serialize page
   ↓
save to IndexedDB
   ↓
update autosave indicator
```

Never write to IndexedDB on every pointer movement.

## AI Provider Pattern

Keep provider-specific code behind a small adapter:

```text
/api/reflect
    ↓
AI provider adapter
    ↓
selected free provider
```

The rest of the app should not depend directly on provider-specific SDK details.

## AI Prompt Pattern

Use four conceptual layers:

1. Role — gentle reflection companion.
2. Product purpose — help the user understand her own emotional experience.
3. Safety boundaries — no diagnosis, certainty about others, relationship decisions, or speculation as fact.
4. Output contract — return only the required structured JSON.

## Pattern Recognition

Use locally stored reflection metadata.

Do not send the full journal history to the AI for every pattern request.

Use observational language:

- “You've mentioned...”
- “A pattern that appears...”
- “You may be noticing...”

Avoid:

- “You always...”
- “You have...”
- “This proves...”
- “Your relationship pattern is...”

## Error Handling

Treat AI failure as expected.

Potential failures:

- rate limit
- network failure
- provider outage
- invalid response
- malformed JSON
- timeout
- missing environment variable

User-facing fallback:

> “I couldn't reflect on this just now. Your journal entry is still safely saved locally. You can try again when you're ready.”

Never lose or overwrite the journal because AI failed.

## Privacy Pattern

Normal journaling:

```text
User → Journal Canvas → Zustand → IndexedDB
```

Reflection:

```text
User presses Reflect
→ extract current entry text
→ POST /api/reflect
→ provider
→ validated response
→ browser
→ IndexedDB
```

Never silently transmit journal data.

## Visual Pattern

Prioritize:

1. Writing
2. Reflect CTA
3. Navigation
4. Reflection
5. Tools
6. Decoration

The main CTA is `Reflect ✦`.

Decoration must support, not compete with, the emotional reflection experience.

## Mobile Pattern

Do not shrink the desktop layout.

Mobile flow:

```text
Header
↓
Journal
↓
Toolbar
↓
Reflect
↓
Reflection
```

Use large touch targets, minimal controls, scrollable reflection, and easy page navigation.

## Change Discipline

Before editing:

- identify the smallest affected files;
- inspect existing implementation;
- avoid unrelated refactors.

After editing:

- run the relevant checks;
- manually test the affected behavior;
- create a checkpoint when stable.
