import React, { useState } from 'react'
import { useJournalStore } from '../../store/useJournalStore'

export const AESTHETIC_STICKER_PACKS = [
  {
    category: '🌸 Pastel Kawaii',
    stickers: [
      { id: 'boba', symbol: '🧋', bg: '#FFF5F0', border: '#FCD7C7' },
      { id: 'bunny', symbol: '🐰', bg: '#FFF0F5', border: '#FFD6E8' },
      { id: 'strawberry', symbol: '🍓', bg: '#FFEBEB', border: '#FFC4C4' },
      { id: 'peach', symbol: '🍑', bg: '#FFF3EB', border: '#FCD6C2' },
      { id: 'cat_paw', symbol: '🐾', bg: '#F5F0FF', border: '#E2D4FF' },
      { id: 'cherry', symbol: '🍒', bg: '#FFF0F3', border: '#FFC8D3' },
    ],
  },
  {
    category: '🌊 Seaside & Coastal',
    stickers: [
      { id: 'shell', symbol: '🐚', bg: '#FDF6F0', border: '#F4C7B8' },
      { id: 'bottle', symbol: '🍾', bg: '#EAF4EE', border: '#B7E4C7' },
      { id: 'wave', symbol: '🌊', bg: '#F0F8FF', border: '#B0C4DE' },
      { id: 'pearl', symbol: '🦪', bg: '#FAF0F5', border: '#E8D2DF' },
      { id: 'starfish', symbol: '⭐', bg: '#FFFBF0', border: '#FCE7B2' },
    ],
  },
  {
    category: '✨ Mindful & Self-Care',
    stickers: [
      { id: 'gem', symbol: '💎', bg: '#F0F7FF', border: '#BEE3F8' },
      { id: 'sparkles', symbol: '✨', bg: '#FEFCBF', border: '#F6E05E' },
      { id: 'green_light', symbol: '🟢', bg: '#E6FFFA', border: '#B2F5EA' },
      { id: 'gentle_flag', symbol: '🚩', bg: '#FFF5F5', border: '#FED7D7' },
      { id: 'crystal', symbol: '🔮', bg: '#F3E8FF', border: '#E9D8FD' },
      { id: 'candle', symbol: '🕯️', bg: '#FFFDF0', border: '#F5EBA0' },
    ],
  },
  {
    category: '🎀 Scrapbook Accents',
    stickers: [
      { id: 'ribbon', symbol: '🎀', bg: '#FFE3EA', border: '#FFB6C1' },
      { id: 'heart', symbol: '💖', bg: '#FFF0F5', border: '#FFC0CB' },
      { id: 'polaroid', symbol: '📸', bg: '#FAF6F0', border: '#E2D9CF' },
      { id: 'flower', symbol: '🌸', bg: '#FFF0F6', border: '#FCC2D7' },
      { id: 'coffee', symbol: '☕', bg: '#F6EFEA', border: '#DFD1C4' },
      { id: 'note', symbol: '📝', bg: '#FFFDF0', border: '#F4E8B0' },
    ],
  },
]

export default function StickerPicker({ onSelectSticker, onClose }) {
  const selectedSticker = useJournalStore((state) => state.selectedSticker)
  const setSelectedSticker = useJournalStore((state) => state.setSelectedSticker)
  const [activeCategory, setActiveCategory] = useState(AESTHETIC_STICKER_PACKS[0].category)

  const currentPack =
    AESTHETIC_STICKER_PACKS.find((p) => p.category === activeCategory) ||
    AESTHETIC_STICKER_PACKS[0]

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
        boxShadow: '0 12px 36px rgba(0,0,0,0.1)',
        maxWidth: '300px',
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
            fontWeight: 700,
            color: '#2C3E35',
            fontSize: '15px',
          }}
        >
          Aesthetic Stickers 🎀
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

      {/* Category Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '12px',
        }}
      >
        {AESTHETIC_STICKER_PACKS.map((pack) => (
          <button
            key={pack.category}
            onClick={() => setActiveCategory(pack.category)}
            style={{
              background: activeCategory === pack.category ? '#C4715A' : '#F4ECE1',
              color: activeCategory === pack.category ? '#FFFFFF' : '#8A5844',
              border: 'none',
              borderRadius: '12px',
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {pack.category}
          </button>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
          maxHeight: '200px',
          overflowY: 'auto',
          paddingRight: '4px',
        }}
      >
        {currentPack.stickers.map((sticker) => {
          const isSelected = selectedSticker?.id === sticker.id
          return (
            <button
              key={sticker.id}
              onClick={() => handlePick(sticker)}
              style={{
                borderRadius: '14px',
                border: isSelected ? '2px solid #C4715A' : `1px solid ${sticker.border}`,
                background: isSelected ? '#FDF6F0' : sticker.bg,
                padding: '12px 8px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: '28px', lineHeight: 1 }}>{sticker.symbol}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
