import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateAiCoachAdvice } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { question, speechId } = await req.json();

    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    let speechContext: any = null;
    if (speechId) {
      speechContext = await prisma.speech.findUnique({
        where: { id: speechId },
        include: {
          temporalEvents: {
            orderBy: { startTimestamp: "asc" },
          },
          rubricScores: true,
          analysis: true,
        },
      });
    }

    if (!speechContext) {
      // Pick the latest speech as context
      speechContext = await prisma.speech.findFirst({
        orderBy: { createdAt: "desc" },
        include: {
          temporalEvents: {
            orderBy: { startTimestamp: "asc" },
          },
          rubricScores: true,
          analysis: true,
        },
      });
    }

    const advice = await generateAiCoachAdvice({
      question,
      speechTitle: speechContext?.title,
      wpm: speechContext?.wpm,
      fillerDensity: speechContext?.fillerDensity,
      overallScore: speechContext?.overallScore,
      flaws: speechContext?.temporalEvents?.map((e: any) => ({
        label: e.label,
        startTimestamp: e.startTimestamp,
        description: e.description,
      })),
    });

    return NextResponse.json({
      answer: advice,
      speechContext: {
        id: speechContext?.id,
        title: speechContext?.title,
        wpm: speechContext?.wpm,
        overallScore: speechContext?.overallScore,
      },
    });
  } catch (err: any) {
    console.error("AI Coach query failed:", err);
    return NextResponse.json({ error: "Failed to generate coaching response" }, { status: 500 });
  }
}
