"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bell,
    Gift,
    Swords,
    TrendingUp,
    AlertCircle,
    BrainCircuit,
    CheckCircle2,
    Clock,
    Trash2,
    CheckCheck
} from "lucide-react";

type NotificationType = 'system' | 'ai' | 'combat' | 'social' | 'reward';

interface AppNotification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    time: string;
    read: boolean;
    reward?: string;
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
    {
        id: "n1",
        type: "ai",
        title: "Peringatan Konsistensi Jangka Panjang",
        message: "Pola tidurmu berkurang 20% minggu ini. Jangan lupakan pemulihan sebelum menghadapi Shadow Boss selanjutnya.",
        time: "10 menit yang lalu",
        read: false
    },
    {
        id: "n2",
        type: "reward",
        title: "Pencapaian Terbuka: Konsisten",
        message: "Kamu telah menyelesaikan rutinitas selama 3 hari beruntun! Ambil hadiah XP-mu sekarang.",
        time: "1 jam yang lalu",
        read: false,
        reward: "+100 XP"
    },
    {
        id: "n3",
        type: "combat",
        title: "Serangan Shadow Enemy: Prokrastinator Kecil",
        message: "Musuh mencoba mencuri waktumu saat kamu membuka media sosial. Segera alihkan perhatian ke 'Deep Work'!",
        time: "2 jam yang lalu",
        read: true
    },
    {
        id: "n4",
        type: "system",
        title: "Pembaruan Sistem LifeQuest v1.2",
        message: "Fitur Simulasi Masa Depan dan Papan Peringkat kini telah aktif. Cek sekarang untuk memantau lintasanmu.",
        time: "1 hari yang lalu",
        read: true
    },
    {
        id: "n5",
        type: "social",
        title: "Pesan Guild: Alex Miller",
        message: "'Jangan lupa setoran quest hariannya ya teman-teman!' - Ketuk untuk melihat chat Guild.",
        time: "1 hari yang lalu",
        read: true
    }
];

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

    const unreadCount = notifications.filter(n => !n.read).length;

    const getIcon = (type: NotificationType) => {
        switch(type) {
            case 'ai': return <BrainCircuit size={18} className="text-indigo-400" />;
            case 'reward': return <Gift size={18} className="text-yellow-400" />;
            case 'combat': return <Swords size={18} className="text-red-400" />;
            case 'social': return <CheckCircle2 size={18} className="text-blue-400" />;
            default: return <Bell size={18} className="text-slate-400" />;
        }
    };

    const getColors = (type: NotificationType, read: boolean) => {
        if (read) return "bg-black/20 border-white/5 opacity-70";
        switch(type) {
            case 'ai': return "bg-indigo-500/10 border-indigo-500/20 shadow-[inset_4px_0_0_rgba(99,102,241,1)]";
            case 'reward': return "bg-yellow-500/10 border-yellow-500/20 shadow-[inset_4px_0_0_rgba(250,204,21,1)]";
            case 'combat': return "bg-red-500/10 border-red-500/20 shadow-[inset_4px_0_0_rgba(239,68,68,1)]";
            case 'social': return "bg-blue-500/10 border-blue-500/20 shadow-[inset_4px_0_0_rgba(59,130,246,1)]";
            default: return "bg-slate-800 border-slate-700 shadow-[inset_4px_0_0_rgba(148,163,184,1)]";
        }
    };

    const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    const clearAll = () => setNotifications([]);

    const toggleRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
    };

    return (
        <div className="space-y-8 pb-20 w-full animate-fade-in">
            {/* Actions */}
            <div className="flex justify-end pb-6 border-b border-white/5">
                <div className="flex items-center gap-3 shrink-0">
                    <button 
                        onClick={markAllRead}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-[var(--bg-card)] border border-[var(--border-light)] hover:border-white/20 transition-all"
                    >
                        <CheckCheck size={14} /> Tandai Semua Dibaca
                    </button>
                    <button 
                        onClick={clearAll}
                        className="flex items-center gap-2 p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-400/10 border border-transparent transition-all"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="space-y-3">
                <AnimatePresence>
                    {notifications.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="p-12 text-center rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-4"
                        >
                            <Bell size={48} className="text-slate-700" />
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Tidak ada notifikasi baru.</p>
                        </motion.div>
                    ) : (
                        notifications.map((notif) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                key={notif.id}
                                onClick={() => !notif.read && toggleRead(notif.id)}
                                className={`w-full p-4 md:p-5 rounded-2xl border transition-all cursor-pointer hover:border-white/20 ${getColors(notif.type, notif.read)}`}
                            >
                                <div className="flex gap-4">
                                    <div className="shrink-0 mt-1">
                                        <div className={`p-2.5 rounded-full bg-black/40 border border-white/5`}>
                                            {getIcon(notif.type)}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4 mb-1">
                                            <h4 className={`text-base font-bold font-[family-name:var(--font-heading)] truncate ${notif.read ? 'text-slate-300' : 'text-white'}`}>
                                                {notif.title}
                                            </h4>
                                            <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap flex items-center gap-1 shrink-0 mt-1">
                                                <Clock size={10} /> {notif.time}
                                            </span>
                                        </div>
                                        <p className={`text-sm leading-relaxed ${notif.read ? 'text-slate-500' : 'text-slate-300'}`}>
                                            {notif.message}
                                        </p>
                                        
                                        {notif.reward && (
                                            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold">
                                                <Gift size={12} /> {notif.reward}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

        </div>
    );
}
