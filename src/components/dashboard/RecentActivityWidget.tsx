"use client";

import { History, Ghost } from "lucide-react";
import { useQuestStore } from "@/store/questStore";
import Link from "next/link";

export default function RecentActivityWidget() {
  const { quests } = useQuestStore();

  // Build real recent activity from completed quests
  const completedQuests = quests
    .filter(q => q.is_completed && q.completed_at)
    .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime())
    .slice(0, 5);

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes} menit lalu`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} jam lalu`;
    const days = Math.floor(hours / 24);
    return `${days} hari lalu`;
  };

  const colors = ["#22C55E", "#8B5CF6", "#F59E0B", "#3B82F6", "#EF4444"];

  return (
    <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-light)] relative overflow-hidden group shadow-xl transition-all">
      <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-blue-500/10 transition-colors"></div>

      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-light)] text-blue-400">
            <History size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white font-[family-name:var(--font-heading)] leading-none pt-1">
              Aktivitas Terbaru
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-1">Pencapaian terbarumu</p>
          </div>
        </div>
        <Link href="/dashboard/quests" className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] hover:text-white transition-colors">
          Riwayat
        </Link>
      </div>

      {completedQuests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 mb-4">
            <Ghost size={32} className="text-blue-500/40" />
          </div>
          <p className="text-sm font-semibold text-slate-400 mb-1">Belum ada aktivitas tercatat</p>
          <p className="text-xs text-slate-500">Selesaikan misi pertamamu dan riwayatmu akan muncul di sini!</p>
        </div>
      ) : (
        <div className="relative space-y-6 before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[var(--border-light)] before:to-transparent">
          <div className="relative pl-6 space-y-6">
            <div className="absolute left-[3px] top-2 bottom-2 w-px bg-[var(--border-light)]"></div>

            {completedQuests.map((quest, idx) => (
              <div key={quest.id} className="relative">
                <div
                  className="absolute left-[-23px] top-1.5 w-1.5 h-1.5 rounded-full ring-4 ring-[var(--bg-card)] z-10"
                  style={{ backgroundColor: colors[idx % colors.length] }}
                />
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-semibold text-white">
                    Menyelesaikan &quot;{quest.title}&quot;
                  </p>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                    +{quest.xp_reward} XP · +{quest.coin_reward} GOLD
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {quest.completed_at ? getTimeAgo(quest.completed_at) : "Baru saja"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
