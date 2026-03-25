"use client";

import { AvatarParts } from "./AvatarParts";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchUser, userQueryKey } from "@/lib/queries";
import { createClient } from "@/lib/supabase/client";
import { SHOP_ITEMS } from "@/lib/constants";
import { useState, useEffect } from "react";

interface AvatarRendererProps {
    className?: string;
}

export default function AvatarRenderer({ className = "" }: AvatarRendererProps) {
    const supabase = createClient();
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (data.user) setUserId(data.user.id);
        });
    }, []);

    const { data: user } = useQuery({
        queryKey: userQueryKey(userId!),
        queryFn: () => fetchUser(userId!),
        enabled: !!userId,
    });

    const equippedItems = user?.equipped_items || {};

    // Helper to get item info from itemId
    const getItem = (itemId: string) => {
        return SHOP_ITEMS.find(i => i.id === itemId);
    };

    const headItem = getItem(equippedItems['head'] || "");
    const bodyItem = getItem(equippedItems['body'] || "");
    const outerwearItem = getItem(equippedItems['outerwear'] || "");
    const accessoryItem = getItem(equippedItems['accessory'] || "");

    return (
        <svg viewBox="0 0 100 160" className={className} preserveAspectRatio="xMidYMid meet">
            {/* Layer 1: Accessory (e.g. Cape - rendered behind) */}
            <AnimatePresence>
                {accessoryItem?.svgPart && (
                    <motion.g
                        key={accessoryItem.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                    >
                        {AvatarParts.accessory[accessoryItem.svgPart as keyof typeof AvatarParts.accessory]?.(accessoryItem.color)}
                    </motion.g>
                )}
            </AnimatePresence>
            
            {/* Layer 2: Base Body */}
            {AvatarParts.base.body()}
            
            {/* Layer 3: Body (e.g. T-shirt) */}
            <AnimatePresence>
                {bodyItem?.svgPart && (
                    <motion.g
                        key={bodyItem.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                    >
                        {AvatarParts.body[bodyItem.svgPart as keyof typeof AvatarParts.body]?.(bodyItem.color)}
                    </motion.g>
                )}
            </AnimatePresence>
            
            {/* Layer 4: Outerwear (e.g. Armor/Jacket) */}
            <AnimatePresence>
                {outerwearItem?.svgPart && (
                    <motion.g
                        key={outerwearItem.id}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                    >
                        {AvatarParts.outerwear[outerwearItem.svgPart as keyof typeof AvatarParts.outerwear]?.(outerwearItem.color)}
                    </motion.g>
                )}
            </AnimatePresence>
            
            {/* Layer 5: Head (e.g. Hat/Visor) */}
            <AnimatePresence>
                {headItem?.svgPart && (
                    <motion.g
                        key={headItem.id}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        {AvatarParts.head[headItem.svgPart as keyof typeof AvatarParts.head]?.(headItem.color)}
                    </motion.g>
                )}
            </AnimatePresence>
        </svg>
    );
}
