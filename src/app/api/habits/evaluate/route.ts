import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        // Client can pass their current local date string (YYYY-MM-DD)
        const clientDate = body.clientDate || new Date().toISOString().split("T")[0];

        const supabase = await createServerClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 1. Fetch habits
        const { data: habits, error: fetchError } = await supabase
            .from("habits")
            .select("*")
            .eq("user_id", user.id);

        if (fetchError) throw fetchError;
        if (!habits || habits.length === 0) {
            return NextResponse.json({ success: true, message: "No habits to evaluate" });
        }

        const updates: any[] = [];

        for (const habit of habits) {
            // Already evaluated today?
            if (habit.last_evaluated_at === clientDate) {
                continue;
            }

            let newStreak = habit.current_streak || 0;
            
            // Check if streak is broken
            if (habit.last_completed_at) {
                const completionDate = new Date(habit.last_completed_at);
                const evaluationDate = new Date(clientDate);
                
                // Simple day difference by stripping time
                const cDateStr = completionDate.toISOString().split("T")[0];
                const cleanCompletionDate = new Date(cDateStr);
                const cleanEvaluationDate = new Date(clientDate);
                
                const timeDiff = cleanEvaluationDate.getTime() - cleanCompletionDate.getTime();
                const diffDays = Math.floor(timeDiff / (1000 * 3600 * 24));
                
                // If the habit was completed more than 1 day ago, the streak is broken
                if (diffDays > 1) {
                    newStreak = 0;
                }
            } else {
                // If it was never completed, but we are evaluating it on a new day, should we reset?
                // Usually, yes, if it's not the first day
                if (habit.last_evaluated_at) {
                     newStreak = 0;
                }
            }

            updates.push({
                id: habit.id,
                current_streak: newStreak,
                completed_today: false,
                last_evaluated_at: clientDate,
            });
        }

        if (updates.length > 0) {
            // Update individually to prevent partial overwrite issues 
            await Promise.all(
               updates.map(upd => 
                   supabase.from("habits").update({
                       current_streak: upd.current_streak,
                       completed_today: upd.completed_today,
                       last_evaluated_at: upd.last_evaluated_at
                   }).eq("id", upd.id)
               )
            );
            
            return NextResponse.json({ success: true, evaluated: updates.length });
        }

        return NextResponse.json({ success: true, evaluated: 0 });

    } catch (error) {
        console.error("Error evaluating habits:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
