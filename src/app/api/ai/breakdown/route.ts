import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `Kamu adalah seorang Game Master dan Pelatih Produktivitas untuk workspace gamifikasi bernama LifeQuest.
User akan memberimu tujuan besar atau tugas. Tugasmu adalah memecahnya menjadi 3-5 quest (sub-tugas) kecil yang bisa dikerjakan.
Kembalikan HANYA array JSON objek dengan skema berikut:
[
  {
    "title": "Judul quest singkat dalam Bahasa Indonesia",
    "difficulty": "easy | medium | hard",
    "xp_reward": angka (20-100),
    "coin_reward": angka (5-30)
  }
]
Jangan sertakan blok markdown atau teks lainnya. Hanya array JSON. Semua teks harus dalam Bahasa Indonesia.`;

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey || apiKey === "your-groq-api-key") {
            // Mock response if no API key is set
            return NextResponse.json({
                quests: [
                    { title: "Riset konsep dasar", difficulty: "easy", xp_reward: 30, coin_reward: 10 },
                    { title: "Buat kerangka awal", difficulty: "medium", xp_reward: 50, coin_reward: 15 },
                    { title: "Eksekusi implementasi utama", difficulty: "hard", xp_reward: 100, coin_reward: 30 },
                    { title: "Review dan pemolesan", difficulty: "easy", xp_reward: 20, coin_reward: 5 }
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
                model: "llama-3.3-70b-versatile", // Groq fast model
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        
        if (data.choices && data.choices[0]) {
            const resultText = data.choices[0].message.content;
            try {
                const quests = JSON.parse(resultText);
                return NextResponse.json({ quests });
            } catch (err) {
                console.error("Failed to parse AI response", resultText);
                return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
            }
        } else {
            return NextResponse.json({ error: "OpenAI API Error", details: data }, { status: 500 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
