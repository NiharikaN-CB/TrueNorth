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
        background: '#FFFDF9',
        border: '1px solid #E2D9CF',
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
            color: '#2C3E35',
            fontSize: '15px',
          }}
        >
          Optional Reflection Checklist ☑
        </span>
        {onClose && (
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8A7B70', fontSize: '14px' }}
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
              background: activeCategoryId === cat.id ? '#C4715A' : '#F4ECE1',
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
                border: isChecked ? '1px solid #C4715A' : '1px solid #F0ECE4',
                background: isChecked ? '#FDF3EF' : '#FAFAFA',
                cursor: 'pointer',
                fontSize: '12.5px',
                color: '#3A423D',
              }}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggleChecklistItem(item.id)}
                style={{ accentColor: '#C4715A', cursor: 'pointer' }}
              />
              {item.label}
            </label>
          )
        })}
      </div>

      <div style={{ marginTop: '12px', fontSize: '11px', color: '#8A7B70', textAlign: 'center', fontStyle: 'italic' }}>
        Entirely optional — check anything that fits, or skip it.
      </div>
    </div>
  )
}
