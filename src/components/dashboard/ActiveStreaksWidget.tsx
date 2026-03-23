"use client";

import { Flame, Plus, Check, Zap, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useHabitStore } from "@/store/habitStore";
import { useUserStatsStore } from "@/store/userStatsStore";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const STAT_OPTIONS = [
  { value: "health", label: "Vitalitas", color: "text-red-400" },
  { value: "knowledge", label: "Kecerdasan", color: "text-blue-400" },
  { value: "discipline", label: "Disiplin", color: "text-orange-400" },
  { value: "creativity", label: "Kreativitas", color: "text-purple-400" },
  { value: "finance", label: "Keuangan", color: "text-emerald-400" },
];

export default function ActiveStreaksWidget() {
  const { habits, toggleHabit, addHabit } = useHabitStore();
  const { addXp, addCoins, updateStat } = useUserStatsStore();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [stat, setStat] = useState("discipline");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggle = (habit: any) => {
    const becomingCompleted = !habit.completed_today;
    toggleHabit(habit.id);

    if (becomingCompleted) {
      addXp(habit.xp_per_completion);
      updateStat(habit.stat_reward, 1);
      addCoins(10);
    }
  };

  const handleQuickAdd = async () => {
    if (!title.trim()) return;
    setIsSubmitting(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setIsSubmitting(false); return; }

    const newHabit: any = {
      user_id: user.id,
      title: title.trim(),
      description: STAT_OPTIONS.find(s => s.value === stat)?.label || "",
      frequency: "daily",
      stat_reward: stat,
      xp_per_completion: 15,
      current_streak: 0,
      longest_streak: 0,
      completed_today: false,
      completions: [],
    };

    const { data, error } = await supabase.from("habits").insert(newHabit).select().single();
    if (data && !error) {
      addHabit(data);
      setTitle("");
      setShowForm(false);
    }
    setIsSubmitting(false);
  };

  const completedCount = habits.filter(h => h.completed_today).length;

  return (
    <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-light)] relative overflow-hidden group shadow-xl transition-all">
      <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-orange-500/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-orange-500/10 transition-colors"></div>

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-light)] text-orange-500">
            <Flame size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white font-[family-name:var(--font-heading)]">
              Streak Aktif
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {completedCount}/{habits.length} selesai hari ini
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowForm(!showForm)}
            className="w-8 h-8 rounded-xl bg-[var(--bg-sidebar)] border border-[var(--border-light)] flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:border-orange-500 transition-all"
          >
            {showForm ? <X size={14} /> : <Plus size={16} />}
          </button>
          <Link href="/dashboard/quests" className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] hover:text-white transition-colors hidden sm:block">
            Semua
          </Link>
        </div>
      </div>

      {/* Quick Add Habit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-6 relative z-10"
          >
            <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10 space-y-3">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleQuickAdd()}
                placeholder="Nama kebiasaan baru..."
                className="w-full bg-[var(--bg-main)] border border-[var(--border-light)] text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-500/50 placeholder:text-slate-600"
                autoFocus
              />
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5 flex-wrap">
                  {STAT_OPTIONS.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setStat(s.value)}
                      className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border transition-all ${
                        stat === s.value
                          ? `${s.color} bg-white/5 border-white/20`
                          : "text-slate-500 border-white/5 hover:border-white/20"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleQuickAdd}
                  disabled={!title.trim() || isSubmitting}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-500 disabled:opacity-40 transition-all shrink-0"
                >
                  {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  Tambah
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {habits.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10 mb-4">
            <Zap size={32} className="text-orange-500/40" />
          </div>
          <p className="text-sm font-semibold text-slate-400 mb-1">Belum ada kebiasaan yang dilacak</p>
          <p className="text-xs text-slate-500 mb-4">Tambahkan kebiasaan pertamamu dan bangun streak!</p>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-500 transition-all"
          >
            <Plus size={14} /> Tambah Kebiasaan
          </button>
        </div>
      ) : (
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
                    <span className="text-[9px] text-[var(--text-muted)] font-semibold uppercase tracking-widest">{habit.description}</span>
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
                      <span className={`text-sm font-semibold italic ${habit.completed_today ? "text-orange-400" : "text-slate-500"}`}>
                        {habit.current_streak}
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-tighter text-[var(--text-muted)]">HARI</span>
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
      )}
    </div>
  );
}
