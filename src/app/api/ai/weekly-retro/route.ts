import { NextResponse } from "next/server";

const RETRO_SYSTEM_PROMPT = `You are a developer productivity coach for LifeQuest, a gamified developer workspace.
Analyze the developer's weekly performance data and return a JSON retrospective report.

Return ONLY valid JSON with this schema:
{
  "burnout_risk": "low" | "medium" | "high",
  "went_well": "2-3 sentences about positive achievements",
  "went_wrong": "2-3 sentences about struggles or missed targets",
  "suggestions": "2-3 actionable recommendations for next week"
}

Rules:
- Write all text content in Indonesian
- Be specific and reference the data provided
- burnout_risk is high if completion rate < 40% or streak < 2 days
- burnout_risk is medium if completion rate < 65%
- burnout_risk is low otherwise
- Do NOT include markdown, backticks, or any text outside the JSON object`;

export async function POST(req: Request) {
  try {
    const {
      userId,
      questsCompleted,
      questsTotal,
      habitsKept,
      habitsTotal,
      currentStreak,
      weekStart,
      weekEnd,
    } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const completionRate = questsTotal > 0 ? Math.round((questsCompleted / questsTotal) * 100) : 0;
    const habitRate = habitsTotal > 0 ? Math.round((habitsKept / habitsTotal) * 100) : 0;

    const prompt = `Analyze this developer's week (${weekStart} to ${weekEnd}):
- Quests completed: ${questsCompleted}/${questsTotal} (${completionRate}% completion rate)
- Habits kept: ${habitsKept}/${habitsTotal} (${habitRate}% habit rate)
- Current streak: ${currentStreak} days

Generate their weekly retrospective.`;

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || apiKey === "your-groq-api-key") {
      // Mock response
      const burnoutRisk = completionRate < 40 ? "high" : completionRate < 65 ? "medium" : "low";
      return NextResponse.json({
        burnout_risk: burnoutRisk,
        went_well: `Kamu berhasil menyelesaikan ${questsCompleted} dari ${questsTotal} quest minggu ini. Kebiasaan produktifmu terjaga dengan baik.`,
        went_wrong: `Beberapa quest tidak sempat diselesaikan. Perlu evaluasi prioritas dan manajemen waktu yang lebih baik.`,
        suggestions: `Fokus pada 3 quest prioritas per hari. Gunakan teknik time-blocking untuk sesi coding. Jangan lupa istirahat setiap 90 menit.`,
      });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: RETRO_SYSTEM_PROMPT },
          { role: "user", content: prompt }
        ],
        temperature: 0.6,
        max_tokens: 600
      })
    });

    const data = await response.json();
    if (data.choices && data.choices[0]) {
      const text = data.choices[0].message.content;
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const retro = JSON.parse(jsonMatch ? jsonMatch[0] : text);
        return NextResponse.json(retro);
      } catch {
        return NextResponse.json({ error: "Failed to parse AI response", raw: text }, { status: 500 });
      }
    }

    return NextResponse.json({ error: "Groq API Error", details: data }, { status: 500 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
