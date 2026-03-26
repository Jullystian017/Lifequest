"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { questsQueryKey, habitsQueryKey, retrosQueryKey, fetchQuests, fetchHabits, fetchUserRetros } from "@/lib/queries";
import { saveWeeklyRetro } from "@/lib/mutations";
import {
  Sparkles,
  Loader2,
  TrendingUp,
  Zap,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Calendar,
  Brain,
} from "lucide-react";

const RISK_CONFIG = {
  low: { label: "Rendah", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", icon: CheckCircle2 },
  medium: { label: "Sedang", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", icon: AlertTriangle },
  high: { label: "Tinggi", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", icon: AlertTriangle },
};

export default function AIInsightsPage() {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [latestRetro, setLatestRetro] = useState<any>(null);
  const [burnoutData, setBurnoutData] = useState<any>(null);
  const [expandedRetro, setExpandedRetro] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (data.user) setUserId(data.user.id); });
  }, []);

  const EMPTY: any[] = [];

  const { data: quests = EMPTY } = useQuery({
    queryKey: questsQueryKey(userId!),
    queryFn: () => fetchQuests(userId!),
    enabled: !!userId,
  });

  const { data: habits = EMPTY } = useQuery({
    queryKey: habitsQueryKey(userId!),
    queryFn: () => fetchHabits(userId!),
    enabled: !!userId,
  });

  const { data: retros = EMPTY, refetch: refetchRetros } = useQuery({
    queryKey: retrosQueryKey(userId!),
    queryFn: () => fetchUserRetros(userId!),
    enabled: !!userId,
  });

  // Compute weekly stats
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const weeklyQuests = (quests as any[]).filter(q => q.created_at && new Date(q.created_at) >= weekStart);
  const questsCompleted = weeklyQuests.filter(q => q.is_completed).length;
  const questsTotal = weeklyQuests.length;

  // Compute streak (simple: consecutive days with at least 1 completion)
  const streakDays = (() => {
    let streak = 0;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    for (let i = 0; i < 14; i++) {
      const day = new Date(today); day.setDate(today.getDate() - i);
      const hasActivity = (quests as any[]).some(q =>
        q.is_completed && q.completed_at && new Date(q.completed_at).toDateString() === day.toDateString()
      );
      if (hasActivity) streak++;
      else if (i > 0) break;
    }
    return streak;
  })();

  const generateInsights = async () => {
    if (!userId) return;
    setIsGenerating(true);
    try {
      // 1. Check burnout
      const recentRates = [];
      for (let i = 0; i < 4; i++) {
        const weekQ = (quests as any[]).filter(q => {
          const d = new Date(q.created_at);
          const ws = new Date(); ws.setDate(ws.getDate() - (i + 1) * 7 - ws.getDay());
          const we = new Date(); we.setDate(we.getDate() - i * 7 - we.getDay());
          return d >= ws && d <= we;
        });
        const rate = weekQ.length > 0 ? (weekQ.filter((q: any) => q.is_completed).length / weekQ.length) * 100 : 0;
        recentRates.push(rate);
      }

      const burnoutRes = await fetch("/api/ai/burnout-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recentCompletionRates: recentRates,
          streakDays,
          lastActiveDay: (quests as any[]).find((q: any) => q.completed_at)?.completed_at ?? null,
        }),
      });
      const burnout = await burnoutRes.json();
      setBurnoutData(burnout);

      // 2. Generate weekly retro
      const weekStartStr = weekStart.toISOString().split("T")[0];
      const weekEndStr = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

      const retroRes = await fetch("/api/ai/weekly-retro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          questsCompleted,
          questsTotal,
          habitsKept: streakDays,
          habitsTotal: (habits as any[]).length * 7,
          currentStreak: streakDays,
          weekStart: weekStartStr,
          weekEnd: weekEndStr,
        }),
      });
      const retro = await retroRes.json();

      // 3. Save retro + display
      const saved = await saveWeeklyRetro(userId, {
        week_start: weekStartStr,
        week_end: weekEndStr,
        quests_completed: questsCompleted,
        quests_failed: questsTotal - questsCompleted,
        habits_kept: streakDays,
        burnout_risk: retro.burnout_risk ?? burnout.risk,
        went_well: retro.went_well,
        went_wrong: retro.went_wrong,
        suggestions: retro.suggestions,
      });
      setLatestRetro(saved);
      refetchRetros();
    } catch (e) {
      console.error("Failed to generate insights:", e);
    }
    setIsGenerating(false);
  };

  const currentRetro = latestRetro ?? (retros as any[])[0];
  const riskKey = (burnoutData?.risk ?? currentRetro?.burnout_risk ?? "low") as keyof typeof RISK_CONFIG;
  const RiskConfig = RISK_CONFIG[riskKey] ?? RISK_CONFIG.low;
  const RiskIcon = RiskConfig.icon;

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex justify-end mb-4">
        <button onClick={generateInsights} disabled={isGenerating || !userId}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--primary)] text-white font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-[var(--primary)]/20 disabled:opacity-50">
          {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {isGenerating ? "Menganalisa..." : "Generate Insights"}
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Quest Minggu Ini", value: `${questsCompleted}/${questsTotal}`, icon: CheckCircle2, color: "text-emerald-400" },
          { label: "Completion Rate", value: questsTotal > 0 ? `${Math.round((questsCompleted / questsTotal) * 100)}%` : "N/A", icon: BarChart3, color: "text-blue-400" },
          { label: "Streak Aktif", value: `${streakDays} hari`, icon: Zap, color: "text-yellow-400" },
          { label: "Burnout Risk", value: RiskConfig.label, icon: TrendingUp, color: RiskConfig.color },
        ].map(stat => (
          <div key={stat.label} className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-2xl p-4 space-y-2">
            <stat.icon size={18} className={stat.color} />
            <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-[10px] text-slate-500 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Burnout Card */}
      {burnoutData && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className={`p-5 rounded-2xl border ${RiskConfig.bg} space-y-3`}>
          <div className="flex items-center gap-2">
            <RiskIcon size={18} className={RiskConfig.color} />
            <h3 className={`text-sm font-black ${RiskConfig.color}`}>Burnout Risk: {RiskConfig.label}</h3>
          </div>
          <p className="text-sm text-slate-300">{burnoutData.message}</p>
          {burnoutData.recommendations?.length > 0 && (
            <ul className="space-y-1.5">
              {burnoutData.recommendations.map((rec: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                  <CheckCircle2 size={12} className="text-slate-500 mt-0.5 shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      )}

      {/* Latest Retro */}
      {currentRetro && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-[var(--primary)]" />
              <h3 className="text-sm font-black text-white">Weekly Retrospective</h3>
              <span className="text-[10px] text-slate-500">{currentRetro.week_start} — {currentRetro.week_end}</span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-1.5 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">✅ Yang Berjalan Baik</p>
              <p className="text-xs text-slate-300 leading-relaxed">{currentRetro.went_well}</p>
            </div>
            <div className="space-y-1.5 p-4 rounded-xl bg-red-500/5 border border-red-500/10">
              <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">❌ Yang Perlu Perbaikan</p>
              <p className="text-xs text-slate-300 leading-relaxed">{currentRetro.went_wrong}</p>
            </div>
            <div className="space-y-1.5 p-4 rounded-xl bg-[var(--primary)]/5 border border-[var(--primary)]/10">
              <p className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-widest">💡 Saran Minggu Depan</p>
              <p className="text-xs text-slate-300 leading-relaxed">{currentRetro.suggestions}</p>
            </div>
          </div>
        </div>
      )}

      {/* Retro History */}
      {(retros as any[]).length > 1 && (
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <RefreshCw size={12} /> Riwayat Retrospektif
          </h2>
          {(retros as any[]).slice(1).map((r: any) => {
            const rk = r.burnout_risk as keyof typeof RISK_CONFIG;
            const rc = RISK_CONFIG[rk] ?? RISK_CONFIG.low;
            const isOpen = expandedRetro === r.id;
            return (
              <div key={r.id} className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-xl overflow-hidden">
                <button onClick={() => setExpandedRetro(isOpen ? null : r.id)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-white/3 transition-all">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-white">{r.week_start}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${rc.bg} ${rc.color}`}>{rc.label}</span>
                    <span className="text-[10px] text-slate-500">{r.quests_completed} quests selesai</span>
                  </div>
                  {isOpen ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4 space-y-2 border-t border-white/5">
                      <p className="text-xs text-emerald-300 mt-3"><span className="font-bold text-emerald-400">Baik: </span>{r.went_well}</p>
                      <p className="text-xs text-red-300"><span className="font-bold text-red-400">Buruk: </span>{r.went_wrong}</p>
                      <p className="text-xs text-indigo-300"><span className="font-bold text-indigo-400">Saran: </span>{r.suggestions}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!currentRetro && !isGenerating && (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <div className="p-5 rounded-3xl bg-[var(--primary)]/10 border border-[var(--primary)]/20">
            <Brain size={40} className="text-[var(--primary)]" />
          </div>
          <div>
            <p className="text-white font-bold">Belum ada insight mingguan</p>
            <p className="text-slate-400 text-sm mt-1">Klik "Generate Insights" untuk analisis minggu ini.</p>
          </div>
        </div>
      )}
    </div>
  );
}
