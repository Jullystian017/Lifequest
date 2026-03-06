"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-4 bg-[var(--bg-main)]/80 backdrop-blur-xl border-b border-[var(--border-light)] shadow-lg"
          : "py-6 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center shadow-lg shadow-[var(--primary)]/20 transition-transform group-hover:scale-110">
            <span className="text-xl">⚔️</span>
          </div>
          <span className="text-2xl font-black font-[family-name:var(--font-heading)] bg-gradient-to-r from-white to-[var(--text-secondary)] bg-clip-text text-transparent">
            LifeQuest
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {["Features", "How it Works", "Leaderboard"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-colors relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--primary)] transition-all group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* Auth CTAs */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="px-5 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/register"
            className="px-6 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-sm font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-[var(--primary)]/20"
          >
            Start Your Quest
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-[var(--text-secondary)] hover:text-white transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-[var(--bg-card)] border-b border-[var(--border-light)] transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
          {["Features", "How it Works", "Leaderboard"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-lg font-medium text-[var(--text-secondary)] hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
          <hr className="border-[var(--border-light)]" />
          <div className="flex flex-col gap-4">
            <Link
              href="/login"
              className="w-full py-3 text-center font-medium text-[var(--text-secondary)] border border-[var(--border-light)] rounded-xl"
              onClick={() => setMobileMenuOpen(false)}
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="w-full py-3 text-center bg-[var(--primary)] text-white font-bold rounded-xl"
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
