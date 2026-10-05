import { prisma } from "@/lib/db";
import { TemporalAnalysisClient } from "./TemporalAnalysisClient";

export const dynamic = "force-dynamic";

export default async function TemporalAnalysisPage() {
  const speeches = await prisma.speech.findMany({
    include: {
      speaker: true,
      temporalEvents: {
        orderBy: { startTimestamp: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const formattedSpeeches = speeches.map((s) => {
    let transcriptSegments = [];
    try {
      transcriptSegments = JSON.parse(s.transcriptJson || "[]");
    } catch {}

    return {
      ...s,
      transcriptSegments,
    };
  });

  return <TemporalAnalysisClient speeches={formattedSpeeches as any} />;
}
