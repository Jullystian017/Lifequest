/**
 * LifeQuest - AI Quest Generator
 * Uses AI to generate personalized quest roadmaps based on user goals
 */

export interface GeneratedQuest {
    day: number;
    title: string;
    description: string;
    difficulty: "easy" | "medium" | "hard";
    xp_reward: number;
    stat_reward: string;
}

export interface QuestRoadmap {
    goal: string;
    quests: GeneratedQuest[];
    total_days: number;
    total_xp: number;
}

/**
 * Generate a quest roadmap from a user's goal using AI
 * This will call the backend API which interfaces with OpenAI
 */
export async function generateQuestRoadmap(
    goal: string,
    durationDays: number = 7
): Promise<QuestRoadmap> {
    try {
        const response = await fetch("/api/ai/generate-quests", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ goal, durationDays }),
        });

        if (!response.ok) {
            throw new Error("Failed to generate quests");
        }

        return await response.json();
    } catch (error) {
        console.error("AI Quest Generation error:", error);
        // Return fallback quests
        return generateFallbackQuests(goal, durationDays);
    }
}

/** Fallback quest generation (no AI needed) */
function generateFallbackQuests(
    goal: string,
    days: number
): QuestRoadmap {
    const quests: GeneratedQuest[] = [];

    for (let i = 1; i <= days; i++) {
        quests.push({
            day: i,
            title: `Day ${i} - Work on: ${goal}`,
            description: `Spend focused time on your goal: ${goal}`,
            difficulty: i <= 3 ? "easy" : i <= 5 ? "medium" : "hard",
            xp_reward: 50 + i * 10,
            stat_reward: "knowledge",
        });
    }

    return {
        goal,
        quests,
        total_days: days,
        total_xp: quests.reduce((sum, q) => sum + q.xp_reward, 0),
    };
}
