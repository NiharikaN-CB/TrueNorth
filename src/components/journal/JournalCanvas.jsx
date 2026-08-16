import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react'
import { Canvas, PencilBrush, Textbox, FabricText, Rect } from 'fabric'
import { useJournalStore, PAPER_TEXTURES } from '../../store/useJournalStore'

const JournalCanvas = forwardRef(function JournalCanvas({ onCanvasChange }, ref) {
  const canvasRef = useRef(null)
  const fabricCanvasRef = useRef(null)
  const loadedPageIdRef = useRef(null)
  const notesTextRef = useRef('')

  const activeTool = useJournalStore((state) => state.activeTool)
  const brushColor = useJournalStore((state) => state.brushColor)
  const brushSize = useJournalStore((state) => state.brushSize)
  const paperTextureKey = useJournalStore((state) => state.paperTexture)
  const paperTexture = PAPER_TEXTURES[paperTextureKey] || PAPER_TEXTURES.linen
  const updateCurrentPageData = useJournalStore((state) => state.updateCurrentPageData)
  const hasHydrated = useJournalStore((state) => state.hasHydrated)
  const currentPageId = useJournalStore((state) => state.currentPageId)
  const currentPageCreatedAt = useJournalStore(
    (state) => state.pages.find((p) => p.id === state.currentPageId)?.createdAt
  )

  const [notesText, setNotesText] = useState('')

  useEffect(() => {
    notesTextRef.current = notesText
  }, [notesText])

  useEffect(() => {
    if (!canvasRef.current) return

    const initCanvas = new Canvas(canvasRef.current, {
      width: 720,
      height: 480,
      isDrawingMode: true,
      backgroundColor: paperTexture.bg,
    })

    const brush = new PencilBrush(initCanvas)
    brush.color = brushColor
    brush.width = brushSize
    initCanvas.freeDrawingBrush = brush

    fabricCanvasRef.current = initCanvas

    initCanvas.on('path:created', () => {
      const json = initCanvas.toJSON()
      if (onCanvasChange) {
        onCanvasChange(json)
      }
      updateCurrentPageData(json, notesTextRef.current)
    })

    return () => {
      initCanvas.dispose()
    }
  }, [])

  // Load this page's saved canvas + notes whenever the active page changes
  // (initial hydration, page delete/switch), guarded so it only re-runs when
  // the page actually changes rather than on every unrelated re-render. The
  // mount effect above always creates a blank canvas first since hydration
  // is async and can't block first paint.
  useEffect(() => {
    if (!hasHydrated || loadedPageIdRef.current === currentPageId) return
    loadedPageIdRef.current = currentPageId

    const { pages } = useJournalStore.getState()
    const page = pages.find((p) => p.id === currentPageId)
    if (!page) return

    setNotesText(page.notesText || '')

    const canvas = fabricCanvasRef.current
    if (!canvas) return

    // Guards the async loadFromJSON against React StrictMode's dev-only
    // double-mount, which can dispose this canvas instance before the
    // promise resolves.
    let cancelled = false

    if (page.canvasData) {
      canvas
        .loadFromJSON(page.canvasData)
        .then(() => {
          if (cancelled) return
          canvas.renderAll()
        })
        .catch((err) => {
          if (cancelled) return
          console.error('Failed to restore saved canvas content:', err)
        })
    } else {
      canvas.clear()
      canvas.backgroundColor = paperTexture.bg
      canvas.renderAll()
    }

    return () => {
      cancelled = true
    }
  }, [hasHydrated, currentPageId])

  useEffect(() => {
    const canvas = fabricCanvasRef.current
    if (!canvas) return

    canvas.backgroundColor = paperTexture.bg
    canvas.renderAll()
  }, [paperTextureKey])

  useEffect(() => {
    const canvas = fabricCanvasRef.current
    if (!canvas) return

    if (activeTool === 'pen') {
      canvas.isDrawingMode = true
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = brushColor
        canvas.freeDrawingBrush.width = brushSize
      }
    } else if (activeTool === 'eraser') {
      canvas.isDrawingMode = true
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = paperTexture.bg
        canvas.freeDrawingBrush.width = brushSize * 4
      }
    } else {
      canvas.isDrawingMode = false
    }
  }, [activeTool, brushColor, brushSize, paperTexture])

  useImperativeHandle(ref, () => ({
    addSticker: (sticker) => {
      const canvas = fabricCanvasRef.current
      if (!canvas || !sticker) return

      const stickerText = new FabricText(sticker.symbol, {
        left: Math.random() * 350 + 100,
        top: Math.random() * 200 + 50,
        fontSize: 48,
        selectable: true,
      })

      canvas.add(stickerText)
      canvas.setActiveObject(stickerText)
      canvas.renderAll()
      updateCurrentPageData(canvas.toJSON(), notesTextRef.current)
    },
    addWashiTape: (tape) => {
      const canvas = fabricCanvasRef.current
      if (!canvas || !tape) return

      const washi = new Rect({
        left: Math.random() * 300 + 100,
        top: Math.random() * 200 + 50,
        width: 140,
        height: 28,
        fill: tape.color,
        opacity: 0.85,
        angle: (Math.random() - 0.5) * 15,
        rx: 3,
        ry: 3,
        selectable: true,
      })

      canvas.add(washi)
      canvas.setActiveObject(washi)
      canvas.renderAll()
      updateCurrentPageData(canvas.toJSON(), notesTextRef.current)
    },
    clearCanvas: () => {
      const canvas = fabricCanvasRef.current
      if (!canvas) return
      canvas.clear()
      canvas.backgroundColor = paperTexture.bg
      canvas.renderAll()
      updateCurrentPageData(canvas.toJSON(), notesTextRef.current)
    },
    getCanvasElement: () => canvasRef.current,
  }))

  const addTextToCanvas = () => {
    const canvas = fabricCanvasRef.current
    if (!canvas) return

    const textbox = new Textbox('Type your thoughts here...', {
      left: 100,
      top: 100,
      width: 300,
      fontSize: 18,
      fill: brushColor,
      fontFamily: 'Caveat, cursive, serif',
    })

    canvas.add(textbox)
    canvas.setActiveObject(textbox)
    canvas.renderAll()
  }

  const handleNotesChange = (e) => {
    const val = e.target.value
    setNotesText(val)
    if (fabricCanvasRef.current) {
      updateCurrentPageData(fabricCanvasRef.current.toJSON(), val)
    }
  }

  const formattedPageDate = currentPageCreatedAt
    ? new Date(currentPageCreatedAt).toLocaleString('en-US', {
        weekday: 'long',
        hour: 'numeric',
        minute: '2-digit',
      })
    : ''

  return (
    <div
      id="journal-scrapbook-page"
      style={{
        position: 'relative',
        background: paperTexture.bg,
        borderRadius: '24px',
        border: `1px solid ${paperTexture.borderColor}`,
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.05)',
        padding: '24px',
        maxWidth: '760px',
        width: '100%',
        margin: '0 auto',
        color: paperTexture.textColor || '#2C3E35',
        transition: 'background-color 0.3s ease, border-color 0.3s ease',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          paddingBottom: '12px',
          borderBottom: `1px dashed ${paperTexture.borderColor}`,
        }}
      >
        <div>
          <span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#8A7B70', letterSpacing: '1px' }}>
            Private Digital Planner • {paperTexture.name}
          </span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", margin: '2px 0 0', fontSize: '20px' }}>
            {formattedPageDate}
          </h2>
        </div>

        <button
          onClick={addTextToCanvas}
          style={{
            background: 'rgba(0,0,0,0.04)',
            border: `1px solid ${paperTexture.borderColor}`,
            padding: '6px 14px',
            borderRadius: '16px',
            fontSize: '12px',
            cursor: 'pointer',
            color: 'inherit',
          }}
        >
          + Add Text Box
        </button>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label
          style={{
            display: 'block',
            fontSize: '13px',
            marginBottom: '6px',
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
          }}
        >
          How are you feeling right now?
        </label>
        <textarea
          value={notesText}
          onChange={handleNotesChange}
          placeholder="Write freely... what happened, how you feel, what's on your mind."
          rows={3}
          style={{
            width: '100%',
            border: `1px solid ${paperTexture.borderColor}`,
            borderRadius: '14px',
            padding: '12px 16px',
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '15px',
            lineHeight: '1.6',
            color: 'inherit',
            background: 'rgba(255,255,255,0.4)',
            outline: 'none',
            resize: 'vertical',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: `1px solid ${paperTexture.borderColor}` }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '400px', display: 'block' }} />
      </div>

      <div
        style={{
          marginTop: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '11px',
          opacity: 0.7,
        }}
      >
        <span>Draw, stick washi tape 🩹, or place kawaii stickers 🎀</span>
        <span>Autosaves locally</span>
      </div>
    </div>
  )
})

export default JournalCanvas
