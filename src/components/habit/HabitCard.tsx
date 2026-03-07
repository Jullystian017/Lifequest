import { Habit } from "@/types/habit";
import { CheckCircle2, Flame, Zap, Trophy, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface HabitCardProps {
    habit: Habit;
    onToggle?: (id: string) => void;
}

export default function HabitCard({ habit, onToggle }: HabitCardProps) {
    // Mock consistency data for the last 7 days (including today)
    const consistency = [true, true, false, true, true, false, habit.completed_today];

    return (
        <motion.div
            layout
            className={`group bg-[#151921] rounded-2xl p-5 border transition-all ${habit.completed_today
                    ? "border-emerald-500/30 bg-emerald-500/5 shadow-lg shadow-emerald-500/5"
                    : "border-white/5 hover:border-white/10"
                }`}
        >
            <div className="flex items-center gap-5">
                {/* 1. Action Icon */}
                <button
                    onClick={() => onToggle?.(habit.id)}
                    className={`
                        w-14 h-14 rounded-2xl flex items-center justify-center text-2xl
                        transition-all flex-shrink-0 cursor-pointer relative overflow-hidden
                        ${habit.completed_today
                            ? "bg-emerald-500/20 border-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                            : "bg-slate-800/50 border-2 border-white/5 hover:border-[var(--primary)]"
                        }
                    `}
                >
                    {habit.completed_today ? (
                        <CheckCircle2 size={24} className="text-emerald-400" />
                    ) : (
                        <span className="group-hover:scale-110 transition-transform duration-300">{habit.icon || "🎯"}</span>
                    )}
                </button>

                {/* 2. Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className={`text-base font-bold truncate ${habit.completed_today ? "text-slate-400 font-medium" : "text-white"}`}>
                            {habit.title}
                        </h4>
                        <span className="text-[10px] font-black text-[var(--primary)] uppercase tracking-tighter">+{habit.xp_per_completion} XP</span>
                    </div>

                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                        <span className="flex items-center gap-1.5"><Flame size={12} className="text-orange-500" /> {habit.current_streak} Day Streak</span>
                        <span className="flex items-center gap-1.5"><TrendingUp size={12} className="text-blue-400" /> Best: {habit.longest_streak}</span>
                    </div>
                </div>

                {/* 3. Consistency Radar (Mini) */}
                <div className="hidden sm:flex flex-col items-end gap-2 pr-2">
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Consistency</span>
                    <div className="flex gap-1">
                        {consistency.map((done, i) => (
                            <div
                                key={i}
                                className={`w-1.5 h-4 rounded-full ${done ? "bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" : "bg-slate-800"
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* 4. Reward Badge */}
                <div className="hidden lg:flex flex-col items-center justify-center w-16 h-16 bg-white/[0.02] rounded-2xl border border-white/5">
                    <Zap size={18} className="text-[var(--primary)] mb-1" />
                    <span className="text-[9px] font-black text-slate-400 uppercase">+{habit.xp_per_completion}</span>
                </div>
            </div>
        </motion.div>
    );
}
