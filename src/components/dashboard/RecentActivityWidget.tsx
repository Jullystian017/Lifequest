"use client";

import { History } from "lucide-react";

const activities = [
  {
    id: 1,
    title: "Alex completed 'Study JavaScript'",
    subtitle: "+200 XP",
    meta: "2 hours ago",
    color: "#3B82F6", // Blue
  },
  {
    id: 2,
    title: "Leveled up to Level 12",
    subtitle: "ATTRIBUTE POINTS GAINED",
    meta: "Yesterday",
    color: "#22C55E", // Green
  },
  {
    id: 3,
    title: "Unlocked achievement 'Early Bird'",
    subtitle: "+50 GOLD",
    meta: "2 days ago",
    color: "#F59E0B", // Orange/Yellow
  },
  {
    id: 4,
    title: "Completed 'Weekly Planning'",
    subtitle: "+120 XP",
    meta: "3 days ago",
    color: "#8B5CF6", // Purple
  },
];

export default function RecentActivityWidget() {
  return (
    <div className="bg-[#1b1c28] border border-white/[0.05] rounded-3xl p-6 shadow-lg space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <History size={20} className="text-slate-400" />
        <h3 className="text-lg font-bold text-white font-[family-name:var(--font-heading)] leading-none pt-1">
          Recent Activity
        </h3>
      </div>

      <div className="relative space-y-6 before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/[0.05] before:to-transparent">
        <div className="relative pl-6 space-y-6">
           {/* Connecting Line */}
           <div className="absolute left-[3px] top-2 bottom-2 w-px bg-white/[0.05]"></div>

           {activities.map((activity, index) => (
             <div key={activity.id} className="relative">
               {/* Timeline Dot */}
               <div 
                 className="absolute left-[-23px] top-1.5 w-1.5 h-1.5 rounded-full ring-4 ring-[#1b1c28] z-10"
                 style={{ backgroundColor: activity.color }}
               />
               
               {/* Content */}
               <div className="flex flex-col gap-1">
                 <p className="text-xs font-semibold text-white">
                   {activity.title}
                 </p>
                 <p className="text-[10px] font-bold text-slate-400">
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
