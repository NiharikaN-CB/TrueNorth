import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react'
import { Canvas, PencilBrush, Textbox, FabricText, Rect } from 'fabric'
import { useJournalStore, PAPER_TEXTURES } from '../../store/useJournalStore'

const JournalCanvas = forwardRef(function JournalCanvas({ onCanvasChange, onHistoryChange }, ref) {
  const canvasRef = useRef(null)
  const canvasContainerRef = useRef(null)
  const fabricCanvasRef = useRef(null)
  const loadedPageIdRef = useRef(null)
  const notesTextRef = useRef('')
  const activeToolRef = useRef('pen')
  const onHistoryChangeRef = useRef(onHistoryChange)

  // Undo/Redo history — a stack of JSON snapshots scoped to whichever page
  // is currently loaded (reset whenever the page changes, see the
  // page-restore effect below). isApplyingHistoryRef guards every
  // programmatic loadFromJSON call (undo, redo, and page load/restore)
  // so restoring a snapshot never itself gets recorded as a new entry.
  const historyStackRef = useRef([])
  const historyIndexRef = useRef(-1)
  const isApplyingHistoryRef = useRef(false)
  const saveHistoryRef = useRef(() => {})
  const notifyHistoryChangeRef = useRef(() => {})
  // True until the canvas is genuinely disposed (real unmount). Used instead
  // of a per-effect-invocation closure flag so React StrictMode's dev-only
  // double-invoke of an effect on first mount can't be mistaken for a real
  // supersession — see the page-restore effect below.
  const isMountedRef = useRef(true)

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
    activeToolRef.current = activeTool
  }, [activeTool])

  useEffect(() => {
    onHistoryChangeRef.current = onHistoryChange
  }, [onHistoryChange])

  useEffect(() => {
    if (!canvasRef.current) return

    isMountedRef.current = true

    // The canvas's actual pixel dimensions (set here, on the underlying
    // <canvas> width/height attributes) are what mobile browsers use to
    // compute the page's layout viewport — a canvas with a hardcoded
    // intrinsic width wider than the device (720px) forces the whole page
    // to zoom out to fit it, even though the CSS width:100% would
    // otherwise display it correctly. Sizing to the actual container
    // width at creation time (and on resize, below) keeps intrinsic and
    // CSS size in agreement so mobile layout never has to compensate.
    const initialWidth = canvasContainerRef.current
      ? Math.max(200, canvasContainerRef.current.clientWidth)
      : 720
    const CANVAS_HEIGHT = 400

    const initCanvas = new Canvas(canvasRef.current, {
      width: initialWidth,
      height: CANVAS_HEIGHT,
      isDrawingMode: true,
      backgroundColor: paperTexture.bg,
    })

    const brush = new PencilBrush(initCanvas)
    brush.color = brushColor
    brush.width = brushSize
    initCanvas.freeDrawingBrush = brush

    fabricCanvasRef.current = initCanvas

    const notifyHistoryChange = () => {
      if (onHistoryChangeRef.current) {
        onHistoryChangeRef.current(
          historyIndexRef.current > 0,
          historyIndexRef.current < historyStackRef.current.length - 1
        )
      }
    }

    // Records the current canvas state as a new undo/redo entry. Ignored
    // while a snapshot is being programmatically restored (undo, redo, or
    // loading a page), and skipped if nothing actually changed since the
    // last entry.
    const saveHistory = () => {
      if (isApplyingHistoryRef.current) return
      const jsonStr = JSON.stringify(initCanvas.toJSON())
      if (historyStackRef.current[historyIndexRef.current] === jsonStr) return
      const truncated = historyStackRef.current.slice(0, historyIndexRef.current + 1)
      truncated.push(jsonStr)
      historyStackRef.current = truncated
      historyIndexRef.current = truncated.length - 1
      notifyHistoryChange()
    }
    saveHistoryRef.current = saveHistory
    notifyHistoryChangeRef.current = notifyHistoryChange

    initCanvas.on('path:created', () => {
      const json = initCanvas.toJSON()
      if (onCanvasChange) {
        onCanvasChange(json)
      }
      updateCurrentPageData(json, notesTextRef.current)
      saveHistory()
    })

    // object:added also fires for path creation — skip it there since
    // path:created (above) already handles saving history for strokes.
    initCanvas.on('object:added', (e) => {
      if (isApplyingHistoryRef.current) return
      if (e.target && e.target.type === 'path') return
      saveHistory()
    })

    // Repositioning/resizing an object (drag, corner handles) previously
    // wasn't persisted at all — only the initial placement was. Fixed here
    // alongside history tracking since both need the same event.
    initCanvas.on('object:modified', () => {
      if (isApplyingHistoryRef.current) return
      saveHistory()
      updateCurrentPageData(initCanvas.toJSON(), notesTextRef.current)
    })

    initCanvas.on('object:removed', () => {
      if (isApplyingHistoryRef.current) return
      saveHistory()
    })

    // Eraser tool: clicking directly on an object removes it — drawings,
    // text boxes, stickers, and washi tape are all real Fabric objects, so
    // this works uniformly for all of them (unlike painting over in the
    // background color, which only ever visually hid pen strokes and left
    // everything else — and the strokes themselves — still there
    // underneath).
    const handleEraserClick = (opt) => {
      if (activeToolRef.current !== 'eraser' || !opt.target) return
      initCanvas.remove(opt.target)
      initCanvas.discardActiveObject()
      initCanvas.renderAll()
      updateCurrentPageData(initCanvas.toJSON(), notesTextRef.current)
    }
    initCanvas.on('mouse:down', handleEraserClick)

    // Delete/Backspace removes whatever's currently selected. Carefully
    // guarded: never hijack these keys while the user is typing in the
    // notes textarea or any other input, and never remove a text object
    // that's mid-edit (its own editor should handle Backspace normally).
    const handleKeyDown = (e) => {
      if (e.key !== 'Delete' && e.key !== 'Backspace') return

      const activeEl = document.activeElement
      const isTypingElsewhere =
        activeEl &&
        (activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'INPUT' || activeEl.isContentEditable)
      if (isTypingElsewhere) return

      const activeObject = initCanvas.getActiveObject()
      if (!activeObject || activeObject.isEditing) return

      e.preventDefault()
      initCanvas.remove(...initCanvas.getActiveObjects())
      initCanvas.discardActiveObject()
      initCanvas.renderAll()
      updateCurrentPageData(initCanvas.toJSON(), notesTextRef.current)
    }
    window.addEventListener('keydown', handleKeyDown)

    // Keeps intrinsic canvas width in sync with its container on viewport
    // changes (resize, orientation change) — see the sizing note above.
    // Only the visible viewport changes; existing object coordinates are
    // left as-is rather than rescaled, so this can't shift or distort
    // already-placed content.
    const handleResize = () => {
      if (!canvasContainerRef.current) return
      const newWidth = Math.max(200, canvasContainerRef.current.clientWidth)
      initCanvas.setDimensions({ width: newWidth, height: CANVAS_HEIGHT })
      initCanvas.renderAll()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      isMountedRef.current = false
      window.removeEventListener('resize', handleResize)
      // Also reset which page is considered "loaded" — otherwise, when this
      // effect's StrictMode dev-only double-invoke creates the real, final
      // canvas instance right after this cleanup runs, the page-restore
      // effect's own guard would see loadedPageIdRef already set (from the
      // disposed instance's pass) and skip loading content into the new one
      // entirely, leaving it permanently blank.
      loadedPageIdRef.current = null
      window.removeEventListener('keydown', handleKeyDown)
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

    // Guards the async loadFromJSON against acting after this load has been
    // superseded. Deliberately checked against isMountedRef + whether
    // loadedPageIdRef still points at *this* page — not a boolean set by
    // this effect invocation's own cleanup. React StrictMode's dev-only
    // double-invoke on first mount runs this effect, tears it down, and
    // runs it again in the same tick; a plain per-invocation "cancelled"
    // flag would be (wrongly) true by the time the real promise resolves,
    // silently dropping the restore and leaving isApplyingHistoryRef stuck
    // — this happened, was diagnosed via IndexedDB inspection, and is why
    // the check is against durable refs instead.
    const pageIdBeingLoaded = currentPageId
    // Also require fabricCanvasRef.current to still be *this exact instance*
    // — the page-id check alone isn't enough under StrictMode's double
    // invoke, where a stale promise from an already-disposed first-pass
    // canvas can still see a matching page id (the second pass reloads the
    // same page into the new instance) and would otherwise try to call
    // methods on a disposed canvas.
    const isStillRelevant = () =>
      isMountedRef.current && fabricCanvasRef.current === canvas && loadedPageIdRef.current === pageIdBeingLoaded

    // Resets undo/redo history to a single entry: the state we just loaded.
    // History is scoped per page — switching pages (or first loading one)
    // should never let you undo into a *different* page's content.
    const resetHistory = () => {
      if (!isStillRelevant()) return
      historyStackRef.current = [JSON.stringify(canvas.toJSON())]
      historyIndexRef.current = 0
      notifyHistoryChangeRef.current()
    }

    isApplyingHistoryRef.current = true

    if (page.canvasData) {
      canvas
        .loadFromJSON(page.canvasData)
        .then(() => {
          if (!isStillRelevant()) return
          canvas.renderAll()
          isApplyingHistoryRef.current = false
          resetHistory()
        })
        .catch((err) => {
          if (!isStillRelevant()) return
          console.error('Failed to restore saved canvas content:', err)
          isApplyingHistoryRef.current = false
          resetHistory()
        })
    } else {
      canvas.clear()
      canvas.backgroundColor = paperTexture.bg
      canvas.renderAll()
      isApplyingHistoryRef.current = false
      resetHistory()
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
      canvas.selection = true
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = brushColor
        canvas.freeDrawingBrush.width = brushSize
      }
    } else if (activeTool === 'eraser') {
      // Not a drawing mode — clicking an object removes it (see
      // handleEraserClick in the mount effect). Disabling drag-selection
      // keeps the cursor focused on "click a thing to delete it."
      canvas.isDrawingMode = false
      canvas.selection = false
      canvas.discardActiveObject()
      canvas.renderAll()
    } else {
      canvas.isDrawingMode = false
      canvas.selection = true
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
      // canvas.clear() is a bulk operation and isn't guaranteed to fire a
      // per-object 'object:removed' for each item, so record this
      // explicitly rather than relying on that listener.
      saveHistoryRef.current()
    },
    undo: () => {
      const canvas = fabricCanvasRef.current
      if (!canvas || historyIndexRef.current <= 0) return
      isApplyingHistoryRef.current = true
      historyIndexRef.current -= 1
      const snapshot = JSON.parse(historyStackRef.current[historyIndexRef.current])
      canvas
        .loadFromJSON(snapshot)
        .then(() => {
          canvas.renderAll()
          isApplyingHistoryRef.current = false
          notifyHistoryChangeRef.current()
          updateCurrentPageData(canvas.toJSON(), notesTextRef.current)
        })
        .catch((err) => {
          console.error('Undo failed to restore canvas state:', err)
          isApplyingHistoryRef.current = false
        })
    },
    redo: () => {
      const canvas = fabricCanvasRef.current
      if (!canvas || historyIndexRef.current >= historyStackRef.current.length - 1) return
      isApplyingHistoryRef.current = true
      historyIndexRef.current += 1
      const snapshot = JSON.parse(historyStackRef.current[historyIndexRef.current])
      canvas
        .loadFromJSON(snapshot)
        .then(() => {
          canvas.renderAll()
          isApplyingHistoryRef.current = false
          notifyHistoryChangeRef.current()
          updateCurrentPageData(canvas.toJSON(), notesTextRef.current)
        })
        .catch((err) => {
          console.error('Redo failed to restore canvas state:', err)
          isApplyingHistoryRef.current = false
        })
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
        color: paperTexture.textColor || '#984343',
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
          <span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#8a6a5f', letterSpacing: '1px' }}>
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

      <div
        ref={canvasContainerRef}
        style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: `1px solid ${paperTexture.borderColor}` }}
      >
        <canvas ref={canvasRef} style={{ width: '100%', height: '400px', display: 'block', touchAction: 'none' }} />
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
        <span>Draw, stick washi tape 🩹, or place kawaii stickers 🎀 — select anything and press Delete, or tap Eraser, to remove it</span>
        <span>Autosaves locally</span>
      </div>
    </div>
  )
})

export default JournalCanvas
