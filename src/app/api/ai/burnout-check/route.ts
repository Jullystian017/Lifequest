import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { recentCompletionRates, streakDays, lastActiveDay } = await req.json();

    // Simple heuristic burnout detection (no LLM needed, fast)
    const avgRate = recentCompletionRates.length > 0
      ? recentCompletionRates.reduce((a: number, b: number) => a + b, 0) / recentCompletionRates.length
      : 0;

    const daysSinceActive = lastActiveDay
      ? Math.floor((Date.now() - new Date(lastActiveDay).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    let risk: "low" | "medium" | "high" = "low";
    let message = "";
    let recommendations: string[] = [];

    if (avgRate < 30 || daysSinceActive > 3 || streakDays === 0) {
      risk = "high";
      message = "⚠️ Tanda-tanda burnout terdeteksi. Produktivitasmu turun signifikan minggu ini.";
      recommendations = [
        "Ambil istirahat singkat — 1 hari OFF dari coding tidak masalah.",
        "Mulai dengan 1 task kecil saja. Jangan terlalu ambisius.",
        "Coba review tujuanmu — pastikan masih relevan dan memotivasi.",
      ];
    } else if (avgRate < 60 || daysSinceActive > 1 || streakDays < 3) {
      risk = "medium";
      message = "⚡ Produktivitasmu sedikit menurun. Tetap semangat!";
      recommendations = [
        "Kurangi jumlah quest harian jika terasa kewalahan.",
        "Pastikan tidur cukup — kualitas istirahat = kualitas kode.",
        "Jadwalkan 1 sesi deep work yang terfokus setiap hari.",
      ];
    } else {
      risk = "low";
      message = "✅ Kamu dalam kondisi prima! Pertahankan ritme ini.";
      recommendations = [
        "Coba tantang diri dengan quest difficulty yang lebih tinggi.",
        "Bagikan progress ke tim untuk menjaga akuntabilitas.",
        "Luangkan waktu untuk belajar hal baru di luar zona nyaman.",
      ];
    }

    return NextResponse.json({
      risk,
      avgCompletionRate: Math.round(avgRate),
      streakDays,
      daysSinceActive,
      message,
      recommendations,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
