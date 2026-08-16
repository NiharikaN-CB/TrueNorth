const TEXT_OBJECT_TYPES = new Set(['textbox', 'text', 'i-text'])
const PLACEHOLDER_TEXTS = new Set(['Type your thoughts here...'])

// Pulls the text content out of any text/textbox objects a user has typed
// directly onto the Fabric canvas (via "+ Add Text Box"), so that content
// is included in what gets sent for reflection alongside the notes field.
export function extractTextFromCanvasData(canvasData) {
  if (!canvasData || !Array.isArray(canvasData.objects)) return ''

  return canvasData.objects
    .filter((obj) => TEXT_OBJECT_TYPES.has(obj?.type) && typeof obj.text === 'string')
    .map((obj) => obj.text.trim())
    .filter((text) => text.length > 0 && !PLACEHOLDER_TEXTS.has(text))
    .join('\n')
}
