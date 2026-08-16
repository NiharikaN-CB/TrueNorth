import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { get as idbGet, set as idbSet } from 'idb-keyval'

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

const STORAGE_KEY = 'truenorth-journal-state'
const AUTOSAVE_DEBOUNCE_MS = 600

function createEmptyPage() {
  return {
    id: `page-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: 'Untitled Entry',
    createdAt: new Date().toISOString(),
    canvasData: null,
    notesText: '',
    tags: [],
    mood: null,
    reflection: null,
  }
}

export const useJournalStore = create(
  subscribeWithSelector((set, get) => ({
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
        title: 'Untitled Entry',
        createdAt: new Date().toISOString(),
        canvasData: null,
        notesText: '',
        tags: [],
        mood: null,
        reflection: null,
      },
    ],

    // Pattern Memory Timeline — still seeded/mock data; replaced with real
    // derivation from completed reflections in a later step.
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

    // Persistence state
    hasHydrated: false,
    autosaveStatus: 'saved', // 'saving' | 'saved' | 'error'

    // Loads previously saved journal state from IndexedDB, if any. Safe to
    // call more than once (e.g. React StrictMode's double-invoked effects).
    hydrate: async () => {
      if (get().hasHydrated) return
      try {
        const stored = await idbGet(STORAGE_KEY)
        if (stored && typeof stored === 'object' && Array.isArray(stored.pages) && stored.pages.length > 0) {
          const currentPageId =
            stored.currentPageId && stored.pages.some((p) => p.id === stored.currentPageId)
              ? stored.currentPageId
              : stored.pages[0].id
          set({
            pages: stored.pages,
            currentPageId,
            patterns: Array.isArray(stored.patterns) ? stored.patterns : get().patterns,
            autosaveStatus: 'saved',
          })
        }
      } catch (err) {
        console.error('Failed to load journal data from IndexedDB:', err)
        set({ autosaveStatus: 'error' })
      } finally {
        set({ hasHydrated: true })
      }
    },

    // AI Reflection state — reflection content itself lives on the current page
    // (see setReflection) so it persists and stays scoped to the right entry.
    isReflecting: false,
    setIsReflecting: (isReflecting) => set({ isReflecting }),
    setReflection: (reflection) =>
      set((state) => ({
        pages: state.pages.map((p) => (p.id === state.currentPageId ? { ...p, reflection } : p)),
        isReflecting: false,
      })),

    // Page content actions
    updateCurrentPageData: (canvasJson, text = '') => {
      const { currentPageId, pages } = get()
      set({
        pages: pages.map((p) =>
          p.id === currentPageId ? { ...p, canvasData: canvasJson, notesText: text } : p
        ),
      })
    },

    deletePage: (pageId) => {
      set((state) => {
        const remaining = state.pages.filter((p) => p.id !== pageId)
        if (remaining.length === 0) {
          const freshPage = createEmptyPage()
          return { pages: [freshPage], currentPageId: freshPage.id }
        }
        return {
          pages: remaining,
          currentPageId: state.currentPageId === pageId ? remaining[0].id : state.currentPageId,
        }
      })
    },

    clearAllData: async () => {
      const freshPage = createEmptyPage()
      set({ pages: [freshPage], currentPageId: freshPage.id, patterns: [], autosaveStatus: 'saving' })
      try {
        await idbSet(STORAGE_KEY, { pages: [freshPage], currentPageId: freshPage.id, patterns: [] })
        set({ autosaveStatus: 'saved' })
      } catch (err) {
        console.error('Failed to clear journal data in IndexedDB:', err)
        set({ autosaveStatus: 'error' })
      }
    },
  }))
)

// Real debounced autosave. Fires only when the durable slice of state
// (pages / currentPageId / patterns) actually changes, and only after the
// initial hydrate() has completed — so we never overwrite saved data with
// the transient default state that exists before hydration runs.
let autosaveTimer = null

useJournalStore.subscribe(
  (state) => ({ pages: state.pages, currentPageId: state.currentPageId, patterns: state.patterns }),
  (curr) => {
    if (!useJournalStore.getState().hasHydrated) return

    useJournalStore.setState({ autosaveStatus: 'saving' })

    if (autosaveTimer) clearTimeout(autosaveTimer)
    autosaveTimer = setTimeout(async () => {
      try {
        await idbSet(STORAGE_KEY, curr)
        useJournalStore.setState({ autosaveStatus: 'saved' })
      } catch (err) {
        console.error('Autosave to IndexedDB failed:', err)
        useJournalStore.setState({ autosaveStatus: 'error' })
      }
    }, AUTOSAVE_DEBOUNCE_MS)
  },
  {
    equalityFn: (a, b) => a.pages === b.pages && a.currentPageId === b.currentPageId && a.patterns === b.patterns,
  }
)
