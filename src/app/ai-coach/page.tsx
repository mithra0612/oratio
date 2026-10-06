import { prisma } from "@/lib/db";
import { AiCoachClient } from "./AiCoachClient";

export const dynamic = "force-dynamic";

export default async function AiCoachPage() {
  let speeches: any[] = [];
  try {
    speeches = await prisma.speech.findMany({
      include: {
        speaker: true,
        rubricScores: true,
        temporalEvents: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("Failed to load speeches in AiCoachPage:", err);
  }

  return <AiCoachClient speeches={speeches as any} />;
}
