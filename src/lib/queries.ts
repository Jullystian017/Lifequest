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
        .select("id, username, level, xp")
        .order("xp", { ascending: false })
        .limit(100);
    if (error) throw error;
    
    // Map data to add rank
    return (data || []).map((user, index) => ({
        ...user,
        rank: index + 1,
        // Mock rank change and streak since they aren't directly on user table
        rankChange: 'same' as const,
        rankChangeValue: 0,
        streak: 0,
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

export const fetchWorkspaceInvite = async (inviteCode: string) => {
    const { data, error } = await supabase
        .from("workspace_invites")
        .select("*, workspaces(*)")
        .eq("invite_code", inviteCode)
        .single();
    if (error) throw error;
    return data;
};

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

