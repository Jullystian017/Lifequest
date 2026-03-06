"use client";

import { 
  Sword, 
  Zap, 
  Target, 
  Trophy, 
  Skull, 
  Bot, 
  Users 
} from "lucide-react";

const features = [
  {
    title: "Quest System",
    description: "Break down your life goals into epic quests. Track progress and stay motivated with RPG-style milestones.",
    icon: <Sword className="text-[var(--primary)]" />,
    color: "var(--primary)",
  },
  {
    title: "XP & Progression",
    description: "Every action counts. Earn XP for your daily habits and watch your character level up in real-time.",
    icon: <Zap className="text-[var(--secondary)]" />,
    color: "var(--secondary)",
  },
  {
    title: "Habit Streaks",
    description: "Maintain consistency and build legendary streaks. The more consistent you are, the more powerful you become.",
    icon: <Target className="text-[var(--accent)]" />,
    color: "var(--accent)",
  },
  {
    title: "Epic Achievements",
    description: "Unlock unique badges and rare achievements as you conquer new heights in your personal development.",
    icon: <Trophy className="text-[var(--primary)]" />,
    color: "var(--primary)",
  },
  {
    title: "Boss Battles",
    description: "Face your biggest challenges as 'World Bosses'. Defeat them to earn legendary rewards and massive XP.",
    icon: <Skull className="text-[var(--health)]" />,
    color: "var(--health)",
  },
  {
    title: "AI Dungeon Master",
    description: "Let our AI analyze your goals and generate personalized quests that challenge and inspire you.",
    icon: <Bot className="text-[var(--knowledge)]" />,
    color: "var(--knowledge)",
  },
  {
    title: "Global Leaderboards",
    description: "Compete with other players worldwide. Rise through the ranks and prove your discipline to the world.",
    icon: <Users className="text-[var(--finance)]" />,
    color: "var(--finance)",
  }
];

export default function LandingFeatures() {
  return (
    <section id="features" className="py-32 bg-[var(--bg-main)] relative">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-24 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-semibold font-[family-name:var(--font-heading)] mb-6">
            Master Every Aspect of Your Life
          </h2>
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
            LifeQuest provides the ultimate toolkit for personal growth, 
            blending productivity with the mechanics of modern gaming.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group p-7 rounded-2xl bg-[var(--bg-card)]/30 border border-[var(--border-light)] hover:border-[var(--primary)]/30 hover:bg-[var(--bg-card)]/50 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110 shadow-lg"
                style={{ backgroundColor: `${feature.color}10` }}
              >
                {/* Scale down lucide icons by ensuring they don't grow too large */}
                <div className="scale-75">
                    {feature.icon}
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-3 text-white group-hover:text-[var(--primary-light)] transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
          
          {/* Multi-Purpose Card */}
          <div className="lg:col-span-2 p-7 rounded-2xl bg-gradient-to-br from-[var(--primary)]/5 to-transparent border border-[var(--border-light)] flex flex-col md:flex-row items-center gap-8 group">
            <div className="flex-1">
                <h3 className="text-xl font-semibold mb-3 text-white">Ready to Level Up?</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-6 leading-relaxed">
                    Join over 10,000 players who are already transforming their lives. 
                    Your journey starts with a single quest.
                </p>
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-1.5">
                         {[1,2,3].map(i => (
                            <img key={i} src={`https://i.pravatar.cc/100?u=feat${i}`} className="w-8 h-8 rounded-full border-2 border-[var(--bg-main)]" alt="user" />
                         ))}
                    </div>
                    <span className="text-xs font-semibold text-[var(--text-muted)] italic">+2.4k joined this week</span>
                </div>
            </div>
            <div className="w-full md:w-auto">
                 <button className="w-full px-6 py-3.5 bg-white text-black text-sm font-semibold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5">
                    Join the Guild
                 </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
