import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--dark)] flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-3xl mx-auto">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] mb-6 shadow-lg shadow-[var(--primary)]/20 animate-float">
            <span className="text-4xl">⚔️</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold font-[family-name:var(--font-heading)] mb-4">
            <span className="bg-gradient-to-r from-[var(--primary-light)] via-[var(--secondary)] to-[var(--accent)] bg-clip-text text-transparent">
              LifeQuest
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-[var(--text-secondary)] mb-2 font-medium">
            Turn Your Life Into a Game
          </p>

          <p className="text-sm text-[var(--text-muted)] mb-8 max-w-md mx-auto">
            Coding Your Life, Leveling Your Future. Transform your daily activities
            into RPG quests, earn XP, level up, and unlock achievements.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/register"
              className="px-8 py-3 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-medium rounded-xl transition-all duration-200 active:scale-95 shadow-lg shadow-[var(--primary)]/20"
            >
              Start Your Quest
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 bg-transparent hover:bg-[var(--dark-surface)] text-[var(--text-secondary)] font-medium rounded-xl border border-[var(--dark-border)] transition-all duration-200 active:scale-95"
            >
              Log In
            </Link>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-12">
            {[
              "⚔️ Quest System",
              "📊 XP & Levels",
              "🔥 Habit Streaks",
              "🏆 Achievements",
              "💀 Boss Challenges",
              "👑 Leaderboard",
              "🤖 AI Quests",
            ].map((feature) => (
              <span
                key={feature}
                className="px-4 py-2 rounded-full bg-[var(--dark-secondary)] border border-[var(--dark-border)] text-sm text-[var(--text-secondary)]"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[var(--dark-border)] py-4 text-center text-xs text-[var(--text-muted)]">
        © {new Date().getFullYear()} LifeQuest — Coding Your Life, Leveling Your Future.
      </footer>
    </div>
  );
}
