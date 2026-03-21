"use client";

import { motion } from "framer-motion";
import { useSkillTreeStore, SkillBranch, SkillNode } from "@/store/skillTreeStore";
import { useUserStatsStore } from "@/store/userStatsStore";
import {
  Eye,
  Brain,
  Zap,
  Sunrise,
  Clock,
  Shield,
  Lightbulb,
  Puzzle,
  Rocket,
  Dumbbell,
  Apple,
  Heart,
  Lock,
  ChevronRight,
  Sparkles,
  Star,
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  Eye, Brain, Zap, Sunrise, Clock, Shield, Lightbulb, Puzzle, Rocket, Dumbbell, Apple, Heart,
};

const BRANCH_CONFIG: Record<SkillBranch, { label: string; color: string; gradient: string; icon: any }> = {
  focus: { label: "Fokus", color: "text-cyan-400", gradient: "from-cyan-600/20 to-cyan-600/5", icon: Eye },
  discipline: { label: "Disiplin", color: "text-orange-400", gradient: "from-orange-600/20 to-orange-600/5", icon: Shield },
  creativity: { label: "Kreativitas", color: "text-purple-400", gradient: "from-purple-600/20 to-purple-600/5", icon: Lightbulb },
  health: { label: "Kesehatan", color: "text-emerald-400", gradient: "from-emerald-600/20 to-emerald-600/5", icon: Heart },
};

const BRANCH_BORDER: Record<SkillBranch, string> = {
  focus: "border-cyan-500/30 hover:border-cyan-500/50",
  discipline: "border-orange-500/30 hover:border-orange-500/50",
  creativity: "border-purple-500/30 hover:border-purple-500/50",
  health: "border-emerald-500/30 hover:border-emerald-500/50",
};

const BRANCH_GLOW: Record<SkillBranch, string> = {
  focus: "shadow-cyan-500/20",
  discipline: "shadow-orange-500/20",
  creativity: "shadow-purple-500/20",
  health: "shadow-emerald-500/20",
};

export default function SkillTreePage() {
  const { skills, upgradeSkill } = useSkillTreeStore();
  const { xp, addXp } = useUserStatsStore();

  const branches: SkillBranch[] = ["focus", "discipline", "creativity", "health"];

  const canUnlock = (skill: SkillNode) => {
    if (skill.level >= skill.maxLevel) return false;
    if (xp < skill.xpCost) return false;
    if (skill.requires) {
      const req = skills.find(s => s.id === skill.requires);
      if (!req || req.level === 0) return false;
    }
    return true;
  };

  const isLocked = (skill: SkillNode) => {
    if (skill.requires) {
      const req = skills.find(s => s.id === skill.requires);
      if (!req || req.level === 0) return true;
    }
    return false;
  };

  const handleUpgrade = (skill: SkillNode) => {
    if (!canUnlock(skill)) return;
    upgradeSkill(skill.id);
    addXp(-skill.xpCost); // spend XP
  };

  const totalUnlocked = skills.filter(s => s.level > 0).length;
  const totalSkills = skills.length;

  return (
    <div className="space-y-8 pb-20 w-full">
      {/* Header Stats */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
            {totalUnlocked}/{totalSkills} Skill Terbuka · {xp} XP Tersedia
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-light)]">
          <Sparkles size={14} className="text-[var(--secondary)]" />
          <span className="text-xs font-semibold text-slate-400">Gunakan XP untuk membuka skill baru</span>
        </div>
      </div>

      {/* Branch Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {branches.map((branch) => {
          const config = BRANCH_CONFIG[branch];
          const branchSkills = skills.filter(s => s.branch === branch);
          const unlockedCount = branchSkills.filter(s => s.level > 0).length;

          return (
            <motion.div
              key={branch}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-3xl bg-gradient-to-br ${config.gradient} border ${BRANCH_BORDER[branch]} relative overflow-hidden transition-all`}
            >
              {/* Branch Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl bg-black/20 border border-white/5 ${config.color}`}>
                    <config.icon size={20} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold ${config.color}`}>{config.label}</h3>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">{unlockedCount}/{branchSkills.length} Terbuka</p>
                  </div>
                </div>
              </div>

              {/* Skill Nodes */}
              <div className="space-y-3">
                {branchSkills.map((skill, idx) => {
                  const IconComp = ICON_MAP[skill.icon] || Star;
                  const locked = isLocked(skill);
                  const unlockable = canUnlock(skill);
                  const maxed = skill.level >= skill.maxLevel;

                  return (
                    <motion.div
                      key={skill.id}
                      whileHover={!locked ? { x: 4 } : {}}
                      className={`p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                        locked
                          ? "bg-black/10 border-white/5 opacity-50"
                          : maxed
                          ? `bg-black/20 ${BRANCH_BORDER[branch]} shadow-lg ${BRANCH_GLOW[branch]}`
                          : `bg-black/20 border-white/5 hover:border-white/10`
                      }`}
                    >
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                        locked ? "bg-black/20 border-white/5 text-slate-600" :
                        maxed ? `bg-black/30 border-white/10 ${config.color}` :
                        `bg-black/20 border-white/5 ${config.color}`
                      }`}>
                        {locked ? <Lock size={16} /> : <IconComp size={18} />}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-sm font-semibold ${locked ? "text-slate-600" : "text-white"}`}>{skill.name}</span>
                          {skill.level > 0 && (
                            <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${config.color} bg-black/20`}>
                              Lv.{skill.level}/{skill.maxLevel}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 truncate">{skill.description}</p>
                        {!maxed && !locked && (
                          <p className="text-[9px] text-slate-600 mt-1 font-semibold">Biaya: {skill.xpCost} XP</p>
                        )}
                      </div>

                      {/* Action */}
                      <div className="shrink-0">
                        {maxed ? (
                          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">MAX</span>
                        ) : locked ? (
                          <Lock size={14} className="text-slate-600" />
                        ) : (
                          <button
                            onClick={() => handleUpgrade(skill)}
                            disabled={!unlockable}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                              unlockable
                                ? `bg-[var(--primary)] text-white hover:opacity-90 shadow-lg shadow-[var(--primary)]/20`
                                : "bg-black/20 text-slate-600 cursor-not-allowed"
                            }`}
                          >
                            {skill.level === 0 ? "Buka" : "Upgrade"}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}

                {/* Connection Lines (visual) */}
                {idx < branchSkills.length - 1 && (
                  <div className="flex justify-center">
                    <ChevronRight size={14} className="text-slate-700 rotate-90" />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
