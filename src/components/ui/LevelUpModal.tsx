"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useUserStatsStore } from "@/store/userStatsStore";
import { Trophy, Star, Shield, Sword } from "lucide-react";
import Button from "./Button";

export default function LevelUpModal() {
    const { level, showLevelUpModal, setLevelUpModal } = useUserStatsStore();

    return (
        <AnimatePresence>
            {showLevelUpModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -50 }}
                        transition={{ 
                            type: "spring",
                            damping: 20,
                            stiffness: 300
                        }}
                        className="relative w-full max-w-md bg-[#151921] rounded-3xl border border-[var(--primary)]/30 p-8 text-center overflow-hidden shadow-2xl shadow-[var(--primary)]/20"
                    >
                        {/* Background Effects */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-[var(--primary)]/20 to-transparent opacity-50 pointer-events-none" />
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-32 -left-32 w-64 h-64 bg-[var(--primary)] rounded-full mix-blend-screen filter blur-[100px] opacity-30 pointer-events-none" 
                        />

                        {/* Content */}
                        <div className="relative z-10 flex flex-col items-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1, rotate: [0, -10, 10, -10, 0] }}
                                transition={{ delay: 0.2, type: "tween" }}
                                className="w-24 h-24 bg-gradient-to-br from-[var(--primary)] to-indigo-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[var(--primary)]/50"
                            >
                                <Trophy size={48} className="text-white" />
                            </motion.div>

                            <motion.h2 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-2 font-[family-name:var(--font-heading)] uppercase tracking-widest"
                            >
                                Level Up!
                            </motion.h2>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="mb-8"
                            >
                                <p className="text-slate-400 mb-2">You have reached</p>
                                <div className="text-6xl font-black text-[var(--primary)] drop-shadow-lg">
                                    {level}
                                </div>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="w-full space-y-3 mb-8"
                            >
                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                                    <div className="flex items-center gap-2 text-emerald-400">
                                        <Star size={16} /> <span className="text-sm font-bold uppercase tracking-wider">Stat Points</span>
                                    </div>
                                    <span className="text-white font-black">+3</span>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="w-full"
                            >
                                <Button 
                                    className="w-full py-4 text-lg font-black tracking-wider shadow-lg shadow-[var(--primary)]/30"
                                    onClick={() => setLevelUpModal(false)}
                                >
                                    Continue Journey
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
