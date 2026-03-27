import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `Kamu adalah AI verifikasi untuk aplikasi produktivitas gamifikasi bernama LifeQuest.
User telah menyelesaikan quest dan mengunggah foto sebagai bukti.
Tugasmu adalah menganalisis foto tersebut dan menentukan apakah foto tersebut benar-benar menunjukkan bukti penyelesaian quest.

ATURAN KHUSUS (WAJIB DIIKUTI):
1. Jika foto menunjukkan cuplikan kode pemrograman (IDE, terminal, atau tulisan kode), SEGERA VERIFIKASI SEBAGAI TRUE (verified: true) meskipun quest-nya tidak spesifik menyebutkan kode.
2. Jika tidak diverifikasi (verified: false), kamu WAJIB menyebutkan apa yang kamu lihat di foto tersebut pada bagian "reason". Formatnya: "Saya melihat [apa yang ada di foto], namun quest ini adalah [judul quest]. Mohon unggah bukti yang relevan."

Kamu akan menerima:
- Judul quest
- Deskripsi quest
- Foto yang diunggah oleh user

Berikan respons HANYA dengan objek JSON yang valid (tanpa markdown, tanpa teks tambahan):
{
  "verified": true/false,
  "confidence": angka (0-100),
  "reason": "Penjelasan singkat dalam Bahasa Indonesia mengapa bukti diverifikasi atau tidak"
}

Jadilah adil namun tidak terlalu ketat. Jika foto secara wajar berkaitan dengan topik quest, verifikasi saja.`;

export async function POST(req: Request) {
    try {
        const { questTitle, questDescription, imageBase64 } = await req.json();

        if (!questTitle || !imageBase64) {
            return NextResponse.json({ 
                verified: false,
                confidence: 0,
                reason: "Judul quest dan gambar wajib ada." 
            });
        }

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey || apiKey === "your-groq-api-key") {
            // Mock verified response for demo
            return NextResponse.json({
                verified: true,
                confidence: 85,
                reason: "Foto menunjukkan bukti yang relevan dengan quest. Terverifikasi! 🎉 (Mode Demo)"
            });
        }

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "llama-3.2-11b-vision-preview",
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
                    return NextResponse.json({
                        verified: result.verified ?? false,
                        confidence: result.confidence ?? 0,
                        reason: result.reason || "AI tidak memberikan alasan."
                    });
                }
                const result = JSON.parse(resultText);
                return NextResponse.json({
                    verified: result.verified ?? false,
                    confidence: result.confidence ?? 0,
                    reason: result.reason || "AI tidak memberikan alasan."
                });
            } catch {
                console.error("Failed to parse AI vision response:", resultText);
                return NextResponse.json({
                    verified: false,
                    confidence: 0,
                    reason: "Format respons AI tidak valid."
                });
            }
        } else {
            console.error("Groq API Error:", data);
            return NextResponse.json({ 
                verified: false,
                confidence: 0,
                reason: `AI Error: ${data.error?.message || "Gagal menghubungi pusat AI Vision."}`
            });
        }
    } catch (error: any) {
        console.error("Verification Route Error:", error);
        return NextResponse.json({ 
            verified: false,
            confidence: 0,
            reason: `Sistem Error: ${error.message}`
        });
    }
}
