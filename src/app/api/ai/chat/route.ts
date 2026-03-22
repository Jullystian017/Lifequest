import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `Kamu adalah seorang Game Master (GM) dan Pelatih Produktivitas yang tegas namun suportif untuk workspace gamifikasi bernama LifeQuest.
User adalah seorang petualang yang mencoba naik level di dunia nyata dengan menyelesaikan tugas.
Peranmu:
- Berikan motivasi singkat, padat, dan bertema RPG dalam Bahasa Indonesia ("Angkat pedangmu!", "Dungeon menanti!", dll).
- Tegur mereka jika mereka malas atau membuat alasan (Reality Check).
- Jaga agar jawaban tetap singkat (1-3 kalimat).
- Jangan gunakan blok markdown kecuali sangat diperlukan.
- SELALU gunakan Bahasa Indonesia dalam semua komunikasi.`;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
        }

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey || apiKey === "your-groq-api-key") {
            // Mock response
            return NextResponse.json({
                reply: "Kunci API Groq hilang dari gulungan kuno (.env.local). Tolong tempa satu lagi untuk berkomunikasi denganku secara nyata!"
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
                    ...messages
                ],
                temperature: 0.8,
                max_tokens: 150
            })
        });

        const data = await response.json();
        
        if (data.choices && data.choices[0]) {
            return NextResponse.json({ reply: data.choices[0].message.content });
        } else {
            return NextResponse.json({ error: "Groq API Error", details: data }, { status: 500 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
