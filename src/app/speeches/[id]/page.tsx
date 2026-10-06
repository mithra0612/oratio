import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { SpeechDetailClient } from "./SpeechDetailClient";

export const dynamic = "force-dynamic";

export default async function SpeechPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let speech = null;
  try {
    speech = await prisma.speech.findUnique({
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
  } catch (err) {
    console.error(`Failed to fetch speech ${id}:`, err);
  }

  if (!speech) {
    notFound();
  }

  // Parse JSON fields
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
    } catch {}
  }

  const speechDetail: any = {
    ...speech,
    transcriptSegments,
    analysis: analysisDetail,
  };

  return <SpeechDetailClient speech={speechDetail} />;
}
