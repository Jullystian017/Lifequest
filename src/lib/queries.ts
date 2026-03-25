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

// ─── Quests ─────────────────────────────────────────────────────────────────
export const questsQueryKey = (userId: string) => ["quests", userId] as const;

export const fetchQuests = async (userId: string) => {
    const { data, error } = await supabase
        .from("quests")
        .select("*")
        .eq("user_id", userId)
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
