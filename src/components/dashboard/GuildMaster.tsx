"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Sparkles, MessageSquare, Target, Zap, Flame } from "lucide-react";
import Image from "next/image";

interface GuildMasterProps {
    user: any;
    quests: any[];
    habits: any[];
}

export default function GuildMaster({ user, quests, habits }: GuildMasterProps) {
    const [message, setMessage] = useState("");
    const [isThinking, setIsThinking] = useState(false);

    const generateCommentary = () => {
        setIsThinking(true);
        
        // Simple heuristic engine for the mentor
        const streak = user?.streak || 0;
        const level = user?.level || 1;
        const pendingQuests = quests.filter(q => !q.is_completed).length;
        const completedToday = quests.filter(q => q.is_completed && q.completed_at?.startsWith(new Date().toISOString().split('T')[0])).length;

        let options: string[] = [];

        if (streak >= 7) {
            options.push(`Rangkaian ${streak} hari telah memperkuat fokus Anda. Teruskan, Sang Arsitek.`);
            options.push(`Konsistensi adalah kuncinya. Anda berada di jalur yang benar menuju penguasaan.`);
        } else if (streak === 0 && completedToday === 0) {
            options.push(`Banyak tugas yang belum terselesaikan. Mari kita mulai dengan satu langkah kecil hari ini.`);
            options.push(`Dunia sedang menunggu karya Anda. Apa yang menahan Anda pagi ini?`);
        }

        if (pendingQuests > 5) {
            options.push(`Ada ${pendingQuests} quest tertunda. Prioritaskan algoritma Anda, kurangi kebisingan.`);
        }

        if (completedToday > 3) {
            options.push(`Produktivitas Anda luar biasa hari ini. Jangan lupa untuk beristirahat sejenak agar tetap tajam.`);
        }

        if (level > 10) {
            options.push(`Keberadaan Anda di server ini mulai melegenda. Setiap baris kode Anda adalah sihir.`);
        }

        // Fallback
        if (options.length === 0) {
            options.push(`Selamat datang kembali di LifeQuest. Mari kita buat kemajuan nyata hari ini.`);
            options.push(`Setiap tantangan adalah kesempatan untuk me-refactor diri Anda.`);
        }

        const randomMsg = options[Math.floor(Math.random() * options.length)];
        
        setTimeout(() => {
            setMessage(randomMsg);
            setIsThinking(false);
        }, 1000);
    };

    useEffect(() => {
        generateCommentary();
        // Change message every 2 minutes or when stats change significantly
    }, [user?.id, quests.length]);

    return (
        <div className="relative p-6 rounded-3xl bg-gradient-to-br from-indigo-600/10 to-blue-600/10 border border-indigo-500/20 overflow-hidden group shadow-2xl">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
            
            <div className="flex items-start gap-6 relative z-10">
                {/* Avatar */}
                <div className="relative">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.2)] bg-black/40">
                        <Image 
                            src="/guild_master_avatar_1774525449530.png" 
                            alt="Guild Master" 
                            width={80}
                            height={80}
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                    </div>
                    <div className="absolute -bottom-2 -right-2 p-1.5 rounded-lg bg-indigo-600 border border-indigo-400 text-white shadow-lg animate-bounce">
                        <Sparkles size={12} />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-indigo-400 tracking-widest uppercase">
                            Sang Penasihat Sistem
                        </h4>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                            <span className="text-[10px] font-bold text-slate-500">ONLINE</span>
                        </div>
                    </div>

                    <div className="min-h-[60px] flex items-center">
                        <AnimatePresence mode="wait">
                            {isThinking ? (
                                <motion.div 
                                    key="thinking"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex gap-1.5 items-center"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></div>
                                </motion.div>
                            ) : (
                                <motion.p 
                                    key="message"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-sm font-medium text-slate-200 italic leading-relaxed"
                                >
                                    "{message}"
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="pt-2 flex items-center gap-4">
                        <button 
                            onClick={generateCommentary}
                            className="text-[10px] font-bold text-indigo-400 flex items-center gap-1 hover:text-indigo-300 transition-colors"
                        >
                            <MessageSquare size={12} /> Tanya Masukan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
