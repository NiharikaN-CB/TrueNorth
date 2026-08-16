import React from 'react'
import { useJournalStore } from '../../store/useJournalStore'
import { Activity, Calendar, Compass, Sparkles } from 'lucide-react'

export default function PatternTimeline() {
  const patterns = useJournalStore((state) => state.patterns)

  return (
    <div
      style={{
        background: '#FFFDF9',
        border: '1px solid #EBE3D7',
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
        <Compass size={18} color="#C4715A" />
        <h4
          style={{
            fontFamily: "'Playfair Display', serif",
            margin: 0,
            color: '#2C3E35',
            fontSize: '16px',
          }}
        >
          Pattern Memory Timeline 🗺️
        </h4>
      </div>

      <p style={{ fontSize: '12px', color: '#8A7B70', margin: '0 0 14px', lineHeight: '1.5' }}>
        Notice recurring themes across your entries to understand your personal emotional compass over time.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {patterns.map((item) => (
          <div
            key={item.id}
            style={{
              background: '#FAF6F0',
              borderRadius: '12px',
              padding: '12px 14px',
              borderLeft: '3px solid #C4715A',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '11px',
                color: '#8A5844',
                fontWeight: 600,
                marginBottom: '4px',
              }}
            >
              <span>{item.theme}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={12} /> {item.date}
              </span>
            </div>
            <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#3A423D', lineHeight: '1.4' }}>
              {item.observation}
            </p>
            <div style={{ fontSize: '12px', color: '#2C5741', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={12} color="#10B981" /> {item.insight}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
