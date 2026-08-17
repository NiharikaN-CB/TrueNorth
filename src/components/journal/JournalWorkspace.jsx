import React, { useRef, useState } from 'react'
import { useJournalStore } from '../../store/useJournalStore'
import JournalCanvas from './JournalCanvas'
import AntiGravityStickers from './AntiGravityStickers'
import UnsentVentBox from './UnsentVentBox'
import JournalToolbar from './JournalToolbar'
import AutosaveIndicator from './AutosaveIndicator'
import ReflectionPanel from './ReflectionPanel'
import AmbientSoundPlayer from './AmbientSoundPlayer'
import PaperTexturePicker from './PaperTexturePicker'
import PatternTimeline from './PatternTimeline'
import { ArrowLeft, ShieldCheck, Sparkles, BookOpen, Lock, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

export default function JournalWorkspace() {
  const openLanding = useJournalStore((state) => state.openLanding)
  const hasHydrated = useJournalStore((state) => state.hasHydrated)
  const currentPageId = useJournalStore((state) => state.currentPageId)
  const deletePage = useJournalStore((state) => state.deletePage)
  const clearAllData = useJournalStore((state) => state.clearAllData)
  const canvasComponentRef = useRef(null)
  const [confirmAction, setConfirmAction] = useState(null) // null | 'deletePage' | 'clearAll'
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  const [activeWorkspaceMode, setActiveWorkspaceMode] = useState('canvas') // 'canvas' | 'antigravity' | 'vent'
  const [isSanctuaryOpen, setIsSanctuaryOpen] = useState(false)
  const [isVentOpen, setIsVentOpen] = useState(false)

  const handleAddSticker = (sticker) => {
    if (canvasComponentRef.current) {
      canvasComponentRef.current.addSticker(sticker)
    }
  }

  const handleAddWashiTape = (tape) => {
    if (canvasComponentRef.current) {
      canvasComponentRef.current.addWashiTape(tape)
    }
  }

  const handleClearCanvas = () => {
    if (canvasComponentRef.current) {
      canvasComponentRef.current.clearCanvas()
    }
  }

  const handleUndo = () => {
    if (canvasComponentRef.current) {
      canvasComponentRef.current.undo()
    }
  }

  const handleRedo = () => {
    if (canvasComponentRef.current) {
      canvasComponentRef.current.redo()
    }
  }

  const handleHistoryChange = (nextCanUndo, nextCanRedo) => {
    setCanUndo(nextCanUndo)
    setCanRedo(nextCanRedo)
  }

  const handleExportPdf = async () => {
    const pageEl = document.getElementById('journal-scrapbook-page')
    if (!pageEl) return

    try {
      const canvasImage = await html2canvas(pageEl, { scale: 2 })
      const imgData = canvasImage.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvasImage.height * pdfWidth) / canvasImage.width

      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight)
      pdf.save('TrueNorth-Journal-Scrapbook.pdf')
    } catch (err) {
      console.error('Failed to export PDF:', err)
    }
  }

  const handleConfirmAction = () => {
    if (confirmAction === 'deletePage') {
      deletePage(currentPageId)
    } else if (confirmAction === 'clearAll') {
      clearAllData()
    }
    setConfirmAction(null)
  }

  if (!hasHydrated) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F1E4D9',
          color: '#8a6a5f',
          fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          fontSize: '14px',
        }}
      >
        Loading your journal…
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F1E4D9',
        color: '#984343',
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        paddingBottom: '60px',
      }}
    >
      {/* Header */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px 28px',
          background: 'rgba(255, 253, 249, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(215, 155, 149, 0.3)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={openLanding}
            style={{
              background: '#F7D7CD',
              border: 'none',
              borderRadius: '20px',
              padding: '8px 14px',
              fontSize: '13px',
              color: '#8a6a5f',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 500,
            }}
          >
            <ArrowLeft size={16} /> Home
          </button>
          <div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '18px', color: '#984343' }}>
              TrueNorth
            </span>
            <span style={{ fontSize: '12px', color: '#8A7B70', marginLeft: '8px' }}>— Digital Planner &amp; Reflection</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <AmbientSoundPlayer />
          <PaperTexturePicker />
          <AutosaveIndicator />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px',
              color: '#5f8b90',
              background: 'rgba(145, 189, 194, 0.18)',
              padding: '4px 10px',
              borderRadius: '12px',
            }}
          >
            <ShieldCheck size={14} /> 100% Private
          </div>
          <button
            onClick={() => setConfirmAction('deletePage')}
            title="Delete this page"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px',
              color: '#A85B5B',
              background: 'transparent',
              border: '1px solid rgba(215, 155, 149, 0.25)',
              padding: '4px 10px',
              borderRadius: '12px',
              cursor: 'pointer',
            }}
          >
            <Trash2 size={13} /> Delete Page
          </button>
          <button
            onClick={() => setConfirmAction('clearAll')}
            title="Permanently clear all journal data"
            style={{
              fontSize: '12px',
              color: '#A85B5B',
              background: 'transparent',
              border: '1px solid rgba(215, 155, 149, 0.25)',
              padding: '4px 10px',
              borderRadius: '12px',
              cursor: 'pointer',
            }}
          >
            Clear all data
          </button>
        </div>
      </header>

      {/* Workspace Mode Switcher (Canvas vs Floating Sanctuary vs Unsent Vent Box) */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <div
          style={{
            display: 'inline-flex',
            background: '#EFE8DE',
            padding: '4px',
            borderRadius: '24px',
            border: '1px solid #E2D9CF',
            gap: '4px',
          }}
        >
          <button
            onClick={() => setActiveWorkspaceMode('canvas')}
            style={{
              background: activeWorkspaceMode === 'canvas' ? '#FFFDF9' : 'transparent',
              color: activeWorkspaceMode === 'canvas' ? '#C4715A' : '#6B5E55',
              border: 'none',
              borderRadius: '20px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: activeWorkspaceMode === 'canvas' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            <BookOpen size={15} /> Journal Canvas
          </button>

          <button
            onClick={() => setActiveWorkspaceMode('antigravity')}
            style={{
              background: activeWorkspaceMode === 'antigravity' ? '#FFFDF9' : 'transparent',
              color: activeWorkspaceMode === 'antigravity' ? '#C4715A' : '#6B5E55',
              border: 'none',
              borderRadius: '20px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: activeWorkspaceMode === 'antigravity' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            <Sparkles size={15} color="#C4715A" /> Floating Sanctuary 🌌
          </button>

          <button
            onClick={() => setActiveWorkspaceMode('vent')}
            style={{
              background: activeWorkspaceMode === 'vent' ? '#FFFDF9' : 'transparent',
              color: activeWorkspaceMode === 'vent' ? '#D9486B' : '#6B5E55',
              border: 'none',
              borderRadius: '20px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: activeWorkspaceMode === 'vent' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            <Lock size={15} color="#D9486B" /> Unsent Vent Vault 🔒
          </button>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <main
        className="tn-journal-main"
        style={{
          maxWidth: '1240px',
          margin: '24px auto 0',
          padding: '0 24px',
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: '28px',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Canvas, Floating Sanctuary, or Unsent Vent Vault */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {activeWorkspaceMode === 'canvas' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <JournalToolbar
                  onAddSticker={handleAddSticker}
                  onAddWashiTape={handleAddWashiTape}
                  onClearCanvas={handleClearCanvas}
                  onExportPdf={handleExportPdf}
                  onUndo={handleUndo}
                  onRedo={handleRedo}
                  canUndo={canUndo}
                  canRedo={canRedo}
                />
              </div>
              <JournalCanvas ref={canvasComponentRef} onHistoryChange={handleHistoryChange} />

              {/* Collapsible Sanctuary Tools Section */}
              <div style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ 
                  borderBottom: '1px solid rgba(215, 155, 149, 0.3)', 
                  paddingBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Sparkles size={16} color="#C4715A" />
                  <span style={{ 
                    fontFamily: "'Playfair Display', serif", 
                    fontWeight: 700, 
                    fontSize: '16px', 
                    color: '#984343' 
                  }}>
                    Workspace Companions &amp; Sanctuary
                  </span>
                </div>

                {/* Collapsible Floating Sanctuary Card */}
                <div style={{
                  background: '#FFFDF9',
                  border: '1px solid #EBE3D7',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                  transition: 'all 0.3s ease'
                }}>
                  <button
                    onClick={() => setIsSanctuaryOpen(!isSanctuaryOpen)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px 20px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '18px' }}>🌌</span>
                      <div>
                        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '15px', color: '#2C3E35', display: 'block' }}>
                          Floating Sanctuary Emotes
                        </span>
                        <span style={{ fontSize: '11px', color: '#8A7B70' }}>
                          Drag, toss, and let peaceful emotes float under zero gravity
                        </span>
                      </div>
                    </div>
                    {isSanctuaryOpen ? <ChevronUp size={16} color="#8a6a5f" /> : <ChevronDown size={16} color="#8a6a5f" />}
                  </button>
                  {isSanctuaryOpen && (
                    <div style={{ padding: '0 20px 20px 20px', borderTop: '1px dashed #E2D9CF', paddingTop: '16px' }}>
                      <AntiGravityStickers />
                    </div>
                  )}
                </div>

                {/* Collapsible Unsent Vent Vault Card */}
                <div style={{
                  background: '#FFFDF9',
                  border: '1px solid #EBE3D7',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                  transition: 'all 0.3s ease'
                }}>
                  <button
                    onClick={() => setIsVentOpen(!isVentOpen)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px 20px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '18px' }}>🧰</span>
                      <div>
                        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '15px', color: '#2C3E35', display: 'block' }}>
                          Message-Eating Vent Vault
                        </span>
                        <span style={{ fontSize: '11px', color: '#8A7B70' }}>
                          Express unsent thoughts safely and let the chest digest them securely
                        </span>
                      </div>
                    </div>
                    {isVentOpen ? <ChevronUp size={16} color="#8a6a5f" /> : <ChevronDown size={16} color="#8a6a5f" />}
                  </button>
                  {isVentOpen && (
                    <div style={{ padding: '0 20px 20px 20px', borderTop: '1px dashed #E2D9CF', paddingTop: '16px' }}>
                      <UnsentVentBox />
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeWorkspaceMode === 'antigravity' && <AntiGravityStickers />}

          {activeWorkspaceMode === 'vent' && <UnsentVentBox />}
        </div>

        {/* Right Column: AI Reflection & Pattern Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <ReflectionPanel />
          <PatternTimeline />
        </div>
      </main>
    </div>
  )
}
