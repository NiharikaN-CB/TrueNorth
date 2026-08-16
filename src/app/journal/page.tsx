"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  Pen, 
  Type, 
  Eraser, 
  Image as ImageIcon, 
  CheckSquare, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  RotateCcw, 
  RotateCw,
  Compass
} from "lucide-react";

export default function JournalPage() {
  const [selectedTool, setSelectedTool] = useState<string>("text");

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
        
        <div className="inline-flex items-center gap-1.5 text-xs text-[#984343]/60 font-semibold tracking-wider uppercase bg-white/40 px-3 py-1 rounded-full border border-[#D79B95]/30">
          <Compass className="w-3.5 h-3.5" />
          TrueNorth Journal (Mock)
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
              
              {/* Mock autosave status */}
              <span className="font-sans text-[11px] text-[#527d82] bg-[#91BDC2]/20 px-2.5 py-0.5 rounded-full font-medium border border-[#91BDC2]/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#527d82] animate-pulse"></span>
                Saved locally ✓
              </span>
            </div>

            {/* Dotted Canvas Mockup Surface */}
            <div className="relative border border-[#D79B95]/20 rounded-xl bg-[#F1E4D9]/20 h-[380px] p-6 flex flex-col justify-center items-center text-center opacity-85 select-none pointer-events-none overflow-hidden" 
                 style={{ backgroundImage: "radial-gradient(#D79B95 0.8px, transparent 0.8px)", backgroundSize: "16px 16px" }}>
              
              {/* Mock visual decorations (represents drawing, sticker) */}
              <div className="absolute top-8 left-8 rotate-[-6deg] bg-white border border-[#D79B95]/20 shadow-md p-2 rounded-xs">
                <div className="w-24 h-16 bg-[#F7D7CD]/30 flex items-center justify-center text-xs text-[#984343]/40 font-serif italic">Mock Drawing</div>
                <div className="absolute -top-3 left-6 w-8 h-4 bg-[#91BDC2]/30 -rotate-12 border-l border-r border-[#91BDC2]/10"></div>
              </div>

              {/* Mock sticker in bottom right */}
              <div className="absolute bottom-10 right-10 rotate-12 scale-110 opacity-70">
                <div className="w-10 h-10 bg-radial-gradient from-[#F7D7CD] to-[#D79B95] rounded-full flex items-center justify-center text-lg shadow-sm">🌸</div>
              </div>

              {/* Empty state hint */}
              <div className="max-w-xs space-y-2 relative z-10 bg-white/80 p-4 rounded-xl shadow-xs border border-[#D79B95]/20">
                <p className="font-serif italic text-sm text-[#984343]/85">Creative Canvas Layer</p>
                <p className="font-sans text-xs text-[#984343]/60">
                  (In Phase 2, this will support writing text boxes, freehand sketch lines, erasers, and decorative sticker placements.)
                </p>
              </div>
            </div>
          </div>

          {/* Page Navigation and Undo/Redo toolbar (Mock) */}
          <div className="flex justify-between items-center border-t border-[#D79B95]/20 pt-4 mt-6">
            {/* Undo / Redo */}
            <div className="flex gap-2">
              <button 
                title="Undo (Disabled)" 
                disabled 
                className="p-2 rounded-lg text-[#984343]/30 border border-[#D79B95]/10 cursor-not-allowed"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button 
                title="Redo (Disabled)" 
                disabled 
                className="p-2 rounded-lg text-[#984343]/30 border border-[#D79B95]/10 cursor-not-allowed"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            {/* Page number switcher */}
            <div className="flex items-center gap-3">
              <button 
                title="Previous Page (Disabled)" 
                disabled 
                className="p-1.5 rounded-full text-[#984343]/30 cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-sans font-bold text-[#984343]/70 uppercase tracking-wider">Page 1 of 1</span>
              <button 
                title="Next Page (Disabled)" 
                disabled 
                className="p-1.5 rounded-full text-[#984343]/30 cursor-not-allowed"
              >
                <ArrowRight className="w-4 h-4" />
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
              * Note: Your entry text is kept strictly in local browser storage. Only when you click the Reflect button is this page's text sent securely to generate a calming AI reflection.
            </div>
          </div>

          {/* Action Button and Reflection Placeholder Container */}
          <div className="space-y-6 mt-6">
            
            {/* Reflect button (Mock action) */}
            <button 
              type="button" 
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#984343] hover:bg-[#803838] active:scale-99 text-[#FDFBF7] font-sans font-bold text-base transition-all cursor-pointer shadow-md"
            >
              Reflect ✦
            </button>

            {/* Mock Reflection Panel Section */}
            <div className="border border-dashed border-[#D79B95]/50 bg-[#F7D7CD]/10 rounded-xl p-5 space-y-3 opacity-60">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#D79B95] uppercase tracking-wider">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Reflection Companion</span>
              </div>
              <div className="space-y-2 font-serif text-xs text-[#984343]/70 leading-relaxed">
                <p className="font-bold text-sm italic text-[#984343]/90">Your reflection will appear here...</p>
                <p>When you fill in the journal and click Reflect, TrueNorth will provide a gentle summary, emotion tags, grounding questions, and gentle observations to bring focus back to you.</p>
              </div>
            </div>

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
            onClick={() => setSelectedTool("stickers")}
            className={`p-3 rounded-full transition-all cursor-pointer relative group ${selectedTool === "stickers" ? "bg-[#984343] text-[#FDFBF7]" : "text-[#984343]/60 hover:text-[#984343] hover:bg-[#F7D7CD]/30"}`}
          >
            <ImageIcon className="w-5 h-5" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-[#984343] text-[#FDFBF7] text-[10px] font-sans uppercase font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Stickers
            </span>
          </button>

          <button 
            type="button"
            onClick={() => setSelectedTool("checklist")}
            className={`p-3 rounded-full transition-all cursor-pointer relative group ${selectedTool === "checklist" ? "bg-[#984343] text-[#FDFBF7]" : "text-[#984343]/60 hover:text-[#984343] hover:bg-[#F7D7CD]/30"}`}
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
