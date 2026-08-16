import React from 'react'
import { useJournalStore } from '../../store/useJournalStore'

export const KAWAII_STICKERS = [
  { id: 'shell', symbol: '🐚', name: 'Seashell', category: 'Coastal' },
  { id: 'rose', symbol: '🌹', name: 'Rose', category: 'Coastal' },
  { id: 'sparkle', symbol: '✨', name: 'Sparkles', category: 'Cute' },
  { id: 'heart', symbol: '💖', name: 'Sparkle Heart', category: 'Cute' },
  { id: 'ribbon', symbol: '🎀', name: 'Ribbon Bow', category: 'Cute' },
  { id: 'coffee', symbol: '☕', name: 'Cozy Coffee', category: 'Cozy' },
  { id: 'matcha', symbol: '🍵', name: 'Matcha Tea', category: 'Cozy' },
  { id: 'camera', symbol: '📸', name: 'Memory Polaroid', category: 'Cozy' },
  { id: 'flower', symbol: '🌸', name: 'Blossom', category: 'Cute' },
  { id: 'star', symbol: '💫', name: 'Dizzy Star', category: 'Cute' },
  { id: 'gem', symbol: '💎', name: 'Boundary Gem', category: 'Reflect' },
  { id: 'note', symbol: '📝', name: 'Private Note', category: 'Reflect' },
  { id: 'flag_red', symbol: '🚩', name: 'Gentle Notice', category: 'Reflect' },
  { id: 'flag_green', symbol: '🟢', name: 'Green Light', category: 'Reflect' },
  { id: 'cloud', symbol: '☁️', name: 'Quiet Cloud', category: 'Cozy' },
  { id: 'moon', symbol: '🌙', name: 'Night Reflection', category: 'Cozy' },
]

export default function StickerPicker({ onSelectSticker, onClose }) {
  const selectedSticker = useJournalStore((state) => state.selectedSticker)
  const setSelectedSticker = useJournalStore((state) => state.setSelectedSticker)

  const handlePick = (sticker) => {
    setSelectedSticker(sticker)
    if (onSelectSticker) onSelectSticker(sticker)
  }

  return (
    <div
      style={{
        background: '#FBF5EC',
        border: '1px solid rgba(215, 155, 149, 0.3)',
        borderRadius: '16px',
        padding: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        maxWidth: '320px',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
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
          Kawaii &amp; Coastal Sticker Pack 🎀
        </span>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#8a6a5f',
              fontSize: '14px',
            }}
          >
            ✕
          </button>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '10px',
          maxHeight: '220px',
          overflowY: 'auto',
          paddingRight: '4px',
        }}
      >
        {KAWAII_STICKERS.map((sticker) => {
          const isSelected = selectedSticker?.id === sticker.id
          return (
            <button
              key={sticker.id}
              onClick={() => handlePick(sticker)}
              title={sticker.name}
              style={{
                fontSize: '24px',
                padding: '10px',
                borderRadius: '12px',
                border: isSelected ? '2px solid #984343' : '1px solid rgba(215, 155, 149, 0.25)',
                background: isSelected ? '#FDF6F0' : '#FAFAFA',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {sticker.symbol}
            </button>
          );
        })}
      </div>
      <div
        style={{
          marginTop: '12px',
          fontSize: '11px',
          color: '#8a6a5f',
          textAlign: 'center',
          fontStyle: 'italic',
        }}
      >
        Tap a sticker to add it to your journal canvas ✨
      </div>
    </div>
  )
}
