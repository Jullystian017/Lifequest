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
    workspace_id?: string;
    sprint_id?: string;
}

interface UserRow {
    id: string;
    total_xp: number;
    gold: number;
    level: number;
    stat_points: number;
    stats: Record<string, number>;
    class?: "frontend" | "backend" | "devops" | "fullstack";
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
    const { level: newLevel, xp, xpToNextLevel } = calcLevelFromTotalXp(newTotalXp);
    const newGold = (currentUser.gold || 0) + quest.coin_reward;
    
    // Award 3 stat points for each level up
    const levelGained = Math.max(0, newLevel - (currentUser.level || 1));
    const newStatPoints = (currentUser.stat_points || 0) + (levelGained * 3);

    const newStats = { ...currentUser.stats };
    for (const [key, value] of Object.entries(quest.stat_rewards ?? {})) {
        let finalBonus = value as number;
        
        // Apply class-specific bonuses
        if (currentUser.class === "frontend" && key === "creativity") finalBonus += 2;
        else if (currentUser.class === "backend" && key === "knowledge") finalBonus += 2;
        else if (currentUser.class === "devops" && key === "discipline") finalBonus += 2;
        else if (currentUser.class === "fullstack") finalBonus += 1;

        newStats[key] = Math.min(100, (newStats[key] || 0) + finalBonus);
    }

    // 3. Update user row
    const { error: userError } = await supabase
        .from("users")
        .update({
            total_xp: newTotalXp,
            xp: xp,
            level: newLevel,
            xp_to_next_level: xpToNextLevel,
            gold: newGold,
            stats: newStats,
            stat_points: newStatPoints,
        })
        .eq("id", userId);
    if (userError) throw userError;

    // 4. (Phase 3) Gamification: 20% Chance to spawn a Bug Monster in the workspace
    if (quest.workspace_id && Math.random() < 0.2) {
        await spawnBugMonster(quest.workspace_id).catch(console.error);
    }

    return { level: newLevel, xp, xpToNextLevel, gold: newGold, total_xp: newTotalXp };
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
    category?: string;
    status?: string;
    difficulty?: string;
    xp_reward: number;
    coin_reward: number;
    priority?: string;
    stat_rewards?: Record<string, number>;
    workspace_id?: string;
    sprint_id?: string;
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

export async function archiveQuest(questId: string) {
    const { error } = await supabase.from("quests").update({ is_archived: true }).eq("id", questId);
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

// ─── Stat Allocation ──────────────────────────────────────────────────────
export async function allocateStatPoint(userId: string, statKey: string, currentUser: UserRow) {
    if ((currentUser.stat_points || 0) <= 0) {
        throw new Error("Tidak ada poin statistik yang tersedia");
    }

    const currentVal = currentUser.stats[statKey] || 0;
    if (currentVal >= 100) {
        throw new Error("Statistik sudah mencapai batas maksimum (100)");
    }

    const newStats = {
        ...currentUser.stats,
        [statKey]: currentVal + 1
    };

    const { error } = await supabase
        .from("users")
        .update({
            stats: newStats,
            stat_points: currentUser.stat_points - 1
        })
        .eq("id", userId);

    if (error) throw error;
    return { newStats, newStatPoints: currentUser.stat_points - 1 };
}

// ─── Workspace Mutations ────────────────────────────────────────────────────
export async function createWorkspace(userId: string, name: string, description?: string) {
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const { data: workspace, error: wsError } = await supabase
        .from("workspaces")
        .insert({ name, description, created_by: userId, invite_code: inviteCode })
        .select()
        .single();
    if (wsError) throw wsError;

    // Auto-add creator as owner member
    const { error: memberError } = await supabase
        .from("workspace_members")
        .insert({ workspace_id: workspace.id, user_id: userId, role: "owner" });
    if (memberError) throw memberError;

    return workspace;
}

export async function joinWorkspaceByCode(userId: string, inviteCode: string) {
    // Find the workspace with this invite code
    const { data: workspace, error: findError } = await supabase
        .from("workspaces")
        .select("id")
        .eq("invite_code", inviteCode.toUpperCase())
        .single();
    if (findError) throw new Error("Kode undangan tidak ditemukan");

    // Check if already a member
    const { data: existing } = await supabase
        .from("workspace_members")
        .select("workspace_id")
        .eq("workspace_id", workspace.id)
        .eq("user_id", userId)
        .single();
    if (existing) throw new Error("Kamu sudah menjadi anggota workspace ini");

    // Join workspace
    const { error: joinError } = await supabase
        .from("workspace_members")
        .insert({ workspace_id: workspace.id, user_id: userId, role: "member" });
    if (joinError) throw joinError;

    return workspace;
}

export async function logActivityFeedEvent(
    workspaceId: string,
    userId: string,
    eventType: string,
    eventData: Record<string, any> = {}
) {
    const { error } = await supabase
        .from("team_activity_feed")
        .insert({ workspace_id: workspaceId, user_id: userId, event_type: eventType, event_data: eventData });
    if (error) console.error("Activity feed log error:", error);
}

// ─── Boss (Project) Mutations ───────────────────────────────────────────────
export async function createBoss(workspaceId: string, userId: string, data: {
    name: string;
    description?: string;
    max_hp: number;
}) {
    const { data: boss, error } = await supabase
        .from("bosses")
        .insert({
            workspace_id: workspaceId,
            created_by: userId,
            name: data.name,
            description: data.description ?? "",
            max_hp: data.max_hp,
            current_hp: data.max_hp,
            is_defeated: false,
            status: "active",
        })
        .select()
        .single();
    if (error) throw error;
    return boss;
}

export async function damageBoss(bossId: string, damage: number) {
    const { data: boss } = await supabase.from("bosses").select("current_hp, max_hp").eq("id", bossId).single();
    if (!boss) throw new Error("Boss tidak ditemukan");
    const newHp = Math.max(0, boss.current_hp - damage);
    const defeated = newHp <= 0;
    const { error } = await supabase
        .from("bosses")
        .update({
            current_hp: newHp,
            is_defeated: defeated,
            defeated_at: defeated ? new Date().toISOString() : null,
            status: defeated ? "defeated" : "active",
        })
        .eq("id", bossId);
    if (error) throw error;
    return { newHp, defeated };
}

// ─── AI Retro Mutations ─────────────────────────────────────────────────────
export async function saveWeeklyRetro(userId: string, retro: {
    week_start: string;
    week_end: string;
    quests_completed: number;
    quests_failed: number;
    habits_kept: number;
    burnout_risk: string;
    went_well: string;
    went_wrong: string;
    suggestions: string;
}) {
    const { data, error } = await supabase
        .from("ai_weekly_retros")
        .upsert({ user_id: userId, ...retro }, { onConflict: "user_id,week_start" })
        .select()
        .single();
    if (error) throw error;
    return data;
}

// ─── Sprints ────────────────────────────────────────────────────────────────
export async function createSprint(workspaceId: string, name: string, startDate: string, endDate: string) {
    const { data, error } = await supabase.from("sprints").insert({
        workspace_id: workspaceId,
        name,
        start_date: startDate,
        end_date: endDate,
        status: "active"
    }).select().single();
    if (error) throw error;
    return data;
}

// ─── Bug Monsters ────────────────────────────────────────────────────────────
export async function spawnBugMonster(workspaceId: string | null) {
    const bugTypes = ["syntax_error", "memory_leak", "infinite_loop", "null_pointer"];
    const bugNames = ["Syntax Serpent", "Memory Muncher", "Loop Leviathan", "Null Nibbler"];
    const randomIndex = Math.floor(Math.random() * bugTypes.length);
    
    const { data, error } = await supabase.from("bug_monsters").insert({
        workspace_id: workspaceId || null,
        name: bugNames[randomIndex],
        type: bugTypes[randomIndex],
        hp: 10,
        max_hp: 10,
        xp_reward: 50,
        coin_reward: 10,
        status: "active"
    }).select().single();
    
    if (error) console.error("Error spawning bug:", error);
    return data;
}

export async function damageBugMonster(bugId: string, damage: number, userId: string) {
    const { data: bug } = await supabase.from("bug_monsters").select("*").eq("id", bugId).single();
    if (!bug || bug.status !== "active") return null;

    const newHp = Math.max(0, bug.hp - damage);
    const squashed = newHp === 0;

    await supabase.from("bug_monsters").update({
        hp: newHp,
        status: squashed ? "squashed" : "active",
        squashed_at: squashed ? new Date().toISOString() : null
    }).eq("id", bugId);

    if (squashed) {
        // Reward the player who dealt the final blow
        const { data: user } = await supabase.from("users").select("xp, coins").eq("id", userId).single();
        if (user) {
            await supabase.from("users").update({
                xp: user.xp + bug.xp_reward,
                coins: user.coins + bug.coin_reward
            }).eq("id", userId);
        }
    }

    return { squashed, newHp, reward: squashed ? { xp: bug.xp_reward, coins: bug.coin_reward } : null };
}

// ─── Focus Sessions ──────────────────────────────────────────────────────────
export async function recordFocusSession(userId: string, durationMinutes: number, mode: "focus" | "break") {
    const { data, error } = await supabase
        .from("focus_sessions")
        .insert({
            user_id: userId,
            duration: durationMinutes,
            mode: mode,
        })
        .select()
        .single();
    if (error) throw error;
    return data;
}
