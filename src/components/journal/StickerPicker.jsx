import React, { useState } from 'react'
import { useJournalStore } from '../../store/useJournalStore'

export const AESTHETIC_STICKER_PACKS = [
  {
    category: '🌸 Pastel Kawaii',
    stickers: [
      { id: 'boba', symbol: '🧋', name: 'Boba Tea', bg: '#FFF5F0', border: '#FCD7C7' },
      { id: 'bunny', symbol: '🐰', name: 'Soft Bunny', bg: '#FFF0F5', border: '#FFD6E8' },
      { id: 'strawberry', symbol: '🍓', name: 'Berry Sweet', bg: '#FFEBEB', border: '#FFC4C4' },
      { id: 'peach', symbol: '🍑', name: 'Peach Vibes', bg: '#FFF3EB', border: '#FCD6C2' },
      { id: 'cat_paw', symbol: '🐾', name: 'Gentle Paw', bg: '#F5F0FF', border: '#E2D4FF' },
      { id: 'cherry', symbol: '🍒', name: 'Twin Cherries', bg: '#FFF0F3', border: '#FFC8D3' },
    ],
  },
  {
    category: '🌊 Seaside & Coastal',
    stickers: [
      { id: 'shell', symbol: '🐚', name: 'Seashell', bg: '#FDF6F0', border: '#F4C7B8' },
      { id: 'bottle', symbol: '🍾', name: 'Bottle Message', bg: '#EAF4EE', border: '#B7E4C7' },
      { id: 'wave', symbol: '🌊', name: 'Calm Wave', bg: '#F0F8FF', border: '#B0C4DE' },
      { id: 'pearl', symbol: '🦪', name: 'Ocean Pearl', bg: '#FAF0F5', border: '#E8D2DF' },
      { id: 'starfish', symbol: '⭐', name: 'Beach Star', bg: '#FFFBF0', border: '#FCE7B2' },
    ],
  },
  {
    category: '✨ Mindful & Self-Care',
    stickers: [
      { id: 'gem', symbol: '💎', name: 'Boundary Gem', bg: '#F0F7FF', border: '#BEE3F8' },
      { id: 'sparkles', symbol: '✨', name: 'Sparkles', bg: '#FEFCBF', border: '#F6E05E' },
      { id: 'green_light', symbol: '🟢', name: 'Green Light', bg: '#E6FFFA', border: '#B2F5EA' },
      { id: 'gentle_flag', symbol: '🚩', name: 'Gentle Notice', bg: '#FFF5F5', border: '#FED7D7' },
      { id: 'crystal', symbol: '🔮', name: 'Self Clarity', bg: '#F3E8FF', border: '#E9D8FD' },
      { id: 'candle', symbol: '🕯️', name: 'Quiet Light', bg: '#FFFDF0', border: '#F5EBA0' },
    ],
  },
  {
    category: '🎀 Scrapbook Accents',
    stickers: [
      { id: 'ribbon', symbol: '🎀', name: 'Ribbon Bow', bg: '#FFE3EA', border: '#FFB6C1' },
      { id: 'heart', symbol: '💖', name: 'Sparkle Heart', bg: '#FFF0F5', border: '#FFC0CB' },
      { id: 'polaroid', symbol: '📸', name: 'Polaroid Memory', bg: '#FAF6F0', border: '#E2D9CF' },
      { id: 'flower', symbol: '🌸', name: 'Blossom', bg: '#FFF0F6', border: '#FCC2D7' },
      { id: 'coffee', symbol: '☕', name: 'Cozy Coffee', bg: '#F6EFEA', border: '#DFD1C4' },
      { id: 'note', symbol: '📝', name: 'Warm Note', bg: '#FFFDF0', border: '#F4E8B0' },
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
        background: '#FFFDF9',
        border: '1px solid #E2D9CF',
        borderRadius: '20px',
        padding: '16px',
        boxShadow: '0 12px 36px rgba(0,0,0,0.1)',
        maxWidth: '340px',
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
          Aesthetic Sticker Collection 🎀
        </span>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#8A7B70',
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
          maxHeight: '220px',
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
              title={sticker.name}
              style={{
                borderRadius: '14px',
                border: isSelected ? '2px solid #C4715A' : `1px solid ${sticker.border}`,
                background: isSelected ? '#FDF6F0' : sticker.bg,
                padding: '10px 6px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
              }}
            >
              <span style={{ fontSize: '24px', lineHeight: 1 }}>{sticker.symbol}</span>
              <span style={{ fontSize: '10px', color: '#6B5E55', fontWeight: 500 }}>{sticker.name}</span>
            </button>
          )
        })}
      </div>

      <div
        style={{
          marginTop: '12px',
          fontSize: '11px',
          color: '#8A7B70',
          textAlign: 'center',
          fontStyle: 'italic',
        }}
      >
        Tap a sticker to place on your journal canvas ✨
      </div>
    </div>
  )
}
