import { create } from "zustand";

interface JournalState {
  pages: string[];
  currentPageIndex: number;
  setPages: (pages: string[]) => void;
  setCurrentPageIndex: (index: number) => void;
  updatePageCanvas: (index: number, json: string) => void;
  createPage: () => void;
}

export const useJournalStore = create<JournalState>((set) => ({
  pages: ["{}"],
  currentPageIndex: 0,
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
}));
