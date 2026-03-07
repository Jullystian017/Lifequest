import { Flame, Plus, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useHabitStore } from "@/store/habitStore";
import { useUserStatsStore } from "@/store/userStatsStore";

export default function ActiveStreaksWidget() {
  const { habits, toggleHabit } = useHabitStore();
  const { addXp, updateStat } = useUserStatsStore();

  const handleToggle = (habit: any) => {
    const becomingCompleted = !habit.completed_today;
    toggleHabit(habit.id);

    if (becomingCompleted) {
      addXp(habit.xp_per_completion);
      updateStat(habit.stat_reward, 1);
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-light)] relative overflow-hidden group shadow-xl transition-all">
      {/* Background Subtle Glow */}
      <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-orange-500/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-orange-500/10 transition-colors"></div>

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-light)] text-orange-500">
            <Flame size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white font-[family-name:var(--font-heading)]">
              Active Streaks
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Maintain your daily momentum</p>
          </div>
        </div>
        <button className="w-8 h-8 rounded-xl bg-[var(--bg-sidebar)] border border-[var(--border-light)] flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:border-orange-500 transition-all">
          <Plus size={16} />
        </button>
      </div>

      <div className="space-y-6">
        {habits.map((habit) => (
          <div key={habit.id} className="space-y-3 group cursor-pointer" onClick={() => handleToggle(habit)}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${habit.completed_today
                    ? "bg-orange-500 border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.4)]"
                    : "bg-[var(--bg-sidebar)] border-white/5 text-slate-600 hover:border-orange-500/50"
                  }`}>
                  {habit.completed_today ? <Check size={16} className="text-white" /> : <Flame size={16} />}
                </div>
                <div className="flex flex-col">
                  <span className={`text-sm font-semibold transition-colors ${habit.completed_today ? "text-white" : "text-slate-400 group-hover:text-white"}`}>
                    {habit.title}
                  </span>
                  <span className="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-widest">{habit.description}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={habit.current_streak}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-baseline gap-1"
                  >
                    <span className={`text-sm font-black italic ${habit.completed_today ? "text-orange-400" : "text-slate-500"}`}>
                      {habit.current_streak}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-tighter text-[var(--text-muted)]">DAYS</span>
                  </motion.div>
                </AnimatePresence>
                {habit.completed_today && (
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="text-orange-500"
                  >
                    <Flame size={12} fill="currentColor" />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Minimal Progress Bar */}
            <div className="h-1 w-full bg-[var(--bg-sidebar)] rounded-full overflow-hidden border border-white/5">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-orange-600 to-orange-400"
                style={{ boxShadow: `0 0 10px rgba(249,115,22,0.3)` }}
                initial={{ width: 0 }}
                animate={{ width: `${habit.completed_today ? 100 : 30}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
