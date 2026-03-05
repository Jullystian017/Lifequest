"use client";

import { AchievementRarity } from "@/types/achievement";
import { getRarityColor } from "@/lib/gamification/achievements";

interface BadgeProps {
    label: string;
    rarity?: AchievementRarity;
    color?: string;
    icon?: string;
    size?: "sm" | "md" | "lg";
}

const sizeStyles = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
};

export default function Badge({
    label,
    rarity,
    color,
    icon,
    size = "md",
}: BadgeProps) {
    const bgColor = color || (rarity ? getRarityColor(rarity) : "#6366F1");

    return (
        <span
            className={`
        inline-flex items-center gap-1 rounded-full font-medium
        ${sizeStyles[size]}
      `}
            style={{
                backgroundColor: `${bgColor}20`,
                color: bgColor,
                border: `1px solid ${bgColor}40`,
            }}
        >
            {icon && <span>{icon}</span>}
            {label}
        </span>
    );
}
