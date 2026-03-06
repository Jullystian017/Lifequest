"use client";

import { LeaderboardEntry } from "@/types/leaderboard";
import { getLevelColor } from "@/lib/gamification/levels";

interface LeaderboardTableProps {
    entries: LeaderboardEntry[];
    currentUserId?: string;
}

export default function LeaderboardTable({ entries, currentUserId }: LeaderboardTableProps) {
    if (entries.length === 0) {
        return (
            <div className="text-center py-12 text-[var(--text-muted)]">
                <p className="text-4xl mb-3">🏆</p>
                <p className="text-sm">No leaderboard data yet.</p>
                <p className="text-xs mt-1">Complete tasks to climb the ranks!</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {entries.map((entry) => {
                const isCurrentUser = entry.user_id === currentUserId;
                const levelColor = getLevelColor(entry.level);

                return (
                    <div
                        key={entry.user_id}
                        className={`
              flex items-center gap-3 p-3 rounded-xl border transition-all
              ${isCurrentUser
                                ? "bg-[var(--primary)]/10 border-[var(--primary)]/30"
                                : "bg-[var(--dark-surface)]/50 border-[var(--dark-border)]"
                            }
            `}
                    >
                        {/* Rank */}
                        <div className="w-8 text-center font-semibold text-lg">
                            {entry.rank <= 3 ? (
                                <span>{entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : "🥉"}</span>
                            ) : (
                                <span className="text-[var(--text-muted)]">{entry.rank}</span>
                            )}
                        </div>

                        {/* Avatar */}
                        <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
                            style={{
                                background: `linear-gradient(135deg, ${levelColor}60, ${levelColor}30)`,
                                color: levelColor,
                            }}
                        >
                            {entry.username.charAt(0).toUpperCase()}
                        </div>

                        {/* Name */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{entry.username}</p>
                            <p className="text-xs text-[var(--text-muted)]">Level {entry.level}</p>
                        </div>

                        {/* XP */}
                        <div className="text-right flex-shrink-0">
                            <p className="text-sm font-semibold text-[var(--accent)]">
                                {entry.xp.toLocaleString()} XP
                            </p>
                            <p className="text-xs text-[var(--text-muted)]">
                                🔥 {entry.streak}d streak
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
