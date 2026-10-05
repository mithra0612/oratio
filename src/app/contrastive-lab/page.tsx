import { prisma } from "@/lib/db";
import { ContrastiveLabClient } from "./ContrastiveLabClient";

export const dynamic = "force-dynamic";

export default async function ContrastiveLabPage() {
  const examples = await prisma.datasetExample.findMany({
    include: {
      speech: {
        include: {
          speaker: true,
          analysis: true,
          rubricScores: true,
          temporalEvents: {
            orderBy: { startTimestamp: "asc" },
          },
          recommendations: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const pairMap = new Map<string, { ideal: any; flawed: any; category: string }>();

  examples.forEach((ex) => {
    if (!ex.speech) return;
    const current = pairMap.get(ex.pairId) || {
      ideal: null,
      flawed: null,
      category: ex.category,
    };

    let transcriptSegments = [];
    try {
      transcriptSegments = JSON.parse(ex.speech.transcriptJson || "[]");
    } catch {}

    let analysisDetail = null;
    if (ex.speech.analysis) {
      try {
        analysisDetail = {
          ...ex.speech.analysis,
          linguisticMetrics: JSON.parse(ex.speech.analysis.linguisticMetricsJson || "{}"),
          structuralOutline: JSON.parse(ex.speech.analysis.structuralOutlineJson || "{}"),
          contrastiveNotes: JSON.parse(ex.speech.analysis.contrastiveNotesJson || "[]"),
          practicePlan: JSON.parse(ex.speech.analysis.practicePlanJson || "[]"),
        };
      } catch {}
    }

    const formattedSpeech = {
      ...ex.speech,
      transcriptSegments,
      analysis: analysisDetail,
    };

    if (ex.idealOrFlawed === "IDEAL") {
      current.ideal = formattedSpeech;
    } else {
      current.flawed = formattedSpeech;
    }

    pairMap.set(ex.pairId, current);
  });

  const pairs = Array.from(pairMap.entries()).map(([pairId, val]) => ({
    pairId,
    category: val.category,
    idealSpeech: val.ideal,
    flawedSpeech: val.flawed,
  }));

  const allSpeeches = await prisma.speech.findMany({
    include: { speaker: true },
  });

  return (
    <ContrastiveLabClient
      pairs={pairs}
      allSpeeches={allSpeeches as any}
    />
  );
}
