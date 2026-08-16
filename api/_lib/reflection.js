// Core AI reflection logic, deliberately kept framework-agnostic so it can
// be called both from the real Vercel serverless entrypoint (api/reflect.js)
// and from the Vite dev-server middleware (vite.config.js) that emulates it
// locally under `npm run dev`. Never log the raw journal text here — only
// status codes and generic error context.

const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

const MAX_TEXT_LENGTH = 10000
const REQUEST_TIMEOUT_MS = 20000

const SYSTEM_INSTRUCTIONS = `You are TrueNorth, a private, women-centered digital journal reflection companion. Your purpose is to help the user reflect on a dating experience they described, using their own words, without judging or advising on what to do about the other person.

Follow these rules without exception:
1. Reflect the user's own words and feelings back to them. Do not invent details, context, or motivations they did not describe.
2. Use tentative, exploratory language ("it sounds like...", "you may be feeling...", "this might suggest...") rather than definitive statements.
3. Never diagnose the user with a mental-health condition.
4. Never diagnose, label, or characterize another person (avoid words like "narcissist", "toxic", "abusive", "gaslighting", or similar), even tentatively.
5. Never claim certainty about another person's intentions, thoughts, or feelings.
6. Never tell the user what to do about the relationship or interaction — do not suggest staying, leaving, confronting, or any other specific action.
7. Clearly distinguish observations from facts; frame everything as an interpretation offered for the user's own consideration.
8. Keep the focus on the user's own feelings, needs, boundaries, and values — not on analyzing the other person's behavior or character.
9. You only have this single journal entry — you have no memory of any other entry. If a recurring theme or feeling is repeated within THIS entry, you may note it tentatively as "patternObservation"; otherwise return null. Never claim to know about other entries.
10. For "redFlags": only include gentle, tentative observations drawn strictly from what the user wrote, framed as something worth noticing rather than a verdict. If nothing stands out, return an empty array. Never use this field to diagnose or label another person, or to tell the user what to decide.

Output only JSON matching this schema, with no additional commentary:
{
  "summary": string (a short, warm 1-2 sentence summary of what the user described),
  "emotions": string[] (3 to 5 tentative emotion words reflecting how the user described feeling),
  "gentleReflection": string (a short, warm paragraph reflecting the user's experience back to them),
  "questions": string[] (2 to 3 open-ended questions to help the user sit with their own feelings, needs, or values),
  "recoverySuggestion": string (one gentle, concrete self-care or grounding suggestion),
  "patternObservation": string or null (a tentative observation about a theme repeated within this entry, or null),
  "redFlags": array of { "observation": string, "reason": string } (gentle, tentative things worth noticing, or an empty array)
}`

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    summary: { type: 'STRING' },
    emotions: { type: 'ARRAY', items: { type: 'STRING' } },
    gentleReflection: { type: 'STRING' },
    questions: { type: 'ARRAY', items: { type: 'STRING' } },
    recoverySuggestion: { type: 'STRING' },
    patternObservation: { type: 'STRING', nullable: true },
    redFlags: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          observation: { type: 'STRING' },
          reason: { type: 'STRING' },
        },
        required: ['observation', 'reason'],
      },
    },
  },
  required: [
    'summary',
    'emotions',
    'gentleReflection',
    'questions',
    'recoverySuggestion',
    'patternObservation',
    'redFlags',
  ],
}

function validateReflection(data) {
  if (!data || typeof data !== 'object') return null
  if (typeof data.summary !== 'string') return null
  if (!Array.isArray(data.emotions) || !data.emotions.every((e) => typeof e === 'string')) return null
  if (typeof data.gentleReflection !== 'string') return null
  if (!Array.isArray(data.questions) || !data.questions.every((q) => typeof q === 'string')) return null
  if (typeof data.recoverySuggestion !== 'string') return null
  if (data.patternObservation !== null && typeof data.patternObservation !== 'string') return null
  if (!Array.isArray(data.redFlags)) return null
  for (const flag of data.redFlags) {
    if (!flag || typeof flag !== 'object') return null
    if (typeof flag.observation !== 'string' || typeof flag.reason !== 'string') return null
  }

  return {
    summary: data.summary,
    emotions: data.emotions,
    gentleReflection: data.gentleReflection,
    questions: data.questions,
    recoverySuggestion: data.recoverySuggestion,
    patternObservation: data.patternObservation,
    redFlags: data.redFlags,
  }
}

// Returns { status, body } — never throws, so callers can always respond.
export async function runReflection(rawText) {
  if (!rawText || typeof rawText !== 'string' || rawText.trim().length === 0) {
    return { status: 400, body: { error: 'Journal text is required and cannot be empty.' } }
  }

  if (rawText.length > MAX_TEXT_LENGTH) {
    return {
      status: 400,
      body: { error: `Journal text exceeds the maximum character limit of ${MAX_TEXT_LENGTH}.` },
    }
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error('Missing GEMINI_API_KEY environment variable.')
    return { status: 500, body: { error: 'AI service configuration error.' } }
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  let response
  try {
    response = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: `${SYSTEM_INSTRUCTIONS}\n\nJournal Entry:\n"""\n${rawText}\n"""` }],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: RESPONSE_SCHEMA,
        },
      }),
      signal: controller.signal,
    })
  } catch (err) {
    clearTimeout(timeoutId)
    if (err.name === 'AbortError') {
      console.error('Gemini request timed out.')
      return { status: 504, body: { error: 'The reflection is taking too long right now. Please try again.' } }
    }
    console.error('Network error calling Gemini:', err.message)
    return { status: 502, body: { error: 'AI service is temporarily unavailable.' } }
  }
  clearTimeout(timeoutId)

  if (!response.ok) {
    const errText = await response.text().catch(() => '')
    console.error(`Gemini API returned error code ${response.status}: ${errText}`)
    return { status: 503, body: { error: 'AI service is temporarily unavailable.' } }
  }

  let payload
  try {
    payload = await response.json()
  } catch (err) {
    console.error('Failed to parse Gemini response as JSON:', err.message)
    return { status: 502, body: { error: 'AI service returned a malformed response.' } }
  }

  const modelText = payload?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!modelText) {
    console.error('Gemini returned no candidate content.')
    return { status: 502, body: { error: 'AI service failed to generate a response.' } }
  }

  let reflectionData
  try {
    reflectionData = JSON.parse(modelText.trim())
  } catch (err) {
    console.error('Failed to parse model output as JSON.')
    return { status: 502, body: { error: 'AI service returned a malformed response.' } }
  }

  const validated = validateReflection(reflectionData)
  if (!validated) {
    console.error('AI output failed schema validation.')
    return { status: 502, body: { error: 'AI service response failed validation.' } }
  }

  return { status: 200, body: validated }
}
