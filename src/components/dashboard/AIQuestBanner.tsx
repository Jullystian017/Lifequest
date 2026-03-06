"use client";

import { Sparkles, Wand2 } from "lucide-react";

export default function AIQuestBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-8 shadow-2xl shadow-purple-500/20 group">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-900/40 rounded-full blur-2xl -ml-10 -mb-10" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-xl">
            <Wand2 size={32} className="text-white animate-float" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-2xl font-black font-[family-name:var(--font-heading)] text-white tracking-tight">
              AI Quest Generator
            </h2>
            <p className="text-purple-100 font-medium max-w-sm">
              Transform your long-term goals into daily tasks instantly. Ready to level up your efficiency?
            </p>
          </div>
        </div>

        <button className="px-8 py-3.5 bg-white text-purple-700 font-black rounded-2xl shadow-xl hover:bg-purple-50 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
          <Sparkles size={18} />
          Generate Today
        </button>
      </div>
    </div>
  );
}
