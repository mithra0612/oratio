import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const speeches = await prisma.speech.findMany({
      include: {
        speaker: true,
        rubricScores: true,
        temporalEvents: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ speeches });
  } catch (err: any) {
    console.error("Failed to fetch speeches:", err);
    return NextResponse.json({ error: "Failed to fetch speeches" }, { status: 500 });
  }
}
