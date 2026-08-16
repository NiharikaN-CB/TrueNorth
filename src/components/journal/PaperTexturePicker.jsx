import React from 'react'
import { useJournalStore, PAPER_TEXTURES } from '../../store/useJournalStore'
import { Layers } from 'lucide-react'

export default function PaperTexturePicker() {
  const paperTexture = useJournalStore((state) => state.paperTexture)
  const setPaperTexture = useJournalStore((state) => state.setPaperTexture)

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        background: '#FAF7F2',
        border: '1px solid #EDE6DD',
        borderRadius: '20px',
        padding: '4px 12px',
      }}
    >
      <Layers size={14} color="#8A7B70" />
      <span style={{ fontSize: '12px', color: '#6B5E55', fontWeight: 500 }}>Paper:</span>
      <div style={{ display: 'flex', gap: '4px' }}>
        {Object.entries(PAPER_TEXTURES).map(([key, tex]) => {
          const isActive = paperTexture === key
          return (
            <button
              key={key}
              onClick={() => setPaperTexture(key)}
              style={{
                background: isActive ? '#2C3E35' : 'transparent',
                color: isActive ? '#FFFFFF' : '#6B5E55',
                border: 'none',
                borderRadius: '12px',
                padding: '3px 8px',
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              {tex.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
