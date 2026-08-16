import { create } from "zustand";

export interface PatternLog {
  date: string;       // ISO format timestamp
  emotions: string[]; // Normalized unique emotions list
}

const normalizeEmotions = (rawEmotions: string[]): string[] => {
  if (!Array.isArray(rawEmotions)) return [];
  const normalized = rawEmotions
    .map(e => (typeof e === "string" ? e.trim().toLowerCase() : ""))
    .filter(e => e.length > 0);
  return Array.from(new Set(normalized));
};

interface JournalState {
  pages: string[];
  currentPageIndex: number;
  patternLogs: PatternLog[];
  
  // Actions
  setPages: (pages: string[]) => void;
  setCurrentPageIndex: (index: number) => void;
  updatePageCanvas: (index: number, json: string) => void;
  createPage: () => void;
  setPatternLogs: (logs: PatternLog[]) => void;
  addPatternLog: (emotions: string[]) => void;
  clearPatternLogs: () => void;
}

export const useJournalStore = create<JournalState>((set) => ({
  pages: ["{}"],
  currentPageIndex: 0,
  patternLogs: [],
  
  setPages: (pages) => set({ pages }),
  setCurrentPageIndex: (currentPageIndex) => set({ currentPageIndex }),
  
  updatePageCanvas: (index, json) =>
    set((state) => {
      const updated = [...state.pages];
      updated[index] = json;
      return { pages: updated };
    }),
    
  createPage: () =>
    set((state) => ({
      pages: [...state.pages, "{}"],
      currentPageIndex: state.pages.length,
    })),

  setPatternLogs: (patternLogs) => set({ patternLogs }),

  addPatternLog: (emotions) =>
    set((state) => {
      const normalized = normalizeEmotions(emotions);
      const newLog: PatternLog = {
        date: new Date().toISOString(),
        emotions: normalized,
      };
      return { patternLogs: [...state.patternLogs, newLog] };
    }),

  clearPatternLogs: () => set({ patternLogs: [] }),
}));
