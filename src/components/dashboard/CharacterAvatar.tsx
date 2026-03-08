"use client";

import { useUserStatsStore } from "@/store/userStatsStore";
import { motion, AnimatePresence } from "framer-motion";

export default function CharacterAvatar() {
    const { equippedItems } = useUserStatsStore();

    // Logic to determine which image to show
    // In a more complex system, this would layer multiple PNGs
    // For now, we'll swap between 'Complete Set' images
    let avatarSrc = "/characters/base.png";

    if (equippedItems['cosmetic'] === 's4') {
        avatarSrc = "/characters/dark_knight.png";
    } else if (equippedItems['cosmetic'] === 's6') {
        avatarSrc = "/characters/royal_cape.png";
    }

    return (
        <div className="relative w-full aspect-square max-w-[400px] mx-auto group">
            {/* Background Magic Circle / Aura */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary)]/20 to-transparent rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity" />
            
            <AnimatePresence mode="wait">
                <motion.div
                    key={avatarSrc}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 1.1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="relative z-10 w-full h-full flex items-center justify-center"
                >
                    <img 
                        src={avatarSrc} 
                        alt="Character Avatar" 
                        className="w-full h-full object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                    />
                </motion.div>
            </AnimatePresence>

            {/* Platform / Shadow */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-8 bg-black/40 blur-xl rounded-full" />
        </div>
    );
}
