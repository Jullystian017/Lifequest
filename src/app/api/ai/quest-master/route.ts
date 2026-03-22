import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are a Game Master and Productivity Coach for a gamified workspace called LifeQuest.
The user will give you their ultimate goal. Your job is to create a comprehensive quest plan to achieve that goal.
Break the goal into 4-7 actionable quests (sub-tasks) that progressively build towards the goal.

Return ONLY a valid JSON array with this schema:
[
  {
    "title": "Short actionable quest title in Indonesian",
    "description": "Brief description of what to do (1-2 sentences, Indonesian)",
    "difficulty": "easy" | "medium" | "hard" | "epic",
    "xp_reward": number (30-150),
    "coin_reward": number (10-50),
    "category": "research" | "practice" | "create" | "review" | "milestone",
    "order": number (1-based sequential order)
  }
]

Rules:
- Write all text in Indonesian language
- Start with easier quests and progressively increase difficulty
- The last quest should always be a "milestone" category (a capstone/final boss)
- Make quests specific, measurable, and actionable
- XP rewards should scale with difficulty
- Do NOT include markdown, code blocks, or any text outside the JSON array`;

export async function POST(req: Request) {
    try {
        const { goal } = await req.json();

        if (!goal || typeof goal !== "string") {
            return NextResponse.json({ error: "Goal is required" }, { status: 400 });
        }

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey || apiKey === "your-groq-api-key") {
            // Mock response for demo
            return NextResponse.json({
                quests: [
                    { title: "Riset dasar konsep utama", description: "Pelajari fundamental dan catat poin-poin penting.", difficulty: "easy", xp_reward: 30, coin_reward: 10, category: "research", order: 1 },
                    { title: "Buat catatan ringkasan teori", description: "Tulis ringkasan dari yang sudah dipelajari.", difficulty: "easy", xp_reward: 40, coin_reward: 15, category: "research", order: 2 },
                    { title: "Latihan praktik pertama", description: "Mulai praktik hands-on dengan contoh sederhana.", difficulty: "medium", xp_reward: 60, coin_reward: 20, category: "practice", order: 3 },
                    { title: "Buat proyek mini", description: "Aplikasikan ilmu dalam proyek kecil yang nyata.", difficulty: "hard", xp_reward: 100, coin_reward: 35, category: "create", order: 4 },
                    { title: "Review dan perbaiki", description: "Evaluasi hasil kerja dan perbaiki kekurangan.", difficulty: "medium", xp_reward: 50, coin_reward: 15, category: "review", order: 5 },
                    { title: "🏆 Final Boss: Proyek Utama", description: "Selesaikan proyek capstone sebagai bukti penguasaan.", difficulty: "epic", xp_reward: 150, coin_reward: 50, category: "milestone", order: 6 },
                ]
            });
        }

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: `Goal saya: ${goal}` }
                ],
                temperature: 0.7,
                max_tokens: 1500
            })
        });

        const data = await response.json();

        if (data.choices && data.choices[0]) {
            const resultText = data.choices[0].message.content;
            try {
                // Try to extract JSON from response (handle potential markdown wrapping)
                const jsonMatch = resultText.match(/\[[\s\S]*\]/);
                if (jsonMatch) {
                    const quests = JSON.parse(jsonMatch[0]);
                    return NextResponse.json({ quests });
                }
                const quests = JSON.parse(resultText);
                return NextResponse.json({ quests });
            } catch {
                console.error("Failed to parse AI response:", resultText);
                return NextResponse.json({ error: "Gagal memproses respons AI", raw: resultText }, { status: 500 });
            }
        } else {
            return NextResponse.json({ error: "Groq API Error", details: data }, { status: 500 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
