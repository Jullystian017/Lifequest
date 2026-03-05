"use client";

import { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    glow?: boolean;
    onClick?: () => void;
}

export default function Card({
    children,
    className = "",
    hover = false,
    glow = false,
    onClick,
}: CardProps) {
    return (
        <div
            className={`
        bg-[var(--dark-secondary)] rounded-2xl border border-[var(--dark-border)]
        p-5
        ${hover ? "card-hover cursor-pointer" : ""}
        ${glow ? "animate-pulse-glow" : ""}
        ${className}
      `}
            onClick={onClick}
        >
            {children}
        </div>
    );
}
