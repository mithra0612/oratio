import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting Oratio database seeding...");

  // Clean existing data
  await prisma.systemSetting.deleteMany();
  await prisma.temporalEvent.deleteMany();
  await prisma.rubricScore.deleteMany();
  await prisma.recommendation.deleteMany();
  await prisma.analysis.deleteMany();
  await prisma.datasetExample.deleteMany();
  await prisma.speech.deleteMany();
  await prisma.speaker.deleteMany();

  // 1. Create System Setting
  await prisma.systemSetting.create({
    data: {
      id: "global",
      demoMode: true,
      weightDelivery: 0.20,
      weightClarity: 0.20,
      weightStructure: 0.20,
      weightContent: 0.15,
      weightFluency: 0.15,
      weightEngagement: 0.10,
      autoSyncAudio: true,
    },
  });

  // 2. Create Default Personal Speaker: "You"
  const speakerYou = await prisma.speaker.create({
    data: {
      id: "spk-you",
      name: "You",
      role: "Personal Voice Profile",
      avatar: "YOU",
      baselineWpm: 138,
      baselineFillerDensity: 1.8,
      baselinePauseDuration: 1.0,
    },
  });

  console.log("Personal speaker profile created: You");

  // 3. Seed Note 1: Weekly Project Update Memo
  const note1Segments = [
    {
      id: "seg-1-0",
      start: 0,
      end: 12.0,
      text: "Good morning team. Here is a quick voice memo outlining our key deliverables for the week.",
      wpm: 135,
    },
    {
      id: "seg-1-1",
      start: 12.0,
      end: 27.5,
      text: "First, the new audio ingestion pipeline is now complete with support for live microphone capture and audio file uploads.",
      wpm: 140,
    },
    {
      id: "seg-1-2",
      start: 27.5,
      end: 41.0,
      text: "Second, our cadence analysis runs in under two seconds, accurately measuring words per minute and identifying verbal fillers.",
      wpm: 138,
    },
    {
      id: "seg-1-3",
      start: 41.0,
      end: 54.0,
      text: "Finally, we will review the initial user testing feedback on Thursday. Please check the dashboard and let me know if you have any thoughts.",
      wpm: 132,
    },
  ];

  const speech1 = await prisma.speech.create({
    data: {
      id: "note-project-update",
      title: "Weekly Project Update Memo",
      category: "Voice Note",
      speakerId: speakerYou.id,
      audioUrl: "/samples/ideal-rag.wav",
      durationSeconds: 54,
      wordCount: 122,
      wpm: 136,
      fillerCount: 1,
      fillerDensity: 0.8,
      pauseCount: 4,
      avgPauseDuration: 1.1,
      longestPause: 1.6,
      silenceRatio: 7.2,
      paceVariation: 6.8,
      overallScore: 88,
      isIdeal: true,
      isFlawed: false,
      transcript:
        "Good morning team. Here is a quick voice memo outlining our key deliverables for the week. First, the new audio ingestion pipeline is now complete with support for live microphone capture and audio file uploads. Second, our cadence analysis runs in under two seconds, accurately measuring words per minute and identifying verbal fillers. Finally, we will review the initial user testing feedback on Thursday. Please check the dashboard and let me know if you have any thoughts.",
      transcriptJson: JSON.stringify(note1Segments),
    },
  });

  await prisma.analysis.create({
    data: {
      speechId: speech1.id,
      executiveSummary:
        "Outstanding voice delivery with balanced pacing (136 WPM), crisp articulation, and minimal filler usage (0.8%). Pauses were placed naturally between topical shifts.",
      deliveryScore: 89,
      clarityScore: 91,
      structureScore: 88,
      contentScore: 86,
      fluencyScore: 88,
      engagementScore: 85,
      linguisticMetricsJson: JSON.stringify({
        wordVariety: "High",
        averageSentenceLength: 14.5,
        passiveVoiceRatio: "6%",
        fillerDensity: "0.8%",
      }),
      structuralOutlineJson: JSON.stringify({
        intro: "Greeting & Purpose (0:00 - 0:12)",
        deliverable1: "Pipeline Status (0:12 - 0:27)",
        deliverable2: "Cadence Engine (0:27 - 0:41)",
        conclusion: "Next Steps & Action Item (0:41 - 0:54)",
      }),
      contrastiveNotesJson: JSON.stringify([]),
      practicePlanJson: JSON.stringify([
        {
          step: 1,
          title: "Maintain Cadence Stability",
          instructions: "Continue pacing your updates between 130 and 145 WPM for optimal comprehension.",
          duration: "2 min daily",
        },
      ]),
    },
  });

  await prisma.rubricScore.createMany({
    data: [
      {
        speechId: speech1.id,
        category: "Delivery",
        score: 89,
        weight: 0.20,
        evidence: "136 WPM average cadence within target 130-150 range. Pause duration 1.1s is natural.",
        explanation: "Cadence is stable and natural across the duration.",
        recommendation: "Maintain steady breathing during transitions.",
      },
      {
        speechId: speech1.id,
        category: "Clarity",
        score: 91,
        weight: 0.20,
        evidence: "Single filler detected (0.8% density), well below the 2.5% threshold.",
        explanation: "Verbal crutches were virtually absent.",
        recommendation: "Keep using intentional silence instead of fillers.",
      },
      {
        speechId: speech1.id,
        category: "Structure",
        score: 88,
        weight: 0.20,
        evidence: "Clear three-part structure signposted with 'First', 'Second', and 'Finally'.",
        explanation: "Strong signposting aids listener navigation.",
        recommendation: "Continue opening memos with an upfront thesis.",
      },
      {
        speechId: speech1.id,
        category: "Content",
        score: 86,
        weight: 0.15,
        evidence: "Specific project updates and measurable metrics cited.",
        explanation: "High information density without unnecessary preamble.",
        recommendation: "Include target dates for upcoming milestones.",
      },
      {
        speechId: speech1.id,
        category: "Fluency",
        score: 88,
        weight: 0.15,
        evidence: "No dead air stalls (>2.0s) detected.",
        explanation: "Continuous conversational rhythm without cognitive hesitation.",
        recommendation: "Preserve natural pacing when explaining complex technical mechanisms.",
      },
      {
        speechId: speech1.id,
        category: "Engagement",
        score: 85,
        weight: 0.10,
        evidence: "Prosodic inflections emphasized key milestones.",
        explanation: "Friendly, authoritative tone suitable for asynchronous team memos.",
        recommendation: "Vary pitch modulation slightly when concluding.",
      },
    ],
  });

  // 4. Seed Note 2: Architecture Design Notes
  const note2Segments = [
    {
      id: "seg-2-0",
      start: 0,
      end: 14.0,
      text: "Hey everyone, recording some quick thoughts on the audio streaming architecture.",
      wpm: 138,
    },
    {
      id: "seg-2-1",
      start: 14.0,
      end: 28.5,
      text: "When handling incoming microphone streams or uploaded files, we want to ensure immediate browser-side feedback before sending the audio to the server.",
      wpm: 144,
    },
    {
      id: "seg-2-2",
      start: 28.5,
      end: 44.0,
      text: "By calculating the waveform buffer locally, the user gets instant visual confirmation without waiting for round-trip latency.",
      wpm: 140,
    },
    {
      id: "seg-2-3",
      start: 44.0,
      end: 58.0,
      text: "Let's make sure we test this with larger files above twenty megabytes.",
      wpm: 132,
    },
  ];

  const speech2 = await prisma.speech.create({
    data: {
      id: "note-architecture-design",
      title: "Architecture Design Notes",
      category: "Voice Note",
      speakerId: speakerYou.id,
      audioUrl: "/samples/ideal-pitch.wav",
      durationSeconds: 58,
      wordCount: 134,
      wpm: 139,
      fillerCount: 2,
      fillerDensity: 1.5,
      pauseCount: 5,
      avgPauseDuration: 1.0,
      longestPause: 1.8,
      silenceRatio: 6.9,
      paceVariation: 7.2,
      overallScore: 85,
      isIdeal: true,
      isFlawed: false,
      transcript:
        "Hey everyone, recording some quick thoughts on the audio streaming architecture. When handling incoming microphone streams or uploaded files, we want to ensure immediate browser-side feedback before sending the audio to the server. By calculating the waveform buffer locally, the user gets instant visual confirmation without waiting for round-trip latency. Let's make sure we test this with larger files above twenty megabytes.",
      transcriptJson: JSON.stringify(note2Segments),
    },
  });

  await prisma.analysis.create({
    data: {
      speechId: speech2.id,
      executiveSummary:
        "Strong technical voice memo with steady cadence (139 WPM). Low filler density (1.5%) and concise problem framing.",
      deliveryScore: 86,
      clarityScore: 88,
      structureScore: 84,
      contentScore: 85,
      fluencyScore: 85,
      engagementScore: 82,
      linguisticMetricsJson: JSON.stringify({
        wordVariety: "Moderate-High",
        averageSentenceLength: 16.0,
        passiveVoiceRatio: "8%",
        fillerDensity: "1.5%",
      }),
      structuralOutlineJson: JSON.stringify({
        intro: "Context Setting (0:00 - 0:14)",
        coreMechanism: "Local Waveform Buffering (0:14 - 0:44)",
        conclusion: "Testing Edge Case (0:44 - 0:58)",
      }),
      contrastiveNotesJson: JSON.stringify([]),
      practicePlanJson: JSON.stringify([
        {
          step: 1,
          title: "Pause for Emphasis",
          instructions: "Introduce a 1.2s pause right after key architectural principles to let listeners process the concept.",
          duration: "3 min daily",
        },
      ]),
    },
  });

  await prisma.rubricScore.createMany({
    data: [
      {
        speechId: speech2.id,
        category: "Delivery",
        score: 86,
        weight: 0.20,
        evidence: "139 WPM cadence is optimal for technical explanation.",
        explanation: "Good conversational tempo throughout.",
        recommendation: "Allow a slight pause before transition points.",
      },
      {
        speechId: speech2.id,
        category: "Clarity",
        score: 88,
        weight: 0.20,
        evidence: "1.5% filler density is well within safe bounds.",
        explanation: "Technical terminology used accurately.",
        recommendation: "Continue enunciating technical jargon clearly.",
      },
      {
        speechId: speech2.id,
        category: "Structure",
        score: 84,
        weight: 0.20,
        evidence: "Logical progression from problem statement to architectural solution.",
        explanation: "Clear technical flow.",
        recommendation: "Add an explicit summary sentence at the conclusion.",
      },
      {
        speechId: speech2.id,
        category: "Content",
        score: 85,
        weight: 0.15,
        evidence: "Concrete technical trade-offs discussed (latency vs buffer calculation).",
        explanation: "High signal-to-noise ratio.",
        recommendation: "Mention exact file formats tested.",
      },
      {
        speechId: speech2.id,
        category: "Fluency",
        score: 85,
        weight: 0.15,
        evidence: "Smooth transition between architectural concepts.",
        explanation: "No hesitation stalls detected.",
        recommendation: "Maintain steady breathing across long compound sentences.",
      },
      {
        speechId: speech2.id,
        category: "Engagement",
        score: 82,
        weight: 0.10,
        evidence: "Dynamic inflection on key technical terms.",
        explanation: "Natural and engaging delivery.",
        recommendation: "Lift energy slightly when introducing testing recommendations.",
      },
    ],
  });

  // Add 1 mild pace marker for demonstration of temporal grounding
  await prisma.temporalEvent.create({
    data: {
      speechId: speech2.id,
      eventType: "PACE_SPIKE",
      severity: "info",
      startTimestamp: 14.0,
      endTimestamp: 28.5,
      label: "Cadence Acceleration (+6 WPM)",
      description: "Pacing accelerated slightly during streaming architecture description.",
      evidence: "Spoke 35 words in 14.5 seconds (144 WPM vs 138 WPM baseline).",
      recommendation: "Maintain steady cadence during complex technical descriptions.",
      metricValue: 144,
      metricUnit: "WPM",
    },
  });

  console.log("Seeding finished successfully with 2 clean personal voice notes!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
