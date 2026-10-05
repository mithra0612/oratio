import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const examples = await prisma.datasetExample.findMany({
      include: {
        speech: {
          include: {
            speaker: true,
            analysis: true,
            rubricScores: true,
            temporalEvents: true,
            recommendations: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    // Group into pairs by pairId
    const pairMap = new Map<string, { ideal: any; flawed: any; category: string }>();

    examples.forEach((ex) => {
      if (!ex.speech) return;
      const current = pairMap.get(ex.pairId) || {
        ideal: null,
        flawed: null,
        category: ex.category,
      };

      if (ex.idealOrFlawed === "IDEAL") {
        current.ideal = ex.speech;
      } else {
        current.flawed = ex.speech;
      }

      pairMap.set(ex.pairId, current);
    });

    const pairs = Array.from(pairMap.entries()).map(([pairId, val]) => ({
      pairId,
      category: val.category,
      idealSpeech: val.ideal,
      flawedSpeech: val.flawed,
    }));

    return NextResponse.json({ pairs });
  } catch (err: any) {
    console.error("Failed to fetch contrastive pairs:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
