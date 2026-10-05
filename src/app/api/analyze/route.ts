import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  calculateWpm,
  countWords,
  analyzeFillers,
  analyzePauses,
  calculatePaceVariation,
  generateDeterministicTemporalEvents,
} from "@/lib/metrics";
import { calculateRubricScores } from "@/lib/rubric";
import { evaluateSpeechSemantics } from "@/lib/ai";
import { TranscriptSegment } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title = "New Speech Analysis",
      category = "Technical Presentation",
      transcript: rawTranscript,
      durationSeconds: reqDuration,
      audioUrl = "/samples/ideal-rag.wav",
      speakerId,
    } = body;

    // Use default sample speech if user didn't enter custom text
    const sampleText =
      rawTranscript ||
      "Today we examine the operational efficiency of distributed systems under sudden transactional spikes. When traffic surges, cascading bottlenecks occur at the consensus layer unless backpressure mechanisms are strictly enforced. In our empirical testing across one hundred thousand requests, implementing adaptive rate limiting reduced failure rates by seventy percent.";

    const wordCount = countWords(sampleText);
    const durationSeconds = Number(reqDuration) || Math.max(30, Math.round((wordCount / 135) * 60));
    const wpm = calculateWpm(wordCount, durationSeconds);

    // Segment text into timestamped segments
    const sentences = sampleText.match(/[^.!?]+[.!?]+(\s|$)/g) || [sampleText];
    const segmentDuration = durationSeconds / Math.max(1, sentences.length);

    const segments: TranscriptSegment[] = sentences.map((sentence, idx) => {
      const start = Math.round(idx * segmentDuration * 10) / 10;
      const end = Math.round((idx + 1) * segmentDuration * 10) / 10;
      const segWords = countWords(sentence);
      const segWpm = calculateWpm(segWords, Math.max(1, end - start));

      return {
        id: `seg-${idx}`,
        start,
        end,
        text: sentence.trim(),
        wpm: segWpm,
      };
    });

    // 1. Extract Speech Signals (Deterministic)
    const fillerStats = analyzeFillers(sampleText);
    const pauseStats = analyzePauses(
      segments.map((s) => ({ start: s.start, end: s.end })),
      durationSeconds
    );
    const paceVariation = calculatePaceVariation(segments);

    // 2. Perform Semantic & Structural Evaluation (Gemini or Deterministic Fallback)
    const speechId = `speech-${Date.now()}`;
    const semanticResult = await evaluateSpeechSemantics({
      speechId,
      title,
      category,
      transcript: sampleText,
      segments,
      durationSeconds,
      wpm,
      fillerDensity: fillerStats.density,
      pauseCount: pauseStats.pauseCount,
    });

    // 3. Compute Reproducible Rubric Scores
    const rubricResult = calculateRubricScores(speechId, {
      wpm,
      fillerDensity: fillerStats.density,
      pauseCount: pauseStats.pauseCount,
      avgPauseDuration: pauseStats.avgPauseDuration,
      longestPause: pauseStats.longestPause,
      paceVariation,
      silenceRatio: pauseStats.silenceRatio,
      semanticScores: {
        delivery: semanticResult.deliveryScore,
        clarity: semanticResult.clarityScore,
        structure: semanticResult.structureScore,
        content: semanticResult.contentScore,
        fluency: semanticResult.fluencyScore,
        engagement: semanticResult.engagementScore,
      },
    });

    // 4. Ground Temporal Flaws
    const deterministicFlaws = generateDeterministicTemporalEvents(
      speechId,
      segments,
      135
    );

    const allFlaws = [
      ...deterministicFlaws,
      ...semanticResult.temporalFlaws.map((f, i) => ({
        id: `evt-sem-${i}-${Math.round(f.startTimestamp)}`,
        speechId,
        eventType: f.eventType,
        severity: f.severity,
        startTimestamp: f.startTimestamp,
        endTimestamp: f.endTimestamp,
        label: f.label,
        description: f.description,
        evidence: f.evidence,
        recommendation: f.recommendation,
        metricValue: f.metricValue ?? null,
        metricUnit: f.metricUnit ?? null,
      })),
    ].sort((a, b) => a.startTimestamp - b.startTimestamp);

    // 5. Persist to SQLite Database
    const newSpeech = await prisma.speech.create({
      data: {
        id: speechId,
        title,
        category,
        speakerId: speakerId || null,
        audioUrl,
        durationSeconds,
        wordCount,
        wpm,
        fillerCount: fillerStats.count,
        fillerDensity: fillerStats.density,
        pauseCount: pauseStats.pauseCount,
        avgPauseDuration: pauseStats.avgPauseDuration,
        longestPause: pauseStats.longestPause,
        silenceRatio: pauseStats.silenceRatio,
        paceVariation,
        overallScore: rubricResult.overallScore,
        isIdeal: rubricResult.overallScore >= 82,
        isFlawed: rubricResult.overallScore < 70,
        transcript: sampleText,
        transcriptJson: JSON.stringify(segments),
      },
    });

    await prisma.analysis.create({
      data: {
        speechId: newSpeech.id,
        executiveSummary: semanticResult.executiveSummary,
        deliveryScore: rubricResult.categoryScores.delivery,
        clarityScore: rubricResult.categoryScores.clarity,
        structureScore: rubricResult.categoryScores.structure,
        contentScore: rubricResult.categoryScores.content,
        fluencyScore: rubricResult.categoryScores.fluency,
        engagementScore: rubricResult.categoryScores.engagement,
        linguisticMetricsJson: JSON.stringify(semanticResult.linguisticMetrics),
        structuralOutlineJson: JSON.stringify(semanticResult.structuralOutline),
        contrastiveNotesJson: JSON.stringify(semanticResult.contrastiveNotes),
        practicePlanJson: JSON.stringify(semanticResult.practicePlan),
      },
    });

    await prisma.rubricScore.createMany({
      data: rubricResult.rubricItems.map((item) => ({
        speechId: newSpeech.id,
        category: item.category,
        score: item.score,
        weight: item.weight,
        evidence: item.evidence,
        issueDetected: item.issueDetected ?? null,
        explanation: item.explanation,
        recommendation: item.recommendation,
      })),
    });

    if (allFlaws.length > 0) {
      await prisma.temporalEvent.createMany({
        data: allFlaws.map((f) => ({
          speechId: newSpeech.id,
          eventType: f.eventType,
          severity: f.severity,
          startTimestamp: f.startTimestamp,
          endTimestamp: f.endTimestamp,
          label: f.label,
          description: f.description,
          evidence: f.evidence,
          recommendation: f.recommendation,
          metricValue: f.metricValue ?? null,
          metricUnit: f.metricUnit ?? null,
        })),
      });
    }

    if (semanticResult.recommendations.length > 0) {
      await prisma.recommendation.createMany({
        data: semanticResult.recommendations.map((r) => ({
          speechId: newSpeech.id,
          title: r.title,
          category: r.category,
          priority: r.priority,
          description: r.description,
          actionableDrill: r.actionableDrill,
          targetTimestamp: r.targetTimestamp ?? null,
        })),
      });
    }

    return NextResponse.json({
      success: true,
      speechId: newSpeech.id,
      overallScore: rubricResult.overallScore,
    });
  } catch (err: any) {
    console.error("Analysis pipeline failed:", err);
    return NextResponse.json(
      { error: err.message || "Analysis failed" },
      { status: 500 }
    );
  }
}
