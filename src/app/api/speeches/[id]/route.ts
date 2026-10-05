import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const speech = await prisma.speech.findUnique({
      where: { id },
      include: {
        speaker: true,
        analysis: true,
        rubricScores: true,
        temporalEvents: {
          orderBy: { startTimestamp: "asc" },
        },
        recommendations: true,
        datasetExample: true,
      },
    });

    if (!speech) {
      return NextResponse.json({ error: "Speech not found" }, { status: 404 });
    }

    // Parse JSON fields safely
    let transcriptSegments = [];
    try {
      transcriptSegments = JSON.parse(speech.transcriptJson || "[]");
    } catch {}

    let analysisDetail = null;
    if (speech.analysis) {
      try {
        analysisDetail = {
          ...speech.analysis,
          linguisticMetrics: JSON.parse(speech.analysis.linguisticMetricsJson || "{}"),
          structuralOutline: JSON.parse(speech.analysis.structuralOutlineJson || "{}"),
          contrastiveNotes: JSON.parse(speech.analysis.contrastiveNotesJson || "[]"),
          practicePlan: JSON.parse(speech.analysis.practicePlanJson || "[]"),
        };
      } catch (e) {
        console.error("Error parsing analysis JSON:", e);
      }
    }

    return NextResponse.json({
      speech: {
        ...speech,
        transcriptSegments,
        analysis: analysisDetail,
      },
    });
  } catch (err: any) {
    console.error("Failed to retrieve speech:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.speech.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to delete speech" }, { status: 500 });
  }
}
