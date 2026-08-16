import { NextResponse } from "next/server";

export interface Reflection {
  summary: string;
  emotions: string[];
  gentleReflection: string;
  questions: string[];
  recoverySuggestion: string;
  patternObservation: string | null;
  redFlags: Array<{
    observation: string;
    reason: string;
  }>;
}

interface RawFlag {
  observation?: unknown;
  reason?: unknown;
}

function validateReflection(data: unknown): Reflection | null {
  if (!data || typeof data !== "object") return null;
  const obj = data as Record<string, unknown>;

  if (typeof obj.summary !== "string") return null;
  
  if (!Array.isArray(obj.emotions) || !obj.emotions.every((e) => typeof e === "string")) {
    return null;
  }
  
  if (typeof obj.gentleReflection !== "string") return null;
  
  if (!Array.isArray(obj.questions) || !obj.questions.every((q) => typeof q === "string")) {
    return null;
  }
  
  if (typeof obj.recoverySuggestion !== "string") return null;
  
  if (obj.patternObservation !== null && typeof obj.patternObservation !== "string") {
    return null;
  }
  
  if (!Array.isArray(obj.redFlags)) return null;

  for (const flag of obj.redFlags) {
    if (!flag || typeof flag !== "object") return null;
    const flagObj = flag as RawFlag;
    if (typeof flagObj.observation !== "string" || typeof flagObj.reason !== "string") {
      return null;
    }
  }

  return {
    summary: obj.summary,
    emotions: obj.emotions as string[],
    gentleReflection: obj.gentleReflection,
    questions: obj.questions as string[],
    recoverySuggestion: obj.recoverySuggestion,
    patternObservation: obj.patternObservation,
    redFlags: obj.redFlags as Array<{ observation: string; reason: string }>,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { text?: unknown };
    const { text } = body;

    // Enforce 10,000-character input limit and reject empty/whitespace input
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Journal text is required and cannot be empty." },
        { status: 400 }
      );
    }

    if (text.length > 10000) {
      return NextResponse.json(
        { error: "Journal text exceeds the maximum character limit of 10,000." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("Missing GEMINI_API_KEY environment variable.");
      return NextResponse.json(
        { error: "AI service configuration error." },
        { status: 500 }
      );
    }

    const systemInstructions = `You are TrueNorth, a private, women-centered digital journal reflection companion.
Your purpose is to help the user reflect on their dating experiences, process their emotions, and understand their own feelings, needs, boundaries, and values.

Follow these safety and product rules without exception:
1. Focus on the user's emotional experience, feelings, and needs.
2. Encourage grounded self-reflection.
3. Safety & boundaries constraints:
   - Do NOT diagnose the user or anyone else with mental health conditions.
   - Do NOT label other people (avoid diagnostic terms like "narcissist", "gaslighter", "toxic", "borderline", etc.).
   - Do NOT claim certainty about another person's intentions, thoughts, or feelings. Instead, frame observations tentatively (e.g. say "They might have been feeling..." instead of "They did not care about you").
   - Do NOT make decisions for the user or give prescriptive relationship advice (do NOT tell the user to break up, stay, or confront the person).
   - Distinguish observations from facts; keep observations tentative.
4. Red Flags / Things to Notice styling rule:
   - Frame items in the 'redFlags' list as gentle, non-definitive observations to notice (e.g., 'You mentioned feeling anxious when communication became inconsistent. This may be worth exploring...'). Do NOT declare another person's behavior as definitively toxic or emotionally unavailable.
5. Checklist Items Guard:
   - Any checklist selections included in the request represent USER-REPORTED experiences, feelings, needs, values, or observations. They are not objective facts about other people. Frame all reflections regarding checklists as user-focused observations (e.g. 'You noted feeling anxious... you might explore how this pace felt relative to your needs') rather than objective claims about other people's behaviors or motives (never say 'the other person rushed you' or 'he was avoidant').

Output contract:
- You must output your reflection as JSON matching this schema:
  {
    "summary": string (a short 1-2 sentence gentle summary of the entry),
    "emotions": string[] (3-5 emotion tags representing how the user felt),
    "gentleReflection": string (a warm, validating, and calming paragraph reflecting on the user's experience),
    "questions": string[] (2-3 open-ended grounding questions to guide their self-reflection),
    "recoverySuggestion": string (a gentle grounding suggestion or self-care reminder),
    "patternObservation": string | null (any tentative observation of emotional patterns if visible in the current text, or null),
    "redFlags": Array<{ "observation": string, "reason": string }> (gentle observations of behaviors that felt unsettling or boundary-crossing, along with a reason focusing on the user's boundaries/needs, or an empty array if none are visible)
  }
`;

    // Construct standard REST generateContent request
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${systemInstructions}\n\nJournal Entry:\n"""\n${text}\n"""`,
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                summary: { type: "STRING" },
                emotions: {
                  type: "ARRAY",
                  items: { type: "STRING" },
                },
                gentleReflection: { type: "STRING" },
                questions: {
                  type: "ARRAY",
                  items: { type: "STRING" },
                },
                recoverySuggestion: { type: "STRING" },
                patternObservation: { type: "STRING", nullable: true },
                redFlags: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      observation: { type: "STRING" },
                      reason: { type: "STRING" },
                    },
                    required: ["observation", "reason"],
                  },
                },
              },
              required: [
                "summary",
                "emotions",
                "gentleReflection",
                "questions",
                "recoverySuggestion",
                "patternObservation",
                "redFlags",
              ],
            },
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API returned error code ${response.status}: ${errorText}`);
      return NextResponse.json(
        { error: "AI service is temporarily unavailable." },
        { status: 503 }
      );
    }

    const payload = (await response.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>;
        };
      }>;
    };
    const candidates = payload?.candidates;
    const modelText = candidates?.[0]?.content?.parts?.[0]?.text;

    if (!modelText) {
      console.error("Gemini returned an empty candidates/content block:", JSON.stringify(payload));
      return NextResponse.json(
        { error: "AI service failed to generate a response." },
        { status: 502 }
      );
    }

    let reflectionData: unknown;
    try {
      reflectionData = JSON.parse(modelText.trim());
    } catch {
      console.error("Failed to parse Gemini output text as JSON. Model Output:", modelText);
      return NextResponse.json(
        { error: "AI service returned a malformed response." },
        { status: 502 }
      );
    }

    // Validate structured output content and field types
    const validatedData = validateReflection(reflectionData);
    if (!validatedData) {
      console.error("AI output did not match required schema structure:", JSON.stringify(reflectionData));
      return NextResponse.json(
        { error: "AI service response failed validation rules." },
        { status: 502 }
      );
    }

    return NextResponse.json(validatedData);
  } catch (err) {
    console.error("Unhandled error in POST /api/reflect:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
