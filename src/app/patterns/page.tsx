"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { get, set } from "idb-keyval";
import { useJournalStore } from "@/lib/storage/journal-storage";
import { ArrowLeft, Bookmark, AlertTriangle, Sparkles, Trash2, Heart } from "lucide-react";

export default function PatternsPage() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const {
    pages,
    patternLogs,
    setPages,
    setPatternLogs,
    clearPatternLogs,
  } = useJournalStore();

  // Mount -> Load from IndexedDB
  useEffect(() => {
    interface StoredJournalState {
      pages?: string[];
      patternLogs?: Array<{ date: string; emotions: string[] }>;
    }
    const loadState = async () => {
      try {
        const stored = await get("truenorth-journal-state");
        const storedObj = stored as StoredJournalState;
        if (storedObj && typeof storedObj === "object") {
          if (Array.isArray(storedObj.pages)) {
            setPages(storedObj.pages);
          }
          if (Array.isArray(storedObj.patternLogs)) {
            setPatternLogs(storedObj.patternLogs);
          }
        }
      } catch (err) {
        console.error("Failed to read IndexedDB from patterns page:", err);
      } finally {
        setHasHydrated(true);
      }
    };
    loadState();
  }, [setPages, setPatternLogs]);

  // Autosave back to IndexedDB if state is modified (e.g. clearing patterns)
  useEffect(() => {
    if (!hasHydrated) return;

    const timer = setTimeout(async () => {
      try {
        await set("truenorth-journal-state", { pages, patternLogs });
      } catch (err) {
        console.error("Failed to autosave from patterns page:", err);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [pages, patternLogs, hasHydrated]);

  // Aggregate emotion frequencies
  const emotionCounts: Record<string, number> = {};
  for (const log of patternLogs) {
    if (log.emotions && Array.isArray(log.emotions)) {
      for (const emotion of log.emotions) {
        const normalized = emotion.trim().toLowerCase();
        if (normalized.length > 0) {
          emotionCounts[normalized] = (emotionCounts[normalized] || 0) + 1;
        }
      }
    }
  }

  const sortedEmotions = Object.entries(emotionCounts)
    .map(([emotion, count]) => ({ emotion, count }))
    .sort((a, b) => b.count - a.count);

  const totalReflections = patternLogs.length;

  // Build local observations based on threshold filter (count >= 2)
  const recurringObservations: string[] = [];
  if (totalReflections >= 2) {
    for (const { emotion, count } of sortedEmotions) {
      if (count >= 2) {
        if (emotion === "anxious" || emotion === "anxiety") {
          recurringObservations.push(
            `You've mentioned feeling anxiety in ${count} reflections. That may be worth noticing alongside what consistency, clarity, or reassurance mean to you.`
          );
        } else if (emotion === "drained") {
          recurringObservations.push(
            `You've described feeling drained in ${count} reflections. This might be a gentle invitation to explore your emotional boundaries and energy levels.`
          );
        } else if (emotion === "unsettled") {
          recurringObservations.push(
            `You've noted feeling unsettled in ${count} reflections. That could be a cue to explore what values or boundaries felt crossed or ignored.`
          );
        } else {
          // General fallback observation following non-diagnostic, tentative wording constraints
          recurringObservations.push(
            `You've noted feeling ${emotion} in ${count} reflections. It might be a gentle invitation to explore what needs or feelings are connected to this experience.`
          );
        }
      }
    }
  }

  const handleClearHistory = () => {
    clearPatternLogs();
    setShowConfirmReset(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#F1E4D9] via-[#F7D7CD] to-[#91BDC2]/20 font-sans p-4 md:p-8">
      
      {/* Top Header Bar */}
      <header className="flex justify-between items-center w-full max-w-6xl mx-auto mb-6 px-2">
        <Link 
          href="/journal" 
          className="inline-flex items-center gap-1.5 text-[#984343] hover:text-[#803838] transition-colors font-medium text-sm group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Back to Journal
        </Link>
        
        <div className="inline-flex items-center gap-1.5 text-xs text-[#527d82] font-semibold tracking-wider uppercase bg-white/40 px-3 py-1 rounded-full border border-[#91BDC2]/30">
          <Sparkles className="w-3.5 h-3.5 text-[#91BDC2]" />
          Insights Dashboard
        </div>
      </header>

      {/* Main Insights Scrapbook Spread */}
      <main className="flex-1 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 bg-[#F1E4D9] rounded-3xl shadow-2xl border border-[#D79B95]/30 p-6 md:p-10 relative overflow-hidden before:content-[''] before:absolute before:left-0 before:right-0 before:top-0 before:h-1.5 before:bg-gradient-to-b before:from-[#984343]/10 before:to-transparent">
        
        {/* Notebook seam divider line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#D79B95]/20 pointer-events-none hidden lg:block"></div>
        <div className="absolute left-1/2 top-0 bottom-0 w-[8px] bg-gradient-to-r from-black/5 to-transparent pointer-events-none hidden lg:block -translate-x-[4px]"></div>

        {/* Left Spread Page (Aggregates & Chart) */}
        <section className="relative z-10 flex flex-col justify-between h-full bg-[#FDFBF7] rounded-2xl p-6 md:p-8 border border-[#D79B95]/20 shadow-sm">
          <div className="space-y-6">
            <h2 className="text-xl font-serif font-bold text-[#984343] pb-2 border-b border-[#D79B95]/20">
              Reflections Log
            </h2>

            {/* Basic Analytics Statistics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[#F7D7CD]/15 border border-[#D79B95]/15 rounded-xl text-center space-y-1">
                <span className="text-[10px] font-sans font-bold text-[#984343]/60 uppercase tracking-wider block">Total Entries</span>
                <span className="font-serif text-3xl font-bold text-[#984343]">{pages.length}</span>
              </div>
              <div className="p-4 bg-[#91BDC2]/10 border border-[#91BDC2]/20 rounded-xl text-center space-y-1">
                <span className="text-[10px] font-sans font-bold text-[#527d82] uppercase tracking-wider block">Reflections Run</span>
                <span className="font-serif text-3xl font-bold text-[#527d82]">{totalReflections}</span>
              </div>
            </div>

            {/* Top Recurring Emotions Map */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-sans font-bold text-[#984343]/60 uppercase tracking-widest flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#D79B95] fill-[#D79B95]" />
                <span>Emotion Frequencies</span>
              </h3>

              {sortedEmotions.length === 0 ? (
                <div className="p-6 text-center border border-dashed border-[#D79B95]/30 rounded-xl bg-white/40">
                  <p className="font-serif italic text-xs text-[#984343]/50">No logged emotions found yet.</p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {sortedEmotions.slice(0, 5).map(({ emotion, count }, index) => {
                    const percentage = totalReflections > 0 ? (count / totalReflections) * 100 : 0;
                    return (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between items-center text-xs font-sans">
                          <span className="font-bold text-[#984343]/80 capitalize">{emotion}</span>
                          <span className="text-[#984343]/50 font-medium">
                            {count} {count === 1 ? "reflection" : "reflections"}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden border border-stone-200/50">
                          <div 
                            className="h-full bg-gradient-to-r from-[#F7D7CD] to-[#D79B95] rounded-full transition-all duration-500" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="text-[10px] font-sans text-[#984343]/40 italic mt-8 pt-4 border-t border-[#D79B95]/10">
            * All data is processed local-only. Reflection details remain encrypted in your browser database.
          </div>
        </section>

        {/* Right Spread Page (Observations & Management) */}
        <section className="relative z-10 flex flex-col justify-between h-full bg-[#FDFBF7] rounded-2xl p-6 md:p-8 border border-[#D79B95]/20 shadow-sm min-h-[500px]">
          <div className="space-y-6">
            <h2 className="text-xl font-serif font-bold text-[#984343] pb-2 border-b border-[#D79B95]/20 flex items-center gap-2">
              <span>Noticed Patterns</span>
            </h2>

            {/* Observations card timeline logic */}
            {recurringObservations.length === 0 ? (
              <div className="border border-dashed border-[#D79B95]/50 bg-[#F7D7CD]/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#984343]/60 uppercase tracking-wider">
                  <Bookmark className="w-4 h-4 shrink-0 text-[#D79B95]" />
                  <span>Looking for insights</span>
                </div>
                <div className="space-y-2.5 font-serif text-xs md:text-sm text-[#984343]/70 leading-relaxed">
                  <p className="font-bold text-[#984343]/90 italic">Building your timeline...</p>
                  <p>
                    More reflection data is needed to notice patterns. TrueNorth requires at least two logged reflections with recurring themes to surface insights.
                  </p>
                  <p className="text-[11px] text-[#984343]/50 italic">
                    Keep journaling and requesting AI reflections from the editor.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1">
                {recurringObservations.map((observation, idx) => (
                  <div 
                    key={idx} 
                    className="p-4 bg-[#F7D7CD]/15 border border-[#D79B95]/20 rounded-xl space-y-2 text-left transition-all hover:bg-[#F7D7CD]/20"
                  >
                    <div className="flex items-center gap-1.5 text-[10px] font-sans font-bold text-[#984343] uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-[#D79B95]" />
                      <span>Observation</span>
                    </div>
                    <p className="font-serif text-xs md:text-sm text-[#984343]/85 leading-relaxed italic">
                      &ldquo;{observation}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reset Options Card with Confirms Block */}
          <div className="mt-8 pt-4 border-t border-[#D79B95]/15 space-y-4">
            {!showConfirmReset ? (
              <button
                type="button"
                onClick={() => setShowConfirmReset(true)}
                disabled={totalReflections === 0}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-sans font-bold border transition-all ${
                  totalReflections === 0
                    ? "text-stone-400 bg-stone-50 border-stone-200 cursor-not-allowed"
                    : "text-[#984343] bg-white border-[#D79B95]/30 hover:bg-[#984343]/5 cursor-pointer"
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Pattern History</span>
              </button>
            ) : (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-3 animate-fade-in">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-rose-900">Are you sure you want to clear your patterns?</p>
                    <p className="text-[11px] text-rose-800/80 leading-relaxed font-serif">
                      This action will reset your pattern history analytics only. Your written journal pages, drawings, and writings will <strong>NOT</strong> be deleted.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 pl-7.5">
                  <button
                    type="button"
                    onClick={() => setShowConfirmReset(false)}
                    className="px-3 py-1.5 rounded bg-white hover:bg-stone-50 text-stone-600 border border-stone-200 text-[11px] font-sans font-semibold shadow-2xs transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleClearHistory}
                    className="px-3 py-1.5 rounded bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-sans font-bold shadow-sm transition-all cursor-pointer"
                  >
                    Confirm Clear
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}
