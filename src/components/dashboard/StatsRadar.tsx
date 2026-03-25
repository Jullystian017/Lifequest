"use client";

import Card from "@/components/ui/Card";
import { CharacterStats } from "@/types/user";

interface StatsRadarProps {
    stats: CharacterStats;
}

/** Simple radar/pentagon chart for character stats using SVG */
export default function StatsRadar({ stats }: StatsRadarProps) {
    const statKeys: (keyof CharacterStats)[] = [
        "health",
        "knowledge",
        "discipline",
        "creativity",
    ];

    const labels = ["Health", "Knowledge", "Discipline", "Creativity"];
    const colors = ["#EF4444", "#3B82F6", "#8B5CF6", "#F59E0B"];

    const cx = 150;
    const cy = 150;
    const maxR = 100;
    const angleStep = (2 * Math.PI) / 4;
    const startAngle = -Math.PI / 2;

    const getPoint = (index: number, value: number) => {
        const angle = startAngle + index * angleStep;
        const r = (value / 100) * maxR;
        return {
            x: cx + r * Math.cos(angle),
            y: cy + r * Math.sin(angle),
        };
    };

    // Background pentagon layers
    const bgLayers = [20, 40, 60, 80, 100];

    return (
        <Card>
            <h3 className="text-sm font-semibold mb-3 text-[var(--text-secondary)]">
                Character Stats
            </h3>
            <div className="flex justify-center">
                <svg viewBox="0 0 300 300" className="w-full max-w-[280px]">
                    {/* Background layers */}
                    {bgLayers.map((layer) => (
                        <polygon
                            key={layer}
                            points={statKeys
                                .map((_, i) => {
                                    const p = getPoint(i, layer);
                                    return `${p.x},${p.y}`;
                                })
                                .join(" ")}
                            fill="none"
                            stroke="var(--dark-border)"
                            strokeWidth="1"
                            opacity={0.3}
                        />
                    ))}

                    {/* Data polygon */}
                    <polygon
                        points={statKeys
                            .map((key, i) => {
                                const p = getPoint(i, stats[key]);
                                return `${p.x},${p.y}`;
                            })
                            .join(" ")}
                        fill="rgba(99,102,241,0.15)"
                        stroke="var(--primary)"
                        strokeWidth="2"
                    />

                    {/* Data points */}
                    {statKeys.map((key, i) => {
                        const p = getPoint(i, stats[key]);
                        return (
                            <circle
                                key={key}
                                cx={p.x}
                                cy={p.y}
                                r="4"
                                fill={colors[i]}
                                stroke="var(--dark)"
                                strokeWidth="2"
                            />
                        );
                    })}

                    {/* Labels */}
                    {statKeys.map((_, i) => {
                        const p = getPoint(i, 120);
                        return (
                            <text
                                key={i}
                                x={p.x}
                                y={p.y}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="text-[10px] fill-[var(--text-secondary)]"
                            >
                                {labels[i]}
                            </text>
                        );
                    })}
                </svg>
            </div>
        </Card>
    );
}
