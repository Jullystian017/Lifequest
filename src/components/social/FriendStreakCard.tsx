"use client";

import { FriendStreak } from "@/types/social";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

interface FriendStreakCardProps {
    friend?: FriendStreak;
    isInvite?: boolean;
}

export default function FriendStreakCard({ friend, isInvite }: FriendStreakCardProps) {
    if (isInvite) {
        return (
            <motion.div
                whileHover={{ y: -2 }}
                className="flex flex-col items-center justify-center gap-2 p-6 bg-[#151921]/50 rounded-2xl border border-dashed border-white/10 min-w-[120px] cursor-pointer"
            >
                <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                    <Plus size={20} />
                </div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Invite</span>
            </motion.div>
        );
    }

    if (!friend) return null;

    return (
        <motion.div
            whileHover={{ y: -2 }}
            className="flex flex-col items-center gap-3 p-5 bg-[#151921] rounded-2xl border border-white/5 min-w-[120px]"
        >
            <div className="relative">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-sm font-semibold text-white border-2 border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.3)] uppercase">
                    {friend.userName.charAt(0)}
                </div>
                {friend.isOnline && (
                    <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#0b0e14] shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                )}
            </div>

            <div className="text-center min-w-0">
                <h4 className="text-[11px] font-semibold text-white truncate">{friend.userName}</h4>
                <p className="text-[10px] font-semibold text-orange-500 mt-1 uppercase tracking-tight">🔥 {friend.currentStreak} Days</p>
            </div>
        </motion.div>
    );
}
