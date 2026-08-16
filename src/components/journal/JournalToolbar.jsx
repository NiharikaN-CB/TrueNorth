import React, { useState } from 'react'
import { useJournalStore, WASHI_TAPES } from '../../store/useJournalStore'
import StickerPicker from './StickerPicker'
import ChecklistPanel from './ChecklistPanel'
import { Edit3, Type, Eraser, Smile, Trash2, Tag, Download, CheckSquare } from 'lucide-react'

const COLORS = ['#4A5568', '#984343', '#5f8b90', '#7B5E7B', '#8C6D46']

export default function JournalToolbar({ onAddSticker, onAddWashiTape, onClearCanvas, onExportPdf }) {
  const activeTool = useJournalStore((state) => state.activeTool)
  const setActiveTool = useJournalStore((state) => state.setActiveTool)
  const brushColor = useJournalStore((state) => state.brushColor)
  const setBrushColor = useJournalStore((state) => state.setBrushColor)
  const selectedWashi = useJournalStore((state) => state.selectedWashi)
  const setSelectedWashi = useJournalStore((state) => state.setSelectedWashi)
  const checkedCount = useJournalStore(
    (state) => state.pages.find((p) => p.id === state.currentPageId)?.checklist?.length || 0
  )

  const [showStickers, setShowStickers] = useState(false)
  const [showWashi, setShowWashi] = useState(false)
  const [showChecklist, setShowChecklist] = useState(false)

  return (
    <div style={{ position: 'relative' }}>
      {showStickers && (
        <div style={{ position: 'absolute', bottom: '60px', left: '0', zIndex: 50 }}>
          <StickerPicker
            onSelectSticker={(sticker) => {
              if (onAddSticker) onAddSticker(sticker)
              setShowStickers(false)
            }}
            onClose={() => setShowStickers(false)}
          />
        </div>
      )}

      {showWashi && (
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            left: '120px',
            zIndex: 50,
            background: '#FBF5EC',
            border: '1px solid rgba(215, 155, 149, 0.3)',
            borderRadius: '16px',
            padding: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#984343' }}>Choose Washi Tape 🩹</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {WASHI_TAPES.map((tape) => (
              <button
                key={tape.id}
                onClick={() => {
                  setSelectedWashi(tape)
                  if (onAddWashiTape) onAddWashiTape(tape)
                  setShowWashi(false)
                }}
                style={{
                  height: '24px',
                  width: '60px',
                  backgroundColor: tape.color,
                  border: selectedWashi.id === tape.id ? '2px solid #984343' : '1px solid #CCC',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
                title={tape.name}
              />
            ))}
          </div>
        </div>
      )}

      {showChecklist && (
        <div style={{ position: 'absolute', bottom: '60px', left: '0', zIndex: 50 }}>
          <ChecklistPanel onClose={() => setShowChecklist(false)} />
        </div>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#FAF7F2',
          border: '1px solid rgba(215, 155, 149, 0.3)',
          padding: '8px 16px',
          borderRadius: '30px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={() => setActiveTool('pen')}
          style={{
            background: activeTool === 'pen' ? '#984343' : 'transparent',
            color: activeTool === 'pen' ? '#FFFFFF' : '#6B5E55',
            border: 'none',
            borderRadius: '20px',
            padding: '8px 14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          <Edit3 size={15} /> Pen
        </button>

        <button
          onClick={() => setActiveTool('text')}
          style={{
            background: activeTool === 'text' ? '#984343' : 'transparent',
            color: activeTool === 'text' ? '#FFFFFF' : '#6B5E55',
            border: 'none',
            borderRadius: '20px',
            padding: '8px 14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          <Type size={15} /> Text
        </button>

        <button
          onClick={() => setActiveTool('eraser')}
          style={{
            background: activeTool === 'eraser' ? '#984343' : 'transparent',
            color: activeTool === 'eraser' ? '#FFFFFF' : '#6B5E55',
            border: 'none',
            borderRadius: '20px',
            padding: '8px 14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          <Eraser size={15} /> Eraser
        </button>

        <div style={{ width: '1px', height: '20px', background: 'rgba(215, 155, 149, 0.3)', margin: '0 4px' }} />

        <button
          onClick={() => {
            setShowWashi(!showWashi)
            setShowStickers(false)
            setShowChecklist(false)
          }}
          style={{
            background: showWashi ? '#F3E8E3' : 'transparent',
            color: '#8a6a5f',
            border: 'none',
            borderRadius: '20px',
            padding: '8px 12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          <Tag size={15} /> Washi Tape 🩹
        </button>

        <button
          onClick={() => {
            setShowStickers(!showStickers)
            setShowWashi(false)
            setShowChecklist(false)
          }}
          style={{
            background: showStickers ? '#F3E8E3' : 'transparent',
            color: '#984343',
            border: 'none',
            borderRadius: '20px',
            padding: '8px 14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          <Smile size={16} /> Stickers 🎀
        </button>

        <button
          onClick={() => {
            setShowChecklist(!showChecklist)
            setShowWashi(false)
            setShowStickers(false)
          }}
          style={{
            background: showChecklist ? '#F3E8E3' : 'transparent',
            color: '#527D5E',
            border: 'none',
            borderRadius: '20px',
            padding: '8px 14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          <CheckSquare size={15} /> Checklist{checkedCount > 0 ? ` (${checkedCount})` : ''}
        </button>

        <div style={{ width: '1px', height: '20px', background: 'rgba(215, 155, 149, 0.3)', margin: '0 4px' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setBrushColor(c)}
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: c,
                border: brushColor === c ? '2px solid #984343' : '1px solid transparent',
                cursor: 'pointer',
                padding: 0,
              }}
            />
          ))}
        </div>

        <div style={{ width: '1px', height: '20px', background: 'rgba(215, 155, 149, 0.3)', margin: '0 4px' }} />

        {onExportPdf && (
          <button
            onClick={onExportPdf}
            style={{
              background: '#984343',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '20px',
              padding: '8px 14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 500,
            }}
          >
            <Download size={14} /> Export PDF
          </button>
        )}

        {onClearCanvas && (
          <button
            onClick={onClearCanvas}
            style={{
              background: 'transparent',
              color: '#A85B5B',
              border: 'none',
              borderRadius: '20px',
              padding: '8px',
              cursor: 'pointer',
            }}
            title="Clear canvas"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  )
}
