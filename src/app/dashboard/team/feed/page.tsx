"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { workspacesQueryKey, workspaceActivityQueryKey, fetchUserWorkspaces, fetchWorkspaceActivity } from "@/lib/queries";
import { Zap, CheckCircle2, UserPlus, Skull, Trophy, BookOpen, Loader2, Activity } from "lucide-react";

const EVENT_CONFIG: Record<string, { icon: any; color: string; label: string }> = {
  quest_completed: { icon: CheckCircle2, color: "text-emerald-400 bg-emerald-500/10", label: "Quest Selesai" },
  member_joined: { icon: UserPlus, color: "text-blue-400 bg-blue-500/10", label: "Anggota Baru" },
  boss_defeated: { icon: Trophy, color: "text-yellow-400 bg-yellow-500/10", label: "Boss Dikalahkan" },
  boss_damaged: { icon: Skull, color: "text-red-400 bg-red-500/10", label: "Boss Diserang" },
  habit_streak: { icon: Zap, color: "text-purple-400 bg-purple-500/10", label: "Habit Streak" },
  note_created: { icon: BookOpen, color: "text-indigo-400 bg-indigo-500/10", label: "Jurnal Baru" },
  default: { icon: Activity, color: "text-slate-400 bg-slate-500/10", label: "Aktivitas" },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "baru saja";
  if (mins < 60) return `${mins}m lalu`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}j lalu`;
  const days = Math.floor(hrs / 24);
  return `${days}h lalu`;
}

export default function ActivityFeedPage() {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (data.user) setUserId(data.user.id); });
  }, []);

  const { data: workspaces = [] } = useQuery({
    queryKey: workspacesQueryKey(userId!),
    queryFn: () => fetchUserWorkspaces(userId!),
    enabled: !!userId,
  });

  const activeWorkspace = workspaces[0];

  const { data: events = [], isLoading } = useQuery({
    queryKey: workspaceActivityQueryKey(activeWorkspace?.id),
    queryFn: () => fetchWorkspaceActivity(activeWorkspace?.id),
    enabled: !!activeWorkspace?.id,
    refetchInterval: 30000, // Poll every 30 seconds
  });

  if (!activeWorkspace) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <Activity size={48} className="text-slate-600" />
        <h2 className="text-xl font-bold text-white">Belum ada Workspace</h2>
        <p className="text-slate-400 text-sm">Buat atau bergabung ke workspace dulu.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-3">
          <Activity size={24} className="text-yellow-400" /> Activity Feed
        </h1>
        <p className="text-slate-400 text-sm mt-1">Real-time aktivitas tim di {activeWorkspace.name}</p>
      </div>

      {isLoading && (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-indigo-400" size={32} />
        </div>
      )}

      {!isLoading && (events as any[]).length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <Activity size={40} className="text-slate-700" />
          <p className="text-slate-500 text-sm">Belum ada aktivitas. Yuk mulai nge-quest!</p>
        </div>
      )}

      <div className="relative space-y-1">
        {(events as any[]).map((event: any, idx: number) => {
          const config = EVENT_CONFIG[event.event_type] ?? EVENT_CONFIG.default;
          const EventIcon = config.icon;
          const user = event.users;
          const data = event.event_data ?? {};

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="flex gap-4 p-4 rounded-xl hover:bg-white/3 transition-all group"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${config.color}`}>
                <EventIcon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-white">{user?.username ?? "Tim"}</span>
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-white/5 text-slate-400">{config.label}</span>
                </div>
                {data.title && <p className="text-xs text-slate-400 mt-0.5 truncate">{data.title}</p>}
                {data.questTitle && <p className="text-xs text-slate-400 mt-0.5 truncate">» {data.questTitle}</p>}
                <span className="text-[10px] text-slate-600">{timeAgo(event.created_at)}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
