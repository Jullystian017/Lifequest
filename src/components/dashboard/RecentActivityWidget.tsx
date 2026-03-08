"use client";

import { History } from "lucide-react";
import { useWorkspaceStore } from "@/store/workspaceStore";

const personalActivities = [
  {
    id: 1,
    title: "Leveled up to Level 12",
    subtitle: "ATTRIBUTE POINTS GAINED",
    meta: "Yesterday",
    color: "#22C55E", // Green
  },
  {
    id: 2,
    title: "Unlocked achievement 'Early Bird'",
    subtitle: "+50 GOLD",
    meta: "2 days ago",
    color: "#F59E0B", // Orange/Yellow
  },
  {
    id: 3,
    title: "Completed 'Weekly Planning'",
    subtitle: "+120 XP",
    meta: "3 days ago",
    color: "#8B5CF6", // Purple
  },
];

const teamActivities = [
  {
    id: 1,
    title: "Alex dealt 1500 DMG to Leviathan",
    subtitle: "Stripe Integration Completed",
    meta: "2 hours ago",
    color: "#EF4444", // Red
  },
  {
    id: 2,
    title: "Sarah Chen joined the squad",
    subtitle: "NEW MEMBER",
    meta: "Yesterday",
    color: "#3B82F6", // Blue
  },
  {
    id: 3,
    title: "Elena completed QA Testing Phase 2",
    subtitle: "+400 XP to Party",
    meta: "2 days ago",
    color: "#22C55E", // Green
  },
];

export default function RecentActivityWidget() {
  const { activeWorkspace } = useWorkspaceStore();
  const isTeam = activeWorkspace?.type === 'team';
  
  const activities = isTeam ? teamActivities : personalActivities;
  const widgetTitle = isTeam ? "Party Activity" : "Recent Activity";
  const widgetSubtitle = isTeam ? "Latest moves by your squad" : "Your latest milestones";

  return (
    <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-light)] relative overflow-hidden group shadow-xl transition-all">
      {/* Background Subtle Glow */}
      <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-blue-500/10 transition-colors"></div>

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="p-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-light)] text-blue-400">
          <History size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white font-[family-name:var(--font-heading)] leading-none pt-1">
            {widgetTitle}
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-1">{widgetSubtitle}</p>
        </div>
      </div>

      <div className="relative space-y-6 before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[var(--border-light)] before:to-transparent">
        <div className="relative pl-6 space-y-6">
          {/* Connecting Line */}
          <div className="absolute left-[3px] top-2 bottom-2 w-px bg-[var(--border-light)]"></div>

          {activities.map((activity) => (
            <div key={activity.id} className="relative">
              {/* Timeline Dot */}
              <div
                className="absolute left-[-23px] top-1.5 w-1.5 h-1.5 rounded-full ring-4 ring-[var(--bg-card)] z-10"
                style={{ backgroundColor: activity.color }}
              />

              {/* Content */}
              <div className="flex flex-col gap-1">
                <p className="text-xs font-semibold text-white">
                  {activity.title}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {activity.subtitle}
                </p>
                <p className="text-[10px] text-slate-500">
                  {activity.meta}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
