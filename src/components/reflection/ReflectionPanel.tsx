"use client";

import type { Reflection } from "@/app/api/reflect/route";
import { Sparkles, Compass, AlertCircle, Bookmark, Heart } from "lucide-react";

interface ReflectionPanelProps {
  reflection: Reflection | null;
}

export default function ReflectionPanel({ reflection }: ReflectionPanelProps) {
  if (!reflection) {
    return (
      <div className="border border-dashed border-[#D79B95]/50 bg-[#F7D7CD]/10 rounded-xl p-5 space-y-3 opacity-60">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#D79B95] uppercase tracking-wider">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>Reflection Companion</span>
        </div>
        <div className="space-y-2 font-serif text-xs text-[#984343]/70 leading-relaxed">
          <p className="font-bold text-sm italic text-[#984343]/90">Your reflection will appear here...</p>
          <p>
            When you fill in the journal and click Reflect, TrueNorth will provide a gentle summary, emotion tags, grounding questions, and observations to bring focus back to your feelings and needs.
          </p>
        </div>
      </div>
    );
  }

  const { summary, emotions, gentleReflection, questions, recoverySuggestion, patternObservation, redFlags } = reflection;

  return (
    <div className="space-y-6 animate-fade-in pb-4">
      {/* Validation Summary */}
      <div className="border-b border-[#D79B95]/20 pb-4">
        <p className="font-serif italic text-[#984343] text-sm md:text-base leading-relaxed font-semibold">
          &ldquo;{summary}&rdquo;
        </p>
      </div>

      {/* Emotion Tags */}
      <div className="flex flex-wrap gap-2">
        {emotions.map((emotion, idx) => (
          <span
            key={idx}
            className="text-[11px] font-sans font-medium px-2.5 py-0.5 rounded-full border border-[#D79B95]/30 bg-[#F7D7CD]/35 text-[#984343]"
          >
            {emotion}
          </span>
        ))}
      </div>

      {/* Gentle Reflection Paragraph */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[#984343]/60 uppercase tracking-wider">
          <Heart className="w-3.5 h-3.5" />
          <span>Gently Reflecting</span>
        </div>
        <p className="font-serif text-xs md:text-sm text-[#984343]/80 leading-relaxed bg-[#FDFBF7]/60 p-4 rounded-xl border border-[#D79B95]/15">
          {gentleReflection}
        </p>
      </div>

      {/* Grounding Questions */}
      {questions && questions.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#984343]/60 uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>Grounding Questions</span>
          </div>
          <ul className="space-y-2 font-serif text-xs md:text-sm text-[#984343]/80 pl-1">
            {questions.map((question, idx) => (
              <li key={idx} className="flex gap-2 items-start leading-relaxed bg-[#F7D7CD]/10 p-3 rounded-lg border border-[#D79B95]/10">
                <span className="text-[#D79B95] font-bold select-none">•</span>
                <span>{question}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Pattern Observations */}
      {patternObservation && (
        <div className="space-y-2 bg-[#91BDC2]/10 border border-[#91BDC2]/30 rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#527d82] uppercase tracking-wider">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Noticed Pattern</span>
          </div>
          <p className="font-serif text-xs md:text-sm text-[#527d82]/90 leading-relaxed italic">
            {patternObservation}
          </p>
        </div>
      )}

      {/* Observations to Consider (Tentative Red Flags) */}
      {redFlags && redFlags.length > 0 && (
        <div className="space-y-3 bg-[#984343]/5 border border-[#984343]/15 rounded-xl p-4 md:p-5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#984343] uppercase tracking-wider">
            <AlertCircle className="w-4 h-4 text-[#984343] shrink-0" />
            <span>Observations to consider</span>
          </div>
          <div className="space-y-3 font-serif text-xs md:text-sm text-[#984343]/85 pl-1 leading-relaxed">
            {redFlags.map((flag, idx) => (
              <div key={idx} className="space-y-1">
                <p className="font-semibold text-rose-900">• {flag.observation}</p>
                <p className="text-[#984343]/70 pl-3 italic text-[11px] md:text-xs">
                  {flag.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Self-Care Recovery Suggestion */}
      <div className="border border-dashed border-[#D79B95]/40 bg-[#FDFBF7] p-4 rounded-xl space-y-1.5 shadow-2xs">
        <p className="text-[10px] font-sans font-bold text-[#D79B95] uppercase tracking-widest flex items-center gap-1.5">
          <Heart className="w-3 h-3 fill-[#D79B95]" />
          <span>Compassionate reminder</span>
        </p>
        <p className="font-serif text-xs md:text-sm text-[#984343]/75 italic leading-relaxed">
          {recoverySuggestion}
        </p>
      </div>
    </div>
  );
}
