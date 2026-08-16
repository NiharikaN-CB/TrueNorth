import React, { useRef } from 'react'
import { useJournalStore } from '../../store/useJournalStore'
import JournalCanvas from './JournalCanvas'
import JournalToolbar from './JournalToolbar'
import AutosaveIndicator from './AutosaveIndicator'
import ReflectionPanel from './ReflectionPanel'
import AmbientSoundPlayer from './AmbientSoundPlayer'
import PaperTexturePicker from './PaperTexturePicker'
import PatternTimeline from './PatternTimeline'
import { ArrowLeft, ShieldCheck, Download } from 'lucide-react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

export default function JournalWorkspace() {
  const openLanding = useJournalStore((state) => state.openLanding)
  const canvasComponentRef = useRef(null)

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

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#FAF6F0',
        color: '#2C3E35',
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
          borderBottom: '1px solid #EBE3D7',
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
              background: '#F4ECE1',
              border: 'none',
              borderRadius: '20px',
              padding: '8px 14px',
              fontSize: '13px',
              color: '#8A5844',
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
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '18px', color: '#2C3E35' }}>
              TrueNorth
            </span>
            <span style={{ fontSize: '12px', color: '#8A7B70', marginLeft: '8px' }}>— Digital Scrapbook</span>
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
              color: '#2C5741',
              background: '#EAF4EE',
              padding: '4px 10px',
              borderRadius: '12px',
            }}
          >
            <ShieldCheck size={14} /> 100% Private
          </div>
        </div>
      </header>

      {/* Main Workspace Grid */}
      <main
        style={{
          maxWidth: '1240px',
          margin: '28px auto 0',
          padding: '0 24px',
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: '28px',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Canvas & Toolbar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <JournalToolbar
              onAddSticker={handleAddSticker}
              onAddWashiTape={handleAddWashiTape}
              onClearCanvas={handleClearCanvas}
              onExportPdf={handleExportPdf}
            />
          </div>

          <JournalCanvas ref={canvasComponentRef} />
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
