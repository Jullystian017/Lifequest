import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `Kamu adalah "Life Engine", otak inti neural dari platform gamifikasi LifeQuest.
Tugasmu adalah menganalisis data pengguna (quest, habit, statistik) dan memberikan wawasan super cerdas dalam Bahasa Indonesia.

Kamu harus memberikan respons dalam format JSON murni:
{
  "warning": "Peringatan tentang pola negatif (misal: sering skip quest malam)",
  "suggestion": "Saran tindakan nyata (misal: pindah fokus ke pagi hari)",
  "prediction": "Prediksi masa depan berdasarkan tren (misal: goal tercapai dalam 2 minggu)",
  "action_label": "Label singkat untuk tombol aksi (misal: Perbaiki Plan)",
  "action_link": "Link tujuan aksi (misal: /dashboard/quest-master)"
}

Aturan:
- Gunakan Bahasa Indonesia yang keren, tegas, tapi memotivasi.
- Jika data menunjukkan performa bagus, buat warning-nya tetap waspada (jangan kasih kendor).
- Prediction harus terasa berbasis data (logic-based).
- Jangan sertakan markdown atau teks lain di luar JSON.`;

export async function POST(req: Request) {
    try {
        const { quests, habits, stats, level, username } = await req.json();

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey || apiKey === "your-groq-api-key") {
            return NextResponse.json({
                warning: "Sistem monitoring offline. Hubungkan kunci API Groq.",
                suggestion: "Segera periksa file .env.local kamu.",
                prediction: "Tanpa koneksi AI, analisis masa depan terhambat.",
                action_label: "Cek Pengaturan",
                action_link: "/dashboard/settings"
            });
        }

        const prompt = `Data Pengguna:
Nama: ${username}
Level: ${level}
Statistik: ${JSON.stringify(stats)}
Quest Aktif: ${JSON.stringify(quests.filter((q: any) => !q.is_completed).slice(0, 5))}
Quest Selesai: ${JSON.stringify(quests.filter((q: any) => q.is_completed).slice(0, 5))}
Habit: ${JSON.stringify(habits.slice(0, 5))}

Berikan analisis Life Engine sekarang.`;

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
                    { role: "user", content: prompt }
                ],
                temperature: 0.7,
                response_format: { type: "json_object" }
            })
        });

        const data = await response.json();
        
        if (data.choices && data.choices[0]) {
            return NextResponse.json(JSON.parse(data.choices[0].message.content));
        }

        throw new Error("Invalid AI response");
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
