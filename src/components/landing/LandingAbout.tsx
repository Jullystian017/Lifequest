"use client";

import { useEffect, useRef, useState } from "react";
import { Sword, Target, Zap, Heart, Globe, ShieldCheck } from "lucide-react";

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

const values = [
  {
    icon: Target,
    title: "Purpose-Driven",
    desc: "Every feature exists to push you forward. We build tools that genuinely transform lives, not just fill screens.",
    color: "var(--primary)",
  },
  {
    icon: Zap,
    title: "Always Evolving",
    desc: "Stagnation is the enemy. We ship fast, learn from players, and adapt constantly — just like a good RPG character should.",
    color: "var(--secondary)",
  },
  {
    icon: Heart,
    title: "Community First",
    desc: "Our players aren't users — they're guild members. Every decision we make centers around the people who quest with us.",
    color: "var(--accent)",
  },
  {
    icon: ShieldCheck,
    title: "Honest & Transparent",
    desc: "No dark patterns. No pay-to-win. We believe real growth comes from real effort, and we build accordingly.",
    color: "var(--primary)",
  },
];

const team = [
  { name: "Aria Voss",      role: "Founder & CEO",        avatar: "https://i.pravatar.cc/200?u=t1", level: 99 },
  { name: "Kai Mercer",     role: "Head of Engineering",  avatar: "https://i.pravatar.cc/200?u=t2", level: 87 },
  { name: "Lena Park",      role: "Lead Designer",        avatar: "https://i.pravatar.cc/200?u=t3", level: 91 },
  { name: "Dax Okafor",     role: "AI & Game Systems",    avatar: "https://i.pravatar.cc/200?u=t4", level: 84 },
];

const milestones = [
  { year: "2022", event: "LifeQuest founded in a dorm room with one simple belief: life is the ultimate RPG." },
  { year: "2023", event: "Launched beta to 500 players. Streak system went viral. Community exploded." },
  { year: "2024", event: "Crossed 10,000 active heroes. Introduced Boss Battles & AI Dungeon Master." },
  { year: "2025", event: "Global leaderboards, guild wars, and mobile launch. The adventure continues." },
];

export default function LandingAbout() {
  const secHero   = useInView(0.1);
  const secValues = useInView(0.08);
  const secTeam   = useInView(0.08);
  const secStory  = useInView(0.08);

  return (
    <div id="about" className="relative overflow-hidden">

      {/* ══════════════════════════════════
          ABOUT HERO — Mission statement
      ══════════════════════════════════ */}
      <section className="py-28 relative">
        {/* Ambient */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[500px] h-[400px] rounded-full bg-[var(--secondary)]/[0.05] blur-[130px]" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] rounded-full bg-[var(--primary)]/[0.04] blur-[110px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div
            ref={secHero.ref}
            className="max-w-4xl mx-auto text-center transition-all duration-700"
            style={{
              opacity: secHero.visible ? 1 : 0,
              transform: secHero.visible ? "translateY(0)" : "translateY(28px)",
            }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.07] bg-white/[0.03] mb-6">
              <Sword size={11} className="text-[var(--primary)]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--primary)]">
                About LifeQuest
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-heading)] mb-7 leading-tight">
              We Believe Life Is{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, var(--primary-light), var(--secondary-light), var(--accent-light))",
                }}
              >
                the Ultimate RPG
              </span>
            </h2>

            <p className="text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto mb-10">
              LifeQuest was born from a simple frustration — productivity apps are boring, and boring doesn't work.
              We fused the mechanics of great RPGs with real-world self-improvement to create something you
              actually <em className="text-white not-italic font-semibold">want</em> to open every day.
            </p>

            {/* Stats strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px border border-white/[0.06] rounded-2xl overflow-hidden bg-white/[0.06]">
              {[
                { val: "10K+",  label: "Active Heroes" },
                { val: "284K+", label: "Quests Completed" },
                { val: "1.2K+", label: "Guilds Formed" },
                { val: "4.9★",  label: "Average Rating" },
              ].map((s, i) => (
                <div
                  key={i}
                  className="bg-[var(--bg-main)] px-6 py-7 text-center"
                  style={{
                    opacity: secHero.visible ? 1 : 0,
                    transition: `opacity 0.7s ease ${0.2 + i * 0.1}s`,
                  }}
                >
                  <div
                    className="font-bold font-[family-name:var(--font-heading)] text-3xl md:text-4xl mb-1 bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, var(--primary-light), var(--primary))",
                    }}
                  >
                    {s.val}
                  </div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
      </div>

      {/* ══════════════════════════════════
          OUR STORY — Timeline
      ══════════════════════════════════ */}
      <section className="py-28 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-0 top-1/2 w-[350px] h-[350px] rounded-full bg-[var(--primary)]/[0.04] blur-[100px] -translate-x-1/2" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left: heading */}
            <div
              ref={secStory.ref}
              className="transition-all duration-700"
              style={{
                opacity: secStory.visible ? 1 : 0,
                transform: secStory.visible ? "translateY(0)" : "translateY(28px)",
              }}
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.07] bg-white/[0.03] mb-6">
                <Globe size={11} className="text-[var(--secondary)]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--secondary)]">
                  Our Story
                </span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-heading)] mb-5 leading-tight">
                From a Dorm Room{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, var(--secondary-light), var(--primary-light))",
                  }}
                >
                  to Global Quest
                </span>
              </h3>
              <p className="text-[var(--text-secondary)] text-[15px] leading-relaxed mb-8">
                What started as a personal hack to stay disciplined turned into a platform used by heroes across the globe.
                Four years. Thousands of quests. One mission: make self-improvement legendary.
              </p>

              {/* Decorative icon cluster */}
              <div className="flex items-center gap-3">
                {[Sword, Zap, Target, Heart].map((Icon, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/[0.07] bg-white/[0.03]"
                    style={{
                      opacity: secStory.visible ? 1 : 0,
                      transition: `opacity 0.5s ease ${0.3 + i * 0.08}s`,
                    }}
                  >
                    <Icon size={16} className="text-[var(--text-muted)]" />
                  </div>
                ))}
                <span className="text-[12px] text-[var(--text-muted)] ml-1">Built with purpose</span>
              </div>
            </div>

            {/* Right: timeline */}
            <div
              className="relative pl-6 transition-all duration-700"
              style={{
                opacity: secStory.visible ? 1 : 0,
                transform: secStory.visible ? "translateY(0)" : "translateY(28px)",
                transitionDelay: "0.18s",
              }}
            >
              {/* Vertical line */}
              <div className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-[var(--primary)]/40 via-[var(--secondary)]/30 to-transparent" />

              <div className="space-y-8">
                {milestones.map((m, i) => (
                  <div
                    key={i}
                    className="relative pl-6 group"
                    style={{
                      opacity: secStory.visible ? 1 : 0,
                      transition: `opacity 0.6s ease ${0.3 + i * 0.1}s`,
                    }}
                  >
                    {/* Dot */}
                    <div
                      className="absolute left-[-3px] top-1.5 w-[7px] h-[7px] rounded-full border-2 border-[var(--primary)] bg-[var(--bg-main)] group-hover:bg-[var(--primary)] transition-colors duration-300"
                    />
                    <div
                      className="text-[11px] font-bold uppercase tracking-[0.2em] mb-1.5"
                      style={{ color: "var(--primary)" }}
                    >
                      {m.year}
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{m.event}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
      </div>

      {/* ══════════════════════════════════
          VALUES
      ══════════════════════════════════ */}
      <section className="py-28 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 right-0 w-[450px] h-[450px] rounded-full bg-[var(--accent)]/[0.03] blur-[120px] translate-x-1/3" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div
            ref={secValues.ref}
            className="text-center max-w-xl mx-auto mb-16 transition-all duration-700"
            style={{
              opacity: secValues.visible ? 1 : 0,
              transform: secValues.visible ? "translateY(0)" : "translateY(28px)",
            }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.07] bg-white/[0.03] mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--accent)]">
                Our Values
              </span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-heading)] mb-4 leading-tight">
              What We Stand{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, var(--accent-light), var(--primary-light))",
                }}
              >
                For
              </span>
            </h3>
            <p className="text-[var(--text-secondary)] text-[15px] leading-relaxed">
              Four principles that guide every line of code, every design decision, and every quest we build.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div
                  key={i}
                  className="group relative flex gap-5 p-7 rounded-2xl border border-white/[0.07] bg-[var(--bg-card)]/25 hover:bg-[var(--bg-card)]/50 hover:border-white/[0.13] transition-all duration-500 overflow-hidden cursor-default"
                  style={{
                    opacity: secValues.visible ? 1 : 0,
                    transform: secValues.visible ? "translateY(0)" : "translateY(32px)",
                    transition: `opacity 0.7s ease ${0.1 + i * 0.1}s, transform 0.7s ease ${0.1 + i * 0.1}s, background 0.4s, border-color 0.4s`,
                  }}
                >
                  {/* Corner glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse 55% 55% at 0% 0%, color-mix(in srgb, ${v.color} 7%, transparent), transparent)`,
                    }}
                  />

                  <div
                    className="relative shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                    style={{
                      background: `color-mix(in srgb, ${v.color} 12%, transparent)`,
                      boxShadow: `0 0 0 1px color-mix(in srgb, ${v.color} 22%, transparent)`,
                    }}
                  >
                    <Icon
                      size={18}
                      style={{ color: v.color }}
                      className="group-hover:rotate-[-6deg] transition-transform duration-300"
                    />
                  </div>

                  <div className="relative min-w-0">
                    <h4 className="text-[15px] font-bold text-white mb-2 group-hover:text-[var(--primary-light)] transition-colors">
                      {v.title}
                    </h4>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{v.desc}</p>
                  </div>

                  {/* Bottom accent */}
                  <div
                    className="absolute bottom-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(90deg, transparent, color-mix(in srgb, ${v.color} 55%, transparent), transparent)`,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
      </div>
    </div>
  );
}