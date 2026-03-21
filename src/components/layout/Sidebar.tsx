"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Target, // Quests
  Bot, // AI Assistant
  FileText, // Notes
  TreePine, // Skill Tree
  Ghost, // Shadow System
  Trophy, // Achievements
  Medal, // Leaderboard
  Users2, // Team
  BarChart3, // Analytics
  Sparkles, // Simulation
  Bell, // Notifications
  Settings, // Settings
  Store, // Shop
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import { useSidebarStore } from "@/store/sidebarStore";
import WorkspaceSwitcher from "./WorkspaceSwitcher";
import { useState } from "react";

const primaryNav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Quest Board", href: "/dashboard/quests", icon: Target },
  { label: "Asisten AI", href: "/dashboard/ai", icon: Bot },
  { label: "Catatan Docs", href: "/dashboard/notes", icon: FileText },
  { label: "Skill Tree", href: "/dashboard/skills", icon: TreePine },
  { label: "Shadow System", href: "/dashboard/shadow", icon: Ghost },
  { label: "Pencapaian", href: "/dashboard/achievements", icon: Trophy },
  { label: "Papan Peringkat", href: "/dashboard/leaderboard", icon: Medal },
  { label: "Guild & Chat", href: "/dashboard/team", icon: Users2 },
];

const secondaryNav = [
  { label: "Analitik", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Simulasi AI", href: "/dashboard/simulation", icon: Sparkles },
  { label: "Notifikasi", href: "/dashboard/notifications", icon: Bell },
  { label: "Pengaturan", href: "/dashboard/settings", icon: Settings },
  { label: "Toko Gold", href: "/dashboard/shop", icon: Store },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useSidebarStore();
  const [showSecondary, setShowSecondary] = useState(true);

  const NavLink = ({ item }: { item: typeof primaryNav[0] }) => {
    const isActive = pathname === item.href;
    return (
      <Link
        key={item.href}
        href={item.href}
        title={isCollapsed ? item.label : ""}
        className={`
          flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
          ${isActive
            ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20"
            : "text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-white"
          }
          ${isCollapsed ? "justify-center px-0" : ""}
        `}
      >
        <item.icon
          size={18}
          className={isActive ? "text-white" : "text-[var(--text-muted)] group-hover:text-white transition-colors"}
        />
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm font-semibold truncate"
          >
            {item.label}
          </motion.span>
        )}
      </Link>
    );
  };

  return (
    <aside className={`fixed left-0 top-0 h-screen transition-all duration-300 bg-[var(--bg-sidebar)] border-r border-[var(--border-light)] flex flex-col z-50 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Branding */}
      <div className="p-6 flex items-center gap-3 overflow-hidden">
        <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
          <img src="/lifequest.png" alt="LifeQuest Logo" className="w-full h-full object-contain" />
        </div>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl font-semibold font-[family-name:var(--font-heading)] tracking-tight whitespace-nowrap"
          >
            LifeQuest
          </motion.span>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1 scrollbar-hide">
        {/* Workspace Switcher */}
        {!isCollapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <WorkspaceSwitcher />
          </motion.div>
        )}

        {/* Primary Navigation */}
        {primaryNav.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}

        {/* Secondary Section Divider */}
        {!isCollapsed && (
          <div className="pt-4 pb-2 px-1">
            <button
              onClick={() => setShowSecondary(!showSecondary)}
              className="flex items-center justify-between w-full text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] hover:text-white transition-colors"
            >
              <span>Lainnya</span>
              <MoreHorizontal size={14} className={`transition-transform ${showSecondary ? '' : 'rotate-90'}`} />
            </button>
          </div>
        )}

        {/* Secondary Navigation */}
        {(showSecondary || isCollapsed) && (
          <>
            {isCollapsed && <div className="h-px bg-[var(--border-light)] my-2 mx-2" />}
            {secondaryNav.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </>
        )}
      </nav>

      {/* Bottom Toggle Button */}
      <div className="p-4 border-t border-[var(--border-light)]">
        <button
          onClick={toggleSidebar}
          className={`h-11 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] flex items-center justify-center gap-2 text-[var(--text-muted)] hover:text-white hover:border-[var(--primary)] transition-all shadow-lg overflow-hidden ${isCollapsed ? "w-10 mx-auto" : "w-full px-4"
            }`}
        >
          {isCollapsed ? (
            <ChevronRight size={18} />
          ) : (
            <>
              <ChevronLeft size={18} />
              <span className="text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                Ciutkan
              </span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
