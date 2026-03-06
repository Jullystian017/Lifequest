"use client";

import Link from "next/link";
import { Github, Twitter, Instagram, Linkedin, Mail, Sword } from "lucide-react";

export default function LandingFooter() {
  const currentYear = new Date().getFullYear();

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

  return (
    <footer className="bg-[var(--bg-main)] border-t border-[var(--border-light)] pt-16 pb-10 font-[family-name:var(--font-sans)]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center shadow-lg shadow-[var(--primary)]/20 transition-transform group-hover:scale-110">
                <Sword className="text-white" size={18} />
              </div>
              <span className="text-xl font-black font-[family-name:var(--font-heading)] text-white">
                LifeQuest
              </span>
            </Link>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6 max-w-sm">
              Coding Your Life, Leveling Your Future. The most immersive personal 
              growth platform designed for the digital age.
            </p>
            <div className="flex items-center gap-3">
              {[Twitter, Github, Instagram, Linkedin, Mail].map((Icon, i) => (
                <Link 
                  key={i} 
                  href="#" 
                  className="w-9 h-9 rounded-lg bg-[var(--bg-card)] border border-[var(--border-light)] flex items-center justify-center text-[var(--text-secondary)] hover:text-white hover:border-[var(--primary)] transition-all"
                >
                  <Icon size={16} />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {footerSections.map((section, idx) => (
            <div key={idx}>
              <h4 className="text-white font-bold mb-5 uppercase tracking-[0.15em] text-[10px]">
                {section.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {section.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link 
                      href={link.href} 
                      className="text-xs text-[var(--text-secondary)] hover:text-[var(--primary-light)] transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-10 border-t border-[var(--border-light)] flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[var(--text-muted)] text-xs">
            © {currentYear} LifeQuest — Leveling your future.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[var(--text-muted)] text-[10px] italic">Built for the Quest Seekers</span>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--secondary)]/5 border border-[var(--secondary)]/10">
               <span className="w-1 h-1 rounded-full bg-[var(--secondary)]/50 animate-pulse"></span>
               <span className="text-[9px] uppercase font-bold text-[var(--secondary)]/70">Secure</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
