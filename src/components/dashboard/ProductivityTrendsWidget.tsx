"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp, CalendarDays } from "lucide-react";
import { useState } from "react";

// Mock data showing daily XP earned over a week
const weeklyData = [
  { day: "Mon", xp: 320 },
  { day: "Tue", xp: 450 },
  { day: "Wed", xp: 210 },
  { day: "Thu", xp: 680 },
  { day: "Fri", xp: 540 },
  { day: "Sat", xp: 890 },
  { day: "Sun", xp: 420 },
];

export default function ProductivityTrendsWidget() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Focus on the highest day to highlight it by default, or just static
  const highestXp = Math.max(...weeklyData.map(d => d.xp));

  return (
    <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-light)] relative overflow-hidden group">
      {/* Background Subtle Gradient */}
      <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-[var(--primary)]/5 blur-[80px] rounded-full pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-light)] text-[var(--primary)]">
            <TrendingUp size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Productivity Trends</h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">XP earned over the last 7 days</p>
          </div>
        </div>

        {/* Time Selector (Visual Only) */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-light)] text-xs font-semibold text-[var(--text-secondary)]">
          <CalendarDays size={14} className="text-[var(--text-muted)]" />
          This Week
        </div>
      </div>

      {/* Stats Summary */}
      <div className="flex gap-6 mb-8 relative z-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-1">Total XP</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-[family-name:var(--font-heading)] text-white">3,510</span>
            <span className="text-xs font-semibold text-[var(--secondary)]">+12% vs last week</span>
          </div>
        </div>
        <div className="w-px h-10 bg-[var(--border-light)]"></div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-1">Daily Avg</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-[family-name:var(--font-heading)] text-white">501</span>
            <span className="text-xs font-semibold text-[var(--text-muted)]">XP / day</span>
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
                        fill={entry.xp === highestXp ? "var(--primary)" : activeIndex === index ? "var(--primary-light)" : "var(--border-medium)"} 
                        className="transition-all duration-300"
                    />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
