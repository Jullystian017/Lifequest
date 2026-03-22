"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStatsStore } from "@/store/userStatsStore";
import {
    Trophy,
    Medal,
    Swords,
    Globe,
    Users,
    ChevronUp,
    ChevronDown,
    Minus,
    Flame
} from "lucide-react";

type LeaderboardTab = 'global' | 'friends';

interface DBUser {
    id: string;
    username: string;
    level: number;
    xp: number;
    streak: number;
    rank: number;
    rankChange: 'up' | 'down' | 'same';
    rankChangeValue: number;
}

// Dummy data for demo until we connect to a real players table
const DUMMY_PLAYERS: DBUser[] = [
    { id: "u1", username: "ShadowSlayer99", level: 24, xp: 12500, streak: 45, rank: 1, rankChange: 'same', rankChangeValue: 0 },
    { id: "u2", username: "ProductivityNinja", level: 22, xp: 11200, streak: 30, rank: 2, rankChange: 'up', rankChangeValue: 1 },
    { id: "u3", username: "Alex Miller", level: 12, xp: 4500, streak: 12, rank: 3, rankChange: 'up', rankChangeValue: 5 }, // Fake current user
    { id: "u4", username: "TaskMaster2024", level: 20, xp: 10800, streak: 14, rank: 4, rankChange: 'down', rankChangeValue: 2 },
    { id: "u5", username: "HabitBuilder", level: 18, xp: 9500, streak: 60, rank: 5, rankChange: 'up', rankChangeValue: 1 },
    { id: "u6", username: "ZeroDelay", level: 17, xp: 8200, streak: 5, rank: 6, rankChange: 'down', rankChangeValue: 1 },
    { id: "u7", username: "FocusKing", level: 15, xp: 7100, streak: 21, rank: 7, rankChange: 'same', rankChangeValue: 0 },
    { id: "u8", username: "DailyGrinder", level: 14, xp: 6800, streak: 8, rank: 8, rankChange: 'up', rankChangeValue: 2 },
    { id: "u9", username: "IronDiscipline", level: 14, xp: 6500, streak: 100, rank: 9, rankChange: 'down', rankChangeValue: 1 },
    { id: "u10", username: "QuestHunter", level: 11, xp: 4200, streak: 2, rank: 10, rankChange: 'same', rankChangeValue: 0 },
];

export default function LeaderboardPage() {
    const { username: currentUsername } = useUserStatsStore();
    const [activeTab, setActiveTab] = useState<LeaderboardTab>('global');

    // In a real app, this would fetch from Supabase
    // For demo, we just inject the actual current user's name if they are "Rank 3"
    const players = DUMMY_PLAYERS.map(p => 
        p.id === "u3" ? { ...p, username: currentUsername || "PlayerOne" } : p
    ).sort((a, b) => a.rank - b.rank); // Sort by rank

    // Simulate friends list (just a subset)
    const displayPlayers = activeTab === 'global' ? players : players.filter(p => [1, 3, 5, 8].includes(p.rank));

    const topThree = displayPlayers.slice(0, 3);
    const rest = displayPlayers.slice(3);

    const RankChangeIcon = ({ change, val }: { change: string, val: number }) => {
        if (change === 'up') return <div className="flex items-center gap-0.5 text-emerald-400"><ChevronUp size={14} /> <span className="text-[10px]">{val}</span></div>;
        if (change === 'down') return <div className="flex items-center gap-0.5 text-red-500"><ChevronDown size={14} /> <span className="text-[10px]">{val}</span></div>;
        return <div className="flex items-center justify-center text-slate-500 w-[26px]"><Minus size={14} /></div>;
    };

    return (
        <div className="space-y-8 pb-20 w-full animate-fade-in">
            
            {/* Tabs */}
            <div className="flex justify-start pb-6">
                <div className="flex items-center p-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)] shrink-0">
                    <button
                        onClick={() => setActiveTab('global')}
                        className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                            activeTab === 'global' ? 'bg-[var(--primary)] text-white shadow-lg' : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        <Globe size={16} /> Global
                    </button>
                    <button
                        onClick={() => setActiveTab('friends')}
                        className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                            activeTab === 'friends' ? 'bg-[var(--primary)] text-white shadow-lg' : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        <Users size={16} /> Teman
                    </button>
                </div>
            </div>

            {/* Podium (Top 3) */}
            <div className="grid grid-cols-3 gap-4 md:gap-6 items-end pt-10 pb-8 h-[280px]">
                {/* 2nd Place */}
                {topThree[1] && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="flex flex-col items-center"
                    >
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-slate-200 border-4 border-slate-300 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(203,213,225,0.2)] z-10 relative">
                            <span className="text-2xl font-bold text-slate-500">2</span>
                            <div className="absolute -bottom-3 bg-slate-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-600">
                                Lv.{topThree[1].level}
                            </div>
                        </div>
                        <div className="w-full bg-gradient-to-t from-[var(--bg-card)] to-slate-500/10 border-t border-x border-slate-500/30 rounded-t-3xl h-[120px] flex flex-col items-center pt-6 px-2 text-center">
                            <p className="text-sm font-bold text-white truncate w-full">{topThree[1].username}</p>
                            <p className="text-xs text-slate-400 font-mono mt-1">{topThree[1].xp.toLocaleString()} XP</p>
                        </div>
                    </motion.div>
                )}

                {/* 1st Place */}
                {topThree[0] && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center relative"
                    >
                        <div className="absolute -top-16 text-yellow-500 animate-bounce">
                            <Medal size={40} className="drop-shadow-[0_0_15px_rgba(234,179,8,0.5)] text-yellow-500 fill-yellow-500/20" />
                        </div>
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-yellow-400 border-4 border-yellow-500 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(234,179,8,0.4)] z-10 relative">
                            <span className="text-3xl font-bold text-yellow-700">1</span>
                            <div className="absolute -bottom-3 bg-slate-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-yellow-600">
                                Lv.{topThree[0].level}
                            </div>
                        </div>
                        <div className="w-full bg-gradient-to-t from-[var(--bg-card)] to-yellow-500/20 border-t border-x border-yellow-500/50 rounded-t-3xl h-[160px] flex flex-col items-center pt-8 px-2 text-center shadow-[0_-10px_30px_rgba(234,179,8,0.1)]">
                            <p className="text-base font-bold text-white truncate w-full">{topThree[0].username}</p>
                            <p className="text-xs text-yellow-500 font-mono mt-1 font-bold">{topThree[0].xp.toLocaleString()} XP</p>
                            <div className="mt-3 flex items-center gap-1 text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2 py-1 rounded-lg">
                                <Flame size={12} /> {topThree[0].streak} Hari
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* 3rd Place */}
                {topThree[2] && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="flex flex-col items-center"
                    >
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-amber-700 border-4 border-amber-600 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(180,83,9,0.2)] z-10 relative">
                            <span className="text-2xl font-bold text-amber-900">3</span>
                            <div className="absolute -bottom-3 bg-slate-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-800">
                                Lv.{topThree[2].level}
                            </div>
                        </div>
                        <div className="w-full bg-gradient-to-t from-[var(--bg-card)] to-amber-700/10 border-t border-x border-amber-700/30 rounded-t-3xl h-[100px] flex flex-col items-center pt-6 px-2 text-center">
                            <p className="text-sm font-bold text-white truncate w-full">{topThree[2].username}</p>
                            <p className="text-xs text-slate-400 font-mono mt-1">{topThree[2].xp.toLocaleString()} XP</p>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* List Row Header */}
            <div className="grid grid-cols-[60px_1fr_100px_100px] md:grid-cols-[80px_1fr_120px_120px_120px] gap-4 px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">
                <div className="text-center">Peringkat</div>
                <div>Pengguna</div>
                <div className="text-right">Level</div>
                <div className="text-right hidden md:block">Rangkaian</div>
                <div className="text-right">Total XP</div>
            </div>

            {/* Rest of the List (4+) */}
            <div className="space-y-2">
                {rest.map((player) => {
                    const isMe = player.username === currentUsername;

                    return (
                        <div 
                            key={player.id}
                            className={`grid grid-cols-[60px_1fr_100px_100px] md:grid-cols-[80px_1fr_120px_120px_120px] gap-4 px-6 py-4 rounded-2xl items-center transition-all ${
                                isMe 
                                ? "bg-[var(--primary)]/10 border border-[var(--primary)]/30" 
                                : "bg-[var(--bg-card)] border border-[var(--border-light)] hover:border-white/10"
                            }`}
                        >
                            {/* Rank & Change */}
                            <div className="flex items-center gap-2 justify-center">
                                <span className={`text-base font-bold ${isMe ? 'text-[var(--primary)]' : 'text-slate-400'}`}>
                                    {player.rank}
                                </span>
                                <RankChangeIcon change={player.rankChange} val={player.rankChangeValue} />
                            </div>

                            {/* User details */}
                            <div className="flex items-center gap-3 min-w-0">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isMe ? 'bg-[var(--primary)] text-white' : 'bg-black/30 text-slate-400 border border-white/5'}`}>
                                    {player.username.charAt(0).toUpperCase()}
                                </div>
                                <span className={`text-sm font-bold truncate ${isMe ? 'text-white' : 'text-slate-200'}`}>
                                    {player.username} {isMe && <span className="text-[9px] bg-[var(--primary)] text-white px-1.5 py-0.5 rounded ml-2 uppercase">Kamu</span>}
                                </span>
                            </div>

                            {/* Level */}
                            <div className="text-right">
                                <span className="text-xs font-bold text-slate-400">Lv. <span className="text-white text-sm">{player.level}</span></span>
                            </div>

                            {/* Streak (desktop only) */}
                            <div className="text-right hidden md:flex justify-end items-center gap-1.5 text-xs font-bold text-orange-400">
                                <Flame size={14} /> {player.streak}
                            </div>

                            {/* XP */}
                            <div className="text-right text-sm font-bold font-mono text-indigo-400">
                                {player.xp.toLocaleString()}
                            </div>
                        </div>
                    );
                })}
            </div>

        </div>
    );
}
