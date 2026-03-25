"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navLinks = ["Features", "How it Works", "Leaderboard"];

export default function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "py-3 bg-[var(--bg-main)]/75 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_1px_40px_rgba(0,0,0,0.4)]"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 rounded-xl overflow-hidden ring-1 ring-white/10 group-hover:ring-[var(--primary)]/50 transition-all duration-300">
            <img src="/lifequest.png" alt="LifeQuest" className="w-full h-full object-contain" />
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-[15px] font-bold tracking-tight font-[family-name:var(--font-heading)] bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
            LifeQuest
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="relative px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--text-secondary)] hover:text-white transition-colors duration-200 group"
            >
              {item}
              <span className="absolute bottom-1 left-4 right-4 h-px bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
            </Link>
          ))}
        </div>

        {/* Auth CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-[12px] font-semibold text-[var(--text-secondary)] hover:text-white transition-colors duration-200"
          >
            Log In
          </Link>
          <Link
            href="/register"
            className="relative group px-5 py-2.5 text-[12px] font-bold text-white rounded-xl overflow-hidden transition-all duration-300 active:scale-95"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] transition-all duration-300 group-hover:opacity-90" />
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-[var(--primary-light)] to-[var(--primary)]" />
            <span className="relative flex items-center gap-1.5">
              Start Your Quest
              <span className="text-white/60 group-hover:translate-x-0.5 transition-transform duration-200">→</span>
            </span>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-[var(--text-secondary)] hover:text-white transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-[var(--bg-main)]/95 backdrop-blur-2xl border-b border-white/[0.06] transition-all duration-400 overflow-hidden ${
          mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="container mx-auto px-6 py-8 flex flex-col gap-5">
          {navLinks.map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-base font-medium text-[var(--text-secondary)] hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
          <hr className="border-white/[0.06]" />
          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              className="w-full py-3 text-center text-sm font-semibold text-[var(--text-secondary)] border border-white/10 rounded-xl hover:bg-white/5 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="w-full py-3 text-center text-sm font-bold text-white bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] rounded-xl"
              onClick={() => setMobileMenuOpen(false)}
            >
              Start Your Quest
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}