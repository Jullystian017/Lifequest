import { createClient } from "@/lib/supabase/client";
import { useUserStatsStore } from "@/store/userStatsStore";

/**
 * Sync the current user stats (xp, gold, level, xpToNextLevel) to Supabase `users` table.
 * Call this after any action that changes XP, gold, or level (quest completion, shop purchase, etc.)
 */
export async function syncUserStatsToSupabase() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const state = useUserStatsStore.getState();

    await supabase.from("users").upsert({
        id: user.id,
        username: state.username,
        avatar_url: state.avatar_url,
        level: state.level,
        xp: state.xp,
        xp_to_next_level: state.xpToNextLevel,
        gold: state.coins,
        updated_at: new Date().toISOString(),
    }, { onConflict: "id" });
}
