"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { fetchNotifications, notificationsQueryKey } from "@/lib/queries";
import { markNotificationRead, markAllNotificationsRead, clearNotifications, deleteNotification } from "@/lib/mutations";
import {
    Bell,
    Gift,
    Swords,
    AlertCircle,
    BrainCircuit,
    CheckCircle2,
    Clock,
    Trash2,
    CheckCheck
} from "lucide-react";

type NotificationType = 'system' | 'ai' | 'combat' | 'social' | 'reward';

export default function NotificationsPage() {
    const supabase = createClient();
    const queryClient = useQueryClient();
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (data.user) setUserId(data.user.id);
        });
    }, []);

    const { data: notifications = [], isLoading } = useQuery({
        queryKey: notificationsQueryKey(userId!),
        queryFn: () => fetchNotifications(userId!),
        enabled: !!userId,
    });

    const markReadMutation = useMutation({
        mutationFn: (id: string) => markNotificationRead(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationsQueryKey(userId!) }),
    });

    const markAllReadMutation = useMutation({
        mutationFn: () => markAllNotificationsRead(userId!),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationsQueryKey(userId!) }),
    });

    const clearAllMutation = useMutation({
        mutationFn: () => clearNotifications(userId!),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationsQueryKey(userId!) }),
    });

    const unreadCount = notifications.filter((n: any) => !n.read).length;

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

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return "Baru saja";
        if (diffMins < 60) return `${diffMins} menit lalu`;
        if (diffHours < 24) return `${diffHours} jam lalu`;
        return `${diffDays} hari lalu`;
    };

    if (isLoading && userId) {
        return <div className="p-12 text-center text-slate-500 uppercase tracking-widest font-bold text-xs animate-pulse">Memuat Notifikasi...</div>;
    }

    return (
        <div className="space-y-8 pb-20 w-full animate-fade-in">
            {/* Actions */}
            <div className="flex justify-end pb-6 border-b border-white/5">
                <div className="flex items-center gap-3 shrink-0">
                    <button 
                        onClick={() => markAllReadMutation.mutate()}
                        disabled={unreadCount === 0}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-[var(--bg-card)] border border-[var(--border-light)] hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <CheckCheck size={14} /> Tandai Semua Dibaca
                    </button>
                    <button 
                        onClick={() => clearAllMutation.mutate()}
                        disabled={notifications.length === 0}
                        className="flex items-center gap-2 p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-400/10 border border-transparent transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {notifications.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="p-12 text-center rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-4"
                        >
                            <Bell size={48} className="text-slate-700" />
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Tidak ada notifikasi baru.</p>
                        </motion.div>
                    ) : (
                        notifications.map((notif: any) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                key={notif.id}
                                onClick={() => !notif.read && markReadMutation.mutate(notif.id)}
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
                                                <Clock size={10} /> {formatTime(notif.created_at)}
                                            </span>
                                        </div>
                                        <p className={`text-sm leading-relaxed ${notif.read ? 'text-slate-500' : 'text-slate-300'}`}>
                                            {notif.message}
                                        </p>
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
