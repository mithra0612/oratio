import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ReportViewClient } from "./ReportViewClient";

export const dynamic = "force-dynamic";

export default async function SpeechReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
    },
  });

  if (!speech) {
    notFound();
  }

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
    transcriptSegments: [],
    analysis: analysisDetail,
  };

  return <ReportViewClient speech={speechDetail} />;
}
