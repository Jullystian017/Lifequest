"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStatsStore } from "@/store/userStatsStore";
import { useQuestStore } from "@/store/questStore";
import {
    Users,
    MessageSquare,
    Shield,
    Swords,
    Send,
    Plus,
    Target,
    Settings,
    Crown
} from "lucide-react";

interface ChatMessage {
    id: string;
    sender: string;
    message: string;
    timestamp: string;
    isSystem?: boolean;
}

const DUMMY_TEAM = {
    name: "Phoenix Guild",
    level: 12,
    members: [
        { id: "m1", name: "Alex Miller", role: "Leader", level: 12, isMe: true },
        { id: "m2", name: "Sarah Connor", role: "Member", level: 14, isMe: false },
        { id: "m3", name: "John Wick", role: "Member", level: 9, isMe: false },
    ],
    activeQuest: "Selesaikan 50 Quest Gabungan Minggu Ini",
    questProgress: 32,
    questTarget: 50,
};

const INITIAL_CHAT: ChatMessage[] = [
    { id: "c1", sender: "System", message: "Sarah Connor telah menyelesaikan quest 'Lari Pagi 5km'.", timestamp: "10:30", isSystem: true },
    { id: "c2", sender: "John Wick", message: "Mantap Sarah! Gue baru mau mulai coding session nih.", timestamp: "10:32" },
    { id: "c3", sender: "Sarah Connor", message: "Yok semangat! Tinggal 18 quest lagi buat kelarin target mingguan guild kita.", timestamp: "10:35" },
];

export default function TeamPage() {
    const { username } = useUserStatsStore();
    const { quests } = useQuestStore();
    const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT);
    const [newMessage, setNewMessage] = useState("");

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const msg: ChatMessage = {
            id: Date.now().toString(),
            sender: username || "Me",
            message: newMessage.trim(),
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages([...messages, msg]);
        setNewMessage("");
    };

    const teamProgressPercent = (DUMMY_TEAM.questProgress / DUMMY_TEAM.questTarget) * 100;

    return (
        <div className="flex gap-6 h-[calc(100vh-7rem)] pb-4 animate-fade-in w-full">
            
            {/* Left Panel: Team Info & Members */}
            <div className="w-80 shrink-0 flex flex-col gap-6">
                
                {/* Guild Header */}
                <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-light)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <Shield size={100} className="text-[var(--primary)]" />
                    </div>
                    
                    <div className="flex items-center gap-4 mb-6 relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] p-0.5">
                            <div className="w-full h-full bg-black/50 rounded-[14px] flex items-center justify-center">
                                <Shield size={24} className="text-white" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white font-[family-name:var(--font-heading)]">{DUMMY_TEAM.name}</h2>
                            <p className="text-xs font-bold text-[var(--primary)] uppercase tracking-widest bg-[var(--primary)]/10 px-2 py-0.5 rounded inline-block mt-1">Guild Lv.{DUMMY_TEAM.level}</p>
                        </div>
                    </div>

                    {/* Team Quest */}
                    <div className="space-y-3 relative z-10">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                            <Target size={14} className="text-emerald-400" /> Target Mingguan
                        </div>
                        <p className="text-sm font-bold text-white leading-snug">{DUMMY_TEAM.activeQuest}</p>
                        
                        <div>
                            <div className="flex items-center justify-between text-[10px] font-bold mt-3 mb-1.5">
                                <span className="text-emerald-400">Progres</span>
                                <span className="text-slate-400">{DUMMY_TEAM.questProgress} / {DUMMY_TEAM.questTarget}</span>
                            </div>
                            <div className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${teamProgressPercent}%` }}
                                    className="h-full bg-emerald-500 rounded-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Member List */}
                <div className="flex-1 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-light)] flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-white/5 flex items-center justify-between">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Users size={14} /> Anggota ({DUMMY_TEAM.members.length})
                        </h3>
                        <button className="text-[var(--primary)] hover:text-white transition-colors">
                            <Plus size={16} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                        {DUMMY_TEAM.members.map((member) => (
                            <div key={member.id} className="flex items-center justify-between p-3 rounded-2xl bg-black/20 border border-white/5 hover:border-white/10 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-slate-400">
                                        {member.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white flex items-center gap-2">
                                            {member.name} 
                                            {member.isMe && <span className="text-[9px] bg-[var(--primary)] text-white px-1.5 py-0.5 rounded uppercase">You</span>}
                                        </p>
                                        <p className="text-[10px] text-slate-500 font-bold flex items-center gap-1 mt-0.5">
                                            {member.role === 'Leader' && <Crown size={10} className="text-yellow-500" />} {member.role} • Lv.{member.level}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Right Panel: Chat & Activity */}
            <div className="flex-1 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-light)] flex flex-col overflow-hidden relative">
                
                {/* Chat Header */}
                <div className="px-6 py-4 border-b border-white/5 bg-black/20 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <MessageSquare size={18} className="text-[var(--primary)]" />
                        <h3 className="text-base font-bold text-white font-[family-name:var(--font-heading)]">Guild Chat</h3>
                    </div>
                    <button className="p-2 text-slate-500 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                        <Settings size={18} />
                    </button>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide flex flex-col">
                    {messages.map((msg, idx) => {
                        const isMe = msg.sender === (username || "Me");
                        const prevMsg = messages[idx - 1];
                        const hideHeader = prevMsg && prevMsg.sender === msg.sender && !msg.isSystem;

                        if (msg.isSystem) {
                            return (
                                <div key={msg.id} className="flex justify-center my-4">
                                    <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                                        {msg.message}
                                    </span>
                                </div>
                            );
                        }

                        return (
                            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                {!hideHeader && (
                                    <div className="flex items-center gap-2 mb-1.5 px-1">
                                        <span className={`text-[11px] font-bold ${isMe ? 'text-[var(--primary)]' : 'text-slate-400'}`}>
                                            {msg.sender}
                                        </span>
                                        <span className="text-[9px] text-slate-600 font-mono">{msg.timestamp}</span>
                                    </div>
                                )}
                                <div className={`relative max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                                    isMe 
                                    ? 'bg-[var(--primary)] text-white rounded-tr-sm' 
                                    : 'bg-black/40 border border-white/5 text-slate-200 rounded-tl-sm'
                                }`}>
                                    {msg.message}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Chat Input */}
                <div className="p-4 bg-black/20 border-t border-white/5 shrink-0">
                    <form onSubmit={handleSendMessage} className="relative flex items-center">
                        <input 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Ketik pesan untuk guild..."
                            className="w-full bg-[var(--bg-card)] border border-[var(--border-light)] text-white rounded-2xl pl-5 pr-14 py-3.5 outline-none focus:border-[var(--primary)] transition-all placeholder:text-slate-600 text-sm"
                        />
                        <button 
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="absolute right-2 p-2 rounded-xl bg-[var(--primary)] text-white disabled:opacity-50 disabled:bg-slate-800 disabled:text-slate-500 transition-all hover:scale-105 active:scale-95"
                        >
                            <Send size={16} className="ml-0.5 shrink-0" />
                        </button>
                    </form>
                </div>
            </div>
            
        </div>
    );
}
