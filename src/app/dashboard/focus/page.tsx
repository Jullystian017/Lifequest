"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { fetchQuests, questsQueryKey } from "@/lib/queries";
import { Play, Pause, Square, Coffee, Brain, Plus, Loader2, Sparkles, X } from "lucide-react";

type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

const TIMER_PRESETS = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export default function FocusModePage() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);

  // Timer state
  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [timeLeft, setTimeLeft] = useState(TIMER_PRESETS.pomodoro);
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Quest link state
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);
  const [showQuestSelect, setShowQuestSelect] = useState(false);

  // Rewards overlay
  const [sessionReward, setSessionReward] = useState<{ xp: number }>({ xp: 0 });
  const [showReward, setShowReward] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (data.user) setUserId(data.user.id); });
  }, []);

  const { data: quests = [] } = useQuery({
    queryKey: questsQueryKey(userId!),
    queryFn: () => fetchQuests(userId!),
    enabled: !!userId,
  });

  // Calculate progress
  useEffect(() => {
    const totalTime = TIMER_PRESETS[mode];
    setProgress(((totalTime - timeLeft) / totalTime) * 100);
  }, [timeLeft, mode]);

  // Document Title update
  useEffect(() => {
    if (isActive) {
      document.title = `${formatTime(timeLeft)} - Focus Mode | LifeQuest`;
    } else {
      document.title = `LifeQuest`;
    }
  }, [timeLeft, isActive]);

  const toggleTimer = () => {
    if (isActive) {
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsActive(false);
    setTimeLeft(TIMER_PRESETS[mode]);
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(TIMER_PRESETS[newMode]);
  };

  const logSessionMutation = useMutation({
    mutationFn: async (durationMinutes: number) => {
      // 1. Insert focus session
      const { error: sessionError } = await supabase.from("focus_sessions").insert({
        user_id: userId,
        duration_minutes: durationMinutes,
        quest_id: selectedQuestId,
        earned_xp: durationMinutes, // 1 XP per minute
      });
      if (sessionError) throw sessionError;

      // 2. Give user XP
      const { data: userStats, error: userError } = await supabase
        .from("users")
        .select("stats")
        .eq("id", userId)
        .single();
      if (userError) throw userError;

      const newStats = {
        ...userStats.stats,
        xp: (userStats.stats.xp || 0) + durationMinutes,
      };

      await supabase.from("users").update({ stats: newStats }).eq("id", userId);

      // 3. Add time_spent to quest if linked
      if (selectedQuestId) {
        // Fetch current quest time
        const { data: q, error: qErr } = await supabase.from("quests").select("time_spent").eq("id", selectedQuestId).single();
        if (!qErr) {
            await supabase.from("quests").update({
                time_spent: (q.time_spent || 0) + durationMinutes
            }).eq("id", selectedQuestId);
        }
      }

      return durationMinutes;
    },
    onSuccess: (earnedXp) => {
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
      queryClient.invalidateQueries({ queryKey: questsQueryKey(userId!) });
      setSessionReward({ xp: earnedXp });
      setShowReward(true);
      setTimeout(() => setShowReward(false), 5000);
    }
  });

  const handleSessionEnd = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsActive(false);
    
    // Only reward for pomodoro sessions, not breaks
    if (mode === "pomodoro") {
      logSessionMutation.mutate(TIMER_PRESETS.pomodoro / 60);
      switchMode("shortBreak"); // Auto switch to break
    } else {
      switchMode("pomodoro"); // Auto switch to work
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const activeQuest = quests.find(q => q.id === selectedQuestId);

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] py-10 animate-fade-in relative">
      {/* Background gradients changing based on mode */}
      <div className={`fixed inset-0 pointer-events-none transition-colors duration-1000 -z-10 ${
        mode === "pomodoro" ? "bg-red-500/5" :
        mode === "shortBreak" ? "bg-emerald-500/5" : "bg-blue-500/5"
      }`} />
      
      {/* Mode Switcher */}
      <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl mb-12">
        <button onClick={() => switchMode("pomodoro")}
          className={`px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${mode === "pomodoro" ? "bg-red-500/20 text-red-400" : "text-slate-400 hover:text-white"}`}>
          <Brain size={16} /> Pomodoro
        </button>
        <button onClick={() => switchMode("shortBreak")}
          className={`px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${mode === "shortBreak" ? "bg-emerald-500/20 text-emerald-400" : "text-slate-400 hover:text-white"}`}>
          <Coffee size={16} /> Short Break
        </button>
        <button onClick={() => switchMode("longBreak")}
          className={`px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${mode === "longBreak" ? "bg-blue-500/20 text-blue-400" : "text-slate-400 hover:text-white"}`}>
          <Coffee size={16} /> Long Break
        </button>
      </div>

      {/* Timer Display */}
      <div className="relative w-80 h-80 flex items-center justify-center mb-12">
        {/* SVG Circle Progress */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" className="text-white/5" strokeWidth="2" />
          <motion.circle cx="50" cy="50" r="46" fill="none" stroke="currentColor"
            className={
              mode === "pomodoro" ? "text-red-500" :
              mode === "shortBreak" ? "text-emerald-500" : "text-blue-500"
            }
            strokeWidth="4" strokeLinecap="round"
            initial={{ strokeDasharray: "289 289", strokeDashoffset: 289 }}
            animate={{ strokeDashoffset: 289 - (289 * progress) / 100 }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </svg>

        <span className="text-7xl font-black text-white tracking-widest tabular-nums font-mono drop-shadow-2xl">
          {formatTime(timeLeft)}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6 mb-12">
        <button onClick={toggleTimer}
          className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-105 active:scale-95 shadow-xl ${
            isActive ? "bg-white/10 hover:bg-white/20" : 
            mode === "pomodoro" ? "bg-red-500 hover:bg-red-400 shadow-red-500/20" :
            mode === "shortBreak" ? "bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/20" :
            "bg-blue-500 hover:bg-blue-400 shadow-blue-500/20"
          }`}>
          {isActive ? <Pause size={32} /> : <Play size={32} className="ml-2" />}
        </button>
        <button onClick={resetTimer}
          className="w-14 h-14 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all">
          <Square size={20} />
        </button>
      </div>

      {/* Quest Link */}
      <div className="w-full max-w-sm">
        {!activeQuest ? (
          <button onClick={() => setShowQuestSelect(true)} className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 border-dashed flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-all">
            <Plus size={18} /> Link to an Active Quest
          </button>
        ) : (
          <div className="w-full p-4 rounded-2xl bg-[var(--primary)]/10 border border-[var(--primary)]/30 flex items-center justify-between group">
            <div className="flex-1 min-w-0 pr-4">
              <p className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-widest mb-1">Focusing On</p>
              <p className="text-sm font-bold text-white truncate">{activeQuest.title}</p>
            </div>
            <button onClick={() => setSelectedQuestId(null)} className="p-2 rounded-xl bg-black/20 text-slate-400 hover:text-white hover:bg-black/40 transition-all opacity-0 group-hover:opacity-100">
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Quest Selection Modal */}
      <AnimatePresence>
        {showQuestSelect && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowQuestSelect(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-[#11141c] border border-white/10 rounded-3xl p-6 shadow-2xl relative z-10 max-h-[70vh] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-black text-white">Select Quest</h3>
                <button onClick={() => setShowQuestSelect(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {quests.filter(q => q.status !== 'done').length === 0 ? (
                  <p className="text-slate-500 text-center py-8">No active quests found.</p>
                ) : (
                  quests.filter(q => q.status !== 'done').map(quest => (
                    <button key={quest.id} onClick={() => { setSelectedQuestId(quest.id); setShowQuestSelect(false); }}
                      className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/5 text-left transition-all flex flex-col gap-1">
                      <p className="font-bold text-white text-sm truncate">{quest.title}</p>
                      <p className="text-xs text-slate-500">{quest.category} • {quest.difficulty}</p>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reward Overlay */}
      <AnimatePresence>
        {showReward && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none p-4">
            <motion.div initial={{ opacity: 0, scale: 0.8, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: -50 }}
              className="bg-emerald-500/20 border border-emerald-500/50 backdrop-blur-md px-8 py-6 rounded-3xl shadow-2xl flex flex-col items-center gap-3">
              <Sparkles size={40} className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
              <h2 className="text-2xl font-black text-white">Session Complete!</h2>
              <p className="text-emerald-300 font-bold">+{sessionReward.xp} XP Earned</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
