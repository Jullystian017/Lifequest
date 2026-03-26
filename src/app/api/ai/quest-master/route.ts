import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are a Game Master and Technical Mentor for a gamified workspace called LifeQuest.
The user wants to achieve a specific technical goal. 
Context:
- User Specialty: {userClass}
- User Skill Level: {userLevel}

Your job is to create a comprehensive quest roadmap. 
If the user is a "frontend" dev, focus on UI/UX and client-side logic. 
If "backend", focus on APIs and data. 
Scale the difficulty and depth of descriptions based on their level.

Return ONLY a valid JSON array with this schema:
[
  {
    "title": "Short actionable quest title in Indonesian",
    "description": "Brief description of what to do (1-2 sentences, Indonesian)",
    "difficulty": "easy" | "medium" | "hard" | "extreme",
    "xp_reward": number (30-150),
    "coin_reward": number (10-50),
    "category": "general" | "feature" | "bugfix" | "refactor" | "devops" | "documentation" | "review" | "testing" | "planning",
    "order": number (1-based sequential order)
  }
]

Rules:
- Text in Indonesian
- High technical relevance to the {userClass} specialty
- Difficulty should represent {userLevel} expectations
- Do NOT include markdown.`;

export async function POST(req: Request) {
    try {
        const { goal, userClass, userLevel } = await req.json();

        if (!goal || typeof goal !== "string") {
            return NextResponse.json({ error: "Goal is required" }, { status: 400 });
        }

        const dynamicPrompt = SYSTEM_PROMPT
            .replace(/{userClass}/g, userClass || "General Developer")
            .replace(/{userLevel}/g, `Level ${userLevel || 1}`);

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey || apiKey === "your-groq-api-key") {
            // Mock response for demo
            return NextResponse.json({
                quests: [
                    { title: "Riset fundamental konsep", description: "Pelajari fundamental dan dokumentasikan.", difficulty: "easy", xp_reward: 30, coin_reward: 10, category: "documentation", order: 1 },
                    { title: "Setup arsitektur dasar", description: "Buat kerangka proyek awal.", difficulty: "medium", xp_reward: 60, coin_reward: 20, category: "devops", order: 2 },
                    { title: "Implementasi fitur inti", description: "Coding logika utama aplikasi.", difficulty: "hard", xp_reward: 100, coin_reward: 35, category: "feature", order: 3 },
                    { title: "Review dan perbaiki bug", description: "Evaluasi hasil kerja dan perbaiki bug yang muncul.", difficulty: "medium", xp_reward: 50, coin_reward: 15, category: "bugfix", order: 4 },
                    { title: "🏆 Final Boss: Rilis Proyek", description: "Deploy dan rilis proyek sebagai bukti penguasaan.", difficulty: "extreme", xp_reward: 150, coin_reward: 50, category: "feature", order: 5 },
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
                    { role: "system", content: dynamicPrompt },
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
