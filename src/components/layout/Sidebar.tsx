"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Swords,
    ListChecks,
    Repeat,
    Trophy,
    Crown,
    Skull,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Quests", href: "/quests", icon: Swords },
    { label: "Tasks", href: "/tasks", icon: ListChecks },
    { label: "Habits", href: "/habits", icon: Repeat },
    { label: "Achievements", href: "/achievements", icon: Trophy },
    { label: "Leaderboard", href: "/leaderboard", icon: Crown },
    { label: "Boss Challenge", href: "/boss-challenge", icon: Skull },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <motion.aside
            className={`
        fixed left-0 top-0 h-screen z-40
        bg-[var(--dark-secondary)] border-r border-[var(--dark-border)]
        flex flex-col transition-all duration-300
        ${collapsed ? "w-[72px]" : "w-64"}
      `}
            initial={false}
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 py-5 border-b border-[var(--dark-border)]">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">⚔️</span>
                </div>
                {!collapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <h1 className="text-lg font-bold font-[family-name:var(--font-heading)] bg-gradient-to-r from-[var(--primary-light)] to-[var(--secondary)] bg-clip-text text-transparent">
                            LifeQuest
                        </h1>
                    </motion.div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl
                transition-all duration-200 group relative
                ${isActive
                                    ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20"
                                    : "text-[var(--text-secondary)] hover:bg-[var(--dark-surface)] hover:text-[var(--text-primary)]"
                                }
              `}
                        >
                            <Icon size={20} className="flex-shrink-0" />
                            {!collapsed && (
                                <span className="text-sm font-medium">{item.label}</span>
                            )}
                            {collapsed && (
                                <div className="absolute left-full ml-2 px-2 py-1 bg-[var(--dark)] text-[var(--text-primary)] text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Collapse Toggle */}
            <div className="px-3 py-4 border-t border-[var(--dark-border)]">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl w-full text-[var(--text-muted)] hover:bg-[var(--dark-surface)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                    {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    {!collapsed && <span className="text-sm">Collapse</span>}
                </button>
            </div>
        </motion.aside>
    );
}
