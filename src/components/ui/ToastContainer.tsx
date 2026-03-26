"use client";

import { useNotificationStore } from "@/store/notificationStore";
import { AnimatePresence, motion } from "framer-motion";
import { 
    Zap, 
    Bell, 
    Sword, 
    Trophy, 
    User, 
    X,
    Info
} from "lucide-react";

const icons = {
    reward: <Trophy className="text-yellow-400" size={18} />,
    system: <Info className="text-blue-400" size={18} />,
    combat: <Sword className="text-red-400" size={18} />,
    social: <User className="text-indigo-400" size={18} />,
    ai: <Zap className="text-purple-400" size={18} />,
};

const bgColors = {
    reward: "border-yellow-500/20 bg-yellow-500/5",
    system: "border-blue-500/20 bg-blue-500/5",
    combat: "border-red-500/20 bg-red-500/5",
    social: "border-indigo-500/20 bg-indigo-500/5",
    ai: "border-purple-500/20 bg-purple-500/5",
};

export default function ToastContainer() {
    const { toasts, removeToast } = useNotificationStore();

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        layout
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                        className={`pointer-events-auto flex items-start gap-4 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl ${bgColors[toast.type as keyof typeof bgColors]}`}
                    >
                        <div className="shrink-0 p-2 rounded-xl bg-black/40 border border-white/5">
                            {icons[toast.type as keyof typeof icons] || <Bell className="text-white" size={18} />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-white font-[family-name:var(--font-heading)] truncate">
                                {toast.title}
                            </h4>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                {toast.message}
                            </p>
                        </div>
                        <button 
                            onClick={() => removeToast(toast.id)}
                            className="shrink-0 text-slate-500 hover:text-white transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
