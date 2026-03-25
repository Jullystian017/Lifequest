"use client";

import { History, Ghost, Zap, Coins } from "lucide-react";
import Link from "next/link";

interface Quest {
  id: string;
  title: string;
  is_completed: boolean;
  completed_at?: string | null;
  xp_reward: number;
  coin_reward: number;
}

interface RecentActivityWidgetProps {
  quests?: Quest[];
}

export default function RecentActivityWidget({ quests = [] }: RecentActivityWidgetProps) {
  const completedQuests = quests
    .filter(q => q.is_completed && q.completed_at)
    .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime())
    .slice(0, 5);

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "baru saja";
    if (minutes < 60) return `${minutes} menit lalu`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} jam lalu`;
    const days = Math.floor(hours / 24);
    return `${days} hari lalu`;
  };

  return (
    <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-light)]">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-light)] text-slate-400">
            <History size={16} />
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">Aktivitas Terbaru</h3>
        </div>
        <Link href="/dashboard/quests" className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
          Lihat Semua
        </Link>
      </div>

      {completedQuests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
          <Ghost size={28} className="text-slate-600" />
          <p className="text-xs text-slate-500">Belum ada quest yang diselesaikan</p>
        </div>
      ) : (
        <div className="space-y-3">
          {completedQuests.map((quest) => (
            <div key={quest.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/[0.02] transition-colors">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-emerald-400">{quest.title[0]?.toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{quest.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-indigo-400 flex items-center gap-0.5"><Zap size={8} />+{quest.xp_reward} XP</span>
                  <span className="text-[10px] text-yellow-500 flex items-center gap-0.5"><Coins size={8} />+{quest.coin_reward} G</span>
                </div>
              </div>
              <span className="text-[9px] text-slate-500 shrink-0">{getTimeAgo(quest.completed_at!)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
