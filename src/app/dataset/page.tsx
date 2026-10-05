import { prisma } from "@/lib/db";
import { DatasetClient } from "./DatasetClient";

export const dynamic = "force-dynamic";

export default async function DatasetPage() {
  const records = await prisma.datasetExample.findMany({
    orderBy: { createdAt: "asc" },
  });

  const formattedRecords = records.map((r) => {
    let targetFlaws = [];
    try {
      targetFlaws = JSON.parse(r.targetFlaws || "[]");
    } catch {}

    let rubricScoresSummary = {};
    try {
      rubricScoresSummary = JSON.parse(r.rubricScoresSummary || "{}");
    } catch {}

    return {
      ...r,
      targetFlaws,
      rubricScoresSummary,
    };
  });

  return <DatasetClient records={formattedRecords as any} />;
}
