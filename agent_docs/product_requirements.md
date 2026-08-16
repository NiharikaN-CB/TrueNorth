# TrueNorth Product Requirements

## Product

**Name:** TrueNorth  
**Tagline:** A calmer way to date.

**One-line description:** A private, women-centered digital journal and reflection companion for processing dating experiences.

**Launch goal:** Prove that the core journaling + AI reflection experience works.

**Target:** 40-hour execution.

## Primary User Story

> “Meet Maya, a young woman navigating modern dating who often feels unsettled after inconsistent interactions. She finds herself rereading messages and wondering what she did wrong. She opens TrueNorth for a quiet moment, writes what happened, and receives a gentle reflection that helps her recognize what she actually values. She leaves feeling grounded rather than compelled to solve the other person.”

## Must-have Features — P0

### 1. AI Reflection

**User story:** As a user, I want TrueNorth to reflect my experience back to me so that I can understand what I am feeling without overanalyzing the other person.

Output:

- Summary
- Emotion keywords
- Gentle reflection
- Open-ended questions
- Recovery/self-care suggestion
- Pattern observation when relevant
- Gentle red-flag observations when relevant

### 2. Private / Local Autosave

**User story:** As a user, I want my journal to save automatically and privately so that I can use TrueNorth without creating an account.

Requirements:

- Content persists after refresh.
- Multiple pages can be restored.
- Autosave occurs during normal editing.
- User can delete a page or clear journal data.
- No account is required.

### 3. Pattern Recognition

**User story:** As a user, I want to notice recurring feelings so that I can understand my own patterns over time.

Requirements:

- Reflections contribute emotion/theme data to local pattern history.
- Repeated themes can be surfaced.
- Patterns are observations, not diagnoses.
- Example: “You've mentioned similar feelings of unease in 3 of your last 5 interactions.”

### 4. Creative Journal Canvas

**User story:** As a user, I want to write and decorate my journal entry so that reflection feels personal rather than clinical.

Requirements:

- Text boxes.
- Freehand pen.
- Eraser.
- Dotted/blank paper aesthetic.
- Page navigation.
- Mouse and touch support.

### 5. Quick Journal Entry

**User story:** As a user, I want to quickly write about a dating interaction so that I can process it before I start overthinking.

Requirements:

- Begin writing immediately.
- No lengthy onboarding.
- First reflection under two minutes.
- Prominent “How are you feeling?” prompt.

### 6. Stickers & Decorative Assets

**User story:** As a user, I want to personalize my journal with beautiful decorative elements so that it feels like my own private notebook.

Requirements:

- Sticker/decorative asset picker.
- Place assets on canvas.
- Reposition and resize.
- Decoration cannot interfere with core writing/reflection.

Asset language:

- Roses
- Seashells
- Bows
- Stars
- Beach elements
- Photographs
- Tape
- Flowers
- Similar scrapbook details

### 7. Gentle Red-Flag Detection

**User story:** As a user, I want TrueNorth to gently surface concerning patterns I may have overlooked so that I can consider them with greater awareness.

Requirements:

- Concerns based only on information supplied by the user.
- Observational, not definitive.
- No diagnosis or labeling of another person.
- No instruction to stay, leave, confront, or take a specific relationship action.
- Clearly separated from general reflection.

### 8. Checklists

**User story:** As a user, I want optional checklists so that I can quickly identify what I experienced or need.

Requirements:

- Add checklist to a page.
- Check/uncheck items.
- Persist locally.
- Remain optional.

Initial examples:

- How am I feeling?
- What do I need right now?
- What felt good?
- What felt uncomfortable?
- What values mattered to me?

## Nice-to-have Features

Only after all P0 features are functional:

- PNG/PDF Export.
- Advanced page templates.
- Expanded sticker library.
- More sophisticated pattern visualization.
- Improved multi-page export.

## Out of Scope — Not in MVP

- User accounts / authentication
- Cloud database / cloud journal sync
- Social sharing
- Public dating/social feed
- Paid subscriptions/features
- Advanced drawing tools
- Voice journaling
- Cross-device synchronization
- Personality guessing
- Dating profile/message coaching
- Relationship outcome prediction
- Therapy/clinical functionality
- AI memory across cloud conversations
- Complex gamification

## Success Metrics

| Metric | Target | Measure |
|---|---:|---|
| Time-to-value | Under 2 minutes | Time from starting first journal entry to receiving first AI reflection |
| Activation | 70% | Percentage of new users who complete first journal entry and AI reflection |

## UX Requirements

### Design vibe

- Feminine
- Elegant
- Nostalgic
- Personal

### Visual direction

Rosy seaside sunset + handmade digital scrapbook/planner.

### Principles

- Soft rather than clinical.
- Personal rather than corporate.
- Elegant rather than childish.
- Nostalgic rather than futuristic.
- Calming rather than distracting.

### Color palette

- Gold Pink `#F7D7CD`
- Berry Blush `#D79B95`
- Pastel Maroon `#984343`
- Cherub `#91BDC2`
- Cashmere `#F1E4D9`

### Visual hierarchy

1. Writing
2. Reflect CTA
3. Navigation
4. Reflection
5. Tools
6. Decoration

## Key Screens

### Landing / Welcome

- TrueNorth logo
- “A calmer way to date.”
- Short explanation
- Start Journaling CTA
- Private & local reassurance
- Minimal seaside imagery

### Journal

- Journal page/canvas
- Date
- Writing area
- Pen/text/eraser tools
- Stickers/decorative assets
- Checklist tool
- Page navigation
- Autosave indicator
- Reflect CTA

### AI Reflection

- Summary
- Emotions I hear
- Gentle reflection
- Pattern I've noticed
- Questions to sit with
- Recovery/self-care suggestion
- Gentle red flags
- Save reflection

### Patterns / Insights

Examples:

- “You've mentioned feeling drained in 3 of your last 5 interactions.”
- “Clarity appears frequently in the things you say you value.”
- “You often describe feeling anxious when communication becomes unpredictable.”

## Privacy Requirements

- No accounts.
- No cloud journal database.
- Journal data stored locally.
- AI reflection requires explicit user action.
- Only necessary journal text is sent to AI.
- API keys remain server-side.
- User can delete local journal data.

## AI Safety Requirements

The AI must:

- Reflect the user's words rather than invent context.
- Use tentative language.
- Avoid diagnosing mental-health conditions.
- Avoid diagnosing or labeling dating partners.
- Avoid certainty about another person's intentions.
- Avoid telling users what relationship decision to make.
- Distinguish observations from facts.
- Encourage consideration of feelings, needs, boundaries, and values.
- Treat red flags as gentle awareness rather than definitive verdicts.

## Quality Standards

Reject:

- Placeholder production content.
- Lorem ipsum.
- Broken P0 features.
- Confidently invented AI facts.
- AI diagnoses or definitive judgments.
- Exposed API keys.
- Silent journal transmission.
- Unnecessarily complicated onboarding.
- A core flow that cannot be completed on mobile.
- Skipped mobile testing.
- Decoration that overwhelms reflection.

## Constraints

- Development budget: $0.
- Monthly operating target: $0 for MVP.
- Timeline: 40-hour execution.
- Team: Solo builder using AI-assisted development.

If the build falls behind, prioritize:

1. Quick journal entry
2. Creative canvas
3. Local autosave
4. AI reflection
5. Pattern recognition
6. Red-flag detection
7. Checklists
8. Stickers/decorative assets
9. Export and advanced polish
