"use client";

import Link from "next/link";
import { Github, Twitter, Instagram, Linkedin, Mail, ExternalLink } from "lucide-react";

const footerSections = [
  {
    title: "Product",
    links: [
      { name: "Features", href: "#features" },
      { name: "Roadmap", href: "#roadmap" },
      { name: "Global Leaderboard", href: "/leaderboard" },
      { name: "Boss Challenges", href: "/boss" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Community",
    links: [
      { name: "Discord", href: "#discord" },
      { name: "Guilds", href: "#guilds" },
      { name: "Forum", href: "#forum" },
      { name: "Support", href: "#support" },
    ],
  },
];

const socials = [
  { Icon: Twitter, href: "#", label: "Twitter" },
  { Icon: Github, href: "#", label: "GitHub" },
  { Icon: Instagram, href: "#", label: "Instagram" },
  { Icon: Linkedin, href: "#", label: "LinkedIn" },
  { Icon: Mail, href: "#", label: "Email" },
];

export default function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/[0.06] bg-[var(--bg-main)] overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-[var(--primary)]/30 to-transparent" />
      <div className="absolute top-0 left-1/4 w-[300px] h-[200px] bg-[var(--primary)]/[0.03] blur-[80px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 py-16">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand col */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5 group w-fit">
              <div className="w-8 h-8 rounded-xl overflow-hidden ring-1 ring-white/10 group-hover:ring-[var(--primary)]/40 transition-all">
                <img src="/logo.png" alt="LifeQuest" className="w-full h-full object-contain" />
              </div>
              <span className="text-base font-bold font-[family-name:var(--font-heading)] text-white">
                LifeQuest
              </span>
            </Link>

            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6 max-w-xs">
              Coding Your Life, Leveling Your Future. The most immersive personal
              growth platform designed for the digital age.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-2">
              {socials.map(({ Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/[0.08] transition-all duration-200 group"
                >
                  <Icon size={15} className="group-hover:scale-110 transition-transform" />
                </Link>
              ))}
            </div>

            {/* Status badge */}
            <div className="flex items-center gap-2 mt-6 w-fit px-3 py-1.5 rounded-full bg-emerald-500/[0.06] border border-emerald-500/[0.12]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              <span className="text-[10px] font-semibold text-emerald-400/80 uppercase tracking-[0.15em]">
                All systems operational
              </span>
            </div>
          </div>

          {/* Link sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-5">
                {section.title}
              </h4>
              <ul className="flex flex-col gap-3.5">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-1.5 text-[13px] text-[var(--text-secondary)] hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                      <ExternalLink
                        size={10}
                        className="opacity-0 group-hover:opacity-40 transition-opacity -translate-y-0.5"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-8" />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-[var(--text-muted)]">
            © {currentYear} LifeQuest — Leveling your future.
          </p>

          <div className="flex items-center gap-6">
            <span className="text-[10px] italic text-[var(--text-muted)]/60">
              Built for the Quest Seekers
            </span>

            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
              style={{
                background: "color-mix(in srgb, var(--secondary) 5%, transparent)",
                borderColor: "color-mix(in srgb, var(--secondary) 15%, transparent)",
              }}
            >
              <span
                className="w-1 h-1 rounded-full animate-pulse"
                style={{ background: "var(--secondary)" }}
              />
              <span
                className="text-[9px] uppercase font-bold tracking-[0.15em]"
                style={{ color: "color-mix(in srgb, var(--secondary) 70%, white)" }}
              >
                Secure
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}