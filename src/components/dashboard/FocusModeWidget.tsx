"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Zap, Brain, Coffee } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addXpAndStat } from "@/lib/mutations";
import { userQueryKey } from "@/lib/queries";
import { createClient } from "@/lib/supabase/client";

export default function FocusModeWidget() {
    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<"focus" | "break">("focus");

    const supabase = createClient();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async ({ xp, statKey, statAmt }: any) => {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) throw new Error("Not logged in");
            
            // Fetch current user data for stats calculation
            const { data: userData, error: fetchError } = await supabase
                .from("users")
                .select("*")
                .eq("id", authUser.id)
                .single();
                
            if (fetchError || !userData) throw new Error("Gagal mengambil data user");

            return addXpAndStat(authUser.id, xp, statKey, statAmt, userData);
        },
        onSuccess: async () => {
             const { data: { user } } = await supabase.auth.getUser();
             if (user) {
                 queryClient.invalidateQueries({ queryKey: userQueryKey(user.id) });
             }
        }
    });

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive) {
            interval = setInterval(() => {
                if (seconds > 0) {
                    setSeconds(seconds - 1);
                } else if (minutes > 0) {
                    setMinutes(minutes - 1);
                    setSeconds(59);
                } else {
                    // Timer finished
                    handleTimerComplete();
                }
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isActive, minutes, seconds]);

    const handleTimerComplete = () => {
        setIsActive(false);
        if (mode === "focus") {
            mutation.mutate({ xp: 100, statKey: "discipline", statAmt: 2 });
            setMode("break");
            setMinutes(5);
        } else {
            setMode("focus");
            setMinutes(25);
        }
        setSeconds(0);
    };

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setMode("focus");
        setMinutes(25);
        setSeconds(0);
    };

    const formatTime = (m: number, s: number) => {
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-light)] relative overflow-hidden group shadow-xl transition-all">
            {/* Dynamic Glow based on mode */}
            <div className={`absolute top-[-50px] left-[-50px] w-64 h-64 blur-[80px] rounded-full pointer-events-none transition-all duration-1000 ${mode === "focus" ? "bg-indigo-500/10" : "bg-emerald-500/10"
                }`}></div>

            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl bg-[var(--bg-main)] border border-[var(--border-light)] ${mode === "focus" ? "text-indigo-400" : "text-emerald-400"
                        }`}>
                        {mode === "focus" ? <Brain size={20} /> : <Coffee size={20} />}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white font-[family-name:var(--font-heading)]">
                            {mode === "focus" ? "Deep Work" : "Recovery"}
                        </h3>
                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-0.5">
                            {isActive ? "Tethering Flow State" : "Ready to engage"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Timer Display */}
            <div className="flex flex-col items-center justify-center py-4 space-y-6 relative z-10">
                <div className="relative group/timer">
                    <svg className="w-48 h-48 transform -rotate-90">
                        <circle
                            cx="96"
                            cy="96"
                            r="88"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="transparent"
                            className="text-white/5"
                        />
                        <motion.circle
                            cx="96"
                            cy="96"
                            r="88"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 88}
                            initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                            animate={{ strokeDashoffset: (2 * Math.PI * 88) * (1 - (minutes * 60 + seconds) / (mode === "focus" ? 25 * 60 : 5 * 60)) }}
                            className={mode === "focus" ? "text-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" : "text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-black text-white tracking-widest font-mono">
                            {formatTime(minutes, seconds)}
                        </span>
                        <div className="flex items-center gap-1 mt-1">
                            <Zap size={10} className="text-indigo-400" />
                            <span className="text-[9px] font-bold text-slate-500 uppercase">+2 DISC</span>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={resetTimer}
                        className="p-3 rounded-2xl bg-[var(--bg-main)] border border-white/5 text-slate-500 hover:text-white transition-all hover:bg-white/5"
                    >
                        <RotateCcw size={18} />
                    </button>
                    <button
                        onClick={toggleTimer}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${isActive
                                ? "bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20"
                                : mode === "focus"
                                    ? "bg-indigo-600 border border-indigo-400 text-white hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                                    : "bg-emerald-600 border border-emerald-400 text-white hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                            }`}
                    >
                        {isActive ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                    </button>
                    <button className="p-3 rounded-2xl bg-[var(--bg-main)] border border-white/5 text-slate-500 transition-all opacity-30 cursor-not-allowed">
                        <Zap size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
