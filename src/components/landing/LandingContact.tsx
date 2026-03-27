"use client";

import { useEffect, useRef, useState } from "react";
import {
  Mail,
  MessageCircle,
  Twitter,
  Github,
  Send,
  ChevronDown,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

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

const channels = [
  {
    icon: MessageCircle,
    title: "Discord Community",
    desc: "Chat with thousands of active heroes, ask questions, and find your guild.",
    cta: "Join Discord",
    href: "#",
    color: "#5865F2",
  },
  {
    icon: Twitter,
    title: "Twitter / X",
    desc: "Follow for updates, tips, and the occasional legendary loot drop announcement.",
    cta: "Follow Us",
    href: "#",
    color: "#1d9bf0",
  },
  {
    icon: Github,
    title: "GitHub",
    desc: "We're building in public. Star the repo, file issues, or contribute to the quest.",
    cta: "View Repo",
    href: "#",
    color: "#e6edf3",
  },
  {
    icon: Mail,
    title: "Email Support",
    desc: "For billing, account issues, or partnership inquiries. We reply within 24 hours.",
    cta: "Send Email",
    href: "mailto:hello@lifequest.gg",
    color: "var(--primary)",
  },
];

const faqs = [
  {
    q: "Is LifeQuest free to use?",
    a: "Yes — the core experience is completely free. We offer an optional Guild Pass for power users who want advanced analytics, custom boss battles, and exclusive cosmetics.",
  },
  {
    q: "What platforms is LifeQuest available on?",
    a: "Web, iOS, and Android. All platforms sync in real-time so your quests and XP are always up to date regardless of where you play.",
  },
  {
    q: "Can I import tasks from other apps?",
    a: "Absolutely. We support imports from Notion, Todoist, and Google Tasks. The AI Dungeon Master will even convert your existing tasks into proper quests.",
  },
  {
    q: "How do Guild Wars work?",
    a: "Every month guilds compete across XP earned, quests completed, and boss kills. The top guilds earn exclusive titles and cosmetic rewards distributed at season end.",
  },
  {
    q: "Is my data private and secure?",
    a: "Your data is encrypted at rest and in transit. We never sell personal data. You can export or delete your account at any time from settings.",
  },
];

type FormState = "idle" | "loading" | "success" | "error";

export default function LandingContact() {
  const secHeader  = useInView(0.1);
  const secForm    = useInView(0.06);
  const secFaq     = useInView(0.06);

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [formState, setFormState] = useState<FormState>("idle");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("loading");
    // Simulate API call
    await new Promise((res) => setTimeout(res, 1400));
    setFormState("success");
  };

  const inputBase =
    "w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.09] text-white text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)]/50 focus:bg-white/[0.06] transition-all duration-200";

  return (
    <div id="contact" className="relative overflow-hidden">

      {/* ══════════════════════════════════
          HEADER
      ══════════════════════════════════ */}
      <section className="pt-28 pb-16 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[500px] h-[400px] rounded-full bg-[var(--primary)]/[0.05] blur-[130px]" />
          <div className="absolute bottom-0 right-1/4 w-[350px] h-[300px] rounded-full bg-[var(--secondary)]/[0.04] blur-[110px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div
            ref={secHeader.ref}
            className="text-center max-w-2xl mx-auto transition-all duration-700"
            style={{
              opacity: secHeader.visible ? 1 : 0,
              transform: secHeader.visible ? "translateY(0)" : "translateY(28px)",
            }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.07] bg-white/[0.03] mb-6">
              <Mail size={11} className="text-[var(--primary)]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--primary)]">
                Contact Us
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-heading)] mb-5 leading-tight">
              We&apos;re Here to{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, var(--primary-light), var(--secondary-light))",
                }}
              >
                Help You Level Up
              </span>
            </h2>
            <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
              Got a question, idea, or just want to say hi? Send us a message or find us on your preferred platform. Every hero deserves support.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          CHANNELS
      ══════════════════════════════════ */}
      <section className="pb-20 relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {channels.map((ch, i) => {
              const Icon = ch.icon;
              return (
                <a
                  key={i}
                  href={ch.href}
                  target={ch.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="group relative flex flex-col items-center text-center gap-3 p-6 rounded-2xl border border-white/[0.07] bg-[var(--bg-card)]/25 hover:bg-[var(--bg-card)]/55 hover:border-white/[0.14] transition-all duration-400 overflow-hidden"
                  style={{
                    opacity: secHeader.visible ? 1 : 0,
                    transform: secHeader.visible ? "translateY(0)" : "translateY(24px)",
                    transition: `opacity 0.6s ease ${0.2 + i * 0.08}s, transform 0.6s ease ${0.2 + i * 0.08}s, background 0.4s, border-color 0.4s`,
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse 60% 60% at 50% 0%, color-mix(in srgb, ${ch.color} 8%, transparent), transparent)`,
                    }}
                  />
                  <div
                    className="relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                    style={{
                      background: `color-mix(in srgb, ${ch.color} 12%, transparent)`,
                      boxShadow: `0 0 0 1px color-mix(in srgb, ${ch.color} 22%, transparent)`,
                    }}
                  >
                    <Icon size={18} style={{ color: ch.color }} className="group-hover:rotate-[-6deg] transition-transform duration-300" />
                  </div>
                  <div className="relative">
                    <div className="text-[13px] font-bold text-white mb-1">{ch.title}</div>
                    <div className="text-[11px] text-[var(--text-muted)] leading-snug hidden md:block">{ch.desc}</div>
                  </div>
                  <span
                    className="relative text-[11px] font-bold uppercase tracking-[0.12em] mt-auto"
                    style={{ color: ch.color }}
                  >
                    {ch.cta} →
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
      </div>

      {/* ══════════════════════════════════
          FORM + FAQ
      ══════════════════════════════════ */}
      <section className="py-28 relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-5xl mx-auto">

            {/* ── Contact Form ── */}
            <div
              ref={secForm.ref}
              className="transition-all duration-700"
              style={{
                opacity: secForm.visible ? 1 : 0,
                transform: secForm.visible ? "translateY(0)" : "translateY(28px)",
              }}
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.07] bg-white/[0.03] mb-6">
                <Send size={11} className="text-[var(--primary)]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--primary)]">
                  Send a Message
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-heading)] mb-2 leading-tight">
                Drop Us a Quest Scroll
              </h3>
              <p className="text-[var(--text-secondary)] text-sm mb-8 leading-relaxed">
                Fill in the form and we&apos;ll get back to you within one business day. No auto-responders, real humans only.
              </p>

              {formState === "success" ? (
                <div className="flex flex-col items-center justify-center gap-4 py-16 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.05]">
                  <CheckCircle2 size={40} className="text-emerald-400" />
                  <div className="text-center">
                    <div className="text-base font-bold text-white mb-1">Quest Scroll Received!</div>
                    <div className="text-sm text-[var(--text-secondary)]">We&apos;ll respond within 24 hours. +50 XP for reaching out.</div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)] mb-2">
                        Your Name
                      </label>
                      <input
                        suppressHydrationWarning
                        type="text"
                        placeholder="Hero name..."
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={inputBase}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)] mb-2">
                        Email
                      </label>
                      <input
                        suppressHydrationWarning
                        type="email"
                        placeholder="hero@guild.gg"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={inputBase}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)] mb-2">
                      Subject
                    </label>
                    <input
                      suppressHydrationWarning
                      type="text"
                      placeholder="What's your quest?"
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className={inputBase}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)] mb-2">
                      Message
                    </label>
                    <textarea
                      suppressHydrationWarning
                      rows={5}
                      placeholder="Describe your quest in detail..."
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className={`${inputBase} resize-none`}
                    />
                  </div>

                  <button
                    suppressHydrationWarning
                    type="submit"
                    disabled={formState === "loading"}
                    className="group relative w-full py-4 rounded-xl text-sm font-bold text-white overflow-hidden transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] transition-opacity duration-300" />
                    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-[var(--primary-light)] to-[var(--primary)]" />
                    <span className="relative flex items-center justify-center gap-2.5">
                      {formState === "loading" ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={15} />
                          Send Quest Scroll
                        </>
                      )}
                    </span>
                  </button>

                  <p className="text-center text-[11px] text-[var(--text-muted)]">
                    We respect your privacy. No spam, ever.
                  </p>
                </form>
              )}
            </div>

            {/* ── FAQ ── */}
            <div
              ref={secFaq.ref}
              className="transition-all duration-700"
              style={{
                opacity: secFaq.visible ? 1 : 0,
                transform: secFaq.visible ? "translateY(0)" : "translateY(28px)",
                transitionDelay: "0.18s",
              }}
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.07] bg-white/[0.03] mb-6">
                <Sparkles size={11} className="text-[var(--secondary)]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--secondary)]">
                  FAQ
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-heading)] mb-2 leading-tight">
                Common Questions
              </h3>
              <p className="text-[var(--text-secondary)] text-sm mb-8 leading-relaxed">
                Quick answers to the questions every new hero asks.
              </p>

              <div className="space-y-3">
                {faqs.map((faq, i) => {
                  const isOpen = openFaq === i;
                  return (
                    <div
                      key={i}
                      className="rounded-2xl border border-white/[0.07] bg-[var(--bg-card)]/25 overflow-hidden transition-all duration-300"
                      style={{
                        borderColor: isOpen ? "rgba(var(--primary-rgb, 200,169,110), 0.25)" : undefined,
                        background: isOpen ? "rgba(var(--primary-rgb, 200,169,110), 0.03)" : undefined,
                        opacity: secFaq.visible ? 1 : 0,
                        transition: `opacity 0.6s ease ${0.1 + i * 0.08}s, border-color 0.3s, background 0.3s`,
                      }}
                    >
                      <button
                        suppressHydrationWarning
                        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                        onClick={() => setOpenFaq(isOpen ? null : i)}
                      >
                        <span className="text-[13px] font-semibold text-white leading-snug">{faq.q}</span>
                        <ChevronDown
                          size={15}
                          className="shrink-0 text-[var(--text-muted)] transition-transform duration-300"
                          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                        />
                      </button>
                      <div
                        className="overflow-hidden transition-all duration-300"
                        style={{ maxHeight: isOpen ? "200px" : "0px" }}
                      >
                        <p className="px-5 pb-5 text-sm text-[var(--text-secondary)] leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Still have questions */}
              <div className="mt-8 p-5 rounded-2xl border border-white/[0.07] bg-[var(--bg-card)]/20 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center shrink-0">
                  <MessageCircle size={16} className="text-[var(--primary)]" />
                </div>
                <div>
                  <div className="text-[13px] font-bold text-white mb-0.5">Still have questions?</div>
                  <div className="text-[12px] text-[var(--text-muted)]">
                    Our Discord has 10,000+ members ready to help.{" "}
                    <a href="#" className="text-[var(--primary)] hover:underline font-semibold">Join the guild →</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
