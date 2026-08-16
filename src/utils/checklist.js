// The 5 optional reflection categories named in the PRD, each with a small,
// tasteful set of items. Deliberately kept light — this is meant to help
// someone quickly point at what they experienced, not a task list.
export const CHECKLIST_CATEGORIES = [
  {
    id: 'feelings',
    label: 'How am I feeling?',
    items: [
      { id: 'feelings:anxious', label: 'Anxious' },
      { id: 'feelings:hopeful', label: 'Hopeful' },
      { id: 'feelings:drained', label: 'Drained' },
      { id: 'feelings:unsettled', label: 'Unsettled' },
      { id: 'feelings:confused', label: 'Confused' },
      { id: 'feelings:calm', label: 'Calm' },
      { id: 'feelings:excited', label: 'Excited' },
      { id: 'feelings:disappointed', label: 'Disappointed' },
    ],
  },
  {
    id: 'needs',
    label: 'What do I need right now?',
    items: [
      { id: 'needs:space', label: 'Space' },
      { id: 'needs:clarity', label: 'Clarity' },
      { id: 'needs:reassurance', label: 'Reassurance' },
      { id: 'needs:rest', label: 'Rest' },
      { id: 'needs:validation', label: 'Validation' },
      { id: 'needs:distraction', label: 'A distraction' },
      { id: 'needs:to_vent', label: 'To vent' },
    ],
  },
  {
    id: 'felt_good',
    label: 'What felt good?',
    items: [
      { id: 'good:consistency', label: 'Their consistency' },
      { id: 'good:feeling_heard', label: 'Feeling heard' },
      { id: 'good:honesty', label: 'Honesty' },
      { id: 'good:effort', label: 'Their effort' },
      { id: 'good:humor', label: 'Shared humor' },
      { id: 'good:respect_for_time', label: 'Respect for my time' },
    ],
  },
  {
    id: 'felt_uncomfortable',
    label: 'What felt uncomfortable?',
    items: [
      { id: 'uncomfortable:mixed_signals', label: 'Mixed signals' },
      { id: 'uncomfortable:inconsistency', label: 'Inconsistency' },
      { id: 'uncomfortable:pressure', label: 'Feeling pressured' },
      { id: 'uncomfortable:vague_answers', label: 'Vague answers' },
      { id: 'uncomfortable:rushed_pace', label: 'A rushed pace' },
      { id: 'uncomfortable:dismissed', label: 'Feeling dismissed' },
    ],
  },
  {
    id: 'values',
    label: 'What values mattered to me?',
    items: [
      { id: 'values:honesty', label: 'Honesty' },
      { id: 'values:respect', label: 'Respect' },
      { id: 'values:consistency', label: 'Consistency' },
      { id: 'values:kindness', label: 'Kindness' },
      { id: 'values:communication', label: 'Clear communication' },
      { id: 'values:independence', label: 'Independence' },
    ],
  },
]

// Formats a page's checked item ids into a labeled block for the reflection
// request, grouped by category. Returns '' if nothing is checked.
export function formatChecklistForReflection(checkedIds) {
  const checked = new Set(checkedIds || [])
  if (checked.size === 0) return ''

  const lines = []
  for (const category of CHECKLIST_CATEGORIES) {
    const selected = category.items.filter((item) => checked.has(item.id))
    if (selected.length > 0) {
      lines.push(`${category.label} ${selected.map((i) => i.label).join(', ')}`)
    }
  }

  if (lines.length === 0) return ''
  return `User-selected checklist items (self-reported, not facts about anyone else):\n${lines.join('\n')}`
}
