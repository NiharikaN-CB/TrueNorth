import React from 'react'
import { useJournalStore } from '../../store/useJournalStore'

export default function AutosaveIndicator() {
  const autosaveStatus = useJournalStore((state) => state.autosaveStatus)

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '12px',
        color: '#8A7B70',
        background: '#FAF7F2',
        padding: '4px 10px',
        borderRadius: '12px',
        border: '1px solid #EDE6DD',
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor:
            autosaveStatus === 'saving'
              ? '#D97706'
              : autosaveStatus === 'saved'
              ? '#10B981'
              : '#EF4444',
        }}
      />
      <span>
        {autosaveStatus === 'saving'
          ? 'Saving...'
          : autosaveStatus === 'saved'
          ? 'Saved locally'
          : 'Save warning'}
      </span>
    </div>
  )
}
