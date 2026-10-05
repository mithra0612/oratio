import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    let settings = await prisma.systemSetting.findUnique({
      where: { id: "global" },
    });

    if (!settings) {
      settings = await prisma.systemSetting.create({
        data: {
          id: "global",
          demoMode: true,
          weightDelivery: 0.20,
          weightClarity: 0.20,
          weightStructure: 0.20,
          weightContent: 0.15,
          weightFluency: 0.15,
          weightEngagement: 0.10,
        },
      });
    }

    const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 5);
    const hasWhisperKey = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 5);

    return NextResponse.json({
      settings,
      apiStatus: {
        geminiConfigured: hasGeminiKey,
        whisperConfigured: hasWhisperKey,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = await prisma.systemSetting.upsert({
      where: { id: "global" },
      update: {
        demoMode: body.demoMode ?? true,
        weightDelivery: body.weightDelivery ?? 0.20,
        weightClarity: body.weightClarity ?? 0.20,
        weightStructure: body.weightStructure ?? 0.20,
        weightContent: body.weightContent ?? 0.15,
        weightFluency: body.weightFluency ?? 0.15,
        weightEngagement: body.weightEngagement ?? 0.10,
      },
      create: {
        id: "global",
        demoMode: body.demoMode ?? true,
        weightDelivery: body.weightDelivery ?? 0.20,
        weightClarity: body.weightClarity ?? 0.20,
        weightStructure: body.weightStructure ?? 0.20,
        weightContent: body.weightContent ?? 0.15,
        weightFluency: body.weightFluency ?? 0.15,
        weightEngagement: body.weightEngagement ?? 0.10,
      },
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
