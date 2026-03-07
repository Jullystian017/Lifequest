"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Swords,
  Repeat,
  Target,
  Skull,
  Trophy,
  Users,
  BarChart3,
  User,
  Settings,
  Sparkles,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Quests", href: "/quests", icon: Swords },
  { label: "Growth", href: "/habits", icon: Sparkles },
  { label: "Focus", href: "/focus", icon: Target },
  { label: "Progress", href: "/analytics", icon: BarChart3 },
  { label: "Social", href: "/social", icon: Users },
  { label: "Boss Challenge", href: "/boss-challenge", icon: Skull },
  { label: "Achievements", href: "/achievements", icon: Trophy },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[var(--bg-sidebar)] border-r border-[var(--border-light)] flex flex-col z-50">
      {/* Branding */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl overflow-hidden transition-transform group-hover:scale-110">
          <img src="/lifequest.png" alt="LifeQuest Logo" className="w-full h-full object-contain" />
        </div>
        <span className="text-xl font-semibold font-[family-name:var(--font-heading)] tracking-tight">
          LifeQuest
        </span>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1 scrollbar-hide">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                ${isActive
                  ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-white"
                }
              `}
            >
              <item.icon
                size={18}
                className={isActive ? "text-white" : "text-[var(--text-muted)] group-hover:text-white transition-colors"}
              />
              <span className="text-sm font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile Card */}
      <div className="p-4 border-t border-[var(--border-light)]">
        <div className="p-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] flex items-center gap-3 group cursor-pointer hover:border-[var(--primary)]/30 transition-all">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-[var(--border-medium)]">
            <img
              src="https://i.pravatar.cc/150?u=alexmiller"
              alt="Alex Miller"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold truncate">Alex Miller</span>
            <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              LVL 12 Adventurer
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
