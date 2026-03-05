"use client";

import { Bell, Search, Settings } from "lucide-react";

export default function Navbar() {
    return (
        <header className="h-16 bg-[var(--dark-secondary)] border-b border-[var(--dark-border)] flex items-center justify-between px-6 sticky top-0 z-30">
            {/* Search */}
            <div className="relative w-72">
                <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                />
                <input
                    type="text"
                    placeholder="Search quests, tasks..."
                    className="w-full bg-[var(--dark-surface)] border border-[var(--dark-border)] rounded-xl pl-10 pr-4 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
                {/* Notifications */}
                <button className="relative p-2 rounded-xl hover:bg-[var(--dark-surface)] transition-colors text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--accent)] rounded-full" />
                </button>

                {/* Settings */}
                <button className="p-2 rounded-xl hover:bg-[var(--dark-surface)] transition-colors text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer">
                    <Settings size={20} />
                </button>

                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white font-bold text-sm ml-1 cursor-pointer">
                    A
                </div>
            </div>
        </header>
    );
}
