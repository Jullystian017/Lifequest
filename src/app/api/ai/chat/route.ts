import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are a strict but supportive Game Master and Productivity Coach for a gamified workspace called LifeQuest.
The user is an adventurer trying to level up in real life by completing tasks.
Your role:
- Provide quick, punchy, RPG-themed motivation ("Raise your sword!", "The dungeon awaits!").
- Call them out if they are slacking or making excuses (Reality Check).
- Keep responses short (1-3 sentences).
- Do not use markdown blocks unless necessary.`;

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
                reply: "The API Key of Groq is missing from the ancient scrolls (.env.local). Please forge one to commune with me truly!"
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
