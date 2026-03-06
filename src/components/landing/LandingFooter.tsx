"use client";

import Link from "next/link";
import { Github, Twitter, Instagram, Linkedin, Mail } from "lucide-react";

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
    <footer className="bg-[var(--bg-main)] border-t border-[var(--border-light)] pt-20 pb-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center shadow-lg shadow-[var(--primary)]/20 transition-transform group-hover:scale-110">
                <span className="text-xl">⚔️</span>
              </div>
              <span className="text-2xl font-black font-[family-name:var(--font-heading)] text-white">
                LifeQuest
              </span>
            </Link>
            <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-8 max-w-sm">
              Coding Your Life, Leveling Your Future. The most immersive personal 
              growth platform designed for the digital age.
            </p>
            <div className="flex items-center gap-4">
              {[Twitter, Github, Instagram, Linkedin, Mail].map((Icon, i) => (
                <Link 
                  key={i} 
                  href="#" 
                  className="w-10 h-10 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] flex items-center justify-center text-[var(--text-secondary)] hover:text-white hover:border-[var(--primary)] transition-all"
                >
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {footerSections.map((section, idx) => (
            <div key={idx}>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">
                {section.title}
              </h4>
              <ul className="flex flex-col gap-4">
                {section.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link 
                      href={link.href} 
                      className="text-[var(--text-secondary)] hover:text-[var(--primary-light)] transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-12 border-t border-[var(--border-light)] flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[var(--text-muted)] text-sm">
            © {currentYear} LifeQuest — Empowering your journey with gamified productivity.
          </p>
          <div className="flex items-center gap-8">
            <span className="text-[var(--text-muted)] text-sm italic">Built with 💙 for the Quest Seekers</span>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--secondary)]/10 border border-[var(--secondary)]/20">
               <span className="w-1.5 h-1.5 rounded-full bg-[var(--secondary)] animate-pulse"></span>
               <span className="text-[10px] uppercase font-bold text-[var(--secondary)]">Systems Operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
