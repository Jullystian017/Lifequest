"use client";

import AvatarRenderer from "../character/AvatarRenderer";

export default function CharacterAvatar() {
    return (
        <div className="relative w-full aspect-square max-w-[400px] mx-auto group">
            {/* Background Magic Circle / Aura */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary)]/20 to-transparent rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity" />
            
            <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
                <AvatarRenderer className="w-full h-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]" />
            </div>

            {/* Platform / Shadow */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-8 bg-black/40 blur-xl rounded-full" />
        </div>
    );
}

