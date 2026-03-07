"use client";

import { useUserStatsStore } from "@/store/userStatsStore";
import { useMemo } from "react";
import { motion } from "framer-motion";

export default function AttributeRadarChart() {
    const { stats } = useUserStatsStore();

    // Stats mapped to points on a pentagon
    // Discipline, Knowledge, Vitality, Finance, Creativity
    const data = useMemo(() => [
        { label: "DIS", value: stats.discipline, color: "var(--discipline)" },
        { label: "INT", value: stats.knowledge, color: "var(--knowledge)" },
        { label: "VIT", value: stats.health, color: "var(--health)" },
        { label: "FIN", value: stats.finance, color: "var(--finance)" },
        { label: "CRT", value: stats.creativity, color: "var(--creativity)" },
    ], [stats]);

    const size = 200;
    const center = size / 2;
    const radius = size * 0.35;
    const angleStep = (Math.PI * 2) / data.length;

    // Calculate points for the stats
    const points = data.map((d, i) => {
        const value = Math.min(100, Math.max(10, d.value)); // Clamp for visual
        const r = (value / 100) * radius;
        const x = center + r * Math.sin(i * angleStep);
        const y = center - r * Math.cos(i * angleStep);
        return { x, y };
    });

    // Calculate background polygon points (max 100%)
    const bgPoints = data.map((_, i) => {
        const x = center + radius * Math.sin(i * angleStep);
        const y = center - radius * Math.cos(i * angleStep);
        return `${x},${y}`;
    }).join(" ");

    // Points for the 50% line
    const halfPoints = data.map((_, i) => {
        const x = center + (radius * 0.5) * Math.sin(i * angleStep);
        const y = center - (radius * 0.5) * Math.cos(i * angleStep);
        return `${x},${y}`;
    }).join(" ");

    const polygonPath = points.map(p => `${p.x},${p.y}`).join(" ");

    return (
        <div className="relative flex flex-col items-center justify-center py-6 bg-[#151921] rounded-3xl border border-white/5 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--primary)]/5 to-transparent pointer-events-none" />

            <svg width={size} height={size} className="relative z-10 drop-shadow-2xl">
                {/* Background Polygons (the grid) */}
                <polygon
                    points={bgPoints}
                    fill="rgba(255,255,255,0.02)"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="1"
                />
                <polygon
                    points={halfPoints}
                    fill="none"
                    stroke="rgba(255,255,255,0.03)"
                    strokeWidth="1"
                />

                {/* Axes */}
                {data.map((_, i) => {
                    const x = center + radius * Math.sin(i * angleStep);
                    const y = center - radius * Math.cos(i * angleStep);
                    return (
                        <line
                            key={i}
                            x1={center}
                            y1={center}
                            x2={x}
                            y2={y}
                            stroke="rgba(255,255,255,0.05)"
                            strokeWidth="1"
                        />
                    );
                })}

                {/* Data Polygon */}
                <motion.polygon
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    points={polygonPath}
                    fill="rgba(139, 92, 246, 0.2)"
                    stroke="var(--primary)"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    className="drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]"
                />

                {/* Labels */}
                {data.map((d, i) => {
                    const labelRadius = radius + 25;
                    const x = center + labelRadius * Math.sin(i * angleStep);
                    const y = center - labelRadius * Math.cos(i * angleStep);
                    return (
                        <text
                            key={i}
                            x={x}
                            y={y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="rgba(255,255,255,0.4)"
                            className="text-[10px] font-black tracking-widest uppercase"
                        >
                            {d.label}
                        </text>
                    );
                })}

                {/* Data Points (Dots) */}
                {points.map((p, i) => (
                    <circle
                        key={i}
                        cx={p.x}
                        cy={p.y}
                        r="3"
                        fill="#fff"
                        className="drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]"
                    />
                ))}
            </svg>

            <div className="mt-4 text-center">
                <h4 className="text-xs font-bold text-white uppercase tracking-widest">Character Shape</h4>
                <p className="text-[10px] text-slate-500 font-medium">Balanced Growth Active</p>
            </div>
        </div>
    );
}
