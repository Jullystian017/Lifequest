"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { workspacesQueryKey, fetchUserWorkspaces, weeklyReportQueryKey, fetchWeeklyTeamReport } from "@/lib/queries";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { BarChart3, Loader2, TrendingUp, TrendingDown, Zap, Trophy, Code2, Shield, Swords, CheckCircle2 } from "lucide-react";

const CLASS_COLORS: Record<string, string> = { frontend: "text-cyan-400", backend: "text-purple-400", devops: "text-orange-400", fullstack: "text-emerald-400" };
const CLASS_BG: Record<string, string> = { frontend: "from-cyan-500/20", backend: "from-purple-500/20", devops: "from-orange-500/20", fullstack: "from-emerald-500/20" };
const DIFF_COLORS: Record<string, string> = { easy: "text-emerald-400", medium: "text-yellow-400", hard: "text-red-400", extreme: "text-purple-400" };

export default function TeamReportPage() {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const { activeWorkspaceId } = useWorkspaceStore();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (data.user) setUserId(data.user.id); });
  }, []);

  const { data: workspaces = [] } = useQuery({
    queryKey: workspacesQueryKey(userId!),
    queryFn: () => fetchUserWorkspaces(userId!),
    enabled: !!userId,
  });
  const activeWorkspace = activeWorkspaceId ? (workspaces as any[]).find(w => w.id === activeWorkspaceId) : null;

  const { data: report, isLoading } = useQuery({
    queryKey: weeklyReportQueryKey(activeWorkspace?.id ?? ""),
    queryFn: () => fetchWeeklyTeamReport(activeWorkspace?.id ?? ""),
    enabled: !!activeWorkspace?.id,
  });

  if (!activeWorkspace) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <BarChart3 size={48} className="text-slate-600" />
        <h2 className="text-xl font-bold text-white">Belum ada Workspace</h2>
        <p className="text-slate-400 text-sm">Pilih workspace untuk melihat laporan mingguan.</p>
      </div>
    );
  }

  const maxBar = Math.max(1, ...(report?.activityByDay ?? [1]));

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-3">
          <BarChart3 size={24} className="text-emerald-400" /> Weekly Team Report
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          {report ? `${report.weekStart} – ${report.weekEnd}` : "Memuat data..."} · {activeWorkspace.name}
        </p>
      </div>

      {isLoading && <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-400" size={32} /></div>}

      {report && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: "Quest Selesai", value: report.totalQuestsThisWeek, icon: CheckCircle2, color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/20", textColor: "text-emerald-400",
                sub: report.questGrowth !== 0 ? `${report.questGrowth > 0 ? "+" : ""}${report.questGrowth}% vs minggu lalu` : "Sama seperti minggu lalu",
                subColor: report.questGrowth > 0 ? "text-emerald-400" : report.questGrowth < 0 ? "text-red-400" : "text-slate-500",
              },
              {
                label: "XP Diperoleh", value: `+${report.totalXpThisWeek.toLocaleString()}`, icon: Zap, color: "from-indigo-500/20 to-purple-500/10 border-indigo-500/20", textColor: "text-indigo-400",
                sub: "Total XP tim minggu ini", subColor: "text-slate-500",
              },
              {
                label: "Quest Minggu Lalu", value: report.totalQuestsLastWeek, icon: TrendingUp, color: "from-blue-500/20 to-cyan-500/10 border-blue-500/20", textColor: "text-blue-400",
                sub: "Pembanding periode sebelumnya", subColor: "text-slate-500",
              },
              {
                label: "Kontributor Aktif", value: report.contributorRanking.filter((c: any) => c.count > 0).length, icon: Trophy, color: "from-yellow-500/20 to-amber-500/10 border-yellow-500/20", textColor: "text-yellow-400",
                sub: `dari ${report.contributorRanking.length} anggota`, subColor: "text-slate-500",
              },
            ].map((stat) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} border space-y-2`}>
                <stat.icon size={16} className={stat.textColor} />
                <p className={`text-2xl font-black ${stat.textColor}`}>{stat.value}</p>
                <div>
                  <p className="text-[10px] text-slate-400 leading-tight">{stat.label}</p>
                  <p className={`text-[10px] ${stat.subColor} mt-0.5`}>{stat.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Activity Bar Chart */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-2xl p-6">
            <h2 className="text-sm font-bold text-white mb-5 flex items-center gap-2"><BarChart3 size={15} className="text-emerald-400" /> Aktivitas per Hari</h2>
            <div className="flex items-end gap-2 h-32">
              {(report.activityByDay as number[]).map((count: number, i: number) => {
                const heightPct = maxBar > 0 ? (count / maxBar) * 100 : 0;
                const isToday = i === ((new Date().getDay() + 6) % 7);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                    <span className="text-[9px] text-slate-500">{count > 0 ? count : ""}</span>
                    <div className="w-full relative flex items-end" style={{ height: "100px" }}>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(4, heightPct)}%` }}
                        transition={{ duration: 0.5, delay: i * 0.06 }}
                        className={`w-full rounded-t-lg ${isToday ? "bg-gradient-to-t from-[var(--primary)] to-indigo-400" : count > 0 ? "bg-gradient-to-t from-emerald-600 to-emerald-400" : "bg-white/5"}`}
                        style={{ position: "absolute", bottom: 0 }}
                      />
                    </div>
                    <span className={`text-[9px] font-bold ${isToday ? "text-[var(--primary)]" : "text-slate-500"}`}>{report.dayLabels[i]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contributor Ranking */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-2xl p-6">
            <h2 className="text-sm font-bold text-white mb-5 flex items-center gap-2"><Trophy size={15} className="text-yellow-400" /> Top Kontributor Minggu Ini</h2>
            <div className="space-y-2">
              {report.contributorRanking.map((c: any, i: number) => {
                const classKey = c.user?.class ?? "fullstack";
                const xpPct = report.totalXpThisWeek > 0 ? Math.round((c.xp / report.totalXpThisWeek) * 100) : 0;
                return (
                  <motion.div key={c.user?.id ?? i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/3">
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${i === 0 ? "bg-yellow-500 text-black" : "bg-white/5 text-slate-400"}`}>{i + 1}</span>
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${CLASS_BG[classKey] ?? "from-indigo-500/20"} to-transparent border border-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                      {c.user?.username?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{c.user?.username ?? "—"}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${xpPct}%` }} transition={{ duration: 0.6 }}
                            className={`h-full rounded-full ${i === 0 ? "bg-yellow-500" : "bg-indigo-500"}`} />
                        </div>
                        <span className="text-[10px] text-slate-500 whitespace-nowrap">{c.count} quest · +{c.xp} XP</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              {report.contributorRanking.length === 0 && (
                <p className="text-slate-600 text-xs text-center py-6">Belum ada kontribusi minggu ini.</p>
              )}
            </div>
          </div>

          {/* Recent Completions */}
          {(report.recentCompletions as any[]).length > 0 && (
            <div className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-2xl p-6">
              <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-400" /> Quest Selesai Terbaru</h2>
              <div className="space-y-2">
                {(report.recentCompletions as any[]).map((q: any, i: number) => (
                  <motion.div key={q.title + i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/3">
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                    <p className="flex-1 text-sm text-slate-300 truncate">{q.title}</p>
                    {q.difficulty && <span className={`text-[9px] font-bold uppercase ${DIFF_COLORS[q.difficulty] ?? "text-slate-400"}`}>{q.difficulty}</span>}
                    <span className="text-[10px] text-indigo-400 font-bold">+{q.xp_reward} XP</span>
                    <span className="text-[10px] text-slate-600">{new Date(q.completed_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
