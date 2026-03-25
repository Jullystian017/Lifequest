"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Play, Star, ChevronDown } from "lucide-react";

function useCounter(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

export default function LandingHero() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  const players = useCounter(10482, 2200, visible);
  const quests = useCounter(284719, 2400, visible);
  const guilds = useCounter(1247, 2000, visible);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-20 overflow-hidden"
    >
      {/* ── Layered background atmosphere ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Main glow blobs */}
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[60%] rounded-full bg-[var(--primary)]/[0.07] blur-[120px] animate-[float_8s_ease-in-out_infinite]" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[50%] rounded-full bg-[var(--secondary)]/[0.06] blur-[120px] animate-[float_10s_ease-in-out_2s_infinite]" />
        <div className="absolute bottom-[0%] left-[30%] w-[35%] h-[40%] rounded-full bg-[var(--accent)]/[0.04] blur-[100px] animate-[float_12s_ease-in-out_4s_infinite]" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(var(--border-light) 1px, transparent 1px), linear-gradient(90deg, var(--border-light) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg-main)]" />
      </div>

      {/* ── Floating rune decorations ── */}
      {["ᚠ", "ᚢ", "ᚦ", "ᚱ", "ᚲ", "ᚷ"].map((rune, i) => (
        <span
          key={i}
          className="absolute font-[family-name:var(--font-heading)] text-[var(--primary)]/10 select-none pointer-events-none animate-[float_linear_infinite]"
          style={{
            left: `${[8, 15, 82, 90, 50, 70][i]}%`,
            top: `${[20, 55, 25, 60, 12, 75][i]}%`,
            fontSize: `${[14, 10, 16, 12, 18, 11][i]}px`,
            animationDuration: `${[12, 15, 11, 14, 13, 16][i]}s`,
            animationDelay: `${[0, 3, 1.5, 4, 2, 6][i]}s`,
          }}
        >
          {rune}
        </span>
      ))}

      {/* ── Main content ── */}
      <div className="container mx-auto px-6 relative z-10 text-center">
        {/* Eyebrow badge */}
        <div
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-10 border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--primary)]" />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--text-secondary)]">
            The Ultimate Gamified Productivity Tool
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-[family-name:var(--font-heading)] font-bold leading-[0.95] mb-8 mx-auto max-w-5xl"
          style={{
            fontSize: "clamp(48px, 8vw, 96px)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.8s ease 0.15s, transform 0.8s ease 0.15s",
          }}
        >
          <span className="block text-white">Coding Your</span>
          <span
            className="block bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(135deg, var(--primary-light) 0%, var(--secondary-light) 50%, var(--accent-light) 100%)",
            }}
          >
            Life.
          </span>
          <span className="block text-white">Leveling Your</span>
          <span
            className="block bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(135deg, var(--accent-light) 0%, var(--primary-light) 50%, var(--secondary-light) 100%)",
            }}
          >
            Future.
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-lg md:text-xl text-[var(--text-secondary)] max-w-lg mx-auto leading-relaxed mb-12 font-light"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s",
          }}
        >
          Transform your daily grind into an epic adventure. Level up your
          character by completing real-world tasks and building legendary habits.
        </p>

        {/* CTA buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s ease 0.45s, transform 0.8s ease 0.45s",
          }}
        >
          <Link
            href="/register"
            className="group relative w-full sm:w-auto px-8 py-4 text-sm font-bold text-white rounded-xl overflow-hidden transition-all duration-300 active:scale-95 shadow-2xl shadow-[var(--primary)]/20"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)]" />
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-[var(--primary-light)] to-[var(--primary)]" />
            <span className="relative flex items-center justify-center gap-2.5">
              Start Quest
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform duration-200"
              />
            </span>
          </Link>

          <button className="group w-full sm:w-auto px-8 py-4 bg-white/[0.04] border border-white/[0.1] text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-3 transition-all duration-300 hover:bg-white/[0.08] hover:border-white/[0.18] active:scale-95">
            <span className="w-7 h-7 rounded-full bg-[var(--primary)]/15 flex items-center justify-center group-hover:bg-[var(--primary)]/25 transition-colors">
              <Play
                size={11}
                className="text-[var(--primary)] fill-[var(--primary)] ml-0.5"
              />
            </span>
            Watch Demo
          </button>
        </div>

        {/* Stats row */}
        <div
          className="flex flex-wrap items-center justify-center gap-0 mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 1s ease 0.65s",
          }}
        >
          {[
            { val: players, label: "Active Heroes", suffix: "+" },
            { val: quests, label: "Quests Done", suffix: "+" },
            { val: guilds, label: "Guilds Formed", suffix: "+" },
          ].map((stat, i) => (
            <div key={i} className="flex items-center">
              <div className="px-8 py-4 text-center">
                <div
                  className="font-[family-name:var(--font-heading)] font-bold text-3xl bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, var(--primary-light), var(--primary))",
                  }}
                >
                  {stat.val.toLocaleString()}
                  {stat.suffix}
                </div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)] mt-1">
                  {stat.label}
                </div>
              </div>
              {i < 2 && (
                <div className="w-px h-10 bg-white/[0.08] hidden sm:block" />
              )}
            </div>
          ))}
        </div>

        {/* Social proof */}
        <div
          className="flex flex-wrap items-center justify-center gap-3"
          style={{
            opacity: visible ? 0.6 : 0,
            transition: "opacity 1s ease 0.8s",
          }}
        >
          <div className="flex -space-x-2.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full border-2 border-[var(--bg-main)] bg-[var(--bg-card)] overflow-hidden ring-1 ring-white/10"
              >
                <img src={`https://i.pravatar.cc/56?u=hero${i}`} alt="user" />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                size={10}
                className="fill-[var(--accent)] text-[var(--accent)]"
              />
            ))}
          </div>
          <span className="text-[11px] font-semibold text-[var(--text-secondary)]">
            4.9 / 5 from 2,000+ players
          </span>
          <span className="hidden sm:block w-px h-4 bg-white/10" />
          <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Built for the Discipline Seekers
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{
          opacity: visible ? 0.4 : 0,
          transition: "opacity 1s ease 1.2s",
        }}
      >
        <span className="text-[9px] uppercase tracking-[0.3em] text-[var(--text-muted)]">
          Scroll
        </span>
        <ChevronDown
          size={14}
          className="text-[var(--text-muted)] animate-bounce"
        />
      </div>
    </section>
  );
}