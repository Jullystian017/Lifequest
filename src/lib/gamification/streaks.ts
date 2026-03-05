/**
 * LifeQuest - Streak System
 */

/** Check if a streak is still active (within 24h window) */
export function isStreakActive(lastCompletedAt: string | null): boolean {
    if (!lastCompletedAt) return false;

    const last = new Date(lastCompletedAt);
    const now = new Date();
    const diffMs = now.getTime() - last.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    // Streak breaks after 36 hours (giving some grace period)
    return diffHours <= 36;
}

/** Calculate streak length from completion dates */
export function calculateStreak(completionDates: string[]): number {
    if (completionDates.length === 0) return 0;

    const sorted = completionDates
        .map((d) => new Date(d))
        .sort((a, b) => b.getTime() - a.getTime());

    let streak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastDate = new Date(sorted[0]);
    lastDate.setHours(0, 0, 0, 0);

    // Check if the most recent completion is today or yesterday
    const diffDays = Math.floor(
        (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays > 1) return 0;

    for (let i = 1; i < sorted.length; i++) {
        const current = new Date(sorted[i]);
        current.setHours(0, 0, 0, 0);
        const prev = new Date(sorted[i - 1]);
        prev.setHours(0, 0, 0, 0);

        const gap = Math.floor(
            (prev.getTime() - current.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (gap === 1) {
            streak++;
        } else if (gap > 1) {
            break;
        }
        // gap === 0 means same day, skip
    }

    return streak;
}

/** Get streak display emoji */
export function getStreakEmoji(streak: number): string {
    if (streak >= 30) return "🔥🔥🔥";
    if (streak >= 14) return "🔥🔥";
    if (streak >= 7) return "🔥";
    if (streak >= 3) return "⚡";
    return "✨";
}
