"use client";

import { Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function ActivityFeed() {
    const activities = [
        { id: "1", userName: "Ahmad", content: "menyelesaikan 7 hari streak quest", timestamp: "2 JAM YANG LALU", hasLiked: false },
        { id: "2", userName: "Siti", content: "mendapatkan badge Pejuang Gigih", timestamp: "5 JAM YANG LALU", hasLiked: true },
        { id: "3", userName: "Budi", content: "menyelesaikan quest Harian", timestamp: "1 HARI YANG LALU", hasLiked: false },
    ];
    const likeActivity = (id: string) => console.log("Like activity", id);

    return (
        <div className="space-y-4">
            {activities.map((activity, index) => (
                <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4 py-4 border-b border-white/[0.03] last:border-0 group"
                >
                    {/* Avatar */}
                    <div className="shrink-0 relative">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white border border-white/10 uppercase overflow-hidden">
                            {activity.userName.charAt(0)}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <p className="text-[13px] text-slate-300 leading-tight">
                            <span className="text-white font-semibold hover:text-indigo-400 cursor-pointer transition-colors mr-1">
                                {activity.userName}
                            </span>
                            {activity.content.split(/(\d+ .*? streak|badge|quest)/).map((part, i) => {
                                if (part.match(/\d+ .*? streak/)) return <span key={i} className="text-orange-500 font-semibold">{part}</span>;
                                if (part.match(/badge|quest/)) return <span key={i} className="text-indigo-400 font-semibold">{part}</span>;
                                return part;
                            })}
                        </p>
                        <span className="text-[9px] font-semibold text-slate-600 uppercase tracking-widest mt-1 block tracking-tighter">
                            {activity.timestamp}
                        </span>
                    </div>

                    {/* Like Action (Right Side) */}
                    <button
                        onClick={() => likeActivity(activity.id)}
                        className={`p-2 rounded-lg transition-all ${activity.hasLiked ? "text-rose-500 bg-rose-500/5 shadow-[0_0_10px_rgba(244,63,94,0.1)]" : "text-slate-600 hover:text-rose-400"
                            }`}
                    >
                        <Heart size={14} className={activity.hasLiked ? "fill-rose-500" : ""} />
                    </button>
                </motion.div>
            ))}
        </div>
    );
}
