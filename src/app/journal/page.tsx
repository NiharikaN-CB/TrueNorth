"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import type { JournalCanvasRef } from "@/components/journal/JournalCanvas";
import { get, set } from "idb-keyval";
import { useJournalStore, type PatternLog } from "@/lib/storage/journal-storage";
import type { Reflection } from "@/app/api/reflect/route";
import ReflectionPanel from "@/components/reflection/ReflectionPanel";

const JournalCanvas = dynamic(
  () => import("@/components/journal/JournalCanvas").then((mod) => mod.JournalCanvas),
  { ssr: false }
);
import { 
  Pen, 
  Type, 
  Eraser, 
  Image as ImageIcon, 
  CheckSquare, 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  RotateCw,
  Compass,
  AlertCircle,
  Sparkles
} from "lucide-react";

function extractTextFromCanvas(canvasJsonStr: string): string {
  interface FabricObject {
    type?: string;
    text?: string;
  }
  try {
    const data = JSON.parse(canvasJsonStr) as { objects?: FabricObject[] };
    if (data && Array.isArray(data.objects)) {
      return data.objects
        .filter((obj) => (obj.type === "itext" || obj.type === "text") && typeof obj.text === "string")
        .map((obj) => (obj.text || "").trim())
        .filter((text: string) => text.length > 0 && text !== "Write here...")
        .join("\n");
    }
  } catch {}
  return "";
}

export const CHECKLIST_ITEMS = {
  "Feelings": [
    { id: "feelings:anxious", label: "Anxious" },
    { id: "feelings:excited", label: "Excited" },
    { id: "feelings:drained", label: "Drained" },
    { id: "feelings:unsettled", label: "Unsettled" },
    { id: "feelings:hopeful", label: "Hopeful" },
    { id: "feelings:confused", label: "Confused" }
  ],
  "Needs": [
    { id: "needs:space", label: "Space" },
    { id: "needs:clarity", label: "Clarity" },
    { id: "needs:validation", label: "Validation" },
    { id: "needs:reassurance", label: "Reassurance" },
    { id: "needs:safety", label: "Emotional safety" }
  ],
  "What felt good": [
    { id: "good:consistency", label: "Consistency" },
    { id: "good:active_listening", label: "Active listening" },
    { id: "good:clear_intentions", label: "Clear intentions" },
    { id: "good:respect_space", label: "Respect for space" }
  ],
  "What felt uncomfortable": [
    { id: "uncomfortable:inconsistency", label: "Inconsistency" },
    { id: "uncomfortable:rushed_pace", label: "Rushed pace" },
    { id: "uncomfortable:vague_answers", label: "Vague answers" },
    { id: "uncomfortable:unsolicited_advice", label: "Unsolicited advice" }
  ],
  "Values": [
    { id: "values:honesty", label: "Honesty" },
    { id: "values:patience", label: "Patience" },
    { id: "values:mutual_respect", label: "Mutual respect" },
    { id: "values:safety", label: "Safety" }
  ]
} as const;

export const STICKER_ASSETS = [
  {
    id: "sticker:rose",
    name: "Rose",
    svgDataUrl: "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDJDOS41IDIgNyAzLjUgNyA2LjVDNyA5LjUgMTAgMTIgMTIgMTRDMTQgMTIgMTcgOS41IDE3IDYuNUMxNyAzLjUgMTQuNSAyIDEyLDJaIiBmaWxsPSIjRDc5Qjk1Ii8+PHBhdGggZD0iTTEyIDZDMTEgNS41IDEwIDYgMTAgN0MxMCA4IDExLjUgOSAxMiAxMEMxMi41IDkgMTQgOCAxNCA3QzE0IDYgMTMgNS41IDEyLDZaIiBmaWxsPSIjOTg0MzQzIi8+PHBhdGggZD0iTTEyIDE0VjIyIiBzdHJva2U9IiM1MjdkODIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTEyIDE3QzEwIDE3LjUgOSAxOSA5IDE5IiBzdHJva2U9IiM1MjdkODIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTEyIDE5QzE0IDE5LjUgMTUgMjEgMTUgMjEiBzdHJva2U9IiM1MjdkODIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PC9zdmc+"
  },
  {
    id: "sticker:seashell",
    name: "Seashell",
    svgDataUrl: "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDNDNyAzIDQgOCA0IDE0QzQgMTguNSA3LjUgMjAgMTIgMjBDMTYuNSAyMCAyMCAxOC41IDIwIDE0QzIwIDggMTcgMyAxMiAzWiIgZmlsbD0iIzkxQkRDMiIgc3Ryb2tlPSIjNTI3ZDgyIiBzdHJva2Utd2lkdGg9IjEuNSIvPjxwYXRoIGQ9Ik0xMiAyMFYzIiBzdHJva2U9IiM1MjdkODIiIHN0cm9rZS13aWR0aD0iMS41Ii8+PHBhdGggZD0iTTguNSAxOS41QzkuNSAxNiAxMCAxMSAxMiAzIiBzdHJva2U9IiM1MjdkODIiIHN0cm9rZS13aWR0aD0iMSIvPjxwYXRoIGQ9Ik0xNS41IDE5LjVDMTQuNSAxNiAxNCAxMSAxMiAzIiBzdHJva2U9IiM1MjdkODIiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg=="
  },
  {
    id: "sticker:bow",
    name: "Bow",
    svgDataUrl: "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDEwQzEwIDcgNiA3IDYgMTBDNiAxMyAxMCAxMiAxMiAxMkMxNCAxMiAxOCAxMyAxOCAxMEMxOCA3IDE0IDcgMTIgMTBaIiBmaWxsPSIjRjdEN0NEIiBzdHJva2U9IiM5ODQzNDMiIiBzdHJva2Utd2lkdGg9IjEuNSIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTEiIHI9IjIuNSIgZmlsbD0iI0Q3OUI5NSIgc3Ryb2tlPSIjOTg0MzQzIiBzdHJva2Utd2lkdGg9IjEuNSIvPjxwYXRoIGQ9Ik0xMCAxM0w2IDIwIiBzdHJva2U9IiM5ODQzNDMiIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0xNCAxM0wxOCAyMCIgc3Ryb2tlPSIjOTg0MzQzIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjwvc3ZnPg=="
  },
  {
    id: "sticker:star",
    name: "Star",
    svgDataUrl: "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDJMMTQuOCA4LjZMMjIgOS4yTDE2LjUgMTRMMTguMiAyMUwxMiAxNy4yTDUuOCAyMUw3LjUgMTRMMiA5LjJMOS4yIDguNkwxMiAyWiIgZmlsbD0iI0YxRTREOSIgc3Ryb2tlPSIjOTg0MzQzIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg=="
  },
  {
    id: "sticker:wave",
    name: "Beach Wave",
    svgDataUrl: "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTIgMTdDNSAxNyA2IDEzIDkgMTNDMTIgMTMgMTMgMTcgMTYgMTdDMTkgMTcgMjAgMTMgMjIgMTMiIHN0cm9rZT0iIzkxQkRDMiIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMiAxMkM1IDEyIDYgOCA5IDhDMTIgOCAxMyAxMiAxNiAxMkMxOTEyIDIwIDggMjIgOCIgc3Ryb2tlPSIjNTI3ZDgyIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjwvc3ZnPg=="
  },
  {
    id: "sticker:tape",
    name: "Washi Tape",
    svgDataUrl: "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNTAgMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjRDc5Qjk1IiBmaWxsLW9wYWNpdHk9IjAuNiIvPjxwYXRoIGQ9Ik0wIDBMMyA1TDAgMTBMMyAxNUwwIDIwIiBzdHJva2U9IiM5ODQzNDMiIiBzdHJva2Utd2lkdGg9IjEiLz48cGF0aCBkPSJNNTAgMEw0NyA1TDUwIDEwTDQ3IDE1TDUwIDEwMCIgc3Ryb2tlPSIjOTg0MzQzIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4="
  }
];




export default function JournalPage() {
  const [selectedTool, setSelectedTool] = useState<string>("pen");
  const canvasRef = useRef<JournalCanvasRef>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState<"saving" | "saved" | "error" | "offline">("saved");

  // Ephemeral AI reflection states (resets on browser reload)
  const [reflections, setReflections] = useState<(Reflection | null)[]>([]);
  const [isReflecting, setIsReflecting] = useState(false);
  const [reflectionError, setReflectionError] = useState<string | null>(null);

  // Optional checklist states
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"Feelings" | "Needs" | "What felt good" | "What felt uncomfortable" | "Values">("Feelings");

  const {
    pages,
    currentPageIndex,
    patternLogs,
    checklists,
    setPages,
    setCurrentPageIndex,
    setPatternLogs,
    addPatternLog,
    setChecklists,
    toggleChecklistItem,
    updatePageCanvas,
    createPage,
  } = useJournalStore();

  // Mount -> Load from IndexedDB
  useEffect(() => {
    interface StoredJournalState {
      pages?: string[];
      patternLogs?: PatternLog[];
      checklists?: string[][];
    }
    const loadState = async () => {
      try {
        const stored = await get("truenorth-journal-state");
        const storedObj = stored as StoredJournalState;
        if (storedObj && typeof storedObj === "object" && Array.isArray(storedObj.pages)) {
          const restoredPages = storedObj.pages;
          setPages(restoredPages);
          setPatternLogs(storedObj.patternLogs || []);
          setReflections(new Array(restoredPages.length).fill(null));

          // Pad or truncate checklists array safely (creating independent array instances)
          let restoredChecklists: string[][] = Array.from({ length: restoredPages.length }, () => []);
          if (Array.isArray(storedObj.checklists)) {
            restoredChecklists = Array.from({ length: restoredPages.length }, (_, idx) => {
              return Array.isArray(storedObj.checklists?.[idx]) ? (storedObj.checklists?.[idx] as string[]) : [];
            });
          }
          setChecklists(restoredChecklists);
        } else {
          setPages(["{}"]);
          setReflections([null]);
          setPatternLogs([]);
          setChecklists([[]]);
        }
      } catch (err) {
        console.error("Failed to read IndexedDB:", err);
        setPages(["{}"]);
        setReflections([null]);
        setPatternLogs([]);
        setChecklists([[]]);
        setAutosaveStatus("offline");
      } finally {
        setCurrentPageIndex(0); // Always default to Page 1 on reload
        setHasHydrated(true);
      }
    };
    loadState();
  }, [setPages, setCurrentPageIndex, setPatternLogs, setChecklists]);

  // Debounced Autosave
  useEffect(() => {
    if (!hasHydrated) return;

    // Toggle status to 'saving' in next tick to avoid cascading render warning
    const statusTimer = setTimeout(() => {
      setAutosaveStatus("saving");
    }, 0);

    const timer = setTimeout(async () => {
      try {
        await set("truenorth-journal-state", { pages, patternLogs, checklists });
        setAutosaveStatus("saved");
      } catch (err) {
        console.error("Autosave write failed:", err);
        try {
          await set("truenorth-test-write", "test");
        } catch {
          setAutosaveStatus("offline");
          return;
        }
        setAutosaveStatus("error");
      }
    }, 1000);

    return () => {
      clearTimeout(statusTimer);
      clearTimeout(timer);
    };
  }, [pages, patternLogs, checklists, hasHydrated]);

  const handleHistoryChange = (undoAvailable: boolean, redoAvailable: boolean) => {
    setCanUndo(undoAvailable);
    setCanRedo(redoAvailable);
  };

  const handleCanvasChange = (json: string) => {
    updatePageCanvas(currentPageIndex, json);
  };

  const handleCreatePage = () => {
    createPage();
    setReflections((prev) => [...prev, null]);
    setCanUndo(false);
    setCanRedo(false);
  };

  const handlePreviousPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
      setCanUndo(false);
      setCanRedo(false);
    }
  };

  const handleNextPage = () => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
      setCanUndo(false);
      setCanRedo(false);
    }
  };

  const handleReflect = async () => {
    const textarea = document.getElementById("mock-journal-entry") as HTMLTextAreaElement;
    const textareaText = textarea ? textarea.value.trim() : "";
    const canvasText = extractTextFromCanvas(pages[currentPageIndex]);

    // Gather selected checklist item labels for AI prompt context
    const activeChecklist = checklists[currentPageIndex] || [];
    const selectedLabels: string[] = [];
    Object.entries(CHECKLIST_ITEMS).forEach(([category, items]) => {
      items.forEach((item) => {
        if (activeChecklist.includes(item.id)) {
          selectedLabels.push(`${category}: ${item.label}`);
        }
      });
    });

    const checklistText = selectedLabels.length > 0
      ? `User-Selected Checklist Items (User-reported feelings, needs, values, or experiences):\n${selectedLabels.map(l => `- ${l}`).join("\n")}`
      : "";

    const combinedText = [canvasText, textareaText, checklistText].filter(Boolean).join("\n\n").trim();

    // Client-side validation checks
    if (!combinedText) {
      setReflectionError("Please write down some thoughts or select checklist items in your journal before reflecting.");
      return;
    }

    if (combinedText.length > 10000) {
      setReflectionError("Your entry exceeds the maximum reflection limit of 10,000 characters.");
      return;
    }

    setIsReflecting(true);
    setReflectionError(null);

    try {
      const response = await fetch("/api/reflect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: combinedText }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Failed to generate reflection.");
      }

      setReflections((prev) => {
        const updated = [...prev];
        updated[currentPageIndex] = payload;
        return updated;
      });

      // Add reflection emotions to the pattern logs
      if (payload.emotions && Array.isArray(payload.emotions)) {
        addPatternLog(payload.emotions);
      }
    } catch (err) {
      console.error("Reflection API call failed:", err);
      const errorMsg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setReflectionError(errorMsg);
    } finally {
      setIsReflecting(false);
    }
  };

  // Format today's date
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#F1E4D9] via-[#F7D7CD] to-[#91BDC2]/20 font-sans p-4 md:p-8">
      
      {/* Top Header Bar */}
      <header className="flex justify-between items-center w-full max-w-6xl mx-auto mb-6 px-2">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-[#984343] hover:text-[#803838] transition-colors font-medium text-sm group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Back to Portal
        </Link>
        
        <div className="flex items-center gap-2">
          <Link 
            href="/patterns" 
            className="inline-flex items-center gap-1.5 text-xs text-[#527d82] hover:text-[#426569] transition-colors font-bold uppercase tracking-wider bg-white/50 hover:bg-white/80 px-3 py-1.5 rounded-full border border-[#91BDC2]/40 shadow-2xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0 text-[#91BDC2]" />
            <span>Insights & Patterns</span>
          </Link>
          <div className="inline-flex items-center gap-1.5 text-xs text-[#984343]/60 font-semibold tracking-wider uppercase bg-white/40 px-3 py-1.5 rounded-full border border-[#D79B95]/30">
            <Compass className="w-3.5 h-3.5" />
            TrueNorth Journal
          </div>
        </div>
      </header>

      {/* Main Journal Scrapbook Spread */}
      <main className="flex-1 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 bg-[#F1E4D9] rounded-3xl shadow-2xl border border-[#D79B95]/30 p-6 md:p-10 relative overflow-hidden before:content-[''] before:absolute before:left-0 before:right-0 before:top-0 before:h-1.5 before:bg-gradient-to-b before:from-[#984343]/10 before:to-transparent">
        
        {/* Subtle notebook seam divider line in the center for desktop */}
        <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-gradient-to-b from-[#D79B95]/10 via-[#D79B95]/50 to-[#D79B95]/10 pointer-events-none hidden lg:block -translate-x-1/2"></div>
        <div className="absolute top-0 bottom-0 left-1/2 w-4 bg-gradient-to-r from-[#984343]/5 via-transparent to-[#984343]/5 pointer-events-none hidden lg:block -translate-x-1/2"></div>

        {/* Paper texture background overlay */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#984343_1.5px,transparent_1.5px)] [background-size:24px_24px] z-0"></div>

        {/* Left Spread: Creative Canvas Mockup */}
        <section className="relative z-10 flex flex-col justify-between h-full bg-white/70 rounded-2xl p-6 md:p-8 border border-[#D79B95]/20 shadow-inner min-h-[500px]">
          
          <div>
            {/* Header info */}
            <div className="flex justify-between items-baseline border-b border-[#D79B95]/30 pb-4 mb-6">
              <span className="font-serif italic text-sm text-[#D79B95] font-semibold">{today}</span>
              
              {/* Dynamic autosave status */}
              {autosaveStatus === "saving" && (
                <span className="font-sans text-[11px] text-[#527d82] bg-[#91BDC2]/20 px-2.5 py-0.5 rounded-full font-medium border border-[#91BDC2]/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#527d82] animate-pulse"></span>
                  Saving...
                </span>
              )}
              {autosaveStatus === "saved" && (
                <span className="font-sans text-[11px] text-[#527d82] bg-[#91BDC2]/20 px-2.5 py-0.5 rounded-full font-medium border border-[#91BDC2]/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#527d82]"></span>
                  Saved locally ✓
                </span>
              )}
              {autosaveStatus === "error" && (
                <span className="font-sans text-[11px] text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full font-medium border border-amber-300 flex items-center gap-1 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                  Error saving ⚠
                </span>
              )}
              {autosaveStatus === "offline" && (
                <span className="font-sans text-[11px] text-zinc-600 bg-zinc-100 px-2.5 py-0.5 rounded-full font-medium border border-zinc-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-500"></span>
                  Offline (Saved in-memory)
                </span>
              )}
            </div>

            {/* Hydration / loading guard */}
            {!hasHydrated ? (
              <div className="h-[380px] w-full flex flex-col items-center justify-center border border-[#D79B95]/20 rounded-xl bg-[#F1E4D9]/10">
                <div className="w-6 h-6 border-2 border-[#984343] border-t-transparent rounded-full animate-spin mb-2"></div>
                <span className="text-xs font-sans text-[#984343]/60 font-semibold tracking-wide">Loading journal...</span>
              </div>
            ) : (
              <div className="h-[380px] w-full">
                <JournalCanvas 
                  key={currentPageIndex}
                  initialCanvasJson={pages[currentPageIndex]}
                  onCanvasChange={handleCanvasChange}
                  activeTool={selectedTool} 
                  onHistoryChange={handleHistoryChange} 
                  ref={canvasRef} 
                />
              </div>
            )}

            {/* Sticker Tray */}
            {selectedTool === "stickers" && (
              <div className="p-3.5 bg-white/75 border border-[#D79B95]/30 rounded-2xl shadow-inner flex items-center gap-4 overflow-x-auto select-none animate-fade-in border-dashed">
                <span className="text-[10px] font-sans font-bold text-[#984343] uppercase tracking-wider shrink-0">Sticker Tray</span>
                <div className="flex gap-3">
                  {STICKER_ASSETS.map((sticker) => (
                    <button
                      key={sticker.id}
                      type="button"
                      onClick={() => canvasRef.current?.addSticker(sticker.svgDataUrl)}
                      className="p-1 rounded-xl border border-[#D79B95]/20 bg-[#FDFBF7] hover:bg-[#F7D7CD]/20 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-3xs flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#984343]"
                      title={`Add ${sticker.name} sticker`}
                      aria-label={`Add ${sticker.name} decorative sticker`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={sticker.svgDataUrl} alt={sticker.name} className="w-8 h-8 pointer-events-none select-none" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Page Navigation and Undo/Redo toolbar (Mock) */}
          <div className="flex justify-between items-center border-t border-[#D79B95]/20 pt-4 mt-6">
            {/* Undo / Redo */}
            <div className="flex gap-2">
              <button 
                title="Undo" 
                onClick={() => canvasRef.current?.undo()}
                disabled={!canUndo} 
                className={`p-2 rounded-lg transition-all border ${canUndo ? "text-[#984343] border-[#D79B95]/30 hover:bg-[#F7D7CD]/30 cursor-pointer" : "text-[#984343]/30 border-[#D79B95]/10 cursor-not-allowed"}`}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button 
                title="Redo" 
                onClick={() => canvasRef.current?.redo()}
                disabled={!canRedo} 
                className={`p-2 rounded-lg transition-all border ${canRedo ? "text-[#984343] border-[#D79B95]/30 hover:bg-[#F7D7CD]/30 cursor-pointer" : "text-[#984343]/30 border-[#D79B95]/10 cursor-not-allowed"}`}
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            {/* Page number switcher */}
            <div className="flex items-center gap-3">
              <button 
                type="button"
                title="Previous Page" 
                onClick={handlePreviousPage}
                disabled={currentPageIndex === 0} 
                className={`p-1.5 rounded-full transition-all ${
                  currentPageIndex > 0 
                    ? "text-[#984343] hover:bg-[#F7D7CD]/30 cursor-pointer" 
                    : "text-[#984343]/30 cursor-not-allowed"
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-sans font-bold text-[#984343]/70 uppercase tracking-wider">
                Page {currentPageIndex + 1} of {pages.length}
              </span>
              <button 
                type="button"
                title="Next Page" 
                onClick={handleNextPage}
                disabled={currentPageIndex === pages.length - 1} 
                className={`p-1.5 rounded-full transition-all ${
                  currentPageIndex < pages.length - 1 
                    ? "text-[#984343] hover:bg-[#F7D7CD]/30 cursor-pointer" 
                    : "text-[#984343]/30 cursor-not-allowed"
                }`}
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* New Page Button */}
            <div>
              <button 
                type="button"
                onClick={handleCreatePage}
                className="px-3 py-1.5 rounded-lg border border-[#D79B95]/30 text-xs font-sans font-bold text-[#984343] hover:bg-[#F7D7CD]/30 hover:shadow-xs active:scale-97 cursor-pointer transition-all flex items-center gap-1"
              >
                New Page +
              </button>
            </div>
          </div>

        </section>

        {/* Right Spread: Input & Reflection Shell */}
        <section className="relative z-10 flex flex-col justify-between h-full bg-[#FDFBF7] rounded-2xl p-6 md:p-8 border border-[#D79B95]/20 shadow-sm min-h-[500px]">
          
          <div className="space-y-6">
            <h2 className="text-xl font-serif font-bold text-[#984343] pb-2 border-b border-[#D79B95]/20">
              Journal Reflection
            </h2>

            {/* Optional Checklist Interface */}
            {isChecklistOpen && (
              <div className="border border-[#D79B95]/25 rounded-2xl bg-[#FDFBF7] p-4.5 space-y-4 shadow-sm border-dashed animate-fade-in">
                <div className="flex justify-between items-center pb-2 border-b border-[#D79B95]/15">
                  <span className="text-[10px] font-sans font-bold text-[#984343]/60 uppercase tracking-wider">
                    Optional prompt checklists
                  </span>
                  <button 
                    type="button" 
                    onClick={() => setIsChecklistOpen(false)}
                    className="text-xs font-bold text-[#984343]/60 hover:text-[#984343] cursor-pointer bg-[#F7D7CD]/20 px-2 py-0.5 rounded transition-colors"
                  >
                    Close ×
                  </button>
                </div>
                
                {/* Checklist Category Navigation Tabs */}
                <div className="flex flex-wrap gap-1 border-b border-[#D79B95]/10 pb-2">
                  {(Object.keys(CHECKLIST_ITEMS) as Array<keyof typeof CHECKLIST_ITEMS>).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveTab(cat)}
                      className={`px-2.5 py-1 text-[9px] font-sans font-bold uppercase rounded-md transition-all cursor-pointer ${
                        activeTab === cat 
                          ? "bg-[#984343] text-[#FDFBF7]" 
                          : "text-[#984343]/60 hover:bg-[#F7D7CD]/25"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Checklist Item Toggles Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {CHECKLIST_ITEMS[activeTab].map((item) => {
                    const isChecked = checklists[currentPageIndex]?.includes(item.id) || false;
                    return (
                      <label 
                        key={item.id} 
                        className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                          isChecked 
                            ? "bg-[#91BDC2]/15 border-[#91BDC2]/45 text-[#527d82] font-semibold animate-pulse-once" 
                            : "bg-stone-50 border-stone-200/60 text-[#984343]/85 hover:bg-stone-100/30"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleChecklistItem(currentPageIndex, item.id)}
                          className="w-3.5 h-3.5 border-stone-300 text-[#527d82] focus:ring-[#91BDC2] rounded cursor-pointer accent-[#527d82]"
                        />
                        <span>{item.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Visual Text Area Editor */}
            <div className="space-y-2">
              <label htmlFor="mock-journal-entry" className="font-serif italic text-sm text-[#984343]/80 block">
                How are you feeling about your interaction?
              </label>
              <textarea
                id="mock-journal-entry"
                className="w-full h-40 p-4 border border-[#D79B95]/30 rounded-xl bg-white shadow-xs focus:outline-none focus:ring-1 focus:ring-[#984343]/50 focus:border-[#984343]/50 text-sm font-sans text-[#984343]/85 resize-none leading-relaxed"
                placeholder="Write what happened, how it made you feel, or list any thoughts lingering in your mind..."
                defaultValue=""
              ></textarea>
            </div>

            {/* Prompt Helper Info */}
            <div className="text-[11px] text-[#984343]/50 font-sans italic leading-relaxed">
              * Note: Your entry text and selected checklist prompts are kept strictly in local browser storage. Only when you explicitly click Reflect is this context sent securely to generate a calming AI reflection.
            </div>
          </div>

          {/* Action Button and Reflection Placeholder Container */}
          <div className="space-y-6 mt-6">
            
            {/* Non-blocking Reflection Error alert banner */}
            {reflectionError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-sans text-rose-800 flex items-center gap-2 animate-pulse">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-700" />
                <span>{reflectionError}</span>
              </div>
            )}

            {/* Reflect button */}
            <button 
              type="button" 
              onClick={handleReflect}
              disabled={isReflecting}
              className={`w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-sans font-bold text-base transition-all shadow-md ${
                isReflecting 
                  ? "bg-[#984343]/60 text-[#FDFBF7]/80 cursor-not-allowed" 
                  : "bg-[#984343] hover:bg-[#803838] active:scale-99 text-[#FDFBF7] cursor-pointer"
              }`}
            >
              {isReflecting ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#FDFBF7] border-t-transparent rounded-full animate-spin shrink-0"></span>
                  <span>Generating reflection...</span>
                </>
              ) : (
                "Reflect ✦"
              )}
            </button>

            {/* AI Reflection Presentation Panel */}
            <ReflectionPanel reflection={reflections[currentPageIndex] || null} />

          </div>

        </section>

      </main>

      {/* Visual Floating Toolbar (Mock selection) */}
      <footer className="w-full max-w-6xl mx-auto mt-8 flex justify-center z-20">
        <div className="inline-flex items-center gap-1.5 p-2 bg-[#FDFBF7]/90 rounded-full border border-[#D79B95]/40 shadow-lg backdrop-blur-md">
          
          <button 
            type="button"
            onClick={() => setSelectedTool("pen")}
            className={`p-3 rounded-full transition-all cursor-pointer relative group ${selectedTool === "pen" ? "bg-[#984343] text-[#FDFBF7]" : "text-[#984343]/60 hover:text-[#984343] hover:bg-[#F7D7CD]/30"}`}
          >
            <Pen className="w-5 h-5" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-[#984343] text-[#FDFBF7] text-[10px] font-sans uppercase font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Pen Tool
            </span>
          </button>

          <button 
            type="button"
            onClick={() => setSelectedTool("text")}
            className={`p-3 rounded-full transition-all cursor-pointer relative group ${selectedTool === "text" ? "bg-[#984343] text-[#FDFBF7]" : "text-[#984343]/60 hover:text-[#984343] hover:bg-[#F7D7CD]/30"}`}
          >
            <Type className="w-5 h-5" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-[#984343] text-[#FDFBF7] text-[10px] font-sans uppercase font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Text Tool
            </span>
          </button>

          <button 
            type="button"
            onClick={() => setSelectedTool("eraser")}
            className={`p-3 rounded-full transition-all cursor-pointer relative group ${selectedTool === "eraser" ? "bg-[#984343] text-[#FDFBF7]" : "text-[#984343]/60 hover:text-[#984343] hover:bg-[#F7D7CD]/30"}`}
          >
            <Eraser className="w-5 h-5" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-[#984343] text-[#FDFBF7] text-[10px] font-sans uppercase font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Eraser
            </span>
          </button>

          <div className="w-[1px] h-6 bg-[#D79B95]/40 mx-1"></div>

          <button 
            type="button"
            onClick={() => {
              setSelectedTool("stickers");
              setIsChecklistOpen(false);
            }}
            className={`p-3 rounded-full transition-all cursor-pointer relative group ${selectedTool === "stickers" ? "bg-[#984343] text-[#FDFBF7]" : "text-[#984343]/60 hover:text-[#984343] hover:bg-[#F7D7CD]/30"}`}
          >
            <ImageIcon className="w-5 h-5" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-[#984343] text-[#FDFBF7] text-[10px] font-sans uppercase font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Stickers
            </span>
          </button>
 
          <button 
            type="button"
            onClick={() => {
              setIsChecklistOpen((prev) => !prev);
              if (selectedTool === "stickers") {
                setSelectedTool("pen");
              }
            }}
            className={`p-3 rounded-full transition-all cursor-pointer relative group ${isChecklistOpen ? "bg-[#984343] text-[#FDFBF7]" : "text-[#984343]/60 hover:text-[#984343] hover:bg-[#F7D7CD]/30"}`}
          >
            <CheckSquare className="w-5 h-5" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-[#984343] text-[#FDFBF7] text-[10px] font-sans uppercase font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Checklists
            </span>
          </button>

        </div>
      </footer>

    </div>
  );
}
