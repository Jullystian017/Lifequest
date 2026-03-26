"use client";

import { Check, ChevronDown, Plus, Users, User, Rocket } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { workspacesQueryKey, fetchUserWorkspaces } from "@/lib/queries";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { useRouter } from "next/navigation";

export default function WorkspaceSwitcher() {
    const supabase = createClient();
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const { activeWorkspaceId, setActiveWorkspaceId } = useWorkspaceStore();

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (data.user) setUserId(data.user.id);
        });
    }, []);

    const { data: teamWorkspaces = [] } = useQuery({
        queryKey: workspacesQueryKey(userId!),
        queryFn: () => fetchUserWorkspaces(userId!),
        enabled: !!userId,
    });

    const activeWorkspace = activeWorkspaceId 
        ? teamWorkspaces.find((w: any) => w.id === activeWorkspaceId) 
        : { id: null, name: "LifeQuest Main", type: "personal", icon: <Rocket size={14} /> };

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative mb-6" ref={dropdownRef}>
            {/* Active Trigger */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-3 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-2xl transition-all group"
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                        !activeWorkspaceId 
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]'
                        : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.1)]'
                    }`}>
                        {!activeWorkspaceId ? <Rocket size={16} /> : <Users size={16} />}
                    </div>
                    <div className="flex flex-col items-start min-w-0 pr-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate">
                            {!activeWorkspaceId ? 'PERSONAL' : 'TEAM AREA'}
                        </span>
                        <span className="text-sm font-semibold text-white truncate max-w-[120px]">
                            {activeWorkspace?.name || "LifeQuest Main"}
                        </span>
                    </div>
                </div>
                <ChevronDown size={16} className={`text-slate-500 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ type: "tween", duration: 0.2 }}
                        className="absolute left-0 right-0 top-full mt-2 bg-[#1b1c28] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col p-2 space-y-4"
                    >
                        {/* Personal Workspaces */}
                        <div>
                            <div className="flex items-center gap-2 px-3 pb-2 pt-1">
                                <User size={12} className="text-slate-500" />
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Personal</span>
                            </div>
                            <div className="space-y-1">
                                <WorkspaceOption 
                                    name="LifeQuest Main"
                                    icon={<Rocket size={12} />}
                                    isActive={activeWorkspaceId === null}
                                    onSelect={() => {
                                        setActiveWorkspaceId(null);
                                        setIsOpen(false);
                                        router.push("/dashboard");
                                    }}
                                />
                            </div>
                        </div>

                        <div className="h-px bg-white/5 mx-2" />

                        {/* Team Workspaces */}
                        <div>
                            <div className="flex items-center gap-2 px-3 pb-2 pt-1">
                                <Users size={12} className="text-slate-500" />
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Teams & Squads</span>
                            </div>
                            <div className="space-y-1">
                                {teamWorkspaces.map((workspace: any) => (
                                    <WorkspaceOption 
                                        key={workspace.id}
                                        name={workspace.name}
                                        icon={<Users size={12} />}
                                        isActive={workspace.id === activeWorkspaceId}
                                        onSelect={() => {
                                            setActiveWorkspaceId(workspace.id);
                                            setIsOpen(false);
                                            router.push("/dashboard/team");
                                        }}
                                    />
                                ))}
                                {teamWorkspaces.length === 0 && (
                                    <p className="text-xs text-slate-600 px-3 py-2 text-center">Belum ada tim.</p>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-2 px-2 pb-1 grid grid-cols-2 gap-2">
                            <button 
                                onClick={() => {
                                    setIsOpen(false);
                                    router.push("/dashboard/team?action=create");
                                }}
                                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[var(--primary)]/10 text-[10px] font-bold text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white border border-[var(--primary)]/20 transition-all uppercase"
                            >
                                <Plus size={12} /> Buat Baru
                            </button>
                            <button 
                                onClick={() => {
                                    setIsOpen(false);
                                    router.push("/dashboard/team?action=join");
                                }}
                                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/[0.02] hover:bg-white/10 text-[10px] font-bold text-slate-300 hover:text-white border border-transparent hover:border-white/10 transition-all uppercase"
                            >
                                <Users size={12} /> Gabung
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function WorkspaceOption({ name, icon, isActive, onSelect }: { name: string; icon: React.ReactNode; isActive: boolean; onSelect: () => void }) {
    return (
        <button
            onClick={onSelect}
            className={`w-full flex items-center justify-between p-2 rounded-xl transition-all ${
                isActive ? 'bg-indigo-500/10' : 'hover:bg-white/5'
            }`}
        >
            <div className="flex items-center gap-3 overflow-hidden">
                 <div className="w-6 h-6 shrink-0 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] border border-white/5 text-slate-400">
                    {icon}
                </div>
                <div className="flex flex-col items-start pr-2 min-w-0">
                    <span className={`text-xs font-semibold truncate ${isActive ? 'text-indigo-400' : 'text-slate-300'}`}>
                        {name}
                    </span>
                </div>
            </div>
            {isActive && <Check size={14} className="text-indigo-400 shrink-0" />}
        </button>
    );
}
