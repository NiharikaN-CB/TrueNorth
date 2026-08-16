import React from 'react'
import { useJournalStore } from '../../store/useJournalStore'
import { derivePatterns } from '../../utils/patterns'
import { Compass, Sparkles } from 'lucide-react'

export default function PatternTimeline() {
  const pages = useJournalStore((state) => state.pages)
  const { totalReflections, observations } = derivePatterns(pages)

  return (
    <div
      style={{
        background: '#FBF5EC',
        border: '1px solid rgba(215, 155, 149, 0.3)',
        borderRadius: '20px',
        padding: '20px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '14px',
        }}
      >
        <Compass size={18} color="#984343" />
        <h4
          style={{
            fontFamily: "'Playfair Display', serif",
            margin: 0,
            color: '#984343',
            fontSize: '16px',
          }}
        >
          Pattern Memory Timeline 🗺️
        </h4>
      </div>

      <p style={{ fontSize: '12px', color: '#8a6a5f', margin: '0 0 14px', lineHeight: '1.5' }}>
        Notice recurring themes across your entries to understand your personal emotional compass over time.
      </p>

      {totalReflections < 2 ? (
        <p style={{ fontSize: '12.5px', color: '#8a6a5f', lineHeight: '1.6', margin: 0, fontStyle: 'italic' }}>
          Reflect on at least two entries and TrueNorth will gently start noticing themes that repeat — never a
          diagnosis, just an observation.
        </p>
      ) : observations.length === 0 ? (
        <p style={{ fontSize: '12.5px', color: '#8a6a5f', lineHeight: '1.6', margin: 0, fontStyle: 'italic' }}>
          Nothing has repeated across your {totalReflections} reflections yet. Keep journaling — patterns will
          surface here as they emerge.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {observations.map((item) => (
            <div
              key={item.id}
              style={{
                background: '#F1E4D9',
                borderRadius: '12px',
                padding: '12px 14px',
                borderLeft: '3px solid #984343',
                display: 'flex',
                gap: '8px',
                alignItems: 'flex-start',
              }}
            >
              <Sparkles size={14} color="#984343" style={{ marginTop: '2px', flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: '13px', color: '#4A2E28', lineHeight: '1.5' }}>{item.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
