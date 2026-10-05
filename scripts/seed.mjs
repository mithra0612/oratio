import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting ORATOR database seeding...");

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

  // 2. Create Speaker Profiles
  const speakerElena = await prisma.speaker.create({
    data: {
      id: "spk-elena-vance",
      name: "Dr. Elena Vance",
      role: "Principal Research Scientist",
      avatar: "EV",
      baselineWpm: 135,
      baselineFillerDensity: 1.8,
      baselinePauseDuration: 1.1,
    },
  });

  const speakerMarcus = await prisma.speaker.create({
    data: {
      id: "spk-marcus-chen",
      name: "Marcus Chen",
      role: "Lead Systems Architect & Founder",
      avatar: "MC",
      baselineWpm: 132,
      baselineFillerDensity: 2.2,
      baselinePauseDuration: 1.2,
    },
  });

  console.log("Speakers created: Elena Vance, Marcus Chen");

  // Pair 1: Technical Presentation - Explaining Retrieval-Augmented Generation
  // IDEAL VERSION
  const idealRagSegments = [
    {
      id: "seg-rag-ideal-1",
      start: 0.0,
      end: 14.5,
      text: "Today we are addressing the fundamental limitation of static language models: knowledge boundaries.",
      wpm: 132,
      eventIds: ["evt-arg-rag-1"],
    },
    {
      id: "seg-rag-ideal-2",
      start: 15.5,
      end: 29.8,
      text: "Retrieval-Augmented Generation bridges this gap by decoupling parametric memory from real-time dynamic retrieval.",
      wpm: 130,
      eventIds: [],
    },
    {
      id: "seg-rag-ideal-3",
      start: 31.0,
      end: 46.2,
      text: "Instead of hallucinating facts, the pipeline queries a dense vector database to supply grounded context directly into the prompt window.",
      wpm: 134,
      eventIds: ["evt-arg-rag-2"],
    },
    {
      id: "seg-rag-ideal-4",
      start: 47.8,
      end: 63.5,
      text: "In our benchmark evaluation across one hundred thousand queries, this approach slashed hallucination rates by eighty-four percent while preserving sub-second latency.",
      wpm: 133,
      eventIds: [],
    },
    {
      id: "seg-rag-ideal-5",
      start: 65.0,
      end: 80.0,
      text: "In summary: dynamic retrieval transforms generative models from unpredictable creative engines into verifiable, production-grade intelligence systems.",
      wpm: 128,
      eventIds: ["evt-rag-ideal-conc"],
    },
  ];

  const speechIdealRag = await prisma.speech.create({
    data: {
      id: "speech-rag-ideal",
      title: "Explaining Retrieval-Augmented Generation",
      category: "Technical Presentation",
      speakerId: speakerElena.id,
      audioUrl: "/samples/ideal-rag.wav",
      durationSeconds: 80.0,
      wordCount: 176,
      wpm: 132.0,
      fillerCount: 1,
      fillerDensity: 0.6,
      pauseCount: 8,
      avgPauseDuration: 1.2,
      longestPause: 1.6,
      silenceRatio: 12.0,
      paceVariation: 8.5,
      overallScore: 88.6,
      isIdeal: true,
      isFlawed: false,
      transcript: idealRagSegments.map((s) => s.text).join(" "),
      transcriptJson: JSON.stringify(idealRagSegments),
    },
  });

  await prisma.analysis.create({
    data: {
      speechId: speechIdealRag.id,
      executiveSummary:
        "Exemplary technical delivery. The speaker articulates complex architectural principles with consistent pacing (132 WPM), precise syntactical pauses, and negligible verbal clutter. Ideas transition seamlessly from theoretical premise to empirical benchmark.",
      deliveryScore: 90.0,
      clarityScore: 92.0,
      structureScore: 89.0,
      contentScore: 88.0,
      fluencyScore: 91.0,
      engagementScore: 84.0,
      linguisticMetricsJson: JSON.stringify({
        clarity: 92,
        conciseness: 89,
        repetition: 91,
        sentenceComplexity: 84,
        vocabularyRichness: 88,
        fillerLanguage: 96,
        weakPhrasing: 90,
        hedging: 92,
        transitions: 88,
      }),
      structuralOutlineJson: JSON.stringify({
        introduction: { start: 0, end: 14.5, text: "Limitation of static language models: knowledge boundaries." },
        thesis: { start: 15.5, end: 29.8, text: "RAG decouples parametric memory from real-time dynamic retrieval." },
        arguments: [
          { id: "arg-1", start: 31.0, end: 46.2, title: "Dense Vector Pipeline", summary: "Querying vector indices to insert grounded facts directly into context." },
          { id: "arg-2", start: 47.8, end: 63.5, title: "Benchmark Validation", summary: "84% reduction in hallucinations with sub-second response times." },
        ],
        supportingPoints: [
          { id: "sp-1", start: 35.0, end: 42.0, title: "Prompt-window context injection" },
          { id: "sp-2", start: 52.0, end: 60.0, title: "100k query stress test latency" },
        ],
        examples: [
          { start: 48.0, end: 58.0, description: "Empirical latency and hallucination benchmark suite" },
        ],
        transitions: [
          { start: 29.8, end: 31.0, from: "Thesis", to: "Pipeline", quality: "Controlled syntactical pause" },
          { start: 63.5, end: 65.0, from: "Benchmark", to: "Conclusion", quality: "Explicit signposted wrap-up" },
        ],
        conclusion: { start: 65.0, end: 80.0, text: "Production-grade verifiable intelligence systems." },
      }),
      contrastiveNotesJson: JSON.stringify([
        "Maintained stable cadence within ±4 WPM across the entire duration.",
        "Deliberate 1.2s pauses preceded technical assertions, allowing listener absorption.",
        "Zero hedging phrases detected ('I guess', 'maybe'); assertions backed by concrete numbers.",
      ]),
      practicePlanJson: JSON.stringify([
        { step: 1, title: "Tactical Micro-pause Hold", instructions: "Hold 1.5s silent pause after stating 'In summary' for dramatic resonance.", duration: "3 mins" },
        { step: 2, title: "Visual Anchor Alignment", instructions: "Coordinate slide build animation to coincide with the 84% benchmark metric.", duration: "5 mins" },
      ]),
    },
  });

  await prisma.rubricScore.createMany({
    data: [
      {
        speechId: speechIdealRag.id,
        category: "Delivery",
        score: 90.0,
        weight: 0.20,
        evidence: "WPM remained tightly bounded at 132 WPM (variance ±8.5 WPM).",
        issueDetected: null,
        explanation: "Measured, stable vocal delivery with clear acoustic separation between thoughts.",
        recommendation: "Continue using this cadence for all architectural presentations.",
      },
      {
        speechId: speechIdealRag.id,
        category: "Clarity",
        score: 92.0,
        weight: 0.20,
        evidence: "Filler density measured at 0.6% (1 minor filler in 80 seconds).",
        issueDetected: null,
        explanation: "High precision terminology with zero colloquial verbal crutches.",
        recommendation: "Retain crisp phonetic articulation on technical abbreviations.",
      },
      {
        speechId: speechIdealRag.id,
        category: "Structure",
        score: 89.0,
        weight: 0.20,
        evidence: "Logical progression: Problem -> Architecture -> Empirical Data -> Conclusion.",
        issueDetected: null,
        explanation: "Textbook rhetorical scaffolding providing continuous audience orientation.",
        recommendation: "Add an explicit transition hook between retrieval mechanics and vector storage.",
      },
      {
        speechId: speechIdealRag.id,
        category: "Content",
        score: 88.0,
        weight: 0.15,
        evidence: "Includes specific benchmark parameters: 100k queries, 84% reduction, sub-second latency.",
        issueDetected: null,
        explanation: "High evidential density and rigorous technical substance.",
        recommendation: "Consider briefly touching on the re-ranking mechanism.",
      },
      {
        speechId: speechIdealRag.id,
        category: "Fluency",
        score: 91.0,
        weight: 0.15,
        evidence: "Average pause duration 1.2s; zero prolonged dead air or false starts.",
        issueDetected: null,
        explanation: "Smooth melodic flow between syntactic boundaries.",
        recommendation: "Maintain breath support into the final sentence.",
      },
      {
        speechId: speechIdealRag.id,
        category: "Engagement",
        score: 84.0,
        weight: 0.10,
        evidence: "Vocal inflection rises dynamically at the introduction of benchmark results.",
        issueDetected: null,
        explanation: "Effective dynamic contrast between diagnostic framing and breakthrough claims.",
        recommendation: "Inject a subtle pause before 'eighty-four percent' to heighten impact.",
      },
    ],
  });

  await prisma.temporalEvent.createMany({
    data: [
      {
        speechId: speechIdealRag.id,
        eventType: "KEY_ARGUMENT",
        severity: "info",
        startTimestamp: 15.5,
        endTimestamp: 29.8,
        label: "Thesis Formulation",
        description: "Clear articulation of the core RAG decoupling paradigm.",
        evidence: "Clean delivery at 130 WPM with steady vocal volume.",
        recommendation: "Optimal formulation; keep this structure for technical executive briefings.",
        metricValue: 130,
        metricUnit: "WPM",
      },
      {
        speechId: speechIdealRag.id,
        eventType: "STRUCTURAL_TRANSITION",
        severity: "info",
        startTimestamp: 46.2,
        endTimestamp: 47.8,
        label: "Transition to Empirical Evidence",
        description: "1.6-second deliberate pause providing cognitive separation before statistics.",
        evidence: "Intentional pause duration 1.6s.",
        recommendation: "Textbook transitional pause.",
        metricValue: 1.6,
        metricUnit: "sec",
      },
      {
        speechId: speechIdealRag.id,
        eventType: "CONCLUSION",
        severity: "info",
        startTimestamp: 65.0,
        endTimestamp: 80.0,
        label: "Summative Conclusion",
        description: "Deceleration to 128 WPM anchoring the strategic value proposition.",
        evidence: "Pacing decelerated by 4 WPM to emphasize final takeaway.",
        recommendation: "Excellent concluding cadence.",
        metricValue: 128,
        metricUnit: "WPM",
      },
    ],
  });

  await prisma.recommendation.createMany({
    data: [
      {
        speechId: speechIdealRag.id,
        title: "Tactical Pause at Quantitative Claims",
        category: "Delivery",
        priority: "low",
        description: "Insert a 0.8s micro-pause immediately before quoting the 'eighty-four percent' metric to give numerical milestones extra resonance.",
        actionableDrill: "Record the empirical segment 3 times, clapping silently right before the percentage figure.",
        targetTimestamp: 54.0,
      },
    ],
  });

  // FLAWED VERSION
  const flawedRagSegments = [
    {
      id: "seg-rag-flawed-1",
      start: 0.0,
      end: 11.2,
      text: "Um, so basically, what we are trying to talk about here is, like, language models and how they kind of have knowledge limits, right?",
      wpm: 155,
      eventIds: ["evt-flawed-1"],
    },
    {
      id: "seg-rag-flawed-2",
      start: 11.8,
      end: 24.5,
      text: "And so RAG, which is Retrieval-Augmented Generation, it sort of like pulls stuff from outside to fix the memory, so yeah.",
      wpm: 162,
      eventIds: ["evt-flawed-2"],
    },
    {
      id: "seg-rag-flawed-3",
      start: 25.0,
      end: 38.0,
      text: "Instead of hallucinating facts it queries a vector database really fast to shove the context directly into the prompt window before the model answers.",
      wpm: 175,
      eventIds: ["evt-flawed-pace"],
    },
    {
      id: "seg-rag-flawed-4",
      start: 41.5,
      end: 58.0,
      text: "And in our tests, like, we saw hallucinations drop by, I think, eighty-four percent, and the latency was pretty good, sub-second latency.",
      wpm: 156,
      eventIds: ["evt-flawed-pause", "evt-flawed-hedge"],
    },
    {
      id: "seg-rag-flawed-5",
      start: 58.8,
      end: 75.0,
      text: "So yeah, basically in conclusion, retrieval makes models way better and actually usable in production, so that is pretty much it.",
      wpm: 148,
      eventIds: ["evt-flawed-conc"],
    },
  ];

  const speechFlawedRag = await prisma.speech.create({
    data: {
      id: "speech-rag-flawed",
      title: "Explaining Retrieval-Augmented Generation (Unstructured)",
      category: "Technical Presentation",
      speakerId: speakerElena.id,
      audioUrl: "/samples/flawed-rag.wav",
      durationSeconds: 75.0,
      wordCount: 202,
      wpm: 161.6,
      fillerCount: 14,
      fillerDensity: 6.9,
      pauseCount: 4,
      avgPauseDuration: 0.6,
      longestPause: 3.5,
      silenceRatio: 4.8,
      paceVariation: 29.4,
      overallScore: 61.4,
      isIdeal: false,
      isFlawed: true,
      transcript: flawedRagSegments.map((s) => s.text).join(" "),
      transcriptJson: JSON.stringify(flawedRagSegments),
    },
  });

  await prisma.analysis.create({
    data: {
      speechId: speechFlawedRag.id,
      executiveSummary:
        "Delivery stability is compromised by severe pace spikes (reaching 175 WPM at 00:25) and elevated filler density (6.9%). Verbal hedges ('kind of', 'sort of', 'I think') and informal crutches dilute technical authority. An awkward 3.5s pause at 00:38 disrupts audience momentum.",
      deliveryScore: 58.0,
      clarityScore: 61.0,
      structureScore: 64.0,
      contentScore: 72.0,
      fluencyScore: 52.0,
      engagementScore: 60.0,
      linguisticMetricsJson: JSON.stringify({
        clarity: 61,
        conciseness: 54,
        repetition: 49,
        sentenceComplexity: 68,
        vocabularyRichness: 62,
        fillerLanguage: 44,
        weakPhrasing: 51,
        hedging: 48,
        transitions: 52,
      }),
      structuralOutlineJson: JSON.stringify({
        introduction: { start: 0, end: 11.2, text: "Informal opening with filler vocalizations." },
        thesis: { start: 11.8, end: 24.5, text: "Vague description of RAG pulling external content." },
        arguments: [
          { id: "arg-1", start: 25.0, end: 38.0, title: "Accelerated Pipeline Claim", summary: "Rushed explanation of vector database injection at 175 WPM." },
          { id: "arg-2", start: 41.5, end: 58.0, title: "Hesitant Test Results", summary: "Hedged reference to 84% reduction following a 3.5s silent stall." },
        ],
        supportingPoints: [
          { id: "sp-1", start: 30.0, end: 36.0, title: "Prompt window insertion" },
          { id: "sp-2", start: 50.0, end: 57.0, title: "Sub-second latency remark" },
        ],
        examples: [
          { start: 45.0, end: 55.0, description: "Unspecified internal benchmark tests" },
        ],
        transitions: [
          { start: 24.5, end: 25.0, from: "Thesis", to: "Pipeline", quality: "Abrupt jump without pause" },
          { start: 38.0, end: 41.5, from: "Pipeline", to: "Results", quality: "Prolonged 3.5s dead air pause" },
        ],
        conclusion: { start: 58.8, end: 75.0, text: "Abrupt wrap-up: 'that is pretty much it'." },
      }),
      contrastiveNotesJson: JSON.stringify([
        "Pace accelerated by 29 WPM (+22%) compared to ideal counterpart.",
        "Filler density surged by 6.3 percentage points (14 fillers vs 1 filler).",
        "Suffered an unscripted 3.5s hesitation before the results section.",
        "Hedging words undermined technical certainty ('I think eighty-four percent').",
      ]),
      practicePlanJson: JSON.stringify([
        { step: 1, title: "Pace Governor Drill", instructions: "Read segment 00:25 - 00:38 at 130 WPM with a physical hand beat.", duration: "5 mins" },
        { step: 2, title: "Filler Elimination Isolation", instructions: "Replace 'um so basically' with silence. Count to two before speaking.", duration: "5 mins" },
        { step: 3, title: "Decisive Assertion Training", instructions: "State benchmark metrics without hedging ('Our data demonstrated', not 'I think').", duration: "4 mins" },
      ]),
    },
  });

  await prisma.rubricScore.createMany({
    data: [
      {
        speechId: speechFlawedRag.id,
        category: "Delivery",
        score: 58.0,
        weight: 0.20,
        evidence: "Pace volatility of 29.4 WPM with acceleration peak at 175 WPM (00:25 - 00:38).",
        issueDetected: "Speaking rate exceeded recommended baseline by 40 WPM during core mechanism.",
        explanation: "Delivery rushes through technical mechanisms before abruptly stalling in silence.",
        recommendation: "Establish a deliberate 130 WPM anchor cadence using diaphragmatic breathing.",
      },
      {
        speechId: speechFlawedRag.id,
        category: "Clarity",
        score: 61.0,
        weight: 0.20,
        evidence: "Contains 14 filler vocalizations across 75 seconds (6.9% filler density).",
        issueDetected: "Clustering of 'um', 'basically', 'like', and 'right?' obscures core message.",
        explanation: "Verbal crutches interfere with auditory processing of technical terms.",
        recommendation: "Practice 1.0s silent pause technique whenever searching for technical vocabulary.",
      },
      {
        speechId: speechFlawedRag.id,
        category: "Structure",
        score: 64.0,
        weight: 0.20,
        evidence: "Sections connected by informal conjunctions ('and so', 'so yeah').",
        issueDetected: "Transitions between architectural layers lack explicit signposting.",
        explanation: "Lacks structural signposts; conclusion trails off into 'that is pretty much it'.",
        recommendation: "Craft formal transitions: 'Having established the problem, let us examine the pipeline.'",
      },
      {
        speechId: speechFlawedRag.id,
        category: "Content",
        score: 72.0,
        weight: 0.15,
        evidence: "Core numbers mentioned but presented with hesitation ('I think, eighty-four percent').",
        issueDetected: "Hedging phrases undermine empirical credibility.",
        explanation: "Accurate architectural concepts are diminished by uncertain phraseology.",
        recommendation: "Commit technical metrics to muscle memory so they are declared with certainty.",
      },
      {
        speechId: speechFlawedRag.id,
        category: "Fluency",
        score: 52.0,
        weight: 0.15,
        evidence: "A 3.5s dead air gap detected at 00:38 followed by false starts.",
        issueDetected: "Long pause of 3.5 seconds disrupted narrative continuity.",
        explanation: "Flow stalled completely mid-speech, creating perceived disorganization.",
        recommendation: "Maintain a mental outline of 3 bullet points to prevent cognitive stalls.",
      },
      {
        speechId: speechFlawedRag.id,
        category: "Engagement",
        score: 60.0,
        weight: 0.10,
        evidence: "Conversational pitch drops at the end of every sentence ('so yeah').",
        issueDetected: "Falling vocal energy and informal pitch inflections.",
        explanation: "Lacks conviction; sounds uncertain of audience value.",
        recommendation: "Finish sentences on a crisp, downward pitch rather than trailing off.",
      },
    ],
  });

  await prisma.temporalEvent.createMany({
    data: [
      {
        speechId: speechFlawedRag.id,
        eventType: "FILLER_DETECTED",
        severity: "flaw",
        startTimestamp: 0.0,
        endTimestamp: 6.5,
        label: "Opening Filler Cluster",
        description: "Four fillers in the opening clause ('um', 'basically', 'like', 'kind of').",
        evidence: "Filler density exceeded 18% in the introductory 6 seconds.",
        recommendation: "Begin with a silent breath and your strong declarative opening statement.",
        metricValue: 4,
        metricUnit: "fillers",
      },
      {
        speechId: speechFlawedRag.id,
        eventType: "PACE_SPIKE",
        severity: "flaw",
        startTimestamp: 25.0,
        endTimestamp: 38.0,
        label: "Pace Spike (175 WPM)",
        description: "Speaking rate accelerated to 175 WPM (+40 WPM above baseline).",
        evidence: "Spoke 38 words in 13 seconds explaining the vector database injection.",
        recommendation: "Reduce delivery speed during technical mechanism descriptions to prevent listener fatigue.",
        metricValue: 175,
        metricUnit: "WPM",
      },
      {
        speechId: speechFlawedRag.id,
        eventType: "LONG_PAUSE",
        severity: "flaw",
        startTimestamp: 38.0,
        endTimestamp: 41.5,
        label: "Unintended Dead Air (3.5s)",
        description: "Silent hesitation of 3.5 seconds following the pace spike.",
        evidence: "Zero audio signal detected for 3.5 seconds before resuming with 'And in our tests'.",
        recommendation: "Use a planned transition anchor rather than prolonged dead air.",
        metricValue: 3.5,
        metricUnit: "sec",
      },
      {
        speechId: speechFlawedRag.id,
        eventType: "WEAK_TRANSITION",
        severity: "warning",
        startTimestamp: 58.8,
        endTimestamp: 63.0,
        label: "Weak Concluding Signpost",
        description: "Informal concluding stem ('So yeah, basically in conclusion').",
        evidence: "Used consecutive informal crutches to introduce the final summary.",
        recommendation: "State 'In conclusion' crisply without verbal qualifiers.",
        metricValue: null,
        metricUnit: null,
      },
    ],
  });

  await prisma.recommendation.createMany({
    data: [
      {
        speechId: speechFlawedRag.id,
        title: "Decelerate During Pipeline Architecture",
        category: "Pacing",
        priority: "high",
        description: "Speaking rate surged to 175 WPM between 00:25 and 00:38. Slow down to 130 WPM so listeners can digest vector search mechanics.",
        actionableDrill: "Use a metronome at 130 BPM; practice speaking one word per beat across this segment.",
        targetTimestamp: 25.0,
      },
      {
        speechId: speechFlawedRag.id,
        title: "Eradicate Verbal Crutches in Intro",
        category: "Clarity",
        priority: "high",
        description: "Remove 'um so basically' and 'like kind of'. Opening with silence commands instant attention.",
        actionableDrill: "Deliver the first sentence 5 times consecutively into a recorder with zero filler words.",
        targetTimestamp: 2.0,
      },
      {
        speechId: speechFlawedRag.id,
        title: "Eliminate Dead Air Stalls",
        category: "Fluency",
        priority: "medium",
        description: "At 00:38, an awkward 3.5s pause created confusion. Bridge directly into empirical test results.",
        actionableDrill: "Rehearse the exact bridge phrase: 'To validate this architecture, our team tested 100,000 queries.'",
        targetTimestamp: 38.0,
      },
    ],
  });

  // Link Pair 1 into DatasetExample
  await prisma.datasetExample.create({
    data: {
      speechId: speechIdealRag.id,
      pairId: "pair-rag",
      category: "Technical Presentation",
      idealOrFlawed: "IDEAL",
      title: "Explaining Retrieval-Augmented Generation (Controlled Archetype)",
      targetFlaws: JSON.stringify([]),
      expectedCharacteristics: "Cadence 132 WPM, 0.6% filler density, structured transitions, precise numeric citations.",
      durationSeconds: 80.0,
      rubricScoresSummary: JSON.stringify({ overall: 88.6, delivery: 90, clarity: 92, structure: 89 }),
      timestampAnnotations: JSON.stringify([
        { time: "00:15", type: "Thesis formulation" },
        { time: "00:46", type: "Transition pause" },
        { time: "00:65", type: "Summative conclusion" },
      ]),
    },
  });

  await prisma.datasetExample.create({
    data: {
      speechId: speechFlawedRag.id,
      pairId: "pair-rag",
      category: "Technical Presentation",
      idealOrFlawed: "FLAWED",
      title: "Explaining Retrieval-Augmented Generation (Unstructured & Rushed)",
      targetFlaws: JSON.stringify(["Pace spike (175 WPM)", "High filler density (6.9%)", "3.5s dead air pause", "Verbal hedging"]),
      expectedCharacteristics: "Severe pacing volatility, excessive vocalized fillers, uncertain phraseology, weak wrap-up.",
      durationSeconds: 75.0,
      rubricScoresSummary: JSON.stringify({ overall: 61.4, delivery: 58, clarity: 61, structure: 64 }),
      timestampAnnotations: JSON.stringify([
        { time: "00:00 - 00:06", type: "Opening filler cluster" },
        { time: "00:25 - 00:38", type: "Pace spike" },
        { time: "00:38 - 00:41", type: "Long pause hesitation" },
        { time: "00:58 - 00:75", type: "Weak conclusion" },
      ]),
    },
  });

  // Pair 2: Business Pitch - Sustainable Packaging Platform
  // IDEAL VERSION
  const idealPitchSegments = [
    { id: "seg-pitch-ideal-1", start: 0.0, end: 13.0, text: "Global supply chains generate ninety million tons of single-use plastic packaging every single year.", wpm: 135 },
    { id: "seg-pitch-ideal-2", start: 14.2, end: 28.5, text: "Our platform, BioCrest, replaces petroleum polymer wrappers with marine-degradable mycelium composites at cost parity.", wpm: 134 },
    { id: "seg-pitch-ideal-3", start: 30.0, end: 44.5, text: "We have already secured pilot contracts with three enterprise logistics partners, representing two million dollars in annual recurring revenue.", wpm: 136 },
    { id: "seg-pitch-ideal-4", start: 46.0, end: 57.5, text: "Our gross margins exceed sixty-two percent, enabled by our patented continuous fungal fermentation process.", wpm: 135 },
    { id: "seg-pitch-ideal-5", start: 59.0, end: 70.0, text: "Join us in decarbonizing commercial freight. We are raising three million dollars to scale manufacturing capacity.", wpm: 131 },
  ];

  const speechIdealPitch = await prisma.speech.create({
    data: {
      id: "speech-pitch-ideal",
      title: "Introducing a Sustainable Packaging Platform",
      category: "Business Pitch",
      speakerId: speakerMarcus.id,
      audioUrl: "/samples/ideal-pitch.wav",
      durationSeconds: 70.0,
      wordCount: 158,
      wpm: 135.4,
      fillerCount: 1,
      fillerDensity: 0.6,
      pauseCount: 7,
      avgPauseDuration: 1.2,
      longestPause: 1.5,
      silenceRatio: 11.5,
      paceVariation: 7.2,
      overallScore: 89.2,
      isIdeal: true,
      isFlawed: false,
      transcript: idealPitchSegments.map((s) => s.text).join(" "),
      transcriptJson: JSON.stringify(idealPitchSegments),
    },
  });

  await prisma.analysis.create({
    data: {
      speechId: speechIdealPitch.id,
      executiveSummary:
        "Compelling, tightly orchestrated business pitch. Financial traction and proprietary technological moat are conveyed with executive clarity. Consistent 135 WPM pace anchors investor confidence.",
      deliveryScore: 91.0,
      clarityScore: 93.0,
      structureScore: 90.0,
      contentScore: 92.0,
      fluencyScore: 89.0,
      engagementScore: 88.0,
      linguisticMetricsJson: JSON.stringify({ clarity: 93, conciseness: 94, repetition: 90, sentenceComplexity: 82, vocabularyRichness: 89, fillerLanguage: 97, weakPhrasing: 92, hedging: 95, transitions: 89 }),
      structuralOutlineJson: JSON.stringify({
        introduction: { start: 0, end: 13.0, text: "Problem: 90M tons of single-use plastic waste." },
        thesis: { start: 14.2, end: 28.5, text: "Solution: Marine-degradable mycelium composites at cost parity." },
        arguments: [
          { id: "arg-1", start: 30.0, end: 44.5, title: "Commercial Traction", summary: "3 enterprise logistics pilots, $2M ARR." },
          { id: "arg-2", start: 46.0, end: 57.5, title: "Unit Economics", summary: "62% gross margins via patented continuous fermentation." },
        ],
        supportingPoints: [{ id: "sp-1", start: 35.0, end: 42.0, title: "Enterprise pilot pipeline" }],
        examples: [{ start: 31.0, end: 40.0, description: "Active commercial logistics contracts" }],
        transitions: [{ start: 28.5, end: 30.0, from: "Solution", to: "Traction", quality: "Crisp commercial pause" }],
        conclusion: { start: 59.0, end: 70.0, text: "Call to Action: Raising $3M to scale manufacturing capacity." },
      }),
      contrastiveNotesJson: JSON.stringify([
        "Pacing maintained within 131 - 136 WPM throughout.",
        "Zero hedging around commercial claims; explicit financial milestones stated crisply.",
        "Clear 1.5s pauses between problem, solution, traction, and ask.",
      ]),
      practicePlanJson: JSON.stringify([
        { step: 1, title: "Executive Close Resonance", instructions: "Lower vocal pitch slightly when asking for the $3M round to project authority.", duration: "3 mins" },
      ]),
    },
  });

  await prisma.rubricScore.createMany({
    data: [
      { speechId: speechIdealPitch.id, category: "Delivery", score: 91.0, weight: 0.20, evidence: "Pace variance of 7.2 WPM; zero rushed clauses.", explanation: "Executive presence and deliberate pacing.", recommendation: "Maintain this delivery tempo for investor meetings." },
      { speechId: speechIdealPitch.id, category: "Clarity", score: 93.0, weight: 0.20, evidence: "0.6% filler density.", explanation: "Sharp articulation of technical and commercial terms.", recommendation: "Flawless clarity." },
      { speechId: speechIdealPitch.id, category: "Structure", score: 90.0, weight: 0.20, evidence: "Classic pitch progression: Problem, Solution, Traction, Economics, Ask.", explanation: "Strict adherence to venture narrative structure.", recommendation: "Add customer quote if time allows." },
      { speechId: speechIdealPitch.id, category: "Content", score: 92.0, weight: 0.15, evidence: "Quotes specific numbers: 90M tons, $2M ARR, 62% margin, $3M ask.", explanation: "High evidential density and investor relevance.", recommendation: "Ready for institutional pitch." },
      { speechId: speechIdealPitch.id, category: "Fluency", score: 89.0, weight: 0.15, evidence: "Average pause 1.2s; no hesitations.", explanation: "Polished vocal delivery.", recommendation: "Keep breath support steady." },
      { speechId: speechIdealPitch.id, category: "Engagement", score: 88.0, weight: 0.10, evidence: "Effective emphasis on 'cost parity' and 'marine-degradable'.", explanation: "High audience engagement.", recommendation: "Maintain eye contact during the final ask." },
    ],
  });

  await prisma.temporalEvent.createMany({
    data: [
      {
        speechId: speechIdealPitch.id,
        eventType: "KEY_ARGUMENT",
        severity: "info",
        startTimestamp: 30.0,
        endTimestamp: 44.5,
        label: "Commercial Traction Milestone",
        description: "Clear delivery of the $2M ARR milestone with steady vocal projection.",
        evidence: "Delivered at 136 WPM with 0 fillers.",
        recommendation: "Excellent delivery.",
        metricValue: 2,
        metricUnit: "M ARR",
      },
    ],
  });

  await prisma.recommendation.createMany({
    data: [
      {
        speechId: speechIdealPitch.id,
        title: "Emphasize Cost Parity Advantage",
        category: "Clarity",
        priority: "low",
        description: "Add a 0.5s pause after stating 'at cost parity' to let the fundamental economic moat sink in.",
        actionableDrill: "Practice segment 00:14 - 00:28 emphasizing 'cost parity' with deliberate vocal drop.",
        targetTimestamp: 26.0,
      },
    ],
  });

  // FLAWED VERSION - Business Pitch
  const flawedPitchSegments = [
    { id: "seg-pitch-flawed-1", start: 0.0, end: 10.5, text: "So, like, basically packaging is a huge issue because companies throw out so much plastic every year, you know?", wpm: 165 },
    { id: "seg-pitch-flawed-2", start: 11.0, end: 21.5, text: "And what we made at BioCrest is this mycelium wrapper thing that basically breaks down in the ocean, kind of like regular organic stuff.", wpm: 172 },
    { id: "seg-pitch-flawed-3", start: 22.0, end: 36.0, text: "And we already have, like, three pilots going with partners and it represents, I think, around two million in ARR or somewhere around there.", wpm: 176 },
    { id: "seg-pitch-flawed-4", start: 39.0, end: 51.0, text: "Our margins are pretty high, like sixty-something percent, because of our special fermentation system that we patented.", wpm: 160 },
    { id: "seg-pitch-flawed-5", start: 51.8, end: 65.0, text: "So yeah, we are raising three million dollars, so if you are interested, definitely talk to us afterwards.", wpm: 168 },
  ];

  const speechFlawedPitch = await prisma.speech.create({
    data: {
      id: "speech-pitch-flawed",
      title: "Introducing a Sustainable Packaging Platform (Rushed)",
      category: "Business Pitch",
      speakerId: speakerMarcus.id,
      audioUrl: "/samples/flawed-pitch.wav",
      durationSeconds: 65.0,
      wordCount: 182,
      wpm: 168.0,
      fillerCount: 12,
      fillerDensity: 6.6,
      pauseCount: 4,
      avgPauseDuration: 0.5,
      longestPause: 3.0,
      silenceRatio: 3.8,
      paceVariation: 26.5,
      overallScore: 63.2,
      isIdeal: false,
      isFlawed: true,
      transcript: flawedPitchSegments.map((s) => s.text).join(" "),
      transcriptJson: JSON.stringify(flawedPitchSegments),
    },
  });

  await prisma.analysis.create({
    data: {
      speechId: speechFlawedPitch.id,
      executiveSummary:
        "The pitch suffers from excessive speed (168 WPM average, peaking at 176 WPM) and conversational diminutives ('wrapper thing', 'sixty-something percent'). Financial traction is hedged ('somewhere around there'), which impairs investor confidence.",
      deliveryScore: 60.0,
      clarityScore: 63.0,
      structureScore: 65.0,
      contentScore: 70.0,
      fluencyScore: 56.0,
      engagementScore: 62.0,
      linguisticMetricsJson: JSON.stringify({ clarity: 63, conciseness: 58, repetition: 52, sentenceComplexity: 66, vocabularyRichness: 64, fillerLanguage: 46, weakPhrasing: 49, hedging: 46, transitions: 54 }),
      structuralOutlineJson: JSON.stringify({
        introduction: { start: 0, end: 10.5, text: "Informal problem statement with filler vocalization." },
        thesis: { start: 11.0, end: 21.5, text: "Imprecise solution description ('wrapper thing')." },
        arguments: [
          { id: "arg-1", start: 22.0, end: 36.0, title: "Rushed Traction Claim", summary: "Pace spike to 176 WPM quoting ARR with hedging." },
          { id: "arg-2", start: 39.0, end: 51.0, title: "Vague Margin Estimate", summary: "'Sixty-something percent' margin claim." },
        ],
        supportingPoints: [{ id: "sp-1", start: 25.0, end: 32.0, title: "Unverified pilot count" }],
        examples: [{ start: 24.0, end: 34.0, description: "Mention of 3 partners" }],
        transitions: [{ start: 21.5, end: 22.0, from: "Solution", to: "Traction", quality: "No pause; runaway momentum" }],
        conclusion: { start: 51.8, end: 65.0, text: "Weak call to action: 'definitely talk to us afterwards'." },
      }),
      contrastiveNotesJson: JSON.stringify([
        "Pace is 33 WPM faster than the ideal archetype (+24%).",
        "Filler density is 6.0 percentage points higher (6.6% vs 0.6%).",
        "Financial numbers are stated with hedging ('around two million', 'sixty-something percent') instead of crisp precision.",
      ]),
      practicePlanJson: JSON.stringify([
        { step: 1, title: "Metric Precision Enforcement", instructions: "Never say 'sixty-something percent'. State 'Sixty-two percent gross margin' firmly.", duration: "4 mins" },
        { step: 2, title: "Deceleration at Traction", instructions: "Force a 1-second pause before announcing '$2M ARR'.", duration: "5 mins" },
      ]),
    },
  });

  await prisma.rubricScore.createMany({
    data: [
      { speechId: speechFlawedPitch.id, category: "Delivery", score: 60.0, weight: 0.20, evidence: "Pace peaked at 176 WPM with variance 26.5 WPM.", issueDetected: "Accelerated tempo leaves listeners breathless.", explanation: "Rushing through commercial claims harms perceived authority.", recommendation: "Anchor pace at 135 WPM." },
      { speechId: speechFlawedPitch.id, category: "Clarity", score: 63.0, weight: 0.20, evidence: "6.6% filler density with colloquial phrasing.", issueDetected: "Terms like 'wrapper thing' diminish technological credibility.", explanation: "Informal jargon weakens scientific differentiation.", recommendation: "Use exact material science nomenclature." },
      { speechId: speechFlawedPitch.id, category: "Structure", score: 65.0, weight: 0.20, evidence: "All points connected by 'and so' without breath pauses.", issueDetected: "Absence of clean rhetorical separations.", explanation: "Rhetorical structure blends into a run-on sentence.", recommendation: "Insert clear 1.5s stops between slides." },
      { speechId: speechFlawedPitch.id, category: "Content", score: 70.0, weight: 0.15, evidence: "Hedging around margins ('sixty-something percent').", issueDetected: "Financial imprecision in investor pitch.", explanation: "Investors expect exact unit economics.", recommendation: "Quote exact financial decimals." },
      { speechId: speechFlawedPitch.id, category: "Fluency", score: 56.0, weight: 0.15, evidence: "12 fillers across 65 seconds.", issueDetected: "Frequent verbal hesitations.", explanation: "High filler density disrupts persuasive flow.", recommendation: "Rehearse with silent pause replacement." },
      { speechId: speechFlawedPitch.id, category: "Engagement", score: 62.0, weight: 0.10, evidence: "Nervous pitch elevation during traction section.", issueDetected: "Pace elevation creates anxiety signal.", explanation: "Appears hurried and defensive.", recommendation: "Plant feet firmly and project downward vocal resonance." },
    ],
  });

  await prisma.temporalEvent.createMany({
    data: [
      {
        speechId: speechFlawedPitch.id,
        eventType: "PACE_SPIKE",
        severity: "flaw",
        startTimestamp: 22.0,
        endTimestamp: 36.0,
        label: "Pace Spike (176 WPM)",
        description: "Speaking rate surged to 176 WPM while presenting commercial traction.",
        evidence: "Spoke 41 words in 14 seconds.",
        recommendation: "Slow down when delivering business traction metrics.",
        metricValue: 176,
        metricUnit: "WPM",
      },
      {
        speechId: speechFlawedPitch.id,
        eventType: "UNCLEAR_PHRASING",
        severity: "warning",
        startTimestamp: 39.0,
        endTimestamp: 47.0,
        label: "Imprecise Financial Metric",
        description: "Hedging: 'sixty-something percent' margins.",
        evidence: "Uncertain numerical statement.",
        recommendation: "State 'Sixty-two percent gross margins' with exact certainty.",
        metricValue: null,
        metricUnit: null,
      },
    ],
  });

  await prisma.recommendation.createMany({
    data: [
      {
        speechId: speechFlawedPitch.id,
        title: "Eliminate Numerical Hedging",
        category: "Clarity",
        priority: "high",
        description: "Never use approximations like 'sixty-something percent' or 'somewhere around there' when presenting financial metrics to investors.",
        actionableDrill: "State your margin, ARR, and round size three times with locked eye contact.",
        targetTimestamp: 42.0,
      },
    ],
  });

  // Link Pair 2 into DatasetExample
  await prisma.datasetExample.create({
    data: {
      speechId: speechIdealPitch.id,
      pairId: "pair-pitch",
      category: "Business Pitch",
      idealOrFlawed: "IDEAL",
      title: "Introducing a Sustainable Packaging Platform (Venture Masterclass)",
      targetFlaws: JSON.stringify([]),
      expectedCharacteristics: "135 WPM steady cadence, 0.6% filler density, quantitative commercial metrics, clear ask.",
      durationSeconds: 70.0,
      rubricScoresSummary: JSON.stringify({ overall: 89.2, delivery: 91, clarity: 93, structure: 90 }),
      timestampAnnotations: JSON.stringify([
        { time: "00:14", type: "Value proposition" },
        { time: "00:30", type: "Traction disclosure" },
        { time: "00:59", type: "Capital ask" },
      ]),
    },
  });

  await prisma.datasetExample.create({
    data: {
      speechId: speechFlawedPitch.id,
      pairId: "pair-pitch",
      category: "Business Pitch",
      idealOrFlawed: "FLAWED",
      title: "Introducing a Sustainable Packaging Platform (Rushed Delivery)",
      targetFlaws: JSON.stringify(["Pace spike (176 WPM)", "Financial hedging", "Colloquial terminology", "High filler density (6.6%)"]),
      expectedCharacteristics: "Runaway cadence, verbal fillers, imprecise margins, weak call to action.",
      durationSeconds: 65.0,
      rubricScoresSummary: JSON.stringify({ overall: 63.2, delivery: 60, clarity: 63, structure: 65 }),
      timestampAnnotations: JSON.stringify([
        { time: "00:00 - 00:10", type: "Informal opening" },
        { time: "00:22 - 00:36", type: "Traction pace spike" },
        { time: "00:39 - 00:47", type: "Hedged margin" },
      ]),
    },
  });

  // Pair 3: Interview Answer - Distributed Systems Architecture
  // IDEAL VERSION
  const idealDistributedSegments = [
    { id: "seg-dist-ideal-1", start: 0.0, end: 15.0, text: "When architecting distributed systems, I prioritize deterministic consensus, partition tolerance, and strict observability.", wpm: 128 },
    { id: "seg-dist-ideal-2", start: 16.5, end: 32.0, text: "In my previous role, our primary payment gateway suffered cascading failures under sudden traffic bursts exceeding fifty thousand transactions per second.", wpm: 127 },
    { id: "seg-dist-ideal-3", start: 33.5, end: 51.0, text: "I led the migration from an ad-hoc locking pattern to a Raft-based distributed log with adaptive client-side rate limiting and token bucket throttles.", wpm: 130 },
    { id: "seg-dist-ideal-4", start: 53.0, end: 70.0, text: "This eliminated all split-brain states and maintained ninety-nine point nine-nine percent service availability during Black Friday peak volumes.", wpm: 129 },
    { id: "seg-dist-ideal-5", start: 71.5, end: 85.0, text: "My foundational takeaway is that distributed resilience requires designing for failure as the standard steady state, not an exceptional edge case.", wpm: 126 },
  ];

  const speechIdealDistributed = await prisma.speech.create({
    data: {
      id: "speech-distributed-ideal",
      title: "My Approach to Distributed Systems Architecture",
      category: "Interview Answer",
      speakerId: speakerMarcus.id,
      audioUrl: "/samples/ideal-distributed.wav",
      durationSeconds: 85.0,
      wordCount: 182,
      wpm: 128.5,
      fillerCount: 1,
      fillerDensity: 0.5,
      pauseCount: 9,
      avgPauseDuration: 1.3,
      longestPause: 1.5,
      silenceRatio: 12.8,
      paceVariation: 6.8,
      overallScore: 90.4,
      isIdeal: true,
      isFlawed: false,
      transcript: idealDistributedSegments.map((s) => s.text).join(" "),
      transcriptJson: JSON.stringify(idealDistributedSegments),
    },
  });

  await prisma.analysis.create({
    data: {
      speechId: speechIdealDistributed.id,
      executiveSummary:
        "Masterful engineering leadership interview answer adhering precisely to the STAR methodology (Situation, Task, Action, Result). Delivered at a calm 128 WPM with deep technical authority and zero verbal clutter.",
      deliveryScore: 92.0,
      clarityScore: 94.0,
      structureScore: 92.0,
      contentScore: 93.0,
      fluencyScore: 90.0,
      engagementScore: 86.0,
      linguisticMetricsJson: JSON.stringify({ clarity: 94, conciseness: 92, repetition: 91, sentenceComplexity: 86, vocabularyRichness: 90, fillerLanguage: 98, weakPhrasing: 94, hedging: 96, transitions: 91 }),
      structuralOutlineJson: JSON.stringify({
        introduction: { start: 0, end: 15.0, text: "Core philosophy: deterministic consensus, partition tolerance, observability." },
        thesis: { start: 16.5, end: 32.0, text: "Situation: Cascading failures under 50k TPS spikes." },
        arguments: [
          { id: "arg-1", start: 33.5, end: 51.0, title: "Architectural Action", summary: "Raft distributed log with adaptive token bucket throttling." },
          { id: "arg-2", start: 53.0, end: 70.0, title: "Empirical Result", summary: "Zero split-brain states; 99.99% availability during Black Friday." },
        ],
        supportingPoints: [{ id: "sp-1", start: 40.0, end: 48.0, title: "Token bucket rate limiting" }],
        examples: [{ start: 58.0, end: 68.0, description: "Black Friday peak volume scale validation" }],
        transitions: [{ start: 32.0, end: 33.5, from: "Situation", to: "Action", quality: "Controlled transitional pause" }],
        conclusion: { start: 71.5, end: 85.0, text: "Philosophy: Design for failure as the steady state." },
      }),
      contrastiveNotesJson: JSON.stringify([
        "Strictly bounded 126 - 130 WPM pacing demonstrates technical composure under interview pressure.",
        "Syntactical pauses allow complex distributed concepts (Raft, split-brain) to register clearly.",
        "Employs active first-person leadership verbs ('I led the migration', 'I prioritize').",
      ]),
      practicePlanJson: JSON.stringify([
        { step: 1, title: "Leadership Reflection Pause", instructions: "Extend the pause after 'exceptional edge case' to invite the interviewer's follow-up question.", duration: "3 mins" },
      ]),
    },
  });

  await prisma.rubricScore.createMany({
    data: [
      { speechId: speechIdealDistributed.id, category: "Delivery", score: 92.0, weight: 0.20, evidence: "128 WPM average; variance 6.8 WPM.", explanation: "Poised, authoritative technical delivery.", recommendation: "Continue this cadence in all executive interviews." },
      { speechId: speechIdealDistributed.id, category: "Clarity", score: 94.0, weight: 0.20, evidence: "0.5% filler density.", explanation: "Flawless articulation of complex technical vocabulary.", recommendation: "Maintained exceptional clarity." },
      { speechId: speechIdealDistributed.id, category: "Structure", score: 92.0, weight: 0.20, evidence: "Textbook STAR format executed cleanly.", explanation: "Interview question structured with precision.", recommendation: "Optimal answer architecture." },
      { speechId: speechIdealDistributed.id, category: "Content", score: 93.0, weight: 0.15, evidence: "Mentions 50k TPS, Raft consensus, 99.99% uptime.", explanation: "High informational density and engineering depth.", recommendation: "Ready for Staff/Principal interviews." },
      { speechId: speechIdealDistributed.id, category: "Fluency", score: 90.0, weight: 0.15, evidence: "Average pause 1.3s; no stutters.", explanation: "Smooth articulation without cognitive hesitations.", recommendation: "Excellent flow." },
      { speechId: speechIdealDistributed.id, category: "Engagement", score: 86.0, weight: 0.10, evidence: "Steady eye-level vocal energy.", explanation: "Engaging technical storytelling.", recommendation: "Add brief smile at conclusion." },
    ],
  });

  await prisma.temporalEvent.createMany({
    data: [
      {
        speechId: speechIdealDistributed.id,
        eventType: "KEY_ARGUMENT",
        severity: "info",
        startTimestamp: 33.5,
        endTimestamp: 51.0,
        label: "Architectural Action",
        description: "Clear recitation of Raft consensus and token bucket mitigation.",
        evidence: "Spoke 38 words at 130 WPM with 0 fillers.",
        recommendation: "Textbook architectural description.",
        metricValue: 130,
        metricUnit: "WPM",
      },
    ],
  });

  await prisma.recommendation.createMany({
    data: [
      {
        speechId: speechIdealDistributed.id,
        title: "Maintain Executive Presence",
        category: "Delivery",
        priority: "low",
        description: "Your 128 WPM cadence reflects senior engineering maturity. Maintain this exact steady state in real-time interviews.",
        actionableDrill: "Practice answering behavioral system design questions at 128 WPM with zero filler words.",
        targetTimestamp: 10.0,
      },
    ],
  });

  // FLAWED VERSION - Interview Answer
  const flawedDistributedSegments = [
    { id: "seg-dist-flawed-1", start: 0.0, end: 12.0, text: "Um, so yeah, distributed systems are pretty hard, like, I usually try to make sure things do not break, you know?", wpm: 120 },
    { id: "seg-dist-flawed-2", start: 16.0, end: 30.0, text: "At my last job, um, we had this massive crash where, like, the whole payment service just totally went down because of too much traffic.", wpm: 115 },
    { id: "seg-dist-flawed-3", start: 34.5, end: 50.0, text: "And, uh... let me think... yeah, we basically had to change our database locks and use, like, Raft, which kind of helped a lot.", wpm: 108 },
    { id: "seg-dist-flawed-4", start: 54.0, end: 70.0, text: "And so, yeah, after that Black Friday was fine, we did not crash, and, uh, it was pretty successful overall.", wpm: 112 },
  ];

  const speechFlawedDistributed = await prisma.speech.create({
    data: {
      id: "speech-distributed-flawed",
      title: "My Approach to Distributed Systems Architecture (Hesitant)",
      category: "Interview Answer",
      speakerId: speakerMarcus.id,
      audioUrl: "/samples/flawed-distributed.wav",
      durationSeconds: 70.0,
      wordCount: 132,
      wpm: 113.1,
      fillerCount: 11,
      fillerDensity: 8.3,
      pauseCount: 6,
      avgPauseDuration: 2.8,
      longestPause: 4.5,
      silenceRatio: 24.5,
      paceVariation: 21.0,
      overallScore: 57.8,
      isIdeal: false,
      isFlawed: true,
      transcript: flawedDistributedSegments.map((s) => s.text).join(" "),
      transcriptJson: JSON.stringify(flawedDistributedSegments),
    },
  });

  await prisma.analysis.create({
    data: {
      speechId: speechFlawedDistributed.id,
      executiveSummary:
        "The candidate exhibits debilitating hesitation, extended dead air (4.5s pause at 00:30), and excessive filler density (8.3%). Technical metrics (50k TPS, 99.99% availability) are omitted entirely in favor of colloquial phrases ('went down', 'pretty successful').",
      deliveryScore: 54.0,
      clarityScore: 59.0,
      structureScore: 61.0,
      contentScore: 65.0,
      fluencyScore: 48.0,
      engagementScore: 58.0,
      linguisticMetricsJson: JSON.stringify({ clarity: 59, conciseness: 52, repetition: 46, sentenceComplexity: 58, vocabularyRichness: 55, fillerLanguage: 38, weakPhrasing: 42, hedging: 40, transitions: 48 }),
      structuralOutlineJson: JSON.stringify({
        introduction: { start: 0, end: 12.0, text: "Vague philosophical platitude ('distributed systems are pretty hard')." },
        thesis: { start: 16.0, end: 30.0, text: "Situation: Unquantified crash during traffic spike." },
        arguments: [
          { id: "arg-1", start: 34.5, end: 50.0, title: "Hesitant Action", summary: "Extended pause followed by uncertain reference to Raft." },
          { id: "arg-2", start: 54.0, end: 70.0, title: "Vague Outcome", summary: "'Black Friday was fine... pretty successful'." },
        ],
        supportingPoints: [{ id: "sp-1", start: 40.0, end: 46.0, title: "Database lock change" }],
        examples: [{ start: 55.0, end: 65.0, description: "Unquantified Black Friday reference" }],
        transitions: [{ start: 30.0, end: 34.5, from: "Situation", to: "Action", quality: "Disastrous 4.5s dead air silence" }],
        conclusion: { start: 65.0, end: 70.0, text: "'It was pretty successful overall' with downward energy." },
      }),
      contrastiveNotesJson: JSON.stringify([
        "Suffered from prolonged dead air gaps (longest pause 4.5s vs 1.5s in ideal).",
        "Filler density is 7.8 percentage points higher (8.3% vs 0.5%).",
        "Failed to mention key architectural metrics (TPS, SLA numbers, consensus mechanisms).",
        "Passive framing ('we had this crash') instead of proactive leadership.",
      ]),
      practicePlanJson: JSON.stringify([
        { step: 1, title: "STAR Framework Memorization", instructions: "Practice structuring the response into 4 distinct 20-second blocks.", duration: "6 mins" },
        { step: 2, title: "Metrics Anchoring Drill", instructions: "Write down 50k TPS and 99.99% uptime on a card and reference them directly.", duration: "4 mins" },
      ]),
    },
  });

  await prisma.rubricScore.createMany({
    data: [
      { speechId: speechFlawedDistributed.id, category: "Delivery", score: 54.0, weight: 0.20, evidence: "Sluggish 113 WPM pace with 24.5% dead air silence ratio.", issueDetected: "Extended pauses convey uncertainty and lack of preparation.", explanation: "Delivery feels halting and unconfident.", recommendation: "Eliminate long dead air pauses." },
      { speechId: speechFlawedDistributed.id, category: "Clarity", score: 59.0, weight: 0.20, evidence: "8.3% filler density (11 fillers in 70s).", issueDetected: "Relying on 'um', 'like', 'uh' during cognitive recall.", explanation: "Verbal clutter masks technical knowledge.", recommendation: "Use silent pauses instead of vocalized crutches." },
      { speechId: speechFlawedDistributed.id, category: "Structure", score: 61.0, weight: 0.20, evidence: "STAR narrative broken by 4.5s cognitive stall.", issueDetected: "Lost thread of response between Situation and Action.", explanation: "Disorganized rhetorical progression.", recommendation: "Follow the STAR outline explicitly." },
      { speechId: speechFlawedDistributed.id, category: "Content", score: 65.0, weight: 0.15, evidence: "Omitted architectural metrics; vague technical references.", issueDetected: "Lacks quantitative evidence required for senior engineering roles.", explanation: "Fails to prove engineering impact.", recommendation: "State specific numbers and system tradeoffs." },
      { speechId: speechFlawedDistributed.id, category: "Fluency", score: 48.0, weight: 0.15, evidence: "Longest pause 4.5s; verbal stalling.", issueDetected: "Critical flow breakdown at 00:30.", explanation: "Disrupted fluency and awkward silence.", recommendation: "Prepare mental bullet points before speaking." },
      { speechId: speechFlawedDistributed.id, category: "Engagement", score: 58.0, weight: 0.10, evidence: "Flat conversational tone with downward inflections.", issueDetected: "Low energy reflects defeatism.", explanation: "Does not inspire technical confidence.", recommendation: "Project energy and conviction in system achievements." },
    ],
  });

  await prisma.temporalEvent.createMany({
    data: [
      {
        speechId: speechFlawedDistributed.id,
        eventType: "LONG_PAUSE",
        severity: "flaw",
        startTimestamp: 30.0,
        endTimestamp: 34.5,
        label: "Prolonged Dead Air (4.5s)",
        description: "Severe 4.5-second silence while attempting to recall technical architecture.",
        evidence: "Dead air duration 4.5 seconds.",
        recommendation: "Never stall in silence during an interview; use a bridging stem: 'Specifically, the architectural challenge was...'",
        metricValue: 4.5,
        metricUnit: "sec",
      },
      {
        speechId: speechFlawedDistributed.id,
        eventType: "FILLER_DETECTED",
        severity: "flaw",
        startTimestamp: 34.5,
        endTimestamp: 40.0,
        label: "Filler Vocalization Cluster",
        description: "Candidate uttered 'And, uh... let me think... yeah, we basically'.",
        evidence: "4 verbal crutches uttered within 5.5 seconds.",
        recommendation: "Take one silent breath instead of vocalizing cognitive latency.",
        metricValue: 4,
        metricUnit: "fillers",
      },
    ],
  });

  await prisma.recommendation.createMany({
    data: [
      {
        speechId: speechFlawedDistributed.id,
        title: "Eliminate Cognitive Stalls",
        category: "Fluency",
        priority: "high",
        description: "The 4.5s silence at 00:30 conveys panic to an interviewer. Practice bridging phrases that buy time without awkward silence.",
        actionableDrill: "Practice using: 'The core bottleneck we identified was...' whenever your mind searches for an architectural detail.",
        targetTimestamp: 30.0,
      },
    ],
  });

  // Link Pair 3 into DatasetExample
  await prisma.datasetExample.create({
    data: {
      speechId: speechIdealDistributed.id,
      pairId: "pair-distributed",
      category: "Interview Answer",
      idealOrFlawed: "IDEAL",
      title: "My Approach to Distributed Systems Architecture (Executive Archetype)",
      targetFlaws: JSON.stringify([]),
      expectedCharacteristics: "128 WPM poised cadence, 0.5% filler density, STAR format, high technical and numerical precision.",
      durationSeconds: 85.0,
      rubricScoresSummary: JSON.stringify({ overall: 90.4, delivery: 92, clarity: 94, structure: 92 }),
      timestampAnnotations: JSON.stringify([
        { time: "00:16", type: "Situation outline" },
        { time: "00:33", type: "Architectural action" },
        { time: "00:53", type: "Empirical result" },
      ]),
    },
  });

  await prisma.datasetExample.create({
    data: {
      speechId: speechFlawedDistributed.id,
      pairId: "pair-distributed",
      category: "Interview Answer",
      idealOrFlawed: "FLAWED",
      title: "My Approach to Distributed Systems Architecture (Halting & Unprepared)",
      targetFlaws: JSON.stringify(["4.5s dead air pause", "High filler density (8.3%)", "Missing technical metrics", "Sluggish delivery (113 WPM)"]),
      expectedCharacteristics: "Extended hesitation, lack of metrics, conversational fillers, low technical authority.",
      durationSeconds: 70.0,
      rubricScoresSummary: JSON.stringify({ overall: 57.8, delivery: 54, clarity: 59, structure: 61 }),
      timestampAnnotations: JSON.stringify([
        { time: "00:00 - 00:12", type: "Vague intro" },
        { time: "00:30 - 00:34", type: "4.5s dead air" },
        { time: "00:34 - 00:40", type: "Verbal filler cluster" },
      ]),
    },
  });

  console.log("Database seeded successfully with 6 speeches (3 Ideal, 3 Flawed) across 3 contrastive pairs!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
