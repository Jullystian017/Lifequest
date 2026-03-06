"use client";

import Link from "next/link";
import { ArrowRight, Play, Star } from "lucide-react";

export default function LandingHero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--primary)]/20 blur-[120px] rounded-full animate-pulse-orange"></div>
        <div className="absolute top-[20%] right-[-5%] w-[35%] h-[35%] bg-[var(--accent)]/15 blur-[100px] rounded-full delay-700"></div>
        <div className="absolute bottom-0 left-[20%] w-[30%] h-[30%] bg-[var(--secondary)]/10 blur-[90px] rounded-full delay-1000"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-card)] border border-[var(--border-light)] mb-8 animate-fade-in shadow-xl">
            <span className="flex h-2 w-2 rounded-full bg-[var(--secondary)] shadow-[0_0_10px_var(--secondary)]"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">The Ultimate Life Gamification Tool</span>
          </div>

          {/* Main Content */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-[family-name:var(--font-heading)] leading-[1.1] mb-8 animate-fade-in">
            <span className="text-white">Coding Your </span>
            <span className="bg-gradient-to-r from-[var(--primary-light)] via-[var(--secondary-light)] to-[var(--accent-light)] bg-clip-text text-transparent">
              Life
            </span>
            <br />
            <span className="text-white">Leveling Your </span>
            <span className="bg-gradient-to-r from-[var(--accent-light)] via-[var(--primary-light)] to-[var(--secondary-light)] bg-clip-text text-transparent">
              Future
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Transform your daily grind into an epic adventure. Earn XP, conquer habits, 
            and battle real-life challenges as if they were RPG quests.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Link
              href="/register"
              className="group w-full sm:w-auto px-8 py-5 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl shadow-[var(--primary)]/30 hover:shadow-[var(--primary)]/50"
            >
              Start Your Quest Today
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              className="group w-full sm:w-auto px-8 py-5 bg-[var(--bg-card)] border border-[var(--border-medium)] text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all hover:bg-[var(--bg-card-hover)] active:scale-95 shadow-xl"
            >
              <div className="w-8 h-8 rounded-full bg-[var(--primary)]/10 flex items-center justify-center group-hover:bg-[var(--primary)]/20 transition-colors">
                <Play size={16} className="text-[var(--primary)] fill-[var(--primary)]" />
              </div>
              Watch Trailer
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-20 flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all">
             <div className="flex items-center gap-2">
                <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-[var(--bg-main)] bg-[var(--bg-card)] overflow-hidden">
                            <img src={`https://i.pravatar.cc/100?u=user${i}`} alt="user" />
                        </div>
                    ))}
                </div>
                <div className="flex flex-col items-start">
                    <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map(i => <Star key={i} size={10} className="fill-[var(--accent)] text-[var(--accent)]" />)}
                    </div>
                    <span className="text-[10px] font-bold text-white">4.9/5 from 2,000+ Players</span>
                </div>
             </div>
             <div className="h-8 w-px bg-[var(--border-light)] hidden md:block"></div>
             <div className="text-sm font-bold tracking-widest uppercase text-[var(--text-muted)]">Built for the Discipline Seekers</div>
          </div>
        </div>
      </div>

      {/* Hero Asset Decoration */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] opacity-20 pointer-events-none hidden lg:block">
        <div className="w-full h-full bg-gradient-to-br from-[var(--primary)] to-transparent rounded-full blur-[80px]"></div>
      </div>
    </section>
  );
}
