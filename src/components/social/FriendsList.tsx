"use client";

import { useSocialStore } from "@/store/socialStore";
import { MessageSquare } from "lucide-react";

export default function FriendsList() {
    const { friendStreaks } = useSocialStore();

    return (
        <div className="bg-[#151921]/10 rounded-3xl p-6 border border-white/5 space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white tracking-tight">Friends</h3>
                <span className="text-[10px] font-semibold text-emerald-400 uppercase">18 Online</span>
            </div>

            <div className="space-y-4">
                {friendStreaks.slice(0, 4).map((friend) => (
                    <div key={friend.userId} className="flex items-center gap-3 group cursor-pointer">
                        <div className="relative">
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-semibold text-white uppercase border border-white/5">
                                {friend.userName.charAt(0)}
                            </div>
                            {friend.isOnline && (
                                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0b0e14]" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-white truncate group-hover:text-indigo-400 transition-colors uppercase">{friend.userName}</p>
                            <p className="text-[9px] text-slate-500 font-medium truncate italic">{friend.lastActivity}</p>
                        </div>
                        <MessageSquare size={12} className="text-slate-600 group-hover:text-white transition-colors" />
                    </div>
                ))}
            </div>

            <button className="w-full py-3 text-[10px] font-semibold text-slate-400 hover:text-white bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-2xl transition-all uppercase tracking-widest mt-2">
                See All Friends
            </button>
        </div>
    );
}
