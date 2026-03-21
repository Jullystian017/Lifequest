"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp, CalendarDays, BarChart3 } from "lucide-react";
import { useState } from "react";
import { useQuestStore } from "@/store/questStore";

export default function ProductivityTrendsWidget() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { quests } = useQuestStore();

  // Build weekly data from real quests (completed ones with XP)
  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const weeklyData = dayNames.map((day) => ({ day, xp: 0 }));

  quests.forEach((q) => {
    if (q.is_completed && q.completed_at) {
      const d = new Date(q.completed_at);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays < 7) {
        const dayIndex = d.getDay();
        weeklyData[dayIndex].xp += q.xp_reward || 0;
      }
    }
  });

  const totalXp = weeklyData.reduce((sum, d) => sum + d.xp, 0);
  const avgXp = totalXp > 0 ? Math.round(totalXp / 7) : 0;
  const highestXp = Math.max(...weeklyData.map(d => d.xp));
  const hasData = totalXp > 0;

  return (
    <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-light)] relative overflow-hidden group">
      <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-[var(--primary)]/5 blur-[80px] rounded-full pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-light)] text-[var(--primary)]">
            <TrendingUp size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Tren Produktivitas</h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">XP yang didapat 7 hari terakhir</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-light)] text-xs font-semibold text-[var(--text-secondary)]">
          <CalendarDays size={14} className="text-[var(--text-muted)]" />
          Minggu Ini
        </div>
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center py-14 text-center">
          <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 mb-4">
            <BarChart3 size={32} className="text-indigo-500/40" />
          </div>
          <p className="text-sm font-semibold text-slate-400 mb-1">Belum ada data produktivitas</p>
          <p className="text-xs text-slate-500">Selesaikan quest pertamamu untuk melihat grafik XP-mu di sini!</p>
        </div>
      ) : (
        <>
          {/* Stats Summary */}
          <div className="flex gap-6 mb-8 relative z-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-1">Total XP</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold font-[family-name:var(--font-heading)] text-white">{totalXp.toLocaleString()}</span>
              </div>
            </div>
            <div className="w-px h-10 bg-[var(--border-light)]"></div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-1">Rata-rata Harian</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold font-[family-name:var(--font-heading)] text-white">{avgXp}</span>
                <span className="text-xs font-semibold text-[var(--text-muted)]">XP / hari</span>
              </div>
            </div>
          </div>

          {/* Recharts Bar Chart */}
          <div className="h-[220px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
                 onMouseMove={(state) => {
                     if (state.activeTooltipIndex !== undefined) {
                         setActiveIndex(Number(state.activeTooltipIndex));
                     }
                 }}
                 onMouseLeave={() => setActiveIndex(null)}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-medium)" opacity={0.4} />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "var(--text-muted)", fontSize: 11, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                />
                <Tooltip 
                  cursor={{ fill: "var(--bg-main)", opacity: 0.5 }}
                  contentStyle={{ 
                    backgroundColor: "var(--bg-card)", 
                    borderColor: "var(--border-light)",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
                    color: "white",
                    fontSize: "12px",
                    fontWeight: "600"
                  }}
                  itemStyle={{ color: "var(--primary-light)" }}
                />
                <Bar 
                  dataKey="xp" 
                  radius={[6, 6, 6, 6]} 
                  barSize={32}
                >
                    {weeklyData.map((entry, index) => (
                        <Cell 
                            key={`cell-${index}`} 
                            fill={entry.xp === highestXp && entry.xp > 0 ? "var(--primary)" : activeIndex === index ? "var(--primary-light)" : "var(--border-medium)"} 
                            className="transition-all duration-300"
                        />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
