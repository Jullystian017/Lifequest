"use client";

import { useWorkspaceStore, Workspace } from "@/store/workspaceStore";
import { Check, ChevronDown, Plus, Users, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WorkspaceSwitcher() {
    const { activeWorkspaceId, workspaces, setActiveWorkspace } = useWorkspaceStore();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId);
    
    const personalWorkspaces = workspaces.filter(w => w.type === 'personal');
    const teamWorkspaces = workspaces.filter(w => w.type === 'team');

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

    if (!activeWorkspace) return null;

    return (
        <div className="relative mb-6" ref={dropdownRef}>
            {/* Active Trigger */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-3 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-2xl transition-all group"
            >
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm border transition-colors ${
                        activeWorkspace.type === 'personal' 
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]'
                        : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.1)]'
                    }`}>
                        {activeWorkspace.icon}
                    </div>
                    <div className="flex flex-col items-start pr-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{activeWorkspace.type}</span>
                        <span className="text-sm font-semibold text-white truncate max-w-[100px]">{activeWorkspace.name}</span>
                    </div>
                </div>
                <ChevronDown size={16} className={`text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 right-0 top-full mt-2 bg-[#1b1c28] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col p-2 space-y-4"
                    >
                        {/* Personal Workspaces */}
                        <div>
                            <div className="flex items-center gap-2 px-3 pb-2 pt-1">
                                <User size={12} className="text-slate-500" />
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Personal</span>
                            </div>
                            <div className="space-y-1">
                                {personalWorkspaces.map(workspace => (
                                    <WorkspaceOption 
                                        key={workspace.id} 
                                        workspace={workspace} 
                                        isActive={workspace.id === activeWorkspaceId}
                                        onSelect={() => {
                                            setActiveWorkspace(workspace.id);
                                            setIsOpen(false);
                                        }}
                                    />
                                ))}
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
                                {teamWorkspaces.map(workspace => (
                                    <WorkspaceOption 
                                        key={workspace.id} 
                                        workspace={workspace} 
                                        isActive={workspace.id === activeWorkspaceId}
                                        onSelect={() => {
                                            setActiveWorkspace(workspace.id);
                                            setIsOpen(false);
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-2 px-2 pb-1">
                            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.02] hover:bg-indigo-500/10 text-[11px] font-bold text-slate-400 hover:text-indigo-400 border border-transparent hover:border-indigo-500/20 transition-all uppercase">
                                <Plus size={14} /> Handle New Workspace
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function WorkspaceOption({ workspace, isActive, onSelect }: { workspace: Workspace; isActive: boolean; onSelect: () => void }) {
    return (
        <button
            onClick={onSelect}
            className={`w-full flex items-center justify-between p-2 rounded-xl transition-all ${
                isActive ? 'bg-indigo-500/10' : 'hover:bg-white/5'
            }`}
        >
            <div className="flex items-center gap-3">
                 <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] border border-white/5">
                    {workspace.icon}
                </div>
                <div className="flex flex-col items-start pr-2">
                    <span className={`text-xs font-semibold ${isActive ? 'text-indigo-400' : 'text-slate-300'}`}>
                        {workspace.name}
                    </span>
                    {workspace.memberCount && (
                        <span className="text-[9px] text-slate-500 font-medium">
                            {workspace.memberCount} Members
                        </span>
                    )}
                </div>
            </div>
            {isActive && <Check size={14} className="text-indigo-400" />}
        </button>
    );
}
