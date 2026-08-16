import React, { useState } from 'react'
import { useJournalStore } from '../../store/useJournalStore'
import { CHECKLIST_CATEGORIES } from '../../utils/checklist'

export default function ChecklistPanel({ onClose }) {
  const [activeCategoryId, setActiveCategoryId] = useState(CHECKLIST_CATEGORIES[0].id)
  const currentPage = useJournalStore((state) => state.pages.find((p) => p.id === state.currentPageId))
  const toggleChecklistItem = useJournalStore((state) => state.toggleChecklistItem)

  const checked = new Set(currentPage?.checklist || [])
  const activeCategory = CHECKLIST_CATEGORIES.find((c) => c.id === activeCategoryId)

  return (
    <div
      style={{
        background: '#FBF5EC',
        border: '1px solid rgba(215, 155, 149, 0.3)',
        borderRadius: '16px',
        padding: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        maxWidth: '360px',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
        }}
      >
        <span
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 600,
            color: '#984343',
            fontSize: '15px',
          }}
        >
          Optional Reflection Checklist ☑
        </span>
        {onClose && (
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8a6a5f', fontSize: '14px' }}
          >
            ✕
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
        {CHECKLIST_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategoryId(cat.id)}
            style={{
              background: activeCategoryId === cat.id ? '#984343' : '#F7D7CD',
              color: activeCategoryId === cat.id ? '#FFFFFF' : '#6B5E55',
              border: 'none',
              borderRadius: '14px',
              padding: '5px 11px',
              fontSize: '11px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px',
          maxHeight: '200px',
          overflowY: 'auto',
          paddingRight: '4px',
        }}
      >
        {activeCategory.items.map((item) => {
          const isChecked = checked.has(item.id)
          return (
            <label
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 9px',
                borderRadius: '10px',
                border: isChecked ? '1px solid #984343' : '1px solid rgba(215, 155, 149, 0.25)',
                background: isChecked ? '#FDF3EF' : '#FAFAFA',
                cursor: 'pointer',
                fontSize: '12.5px',
                color: '#4A2E28',
              }}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggleChecklistItem(item.id)}
                style={{ accentColor: '#984343', cursor: 'pointer' }}
              />
              {item.label}
            </label>
          )
        })}
      </div>

      <div style={{ marginTop: '12px', fontSize: '11px', color: '#8a6a5f', textAlign: 'center', fontStyle: 'italic' }}>
        Entirely optional — check anything that fits, or skip it.
      </div>
    </div>
  )
}
