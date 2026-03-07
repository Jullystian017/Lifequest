"use client";

import { useSocialStore } from "@/store/socialStore";
import { Trophy, Medal, Crown } from "lucide-react";
import { motion } from "framer-motion";

export default function LeaderboardWidget() {
    const { leaderboard } = useSocialStore();

    // Separate top 3 and others
    const topThree = leaderboard.filter(e => e.rank <= 3).sort((a, b) => a.rank - b.rank);
    const userRank = leaderboard.find(e => e.isUser);

    const getRankStyles = (rank: number) => {
        switch (rank) {
            case 1: return { color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20", icon: <Crown size={12} className="text-yellow-400" /> };
            case 2: return { color: "text-slate-300", bg: "bg-slate-300/10", border: "border-slate-300/20", icon: <Medal size={12} className="text-slate-300" /> };
            case 3: return { color: "text-amber-600", bg: "bg-amber-600/10", border: "border-amber-600/20", icon: <Medal size={12} className="text-amber-600" /> };
            default: return null;
        }
    };

    return (
        <div className="bg-[#151921]/20 rounded-3xl p-6 border border-white/5 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-white tracking-tight">Leaderboard</h3>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mt-0.5">This Week</p>
                </div>
            </div>

            <div className="space-y-2">
                {topThree.map((entry) => {
                    const styles = getRankStyles(entry.rank);
                    return (
                        <div
                            key={entry.userId}
                            className="flex items-center gap-3 py-3 group transition-all"
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold ${styles?.color} ${styles?.bg} border ${styles?.border}`}>
                                {entry.rank}
                            </div>
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-semibold text-white uppercase border border-white/5">
                                {entry.userName.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className="text-xs font-semibold text-white block truncate">{entry.userName}</span>
                                <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-tight">{entry.xp.toLocaleString()} XP</span>
                            </div>
                            {styles?.icon}
                        </div>
                    );
                })}

                {/* User Rank row (Simple highlight) */}
                {userRank && (
                    <div className="flex items-center gap-3 py-3 px-3 -mx-3 rounded-xl bg-indigo-500/5 mt-4">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20">
                            {userRank.rank}
                        </div>
                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-semibold text-white uppercase border border-indigo-500/20">
                            {userRank.userName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <span className="text-xs font-semibold text-white block">You ({userRank.userClass})</span>
                            <span className="text-[9px] font-semibold text-indigo-400 uppercase tracking-tight">{userRank.xp.toLocaleString()} XP</span>
                        </div>
                        <span className="text-[9px] font-semibold text-emerald-400">+120</span>
                    </div>
                )}
            </div>
        </div>
    );
}
