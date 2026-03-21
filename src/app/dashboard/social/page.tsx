"use client";

import { useSocialStore } from "@/store/socialStore";
import { useTeamStore, TeamRole } from "@/store/teamStore";
import { useWorkspaceStore } from "@/store/workspaceStore";
import {
    Users,
    Search as SearchIcon,
    UserPlus,
    Sparkles,
    Search
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import Button from "@/components/ui/Button";
import FriendStreakCard from "@/components/social/FriendStreakCard";
import ActivityFeed from "@/components/social/ActivityFeed";
import LeaderboardWidget from "@/components/social/LeaderboardWidget";
import FriendsList from "@/components/social/FriendsList";

export default function SocialPage() {
    const { friendStreaks } = useSocialStore();
    const [activeTab, setActiveTab] = useState("overview");

    const { addWorkspace, setActiveWorkspace } = useWorkspaceStore();
    const { createTeam } = useTeamStore();
    const [isCreatingTeam, setIsCreatingTeam] = useState(false);

    const handleCreateTeam = () => {
        setIsCreatingTeam(true);
        // Mock creation delay
        setTimeout(() => {
            const newTeamId = `team-${Date.now()}`;
            
            // 1. Create Workspace
            addWorkspace({
                id: newTeamId,
                name: 'New Custom Squad',
                type: 'team',
                icon: '🏰',
                memberCount: 1
            });

            // 2. Create Team Data
            createTeam({
                id: newTeamId,
                name: 'New Custom Squad',
                description: 'A newly summoned guild',
                current_streak: 0,
                longest_streak: 0,
                created_at: new Date().toISOString(),
                members: [
                    { userId: 'u-1', name: 'Alex Miller', avatar_url: '🧔', role: 'owner' as TeamRole, joined_at: new Date().toISOString() }
                ]
            });

            // 3. Navigate
            setActiveWorkspace(newTeamId);
            setIsCreatingTeam(false);
        }, 1000);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-12 pb-20 animate-fade-in w-full">
            {/* Left Column: Community Feed & Streaks */}
            <div className="flex-1 space-y-10">

                {/* 1. Header (Mirroring Stitch) */}
                <header className="space-y-8">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                                <Users size={20} />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white font-[family-name:var(--font-heading)]">Community</h2>
                                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mt-0.5">Connect and compete to accelerate your growth.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Find players..."
                                    className="bg-[#151921] border border-white/5 rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-indigo-500/30 transition-all w-full sm:w-48"
                                />
                            </div>
                            <Button 
                                onClick={handleCreateTeam}
                                disabled={isCreatingTeam}
                                className="rounded-xl flex items-center gap-2 px-4 whitespace-nowrap bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-all"
                            >
                                <Users size={16} /> 
                                <span className="text-[11px] font-semibold uppercase tracking-widest">
                                    {isCreatingTeam ? 'Summoning...' : 'Create Team'}
                                </span>
                            </Button>
                            <Button className="rounded-xl flex items-center gap-2 px-4 whitespace-nowrap bg-indigo-600 hover:bg-indigo-500 text-white border-0 shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                                <UserPlus size={16} /> <span className="text-[11px] font-semibold uppercase tracking-widest">Add Friend</span>
                            </Button>
                        </div>
                    </div>

                    {/* Stitch Tab Style (Text with Underline) */}
                    <div className="flex items-center gap-8 border-b border-white/5">
                        {["overview", "mutual groups", "global arena"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 text-xs font-semibold uppercase tracking-widest transition-all relative ${activeTab === tab
                                    ? "text-white"
                                    : "text-slate-500 hover:text-white"
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="activeTabUnderline"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </header>

                {/* 2. Friend Streaks Section */}
                <section className="space-y-6">
                    <div className="flex items-center gap-2 px-1">
                        <span className="text-orange-500">🔥</span>
                        <h3 className="text-xs font-semibold text-white tracking-tight">Friends Streaks</h3>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                        {friendStreaks.map(friend => (
                            <FriendStreakCard key={friend.userId} friend={friend} />
                        ))}
                        <FriendStreakCard isInvite />
                    </div>
                </section>

                {/* 3. Activity Feed Section */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <h3 className="text-xs font-bold text-white tracking-tight">Activity Feed</h3>
                        </div>
                        <button className="text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest">Mark all as read</button>
                    </div>
                    <ActivityFeed />
                </section>
            </div>

            {/* Right Column: Community Sidebar */}
            <aside className="lg:w-[320px] space-y-8 pt-4">
                <LeaderboardWidget />
                <FriendsList />

                {/* Community Tip / Banner */}
                <div className="bg-indigo-600/10 rounded-3xl p-6 border border-indigo-500/20 p-6 relative overflow-hidden group">
                    <div className="absolute -top-4 -right-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <Sparkles size={80} className="text-indigo-400" />
                    </div>
                    <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">Guild Quest Active</h4>
                    <p className="text-[11px] text-indigo-200/60 leading-relaxed font-medium">Join a guild and contribute 500 XP this week to earn the <span className="text-indigo-300 font-semibold">"Team Player"</span> badge.</p>
                    <button className="flex items-center gap-2 text-[10px] font-semibold text-white uppercase tracking-widest mt-4">
                        Explore Guilds
                    </button>
                </div>
            </aside>
        </div>
    );
}
