import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

// ─── Level calculation from total accumulated XP ──────────────────────────
export function calcLevelFromTotalXp(totalXp: number) {
    let level = 1;
    let threshold = 100;
    let remaining = totalXp;
    while (remaining >= threshold) {
        remaining -= threshold;
        level++;
        threshold = Math.floor(threshold * 1.1);
    }
    return { level, xp: remaining, xpToNextLevel: threshold };
}

// ─── Complete Quest ───────────────────────────────────────────────────────
interface Quest {
    id: string;
    xp_reward: number;
    coin_reward: number;
    stat_rewards?: Record<string, number>;
}

interface UserRow {
    id: string;
    total_xp: number;
    gold: number;
    stats: Record<string, number>;
}

export async function completeQuest(userId: string, quest: Quest, currentUser: UserRow) {
    // 1. Mark quest as completed
    const { error: questError } = await supabase
        .from("quests")
        .update({ is_completed: true, completed_at: new Date().toISOString() })
        .eq("id", quest.id);
    if (questError) throw questError;

    // 2. Compute new user stats
    const newTotalXp = (currentUser.total_xp || 0) + quest.xp_reward;
    const { level, xp, xpToNextLevel } = calcLevelFromTotalXp(newTotalXp);
    const newGold = (currentUser.gold || 0) + quest.coin_reward;

    const newStats = { ...currentUser.stats };
    for (const [key, value] of Object.entries(quest.stat_rewards ?? {})) {
        newStats[key] = Math.min(100, (newStats[key] || 0) + (value as number));
    }

    // 3. Update user row
    const { error: userError } = await supabase
        .from("users")
        .update({
            total_xp: newTotalXp,
            xp: xp,
            level,
            xp_to_next_level: xpToNextLevel,
            gold: newGold,
            stats: newStats,
        })
        .eq("id", userId);
    if (userError) throw userError;

    return { level, xp, xpToNextLevel, gold: newGold, total_xp: newTotalXp };
}

// ─── Complete Quest (Penalty — no proof) ─────────────────────────────────
export async function completeQuestPenalty(userId: string, quest: Quest, currentUser: UserRow) {
    return completeQuest(userId, {
        ...quest,
        xp_reward: Math.round(quest.xp_reward * 0.5),
        coin_reward: Math.round(quest.coin_reward * 0.5),
        stat_rewards: {},
    }, currentUser);
}

// ─── Complete Quest (Bonus — with verified proof) ────────────────────────
export async function completeQuestBonus(userId: string, quest: Quest, currentUser: UserRow) {
    const bonusXp = Math.round(quest.xp_reward * 0.2);
    return completeQuest(userId, {
        ...quest,
        xp_reward: quest.xp_reward + bonusXp,
    }, currentUser);
}

// ─── Buy Item from Shop ───────────────────────────────────────────────────
export async function buyItem(userId: string, itemId: string, itemCategory: string, price: number, currentGold: number) {
    if (currentGold < price) throw new Error("Gold tidak cukup");

    // 1. Insert into inventory
    const { error: invError } = await supabase
        .from("user_inventory")
        .insert({ user_id: userId, item_id: itemId, item_category: itemCategory });
    if (invError) throw invError;

    // 2. Deduct gold from user
    const { error: userError } = await supabase
        .from("users")
        .update({ gold: currentGold - price })
        .eq("id", userId);
    if (userError) throw userError;

    return { newGold: currentGold - price };
}

// ─── Update User Profile ──────────────────────────────────────────────────
export async function updateUserProfile(userId: string, updates: { username?: string; avatar_url?: string }) {
    const { error } = await supabase
        .from("users")
        .update({ ...updates })
        .eq("id", userId);
    if (error) throw error;
}

// ─── Create Quest ─────────────────────────────────────────────────────────
export async function createQuest(userId: string, quest: {
    title: string;
    description?: string;
    type?: string;
    difficulty?: string;
    xp_reward: number;
    coin_reward: number;
    priority?: string;
}) {
    const { data, error } = await supabase
        .from("quests")
        .insert({ ...quest, user_id: userId })
        .select()
        .single();
    if (error) throw error;
    return data;
}

// ─── Delete Quest ─────────────────────────────────────────────────────────
export async function deleteQuest(questId: string) {
    const { error } = await supabase.from("quests").delete().eq("id", questId);
    if (error) throw error;
}

// ─── Update Quest (kanban status, etc.) ───────────────────────────────────
export async function updateQuestStatus(questId: string, status: string) {
    const { error } = await supabase.from("quests").update({ status }).eq("id", questId);
    if (error) throw error;
}

// ─── Note CRUD ────────────────────────────────────────────────────────────
export async function createNote(userId: string, note: { title: string; content: string; folder?: string; tags?: string[] }) {
    const { data, error } = await supabase
        .from("notes")
        .insert({ ...note, user_id: userId })
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function updateNote(noteId: string, updates: { title?: string; content?: string; folder?: string; tags?: string[] }) {
    const { error } = await supabase
        .from("notes")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", noteId);
    if (error) throw error;
}

export async function deleteNote(noteId: string) {
    const { error } = await supabase.from("notes").delete().eq("id", noteId);
    if (error) throw error;
}

// ─── Add XP and Individual Stat ──────────────────────────────────────────
export async function addXpAndStat(userId: string, xpGained: number, statName: string, statValue: number, currentUser: UserRow) {
    const newTotalXp = (currentUser.total_xp || 0) + xpGained;
    const { level, xp, xpToNextLevel } = calcLevelFromTotalXp(newTotalXp);
    
    const newStats = { ...currentUser.stats };
    newStats[statName] = Math.min(100, (newStats[statName] || 0) + statValue);

    const { error } = await supabase
        .from("users")
        .update({
            total_xp: newTotalXp,
            xp: xp,
            level,
            xp_to_next_level: xpToNextLevel,
            stats: newStats
        })
        .eq("id", userId);
    
    if (error) throw error;
    return { level, xp, xpToNextLevel, total_xp: newTotalXp };
}

// ─── Goal CRUD ────────────────────────────────────────────────────────────
export async function createGoal(userId: string, goal: {
    title: string;
    description?: string;
    category: string;
    priority: string;
    xp_reward: number;
    stat_rewards: Record<string, number>;
}, milestones: string[]) {
    // 1. Insert goal
    const { data: goalData, error: goalError } = await supabase
        .from("goals")
        .insert({ ...goal, user_id: userId })
        .select()
        .single();
    
    if (goalError) throw goalError;

    // 2. Insert milestones
    const milestoneInserts = milestones.map((title, index) => ({
        goal_id: goalData.id,
        title,
        order: index,
        is_completed: false
    }));

    const { error: msError } = await supabase.from("milestones").insert(milestoneInserts);
    if (msError) throw msError;

    return goalData;
}

export async function toggleMilestone(userId: string, milestoneId: string, isCompleted: boolean, currentUser: UserRow) {
    // 1. Update milestone
    const { data: milestone, error: mError } = await supabase
        .from("milestones")
        .update({ is_completed: isCompleted })
        .eq("id", milestoneId)
        .select("goal_id")
        .single();
    
    if (mError) throw mError;

    // 2. Fetch all milestones to check if goal is complete
    const { data: allMilestones, error: amError } = await supabase
        .from("milestones")
        .select("is_completed")
        .eq("goal_id", milestone.goal_id);
    
    if (amError) throw amError;

    const allCompletedNow = allMilestones.every(m => m.is_completed);

    // 3. If just completed, award rewards
    if (allCompletedNow && isCompleted) {
        const { data: goal, error: gError } = await supabase
            .from("goals")
            .select("xp_reward, stat_rewards")
            .eq("id", milestone.goal_id)
            .single();
        
        if (gError) throw gError;

        // Apply XP and first stat reward for simplicity in this helper
        const firstStat = Object.keys(goal.stat_rewards || {})[0] || "discipline";
        const firstAmt = (goal.stat_rewards || {})[firstStat] || 5;

        return addXpAndStat(userId, goal.xp_reward, firstStat, firstAmt, currentUser);
    }

    return { allCompleted: allCompletedNow };
}

// ─── AI Chat Mutations ────────────────────────────────────────────────────
export async function createChat(userId: string, title: string) {
    const { data, error } = await supabase
        .from("ai_chats")
        .insert({ user_id: userId, title })
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function addChatMessage(chatId: string, role: "user" | "assistant", content: string) {
    const { data, error } = await supabase
        .from("ai_messages")
        .insert({ chat_id: chatId, role, content })
        .select()
        .single();
    if (error) throw error;

    // Update the parent's updated_at as well
    await supabase.from("ai_chats").update({ updated_at: new Date().toISOString() }).eq("id", chatId);
    return data;
}

export async function deleteChat(chatId: string) {
    const { error } = await supabase.from("ai_chats").delete().eq("id", chatId);
    if (error) throw error;
}
