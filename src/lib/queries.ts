import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

// ─── Helper: get current user ID ───────────────────────────────────────────
export async function getCurrentUserId(): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Tidak terautentikasi");
    return user.id;
}

// ─── User ───────────────────────────────────────────────────────────────────
export const userQueryKey = (userId: string) => ["user", userId] as const;

export const fetchUser = async (userId: string) => {
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();
    if (error) throw error;
    return data;
};

// ─── Leaderboard ────────────────────────────────────────────────────────────
export const leaderboardQueryKey = () => ["leaderboard"] as const;

export const fetchLeaderboard = async () => {
    const { data, error } = await supabase
        .from("users")
        .select("id, username, level, xp, total_xp, streak, highest_streak")
        .order("total_xp", { ascending: false })
        .limit(100);
    if (error) throw error;
    
    // Map data to add rank
    return (data || []).map((user, index) => ({
        ...user,
        rank: index + 1,
        rankChange: 'same' as const, // For now, we don't have historical rank data
        rankChangeValue: 0,
    }));
};

export const fetchWorkspaceLeaderboard = async (workspaceId: string) => {
    // 1. Get all user IDs in this workspace
    const { data: members, error: mError } = await supabase
        .from("workspace_members")
        .select("user_id")
        .eq("workspace_id", workspaceId);
    
    if (mError) throw mError;
    const userIds = members.map(m => m.user_id);

    // 2. Fetch those users and sort
    const { data, error } = await supabase
        .from("users")
        .select("id, username, level, xp, total_xp, streak, highest_streak")
        .in("id", userIds)
        .order("total_xp", { ascending: false });
    
    if (error) throw error;

    return (data || []).map((user, index) => ({
        ...user,
        rank: index + 1,
        rankChange: 'same' as const,
        rankChangeValue: 0,
    }));
};

// ─── Quests ─────────────────────────────────────────────────────────────────
export const questsQueryKey = (userId: string) => ["quests", userId] as const;

export const fetchQuests = async (userId: string) => {
    const { data, error } = await supabase
        .from("quests")
        .select("*")
        .eq("user_id", userId)
        .is("workspace_id", null)
        .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
};

// ─── Habits ─────────────────────────────────────────────────────────────────
export const habitsQueryKey = (userId: string) => ["habits", userId] as const;

export const fetchHabits = async (userId: string) => {
    const { data, error } = await supabase
        .from("habits")
        .select("*")
        .eq("user_id", userId);
    if (error) throw error;
    return data ?? [];
};

// ─── Notes ──────────────────────────────────────────────────────────────────
export const notesQueryKey = (userId: string) => ["notes", userId] as const;

export const fetchNotes = async (userId: string) => {
    const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
};

// ─── Inventory ───────────────────────────────────────────────────────────────
export const inventoryQueryKey = (userId: string) => ["inventory", userId] as const;

export const fetchInventory = async (userId: string) => {
    const { data, error } = await supabase
        .from("user_inventory")
        .select("*")
        .eq("user_id", userId);
    if (error) throw error;
    return data ?? [];
};

// ─── Achievements ────────────────────────────────────────────────────────────
export const achievementsQueryKey = () => ["achievements"] as const;
export const userAchievementsQueryKey = (userId: string) => ["user_achievements", userId] as const;

export const fetchAchievements = async () => {
    const { data, error } = await supabase.from("achievements").select("*");
    if (error) throw error;
    return data ?? [];
};

export const fetchUserAchievements = async (userId: string) => {
    const { data, error } = await supabase
        .from("user_achievements")
        .select("*")
        .eq("user_id", userId);
    if (error) throw error;
    return data ?? [];
};

// ─── Goals ──────────────────────────────────────────────────────────────────
export const goalsQueryKey = (userId: string) => ["goals", userId] as const;

export const fetchGoals = async (userId: string) => {
    const { data, error } = await supabase
        .from("goals")
        .select("*, milestones(*)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
    
    if (error) throw error;
    
    // Sort milestones by order
    const goalsWithSortedMilestones = (data ?? []).map(goal => ({
        ...goal,
        milestones: (goal.milestones ?? []).sort((a: any, b: any) => a.order - b.order)
    }));
    
    return goalsWithSortedMilestones;
};

// ─── AI Chat ────────────────────────────────────────────────────────────────
export const chatsQueryKey = (userId: string) => ["chats", userId] as const;
export const chatMessagesQueryKey = (chatId: string) => ["chat_messages", chatId] as const;

export const fetchChats = async (userId: string) => {
    const { data, error } = await supabase
        .from("ai_chats")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
};

export const fetchChatMessages = async (chatId: string) => {
    const { data, error } = await supabase
        .from("ai_messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true });
    if (error) throw error;
    return data ?? [];
};

// ─── Workspaces ─────────────────────────────────────────────────────────────
export const workspacesQueryKey = (userId: string) => ["workspaces", userId] as const;
export const workspaceMembersQueryKey = (workspaceId: string) => ["workspace_members", workspaceId] as const;
export const workspaceActivityQueryKey = (workspaceId: string) => ["workspace_activity", workspaceId] as const;
export const teamStatsQueryKey = (workspaceId: string) => ["team_stats", workspaceId] as const;
export const workspaceLeaderboardQueryKey = (workspaceId: string) => ["workspace_leaderboard", workspaceId] as const;
export const memberProfileQueryKey = (userId: string) => ["member_profile", userId] as const;
export const memberRecentQuestsQueryKey = (userId: string, workspaceId: string) => ["member_recent_quests", userId, workspaceId] as const;

export const fetchUserWorkspaces = async (userId: string) => {
    const { data, error } = await supabase
        .from("workspace_members")
        .select("workspace_id, role, workspaces(*)")
        .eq("user_id", userId);
    if (error) throw error;
    return (data ?? []).map((row: any) => ({ ...row.workspaces, myRole: row.role }));
};

export const fetchWorkspaceById = async (workspaceId: string) => {
    const { data, error } = await supabase
        .from("workspaces")
        .select("*")
        .eq("id", workspaceId)
        .single();
    if (error) throw error;
    return data;
};

export const fetchWorkspaceMembers = async (workspaceId: string) => {
    const { data, error } = await supabase
        .from("workspace_members")
        .select("*, users(id, username, level, avatar_url, class)")
        .eq("workspace_id", workspaceId)
        .order("joined_at", { ascending: true });
    if (error) throw error;
    return data ?? [];
};

export const fetchWorkspaceActivity = async (workspaceId: string) => {
    const { data, error } = await supabase
        .from("team_activity_feed")
        .select("*, users(username, avatar_url, class)")
        .eq("workspace_id", workspaceId)
        .order("created_at", { ascending: false })
        .limit(50);
    if (error) throw error;
    return data ?? [];
};

export const fetchTeamStats = async (workspaceId: string) => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); // Sunday
    weekStart.setHours(0, 0, 0, 0);

    // Get all members
    const { data: members } = await supabase
        .from("workspace_members")
        .select("user_id, users(id, username, level, total_xp, streak, class)")
        .eq("workspace_id", workspaceId);

    const memberIds = (members ?? []).map((m: any) => m.user_id);

    // Quests completed this week in this workspace
    const { data: weekQuests } = await supabase
        .from("quests")
        .select("user_id, xp_reward")
        .eq("workspace_id", workspaceId)
        .eq("is_completed", true)
        .gte("completed_at", weekStart.toISOString());

    // All completed quests total
    const { data: allQuests } = await supabase
        .from("quests")
        .select("user_id, xp_reward, is_completed")
        .eq("workspace_id", workspaceId)
        .eq("is_completed", true);

    const weekQuestsCount = (weekQuests ?? []).length;
    const weekXpGained = (weekQuests ?? []).reduce((sum: number, q: any) => sum + (q.xp_reward ?? 0), 0);

    // Most active member this week
    const questCountByUser: Record<string, number> = {};
    for (const q of (weekQuests ?? [])) {
        questCountByUser[q.user_id] = (questCountByUser[q.user_id] ?? 0) + 1;
    }

    let mostActiveUser: any = null;
    let maxQuests = 0;
    for (const m of (members ?? [])) {
        const count = questCountByUser[(m as any).user_id] ?? 0;
        if (count > maxQuests) {
            maxQuests = count;
            mostActiveUser = (m as any).users;
        }
    }

    // Highest streak in team
    const highestStreak = Math.max(0, ...(members ?? []).map((m: any) => m.users?.streak ?? 0));
    const totalTeamXp = (members ?? []).reduce((sum: number, m: any) => sum + (m.users?.total_xp ?? 0), 0);
    const activeMembers = Object.keys(questCountByUser).length;

    return {
        weekQuestsCount,
        weekXpGained,
        totalTeamXp,
        highestStreak,
        activeMembers,
        totalMembers: memberIds.length,
        mostActiveUser,
        mostActiveUserQuestCount: maxQuests,
        totalQuestsEver: (allQuests ?? []).length,
    };
};

export const fetchMemberProfile = async (userId: string) => {
    const { data, error } = await supabase
        .from("users")
        .select("id, username, avatar_url, level, total_xp, xp, xp_to_next_level, streak, highest_streak, class, stats, created_at")
        .eq("id", userId)
        .single();
    if (error) throw error;
    return data;
};

export const fetchMemberRecentQuests = async (userId: string, workspaceId: string) => {
    const { data, error } = await supabase
        .from("quests")
        .select("id, title, difficulty, xp_reward, is_completed, completed_at, created_at")
        .eq("user_id", userId)
        .eq("workspace_id", workspaceId)
        .order("created_at", { ascending: false })
        .limit(5);
    if (error) throw error;
    return data ?? [];
};

export const fetchWeeklyTeamReport = async (workspaceId: string) => {
    const now = new Date();
    // This week
    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(now.getDate() - 6);
    thisWeekStart.setHours(0, 0, 0, 0);
    // Last week
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);

    const { data: members } = await supabase
        .from("workspace_members")
        .select("user_id, users(id, username, class)")
        .eq("workspace_id", workspaceId);

    const { data: completedQuests } = await supabase
        .from("quests")
        .select("user_id, xp_reward, completed_at, title, difficulty")
        .eq("workspace_id", workspaceId)
        .eq("is_completed", true)
        .gte("completed_at", thisWeekStart.toISOString())
        .order("completed_at", { ascending: false });

    const { data: lastWeekQuests } = await supabase
        .from("quests")
        .select("user_id, xp_reward")
        .eq("workspace_id", workspaceId)
        .eq("is_completed", true)
        .gte("completed_at", lastWeekStart.toISOString())
        .lt("completed_at", thisWeekStart.toISOString());

    const questsByUser: Record<string, { count: number; xp: number; user: any }> = {};
    for (const m of (members ?? [])) {
        const u = (m as any).users;
        questsByUser[u.id] = { count: 0, xp: 0, user: u };
    }
    for (const q of (completedQuests ?? [])) {
        if (questsByUser[q.user_id]) {
            questsByUser[q.user_id].count++;
            questsByUser[q.user_id].xp += q.xp_reward ?? 0;
        }
    }

    const contributorRanking = Object.values(questsByUser)
        .sort((a, b) => b.count - a.count);

    const totalQuestsThisWeek = (completedQuests ?? []).length;
    const totalQuestsLastWeek = (lastWeekQuests ?? []).length;
    const totalXpThisWeek = (completedQuests ?? []).reduce((sum: number, q: any) => sum + (q.xp_reward ?? 0), 0);

    // Activity by day of week
    const dayLabels = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
    const activityByDay = Array(7).fill(0);
    for (const q of (completedQuests ?? [])) {
        const d = new Date(q.completed_at);
        const dayIdx = (d.getDay() + 6) % 7; // Mon=0
        activityByDay[dayIdx]++;
    }

    return {
        totalQuestsThisWeek,
        totalQuestsLastWeek,
        questGrowth: totalQuestsLastWeek > 0
            ? Math.round(((totalQuestsThisWeek - totalQuestsLastWeek) / totalQuestsLastWeek) * 100)
            : totalQuestsThisWeek > 0 ? 100 : 0,
        totalXpThisWeek,
        contributorRanking,
        recentCompletions: (completedQuests ?? []).slice(0, 10),
        activityByDay,
        dayLabels,
        weekStart: thisWeekStart.toLocaleDateString("id-ID", { day: "numeric", month: "long" }),
        weekEnd: now.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
    };
};

export const weeklyReportQueryKey = (workspaceId: string) => ["weekly_report", workspaceId] as const;

export const fetchWorkspaceInvite = async (inviteCode: string) => {
    const { data, error } = await supabase
        .from("workspace_invites")
        .select("*, workspaces(*)")
        .eq("invite_code", inviteCode)
        .single();
    if (error) throw error;
    return data;
};

export const fetchWorkspaceBoardQuests = async (workspaceId: string, sprintId: string | null) => {
    let query = supabase
        .from("quests")
        .select(`
            *,
            creator:user_id(id, username, avatar_url, class),
            assignee:assignee_id(id, username, avatar_url, class)
        `)
        .eq("workspace_id", workspaceId);
    
    if (sprintId) {
        query = query.eq("sprint_id", sprintId);
    } else {
        // Backlog: only show quests without a sprint
        // Actually, the user might want to see EVERYTHING in the workspace if they select "All Quests"
        // But let's check the current behavior.
    }
    
    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
};

export const boardQuestsQueryKey = (workspaceId: string | undefined, sprintId: string | null | undefined) => ["workspaces", workspaceId, "board-quests", sprintId];

// ─── Bosses ──────────────────────────────────────────────────────────────────
export const bossesQueryKey = (workspaceId: string) => ["bosses", workspaceId] as const;

export const fetchWorkspaceBosses = async (workspaceId: string) => {
    const { data, error } = await supabase
        .from("bosses")
        .select("*")
        .eq("workspace_id", workspaceId)
        .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
};

// ─── AI Retros ───────────────────────────────────────────────────────────────
export const retrosQueryKey = (userId: string) => ["retros", userId] as const;

export const fetchUserRetros = async (userId: string) => {
    const { data, error } = await supabase
        .from("ai_weekly_retros")
        .select("*")
        .eq("user_id", userId)
        .order("week_start", { ascending: false })
        .limit(10);
    if (error) throw error;
    return data ?? [];
};

// ─── Sprints ─────────────────────────────────────────────────────────────────
export const sprintsQueryKey = (workspaceId: string) => ["sprints", workspaceId] as const;

export const fetchWorkspaceSprints = async (workspaceId: string) => {
    const { data, error } = await supabase
        .from("sprints")
        .select("*")
        .eq("workspace_id", workspaceId)
        .order("start_date", { ascending: false });
    if (error) throw error;
    return data ?? [];
};

// ─── Bug Monsters ────────────────────────────────────────────────────────────
export const bugMonstersQueryKey = (workspaceId: string) => ["bugMonsters", workspaceId] as const;

export const fetchWorkspaceBugs = async (workspaceId: string) => {
    const { data, error } = await supabase
        .from("bug_monsters")
        .select("*")
        .eq("workspace_id", workspaceId)
        .eq("status", "active")
        .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
};

// ─── Focus Sessions ──────────────────────────────────────────────────────────
export const focusSessionsQueryKey = (userId: string) => ["focusSessions", userId] as const;

export const fetchFocusSessions = async (userId: string) => {
    const { data, error } = await supabase
        .from("focus_sessions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
};


// ─── Notifications ──────────────────────────────────────────────────────────
export const notificationsQueryKey = (userId: string) => ["notifications", userId] as const;

export const fetchNotifications = async (userId: string) => {
    const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
};
