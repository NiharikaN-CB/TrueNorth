import Link from "next/link";
import { Sparkles, Shield, Compass, Heart } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center px-4 py-12 relative overflow-hidden bg-gradient-to-tr from-[#F1E4D9] via-[#F7D7CD] to-[#91BDC2]/30">
      
      {/* Background seaside aesthetic waves */}
      <div className="absolute inset-x-0 bottom-0 h-40 opacity-20 pointer-events-none">
        <svg viewBox="0 0 1440 320" className="w-full h-full preserve-3d" fill="#D79B95">
          <path d="M0,160L48,154.7C96,149,192,139,288,149.3C384,160,480,192,576,192C672,192,768,160,864,138.7C960,117,1056,107,1152,112C1248,117,1344,139,1392,149.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-32 opacity-30 pointer-events-none">
        <svg viewBox="0 0 1440 320" className="w-full h-full preserve-3d" fill="#91BDC2">
          <path d="M0,224L60,208C120,192,240,160,360,160C480,160,600,192,720,208C840,224,960,224,1080,202.7C1200,181,1320,139,1380,117.3L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
        </svg>
      </div>

      {/* Decorative scrap tape at top right */}
      <div className="absolute top-10 right-10 md:right-24 w-32 h-10 bg-white/40 border-l border-r border-dashed border-[#D79B95]/50 rotate-12 pointer-events-none shadow-sm backdrop-blur-xs flex items-center justify-center">
        <span className="text-[10px] tracking-widest text-[#984343]/60 uppercase font-sans font-medium">TrueNorth</span>
      </div>

      {/* Main Container: Physical scrapbook design */}
      <main className="relative w-full max-w-2xl bg-[#F1E4D9] rounded-2xl shadow-2xl border border-[#D79B95]/30 p-8 md:p-12 z-10 overflow-hidden before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1.5 before:bg-gradient-to-r before:from-[#984343]/20 before:to-transparent">
        
        {/* Subtle notebook binder margin line */}
        <div className="absolute left-8 top-0 bottom-0 w-[1px] bg-[#D79B95]/40 pointer-events-none hidden md:block"></div>

        {/* Paper texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#984343_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="relative flex flex-col items-center text-center space-y-8 md:pl-6">
          
          {/* Header */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7D7CD] text-[#984343] text-xs font-semibold tracking-wider uppercase font-sans">
              <Compass className="w-3.5 h-3.5 animate-spin-slow" />
              Dating Companion
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#984343] tracking-tight">
              TrueNorth
            </h1>
            <p className="text-lg md:text-xl font-serif italic text-[#D79B95] tracking-wide">
              A calmer way to date.
            </p>
          </div>

          {/* Description / Story Loop */}
          <div className="w-full max-w-lg text-[#984343]/85 text-base md:text-lg leading-relaxed font-serif space-y-4">
            <p>
              When a dating interaction leaves you feeling unsettled, we tend to spend hours trying to decode the other person.
            </p>
            <p className="italic text-[#984343]/70">
              TrueNorth is a private notebook for writing down what happened, reflecting on your feelings, and returning to what you value.
            </p>
          </div>

          {/* Visual Loop Process */}
          <div className="flex flex-wrap justify-center items-center gap-3 py-2 w-full max-w-md text-xs font-semibold font-sans uppercase text-[#984343]/60 tracking-wider">
            <span className="px-2.5 py-1.5 rounded-md bg-[#F1E4D9] border border-[#D79B95]/20 shadow-xs">Something Happened</span>
            <span>&rarr;</span>
            <span className="px-2.5 py-1.5 rounded-md bg-[#F7D7CD]/50 border border-[#D79B95]/20 shadow-xs">Feel Unsettled</span>
            <span>&rarr;</span>
            <span className="px-2.5 py-1.5 rounded-md bg-[#91BDC2]/20 border border-[#D79B95]/20 shadow-xs text-[#527d82]">Reflect & Ground</span>
          </div>

          {/* Call to Action Button */}
          <div className="w-full pt-4">
            <Link 
              href="/journal" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 w-full sm:w-auto rounded-full bg-[#984343] text-[#F1E4D9] font-sans font-bold text-lg transition-all duration-300 hover:bg-[#803838] hover:shadow-lg active:scale-98 group cursor-pointer"
            >
              Start Journaling
              <Sparkles className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
            </Link>
          </div>

          {/* Privacy Statement Box */}
          <div className="w-full max-w-lg bg-[#F7D7CD]/30 rounded-xl p-5 border border-[#D79B95]/20 space-y-2.5 text-left md:text-center mt-6">
            <div className="flex items-start md:items-center md:justify-center gap-2.5 text-[#984343]">
              <Shield className="w-5 h-5 shrink-0 text-[#D79B95]" />
              <h3 className="font-sans font-bold text-sm uppercase tracking-wider">
                Private & Device-Local
              </h3>
            </div>
            <div className="space-y-1.5 text-xs md:text-sm text-[#984343]/80 leading-relaxed font-sans">
              <p className="font-semibold">
                &quot;Your journal stays on your device. Nothing is sent for reflection unless you choose Reflect.&quot;
              </p>
              <p className="text-[#984343]/60 italic">
                &quot;When you choose Reflect, only the text needed for that reflection is sent securely to our AI service.&quot;
              </p>
            </div>
          </div>

          {/* Footnotes */}
          <div className="flex items-center gap-1.5 text-xs text-[#984343]/50 font-sans">
            <span>Made for calm reflection</span>
            <Heart className="w-3 h-3 text-[#D79B95] fill-[#D79B95]" />
            <span>No account required</span>
          </div>

        </div>
      </main>
    </div>
  );
}
