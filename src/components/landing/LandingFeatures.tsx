"use client";

import { useEffect, useRef, useState } from "react";
import {
  Sword, Zap, Target, Trophy, Skull, Bot, Users,
  CheckCircle2, Flame, Crown, Medal, TrendingUp, Sparkles, ChevronRight,
} from "lucide-react";

/* ─── helpers ─── */
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ─── data ─── */
const coreFeatures = [
  {
    icon: Sword,
    title: "Quest System",
    desc: "Break down life goals into epic quests with RPG-style milestones. Each completed task brings you closer to becoming legendary.",
    color: "var(--primary)",
  },
  {
    icon: Zap,
    title: "XP & Progression",
    desc: "Every action earns XP. Watch your character evolve in real-time as you build habits and crush daily objectives.",
    color: "var(--secondary)",
  },
  {
    icon: Target,
    title: "Habit Streaks",
    desc: "Consistency is power. Build legendary streaks, unlock streak bonuses, and become unstoppable over time.",
    color: "var(--accent)",
  },
  {
    icon: Trophy,
    title: "Epic Achievements",
    desc: "Unlock unique badges, rare titles, and exclusive achievements that mark your journey as a productivity hero.",
    color: "var(--primary)",
  },
];

const interactiveTabs = [
  {
    id: "boss",
    icon: Skull,
    label: "Boss Battles",
    color: "var(--health, #ef4444)",
    headline: "Face Your Greatest Challenges",
    summary:
      "Your biggest life obstacles transformed into epic World Boss encounters. Rally your guild, deploy your best strategies, and earn legendary loot upon victory.",
    bullets: [
      "Weekly rotating bosses tied to real goals",
      "Guild co-op raids for up to 12 players",
      "Exclusive legendary loot on kill",
      "HP scales to your personal challenge level",
    ],
    Preview: () => (
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-bold text-white flex items-center gap-2">
            <Skull size={13} className="text-red-400" /> Procrastination Titan
          </span>
          <span className="text-red-400 font-bold">34% HP</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-red-700 to-red-400" style={{ width: "34%" }} />
        </div>
        <div className="grid grid-cols-3 gap-2 mt-5">
          {["⚔ Attack", "🛡 Defend", "✨ Spell"].map((a) => (
            <button key={a} className="py-2 rounded-lg text-[11px] font-bold border border-white/10 bg-white/[0.04] hover:bg-white/[0.09] hover:border-red-500/30 transition-all text-white/70 hover:text-white">
              {a}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/[0.06]">
          <div className="flex -space-x-1.5">
            {[1,2,3,4].map(i => (
              <div key={i} className="w-6 h-6 rounded-full bg-[var(--bg-card)] border border-white/10 overflow-hidden">
                <img src={`https://i.pravatar.cc/48?u=boss${i}`} alt="" />
              </div>
            ))}
          </div>
          <span className="text-[11px] text-[var(--text-muted)]">+8 guild members raiding now</span>
        </div>
      </div>
    ),
  },
  {
    id: "ai",
    icon: Bot,
    label: "AI Dungeon Master",
    color: "var(--knowledge, #8b5cf6)",
    headline: "Your Personal AI Quest Crafter",
    summary:
      "Our AI analyzes your goals, habits, and play style to craft perfectly tailored quests. It adapts to your progress — challenging you when you coast, supporting you when you struggle.",
    bullets: [
      "Goal analysis & dynamic quest generation",
      "Adaptive difficulty that grows with you",
      "Smart streak recovery suggestions",
      "Weekly AI-generated challenge reports",
    ],
    Preview: () => (
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles size={13} className="text-purple-400" />
          </div>
          <div className="flex-1 bg-white/[0.04] rounded-xl rounded-tl-none p-3 text-[12px] text-[var(--text-secondary)] leading-relaxed border border-white/[0.06]">
            Based on your week, I've generated 3 new quests. You've been avoiding deep work — let's fix that with a 25-min Focus Sprint. Want me to activate it?
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 py-2 rounded-lg text-[11px] font-bold bg-purple-500/15 text-purple-400 border border-purple-500/20 hover:bg-purple-500/25 transition-all">
            ✓ Activate Quest
          </button>
          <button className="px-4 py-2 rounded-lg text-[11px] font-bold bg-white/[0.04] text-[var(--text-muted)] border border-white/10 hover:bg-white/[0.08] transition-all">
            Skip
          </button>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.05]">
          <TrendingUp size={12} className="text-purple-400" />
          <span className="text-[11px] text-[var(--text-muted)]">AI accuracy improved 12% this week</span>
        </div>
      </div>
    ),
  },
];

const leaderboardPlayers = [
  { rank: 1, name: "ShadowBlade_X",  level: 99, xp: "2.84M", streak: 187, region: "🌏 Asia",     crown: true  },
  { rank: 2, name: "IronWill_Ada",   level: 94, xp: "2.41M", streak: 143, region: "🌍 Europe",   crown: false },
  { rank: 3, name: "NovaSurge",      level: 91, xp: "2.19M", streak: 121, region: "🌎 Americas", crown: false },
  { rank: 4, name: "ZenMaster99",    level: 87, xp: "1.97M", streak: 98,  region: "🌏 Asia",     crown: false },
  { rank: 5, name: "You",            level: 42, xp: "284K",  streak: 21,  region: "📍 Your Rank",crown: false, isYou: true },
];

const rankColors = ["#F59E0B", "#C0C0C0", "#CD7F32"];

/* ─── component ─── */
export default function LandingFeatures() {
  const [activeTab, setActiveTab] = useState(0);
  const secCore        = useInView(0.06);
  const secInteractive = useInView(0.06);
  const secLeader      = useInView(0.06);

  const ActivePreview = interactiveTabs[activeTab].Preview;

  return (
    <div id="features" className="relative overflow-hidden">

      {/* ══════════════════════════════════
          SECTION 1 — CORE FEATURES
      ══════════════════════════════════ */}
      <section className="py-28 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-[380px] h-[380px] rounded-full bg-[var(--primary)]/[0.04] blur-[120px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Header */}
          <div
            ref={secCore.ref}
            className="max-w-xl mb-16 transition-all duration-700"
            style={{
              opacity: secCore.visible ? 1 : 0,
              transform: secCore.visible ? "translateY(0)" : "translateY(28px)",
            }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.07] bg-white/[0.03] mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--primary)]">Core Features</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold font-[family-name:var(--font-heading)] mb-4 leading-tight">
              Everything You Need{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, var(--primary-light), var(--secondary-light))" }}
              >
                to Level Up
              </span>
            </h2>
            <p className="text-[var(--text-secondary)] text-[15px] leading-relaxed">
              The essential toolkit that turns your daily routine into an RPG adventure — quests, XP, streaks, and achievements all in one place.
            </p>
          </div>

          {/* 2×2 grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {coreFeatures.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div
                  key={i}
                  className="group relative flex gap-6 p-8 rounded-2xl border border-white/[0.07] bg-[var(--bg-card)]/25 hover:bg-[var(--bg-card)]/50 hover:border-white/[0.13] transition-all duration-500 cursor-default overflow-hidden"
                  style={{
                    opacity: secCore.visible ? 1 : 0,
                    transform: secCore.visible ? "translateY(0)" : "translateY(36px)",
                    transition: `opacity 0.7s ease ${0.1 + i * 0.1}s, transform 0.7s ease ${0.1 + i * 0.1}s, background 0.4s, border-color 0.4s`,
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse 60% 60% at 0% 0%, color-mix(in srgb, ${feat.color} 7%, transparent), transparent)` }}
                  />
                  <div
                    className="relative shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                    style={{
                      background: `color-mix(in srgb, ${feat.color} 12%, transparent)`,
                      boxShadow: `0 0 0 1px color-mix(in srgb, ${feat.color} 22%, transparent)`,
                    }}
                  >
                    <Icon size={22} style={{ color: feat.color }} className="group-hover:rotate-[-6deg] transition-transform duration-300" />
                  </div>
                  <div className="relative flex-1 min-w-0">
                    <h3 className="text-[15px] font-bold text-white mb-2.5 group-hover:text-[var(--primary-light)] transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{feat.desc}</p>
                  </div>
                  <div
                    className="absolute bottom-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `linear-gradient(90deg, transparent, color-mix(in srgb, ${feat.color} 60%, transparent), transparent)` }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container mx-auto px-6 md:px-10 lg:px-16 xl:px-24">
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
      </div>

      {/* ══════════════════════════════════
          SECTION 2 — INTERACTIVE FEATURES
      ══════════════════════════════════ */}
      <section className="py-28 relative" id="how-it-works">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full bg-[var(--secondary)]/[0.04] blur-[130px] translate-x-1/3" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Header */}
          <div
            ref={secInteractive.ref}
            className="text-center max-w-2xl mx-auto mb-12 transition-all duration-700"
            style={{
              opacity: secInteractive.visible ? 1 : 0,
              transform: secInteractive.visible ? "translateY(0)" : "translateY(28px)",
            }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.07] bg-white/[0.03] mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--secondary)] animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--secondary)]">Interactive Features</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold font-[family-name:var(--font-heading)] mb-4 leading-tight">
              Go Beyond the{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, var(--secondary-light), var(--accent-light))" }}
              >
                Ordinary
              </span>
            </h2>
            <p className="text-[var(--text-secondary)] text-[15px] leading-relaxed">
              Boss Battles and AI-powered quest crafting take your productivity to an entirely different dimension.
            </p>
          </div>

          {/* Tab pills */}
          <div
            className="flex justify-center mb-12 transition-all duration-700"
            style={{
              opacity: secInteractive.visible ? 1 : 0,
              transform: secInteractive.visible ? "translateY(0)" : "translateY(16px)",
              transitionDelay: "0.15s",
            }}
          >
            <div className="inline-flex p-1.5 rounded-2xl border border-white/[0.08] bg-white/[0.03] gap-2">
              {interactiveTabs.map((tab, i) => {
                const Icon = tab.icon;
                const active = activeTab === i;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(i)}
                    className="relative flex items-center gap-2.5 px-7 py-3 rounded-xl text-sm font-semibold transition-all duration-300"
                    style={{
                      background: active ? `color-mix(in srgb, ${tab.color} 14%, transparent)` : "transparent",
                      color: active ? "white" : "var(--text-secondary)",
                      border: active ? `1px solid color-mix(in srgb, ${tab.color} 35%, transparent)` : "1px solid transparent",
                    }}
                  >
                    <Icon size={15} style={{ color: active ? tab.color : undefined }} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Panel */}
          {interactiveTabs.map((tab, i) => {
            if (activeTab !== i) return null;
            const Icon = tab.icon;
            return (
              <div
                key={tab.id}
                className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center max-w-5xl mx-auto"
                style={{ animation: "fadeSlideUp 0.4s ease forwards" }}
              >
                {/* Left */}
                <div>
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                    style={{
                      background: `color-mix(in srgb, ${tab.color} 14%, transparent)`,
                      boxShadow: `0 0 0 1px color-mix(in srgb, ${tab.color} 25%, transparent)`,
                    }}
                  >
                    <Icon size={24} style={{ color: tab.color }} />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-heading)] text-white mb-4 leading-tight">
                    {tab.headline}
                  </h3>
                  <p className="text-[var(--text-secondary)] text-[15px] leading-relaxed mb-7">{tab.summary}</p>
                  <ul className="space-y-3.5">
                    {tab.bullets.map((b, bi) => (
                      <li key={bi} className="flex items-start gap-3">
                        <CheckCircle2 size={16} style={{ color: tab.color }} className="mt-0.5 shrink-0" />
                        <span className="text-sm text-[var(--text-secondary)]">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right: live preview */}
                <div
                  className="relative p-7 rounded-2xl border bg-[var(--bg-card)]/50 backdrop-blur-sm"
                  style={{ borderColor: `color-mix(in srgb, ${tab.color} 20%, transparent)` }}
                >
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{ background: `radial-gradient(ellipse 70% 50% at 50% 0%, color-mix(in srgb, ${tab.color} 6%, transparent), transparent)` }}
                  />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Live Preview</span>
                    </div>
                    <ActivePreview />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Divider */}
      <div className="container mx-auto px-6 md:px-10 lg:px-16 xl:px-24">
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
      </div>

      {/* ══════════════════════════════════
          SECTION 3 — LEADERBOARD
      ══════════════════════════════════ */}
      <section className="py-28 relative" id="leaderboard">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-yellow-500/[0.03] blur-[100px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left: copy */}
            <div
              ref={secLeader.ref}
              className="transition-all duration-700"
              style={{
                opacity: secLeader.visible ? 1 : 0,
                transform: secLeader.visible ? "translateY(0)" : "translateY(28px)",
              }}
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-yellow-500/[0.15] bg-yellow-500/[0.05] mb-6">
                <Crown size={11} className="text-yellow-400" />
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-yellow-400">Global Leaderboard</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold font-[family-name:var(--font-heading)] mb-5 leading-tight">
                Rise Through{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg, #fbbf24, var(--primary-light))" }}
                >
                  the Ranks
                </span>
              </h2>
              <p className="text-[var(--text-secondary)] text-[15px] leading-relaxed mb-8">
                Every quest completed, every habit maintained, and every boss defeated pushes you up the global standings. Prove your discipline to the world — or just to yourself.
              </p>

              <ul className="space-y-4 mb-10">
                {[
                  { icon: TrendingUp, text: "Real-time global & regional rankings" },
                  { icon: Flame,      text: "Streak multipliers that boost your XP gain" },
                  { icon: Medal,      text: "Seasonal trophies & exclusive title rewards" },
                  { icon: Users,      text: "Guild vs Guild war rankings every month" },
                ].map(({ icon: Ic, text }, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-yellow-500/10">
                      <Ic size={14} className="text-yellow-400" />
                    </div>
                    <span className="text-sm text-[var(--text-secondary)]">{text}</span>
                  </li>
                ))}
              </ul>

              <a
                href="/leaderboard"
                className="inline-flex items-center gap-2 text-sm font-bold text-yellow-400 hover:text-yellow-300 transition-colors group"
              >
                View Full Leaderboard
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Right: leaderboard card */}
            <div
              className="transition-all duration-700"
              style={{
                opacity: secLeader.visible ? 1 : 0,
                transform: secLeader.visible ? "translateY(0)" : "translateY(28px)",
                transitionDelay: "0.2s",
              }}
            >
              {/* Podium */}
              <div className="flex items-end justify-center gap-3 mb-8 px-4">
                {[1, 0, 2].map((playerIdx, podiumPos) => {
                  const p = leaderboardPlayers[playerIdx];
                  const heights  = ["h-20", "h-28", "h-16"];
                  const podiumRanks = [2, 1, 3];
                  const col = rankColors[podiumPos];
                  return (
                    <div key={p.rank} className="flex flex-col items-center gap-2 flex-1">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2" style={{ borderColor: col }}>
                        <img src={`https://i.pravatar.cc/80?u=lb${p.rank}`} alt={p.name} />
                      </div>
                      <span className="text-[11px] font-bold text-white truncate max-w-full px-1 text-center">{p.name}</span>
                      <div
                        className={`w-full ${heights[podiumPos]} rounded-t-xl flex items-center justify-center font-bold text-xl`}
                        style={{
                          background: `color-mix(in srgb, ${col} 12%, transparent)`,
                          border: `1px solid color-mix(in srgb, ${col} 30%, transparent)`,
                          color: col,
                        }}
                      >
                        #{podiumRanks[podiumPos]}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Table */}
              <div className="rounded-2xl border border-white/[0.07] bg-[var(--bg-card)]/30 overflow-hidden">
                <div className="grid grid-cols-[32px_1fr_56px_48px] gap-3 px-5 py-3 border-b border-white/[0.06]">
                  {["#", "Player", "XP", "🔥"].map((h) => (
                    <span key={h} className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">{h}</span>
                  ))}
                </div>

                {leaderboardPlayers.map((p, i) => (
                  <div
                    key={p.rank}
                    className={`grid grid-cols-[32px_1fr_56px_48px] gap-3 items-center px-5 py-4 border-b border-white/[0.04] last:border-0 transition-colors duration-200 ${
                      p.isYou
                        ? "bg-[var(--primary)]/[0.07] border-l-2 border-l-[var(--primary)]"
                        : "hover:bg-white/[0.03]"
                    }`}
                    style={{
                      opacity: secLeader.visible ? 1 : 0,
                      transitionDelay: `${0.35 + i * 0.07}s`,
                      transition: "opacity 0.5s ease, background 0.2s, border-color 0.2s",
                    }}
                  >
                    <div className="flex items-center justify-center">
                      {p.crown
                        ? <Crown size={13} className="text-yellow-400" />
                        : <span className={`text-xs font-bold ${p.isYou ? "text-[var(--primary)]" : "text-[var(--text-muted)]"}`}>{p.rank}</span>
                      }
                    </div>

                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-full overflow-hidden border border-white/10 shrink-0">
                        <img src={`https://i.pravatar.cc/56?u=lb${p.rank}`} alt={p.name} />
                      </div>
                      <div className="min-w-0">
                        <div className={`text-[13px] font-bold truncate ${p.isYou ? "text-[var(--primary-light)]" : "text-white"}`}>
                          {p.name}{p.isYou && <span className="text-[10px] font-normal text-[var(--primary)]/60 ml-1">(you)</span>}
                        </div>
                        <div className="text-[10px] text-[var(--text-muted)]">Lv.{p.level} · {p.region}</div>
                      </div>
                    </div>

                    <span className={`text-xs font-bold ${p.isYou ? "text-[var(--primary)]" : "text-[var(--text-secondary)]"}`}>
                      {p.xp}
                    </span>

                    <div className="flex items-center gap-1">
                      <Flame size={11} className="text-orange-400" />
                      <span className="text-xs font-bold text-orange-400">{p.streak}</span>
                    </div>
                  </div>
                ))}

                <div className="px-5 py-4 text-center bg-white/[0.02] border-t border-white/[0.04]">
                  <a href="/leaderboard" className="text-[11px] font-bold uppercase tracking-[0.15em] text-yellow-400 hover:text-yellow-300 transition-colors">
                    See full rankings →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}