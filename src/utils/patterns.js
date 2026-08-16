const MIN_OCCURRENCES = 2

function normalizeEmotion(raw) {
  return typeof raw === 'string' ? raw.trim().toLowerCase() : ''
}

// Derives tentative, observation-only pattern entries from the emotion tags
// attached to each page's completed AI reflection. Purely local computation
// over data already on the device — no AI call involved, and no claim of
// memory beyond the entries currently stored. Each entry counts an emotion
// at most once, so a single wordy reflection can't fake a "recurring" theme.
export function derivePatterns(pages) {
  const reflectedPages = (pages || []).filter(
    (p) => p?.reflection && Array.isArray(p.reflection.emotions)
  )
  const totalReflections = reflectedPages.length

  if (totalReflections < MIN_OCCURRENCES) {
    return { totalReflections, observations: [] }
  }

  const counts = new Map()
  for (const page of reflectedPages) {
    const seenInThisEntry = new Set(page.reflection.emotions.map(normalizeEmotion).filter(Boolean))
    for (const emotion of seenInThisEntry) {
      counts.set(emotion, (counts.get(emotion) || 0) + 1)
    }
  }

  const observations = Array.from(counts.entries())
    .filter(([, count]) => count >= MIN_OCCURRENCES)
    .sort((a, b) => b[1] - a[1])
    .map(([emotion, count]) => ({
      id: `pattern-${emotion}`,
      emotion,
      count,
      text: `You've mentioned feeling ${emotion} in ${count} of your last ${totalReflections} reflections.`,
    }))

  return { totalReflections, observations }
}
