import assert from "node:assert";
import { test } from "node:test";
import {
  calculateWpm,
  countWords,
  analyzeFillers,
  analyzePauses,
  detectPaceSpikes,
  calculatePaceVariation,
  generateDeterministicTemporalEvents,
} from "../src/lib/metrics.js";
import { calculateRubricScores, DEFAULT_WEIGHTS } from "../src/lib/rubric.js";
import { PrismaClient } from "@prisma/client";

test("1. WPM Calculation", () => {
  // 135 words in 60 seconds should be 135 WPM
  const wpm = calculateWpm(135, 60);
  assert.strictEqual(wpm, 135);

  // Edge cases: 0 seconds or 0 words
  assert.strictEqual(calculateWpm(0, 60), 0);
  assert.strictEqual(calculateWpm(100, 0), 0);

  // 180 words in 90 seconds = 120 WPM
  assert.strictEqual(calculateWpm(180, 90), 120);
});

test("2. Word Count Extraction", () => {
  const text = "Retrieval-Augmented Generation decouples parametric memory from dynamic retrieval.";
  const count = countWords(text);
  assert.strictEqual(count, 8);
  assert.strictEqual(countWords(""), 0);
  assert.strictEqual(countWords("   one   two   three   "), 3);
});

test("3. Filler Detection and Density", () => {
  const text = "Um, basically, what we are like trying to do here is sort of solve retrieval, you know?";
  const res = analyzeFillers(text);
  assert.ok(res.count >= 4, `Expected at least 4 fillers, found ${res.count}`);
  assert.ok(res.density > 0, "Density should be greater than 0");

  const cleanText = "Today we evaluate the latency of our distributed key value store.";
  const cleanRes = analyzeFillers(cleanText);
  assert.strictEqual(cleanRes.count, 0);
  assert.strictEqual(cleanRes.density, 0);
});

test("4. Pause and Silence Analysis", () => {
  const segments = [
    { start: 0, end: 10 },
    { start: 12, end: 20 }, // 2.0s gap
    { start: 23.5, end: 35 }, // 3.5s gap
  ];
  const res = analyzePauses(segments, 40, 0.6);
  assert.strictEqual(res.pauseCount, 2);
  assert.strictEqual(res.longestPause, 3.5);
  assert.ok(res.silenceRatio > 0);
});

test("5. Pace Spike Detection", () => {
  const segments = [
    { id: "1", start: 0, end: 10, text: "This is a normal paced introduction to our work." }, // ~9 words in 10s = 54 wpm
    { id: "2", start: 10, end: 20, text: "Now we suddenly speak extremely rapidly and rush through all thirty five different engineering modules without taking any breath at all." }, // 22 words in 10s = 132 wpm
  ];
  // With baseline 90 wpm, segment 2 is 132 wpm (> 25% over baseline)
  const spikes = detectPaceSpikes(segments, 90, 25);
  assert.strictEqual(spikes.length, 1);
  assert.strictEqual(spikes[0].segmentIndex, 1);
  assert.ok(spikes[0].percentAboveBaseline >= 25);
});

test("6. Reproducible Rubric Engine", () => {
  const input = {
    wpm: 132,
    fillerDensity: 0.8,
    pauseCount: 8,
    avgPauseDuration: 1.2,
    longestPause: 1.5,
    paceVariation: 8.5,
    silenceRatio: 10.0,
    semanticScores: {
      delivery: 90,
      clarity: 92,
      structure: 89,
      content: 88,
      fluency: 91,
      engagement: 84,
    },
  };

  const result = calculateRubricScores("test-speech-1", input);
  assert.ok(result.overallScore >= 80, `Expected score >= 80, got ${result.overallScore}`);
  assert.strictEqual(result.rubricItems.length, 6);

  // Check evidence and recommendation retention
  const deliveryItem = result.rubricItems.find((r) => r.category === "Delivery");
  assert.ok(deliveryItem);
  assert.ok(deliveryItem.evidence.length > 5);
  assert.ok(deliveryItem.recommendation.length > 5);
});

test("7. Deterministic Temporal Event Generation", () => {
  const segments = [
    { id: "s1", start: 0, end: 10, text: "Um basically we kind of started the system like this right?" },
    { id: "s2", start: 14, end: 20, text: "Then four seconds of silence occurred." }, // gap = 4.0s
    { id: "s3", start: 20, end: 26, text: "And we rapidly explain the entire mechanism in six seconds with forty words rushing through the architecture." },
  ];

  const events = generateDeterministicTemporalEvents("test-speech-2", segments, 120);
  assert.ok(events.length >= 2, `Expected at least 2 events, got ${events.length}`);

  const fillerEvt = events.find((e) => e.eventType === "FILLER_DETECTED");
  assert.ok(fillerEvt, "Should detect filler cluster");

  const pauseEvt = events.find((e) => e.eventType === "LONG_PAUSE");
  assert.ok(pauseEvt, "Should detect long pause");
});

test("8. Database Operations (Prisma SQLite)", async () => {
  const prisma = new PrismaClient();
  const speeches = await prisma.speech.findMany({
    include: { rubricScores: true, temporalEvents: true, speaker: true },
  });

  assert.ok(speeches.length >= 1, `Expected seeded voice notes, found ${speeches.length}`);

  const sampleSpeech = speeches[0];
  assert.ok(sampleSpeech.rubricScores.length > 0, "Speech should have rubric scores");
  assert.ok(sampleSpeech.speaker, "Speech should have an associated speaker");

  await prisma.$disconnect();
});
