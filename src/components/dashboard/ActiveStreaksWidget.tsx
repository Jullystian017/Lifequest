"use client";

import { Flame, Plus, Check, Zap, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const STAT_OPTIONS = [
  { value: "vitality", label: "Vitalitas", color: "text-red-400" },
  { value: "knowledge", label: "Kecerdasan", color: "text-blue-400" },
  { value: "discipline", label: "Disiplin", color: "text-orange-400" },
  { value: "creativity", label: "Kreativitas", color: "text-purple-400" },
];

const DEV_PRESETS = [
  { title: "Push Commits", stat: "discipline", category: "coding", icon: "💻" },
  { title: "Code Review", stat: "knowledge", category: "communication", icon: "👀" },
  { title: "Write Tests", stat: "discipline", category: "coding", icon: "🧪" },
  { title: "Read Docs", stat: "knowledge", category: "learning", icon: "📚" },
  { title: "Stretch & Water", stat: "vitality", category: "health", icon: "💧" },
];

interface Habit {
  id: string;
  title: string;
  description?: string;
  stat_reward?: string;
  category?: string;
  xp_per_completion?: number;
  current_streak?: number;
  longest_streak?: number;
  completed_today?: boolean;
}

interface ActiveStreaksWidgetProps {
  habits?: Habit[];
  userId?: string;
  onHabitToggled?: () => void;
  onHabitAdded?: () => void;
}

export default function ActiveStreaksWidget({
  habits = [],
  userId,
  onHabitToggled,
  onHabitAdded,
}: ActiveStreaksWidgetProps) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [stat, setStat] = useState("discipline");
  const [category, setCategory] = useState("coding");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabase = createClient();

  const handleToggle = async (habit: Habit) => {
    const becomingCompleted = !habit.completed_today;
    const uid = userId || (await supabase.auth.getUser()).data.user?.id;
    if (!uid) return;

    const newStreak = becomingCompleted ? (habit.current_streak || 0) + 1 : Math.max(0, (habit.current_streak || 0) - 1);
    const longestStreak = Math.max(habit.longest_streak || 0, newStreak);

    const updateData: any = {
      completed_today: becomingCompleted,
      current_streak: newStreak,
      longest_streak: longestStreak,
    };

    if (becomingCompleted) {
       updateData.last_completed_at = new Date().toISOString();
       updateData.last_evaluated_at = new Date().toISOString().split('T')[0];
    }

    await supabase.from("habits").update(updateData).eq("id", habit.id);

    onHabitToggled?.();
  };

  const handleQuickAdd = async () => {
    if (!title.trim()) return;
    setIsSubmitting(true);
    const uid = userId || (await supabase.auth.getUser()).data.user?.id;
    if (!uid) { setIsSubmitting(false); return; }

    await supabase.from("habits").insert({
      user_id: uid,
      title: title.trim(),
      description: STAT_OPTIONS.find(s => s.value === stat)?.label || "",
      frequency: "daily",
      stat_reward: stat,
      category: category,
      xp_per_completion: 15,
      current_streak: 0,
      longest_streak: 0,
      completed_today: false,
    });

    setTitle("");
    setShowForm(false);
    setIsSubmitting(false);
    onHabitAdded?.();
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
            <h3 className="text-lg font-semibold text-white font-[family-name:var(--font-heading)]">Streak Aktif</h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{completedCount}/{habits.length} selesai hari ini</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-8 h-8 rounded-xl bg-[var(--bg-sidebar)] border border-[var(--border-light)] flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:border-orange-500 transition-all"
          >
            {showForm ? <X size={14} /> : <Plus size={16} />}
          </button>
          <Link href="/dashboard/quests" className="text-[10px] font-semibold text-[var(--text-muted)] hover:text-white transition-colors hidden sm:block">
            Semua
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-6 relative z-10"
          >
            <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10 space-y-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                 {DEV_PRESETS.map((p, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            setTitle(p.title);
                            setStat(p.stat);
                            setCategory(p.category);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-sidebar)] border border-white/5 text-[10px] whitespace-nowrap text-slate-400 hover:text-white hover:border-orange-500/50 transition-all font-semibold"
                    >
                        <span>{p.icon}</span> {p.title}
                    </button>
                 ))}
              </div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleQuickAdd()}
                placeholder="Nama kebiasaan baru..."
                className="w-full bg-[var(--bg-main)] border border-[var(--border-light)] text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-500/50 placeholder:text-slate-600"
                autoFocus
              />
              <div className="flex items-center justify-between gap-2 overflow-x-auto">
                <div className="flex gap-1.5 flex-wrap shrink-0">
                  <select 
                     value={category} 
                     onChange={(e) => setCategory(e.target.value)}
                     className="px-2 py-1 rounded-lg text-[9px] font-bold border border-white/5 bg-transparent text-slate-400 focus:outline-none focus:border-orange-500 appearance-none cursor-pointer"
                  >
                     <option value="coding">Coding</option>
                     <option value="learning">Learning</option>
                     <option value="health">Health</option>
                     <option value="communication">Comm</option>
                     <option value="devops">DevOps</option>
                  </select>
                  {STAT_OPTIONS.map((s) => (
                    <button key={s.value} onClick={() => setStat(s.value)}
                      className={`px-2 py-1 rounded-lg text-[9px] font-bold border transition-all ${stat === s.value ? `${s.color} bg-white/5 border-white/20` : "text-slate-500 border-white/5 hover:border-white/20"}`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
                <button onClick={handleQuickAdd} disabled={!title.trim() || isSubmitting}
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
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-500 transition-all">
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
                    <span className="text-[9px] text-[var(--text-muted)] font-semibold">{habit.description}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold italic ${habit.completed_today ? "text-orange-400" : "text-slate-500"}`}>
                    {habit.current_streak ?? 0}
                  </span>
                  <span className="text-[10px] font-semibold text-[var(--text-muted)]">hari</span>
                  {habit.completed_today && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-orange-500">
                      <Flame size={12} fill="currentColor" />
                    </motion.div>
                  )}
                </div>
              </div>
              <div className="h-1 w-full bg-[var(--bg-sidebar)] rounded-full overflow-hidden border border-white/5">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-orange-600 to-orange-400"
                  style={{ boxShadow: "0 0 10px rgba(249,115,22,0.3)" }}
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
