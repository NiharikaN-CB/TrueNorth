import { create } from 'zustand'

export const PAPER_TEXTURES = {
  linen: { name: 'Soft Linen', bg: '#FFFDF9', borderColor: '#EBE3D7' },
  grain: { name: 'Seaside Grain', bg: '#F6F1EA', borderColor: '#E5DCD1' },
  cream: { name: 'Vintage Cream', bg: '#FFFBF2', borderColor: '#EDE3D1' },
  dark: { name: 'Night Sanctuary', bg: '#252B28', borderColor: '#3A423E', textColor: '#EAE5DD' },
}

export const WASHI_TAPES = [
  { id: 'blush', name: 'Blush Rose Tape', color: '#E8C5C8', pattern: 'stripe' },
  { id: 'sage', name: 'Sage Leaf Tape', color: '#C5D8CD', pattern: 'dots' },
  { id: 'gingham', name: 'Gingham Pink', color: '#F2D3C7', pattern: 'check' },
  { id: 'gold', name: 'Gold Foil Accent', color: '#E3C88D', pattern: 'solid' },
]

export const useJournalStore = create((set, get) => ({
  // View state: 'landing' | 'journal'
  currentView: 'landing',
  setView: (view) => set({ currentView: view }),
  openJournal: () => set({ currentView: 'journal' }),
  openLanding: () => set({ currentView: 'landing' }),

  // Canvas paper texture state
  paperTexture: 'linen',
  setPaperTexture: (textureKey) => set({ paperTexture: textureKey }),

  // Canvas tool state
  activeTool: 'pen', // 'pen' | 'text' | 'eraser' | 'washi' | 'select'
  setActiveTool: (tool) => set({ activeTool: tool }),

  brushColor: '#4A5568',
  setBrushColor: (color) => set({ brushColor: color }),

  brushSize: 3,
  setBrushSize: (size) => set({ brushSize: size }),

  // Selected Washi Tape & Sticker
  selectedWashi: WASHI_TAPES[0],
  setSelectedWashi: (washi) => set({ selectedWashi: washi }),
  selectedSticker: null,
  setSelectedSticker: (sticker) => set({ selectedSticker: sticker }),

  // Journal pages state
  currentPageId: 'page-1',
  pages: [
    {
      id: 'page-1',
      title: 'Entry — Today',
      createdAt: new Date().toISOString(),
      canvasData: null,
      notesText: '',
      tags: ['unsettled', 'processing'],
      mood: 'cloudy',
    },
  ],

  // Pattern Memory Timeline
  patterns: [
    {
      id: 'pattern-1',
      date: 'Aug 14',
      theme: 'Uncertain communication',
      observation: 'Felt unsettled when texts were left unanswered for > 4 hours.',
      insight: 'You prioritize responsiveness & clear expectations.',
    },
    {
      id: 'pattern-2',
      date: 'Aug 10',
      theme: 'Boundary clarity',
      observation: 'Felt proud for expressing your availability preference.',
      insight: 'Standing firm in your needs brought peace.',
    },
  ],

  // Storage / Autosave state
  autosaveStatus: 'saved',
  setAutosaveStatus: (status) => set({ autosaveStatus: status }),

  // AI Reflection state
  reflection: null,
  isReflecting: false,
  setReflection: (reflection) => set({ reflection, isReflecting: false }),
  setIsReflecting: (isReflecting) => set({ isReflecting }),

  // Helper actions
  updateCurrentPageData: (canvasJson, text = '') => {
    const { currentPageId, pages } = get()
    const updatedPages = pages.map((p) =>
      p.id === currentPageId ? { ...p, canvasData: canvasJson, notesText: text } : p
    )
    set({ pages: updatedPages, autosaveStatus: 'saving' })

    setTimeout(() => {
      set({ autosaveStatus: 'saved' })
    }, 600)
  },
}))
