import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are a verification AI for a gamified productivity app called LifeQuest.
The user has completed a quest and submitted a photo as proof.
Your job is to analyze the photo and determine if it genuinely shows evidence of the quest being completed.

You will receive:
- The quest title
- The quest description
- A photo submitted by the user

Respond ONLY with a valid JSON object (no markdown, no extra text):
{
  "verified": true/false,
  "confidence": number (0-100),
  "reason": "Brief explanation in Indonesian why it was verified or not"
}

Be fair but not too strict. If the photo reasonably relates to the quest topic, verify it.
For example, if the quest is "Baca buku tentang React", a photo showing a book or laptop with code is sufficient.`;

export async function POST(req: Request) {
    try {
        const { questTitle, questDescription, imageBase64 } = await req.json();

        if (!questTitle || !imageBase64) {
            return NextResponse.json({ error: "Quest title and image are required" }, { status: 400 });
        }

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey || apiKey === "your-groq-api-key") {
            // Mock verified response for demo
            return NextResponse.json({
                verified: true,
                confidence: 85,
                reason: "Foto menunjukkan bukti yang relevan dengan quest. Terverifikasi! 🎉"
            });
        }

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "llama-3.2-90b-vision-preview",
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: `Quest Title: "${questTitle}"\nQuest Description: "${questDescription || 'Tidak ada deskripsi'}"\n\nVerifikasi apakah foto berikut menunjukkan bukti penyelesaian quest ini.`
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: imageBase64.startsWith("data:") 
                                        ? imageBase64 
                                        : `data:image/jpeg;base64,${imageBase64}`
                                }
                            }
                        ]
                    }
                ],
                temperature: 0.3,
                max_tokens: 300
            })
        });

        const data = await response.json();

        if (data.choices && data.choices[0]) {
            const resultText = data.choices[0].message.content;
            try {
                const jsonMatch = resultText.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const result = JSON.parse(jsonMatch[0]);
                    return NextResponse.json(result);
                }
                const result = JSON.parse(resultText);
                return NextResponse.json(result);
            } catch {
                console.error("Failed to parse AI vision response:", resultText);
                return NextResponse.json({
                    verified: false,
                    confidence: 0,
                    reason: "Gagal memproses respons AI Vision."
                }, { status: 500 });
            }
        } else {
            return NextResponse.json({ error: "Groq Vision API Error", details: data }, { status: 500 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
