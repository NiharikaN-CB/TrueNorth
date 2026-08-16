import React from 'react'
import { useJournalStore } from '../../store/useJournalStore'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'

export default function PageNavigator() {
  const pages = useJournalStore((state) => state.pages)
  const currentPageId = useJournalStore((state) => state.currentPageId)
  const setCurrentPageId = useJournalStore((state) => state.setCurrentPageId)
  const addPage = useJournalStore((state) => state.addPage)

  const currentIndex = Math.max(
    0,
    pages.findIndex((p) => p.id === currentPageId)
  )

  const goPrev = () => {
    if (currentIndex > 0) setCurrentPageId(pages[currentIndex - 1].id)
  }

  const goNext = () => {
    if (currentIndex < pages.length - 1) setCurrentPageId(pages[currentIndex + 1].id)
  }

  const navButtonStyle = (enabled) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    border: '1px solid rgba(215, 155, 149, 0.3)',
    background: '#FFFFFF',
    color: enabled ? '#6B5E55' : '#D8CFC4',
    cursor: enabled ? 'pointer' : 'not-allowed',
  })

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '14px',
      }}
    >
      <button onClick={goPrev} disabled={currentIndex === 0} title="Previous page" style={navButtonStyle(currentIndex > 0)}>
        <ChevronLeft size={16} />
      </button>

      <span style={{ fontSize: '12px', fontWeight: 600, color: '#6B5E55', minWidth: '92px', textAlign: 'center' }}>
        Page {currentIndex + 1} of {pages.length}
      </span>

      <button
        onClick={goNext}
        disabled={currentIndex === pages.length - 1}
        title="Next page"
        style={navButtonStyle(currentIndex < pages.length - 1)}
      >
        <ChevronRight size={16} />
      </button>

      <div style={{ width: '1px', height: '18px', background: 'rgba(215, 155, 149, 0.3)' }} />

      <button
        onClick={addPage}
        title="Add a new page"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          fontWeight: 500,
          color: '#8a6a5f',
          background: '#F7D7CD',
          border: 'none',
          borderRadius: '20px',
          padding: '7px 14px',
          cursor: 'pointer',
        }}
      >
        <Plus size={14} /> New Page
      </button>
    </div>
  )
}
