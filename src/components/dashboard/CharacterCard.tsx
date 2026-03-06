"use client";

import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import { getLevelTitle, getLevelColor } from "@/lib/gamification/levels";
import { CharacterStats } from "@/types/user";
import { Shield, Brain, Swords, Wallet, Palette } from "lucide-react";

interface CharacterCardProps {
  username: string;
  level: number;
  xp: number;
  xpToNext: number;
  stats: CharacterStats;
  avatarUrl?: string;
}

const statConfig: { 
  key: keyof CharacterStats; 
  label: string; 
  color: string; 
  icon: any;
  sublabel: string;
}[] = [
  { key: "health", label: "Health", color: "var(--health)", icon: Shield, sublabel: "Vitality" },
  { key: "knowledge", label: "Knowledge", color: "var(--knowledge)", icon: Brain, sublabel: "Lvl 5 Intel" },
  { key: "discipline", label: "Discipline", color: "var(--discipline)", icon: Swords, sublabel: "Combat Ready" },
  { key: "finance", label: "Finance", color: "var(--finance)", icon: Wallet, sublabel: "Wealthy" },
  { key: "creativity", label: "Creativity", color: "var(--creativity)", icon: Palette, sublabel: "Inspired" },
];

export default function CharacterCard({
  username,
  level,
  xp,
  xpToNext,
  stats,
  avatarUrl,
}: CharacterCardProps) {
  const levelTitle = getLevelTitle(level);
  const levelColor = getLevelColor(level);

  return (
    <Card className="relative overflow-hidden group">
      {/* Dynamic Background Glow */}
      <div 
        className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity"
        style={{ backgroundColor: levelColor }}
      />

      {/* Header with Avatar and Level */}
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-semibold shadow-lg transform transition-transform group-hover:rotate-3"
          style={{
            background: `linear-gradient(135deg, ${levelColor}, ${levelColor}CC)`,
            color: 'white',
            boxShadow: `0 8px 16px -4px ${levelColor}40`,
          }}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={username} className="w-full h-full rounded-2xl object-cover" />
          ) : (
            <span>{username.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div>
          <h3 className="text-xl font-semibold font-[family-name:var(--font-heading)] leading-none mb-2">
            {username}
          </h3>
          <div className="flex items-center gap-2">
            <Badge label={`Level ${level}`} color={levelColor} size="sm" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
              {levelTitle}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Breakdown */}
      <div className="space-y-4 relative z-10">
        <h4 className="text-[10px] font-semibold uppercase tracking-[2px] text-[var(--text-muted)] mb-2">
          Attribute Matrix
        </h4>
        <div className="grid grid-cols-1 gap-4">
          {statConfig.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.key} className="space-y-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="p-1 px-1.5 rounded-md" style={{ backgroundColor: `${stat.color}15` }}>
                       <Icon size={12} style={{ color: stat.color }} />
                    </div>
                    <span className="text-xs font-semibold">{stat.label}</span>
                  </div>
                  <span className="text-[10px] font-medium text-[var(--text-muted)]">
                    {stats[stat.key]}%
                  </span>
                </div>
                <ProgressBar
                  value={stats[stat.key]}
                  max={100}
                  color={stat.color}
                  height="sm"
                  animated
                />
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
