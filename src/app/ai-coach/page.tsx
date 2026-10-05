import { prisma } from "@/lib/db";
import { AiCoachClient } from "./AiCoachClient";

export const dynamic = "force-dynamic";

export default async function AiCoachPage() {
  const speeches = await prisma.speech.findMany({
    include: {
      speaker: true,
      rubricScores: true,
      temporalEvents: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return <AiCoachClient speeches={speeches as any} />;
}
