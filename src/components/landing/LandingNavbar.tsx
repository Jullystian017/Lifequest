"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navLinks = ["Home", "Features", "About", "Contact"];

export default function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 24);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        isScrolled
          ? "py-3 bg-[var(--bg-main)]/70 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
          : "py-5 bg-transparent"
      }`}
    >
      {/* CENTERED CONTAINER */}
      <div className="max-w-[1500px] mx-auto px-6 md:px-10 lg:px-14 xl:px-20 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 rounded-xl overflow-hidden ring-1 ring-white/10 group-hover:ring-[var(--primary)]/50 transition-all duration-300">
            <img src="/lifequest.png" alt="LifeQuest" className="w-full h-full object-contain" />
          </div>
          <span className="text-[15px] font-bold tracking-tight font-[family-name:var(--font-heading)] text-white/90">
            LifeQuest
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="relative px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)] hover:text-white transition-colors duration-200 group"
            >
              {item}
              <span className="absolute bottom-1 left-4 right-4 h-[1px] bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>
          ))}
        </div>

        {/* Auth */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-[12px] font-medium text-[var(--text-secondary)] hover:text-white transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/register"
            className="px-5 py-2.5 text-[12px] font-semibold text-white rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] hover:opacity-90 transition"
          >
            Start Your Quest
          </Link>
        </div>

        {/* Mobile */}
        <button
          className="md:hidden p-2 text-[var(--text-secondary)] hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-[var(--bg-main)]/95 backdrop-blur-xl transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-4">
          {navLinks.map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-sm text-[var(--text-secondary)] hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item}
            </Link>
          ))}

          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <Link
              href="/login"
              className="w-full py-2.5 text-center text-sm border border-white/10 rounded-lg text-[var(--text-secondary)] hover:bg-white/5"
              onClick={() => setMobileMenuOpen(false)}
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="w-full py-2.5 text-center text-sm text-white bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] rounded-lg"
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