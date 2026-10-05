export type SpeechCategory =
  | "Technical Presentation"
  | "Interview Answer"
  | "Business Pitch"
  | "Academic Presentation"
  | "Public Speaking"
  | "Product Explanation";

export type EventSeverity = "info" | "warning" | "flaw";

export type TemporalEventType =
  | "PACE_SPIKE"
  | "FILLER_DETECTED"
  | "LONG_PAUSE"
  | "REPETITION"
  | "WEAK_TRANSITION"
  | "STRUCTURAL_TRANSITION"
  | "COMPLEX_SENTENCE"
  | "UNCLEAR_PHRASING"
  | "KEY_ARGUMENT"
  | "CONCLUSION";

export interface TranscriptSegment {
  id: string;
  start: number; // in seconds
  end: number; // in seconds
  text: string;
  wpm?: number;
  pauseBefore?: number;
  eventIds?: string[];
}

export interface TemporalEventItem {
  id: string;
  speechId: string;
  eventType: TemporalEventType;
  severity: EventSeverity;
  startTimestamp: number;
  endTimestamp: number;
  label: string;
  description: string;
  evidence: string;
  recommendation: string;
  metricValue?: number | null;
  metricUnit?: string | null;
}

export interface RubricScoreItem {
  id: string;
  speechId: string;
  category: "Delivery" | "Clarity" | "Structure" | "Content" | "Fluency" | "Engagement" | string;
  score: number;
  weight: number;
  evidence: string;
  issueDetected?: string | null;
  explanation: string;
  recommendation: string;
}

export interface RecommendationItem {
  id: string;
  speechId: string;
  title: string;
  category: string;
  priority: "high" | "medium" | "low";
  description: string;
  actionableDrill: string;
  targetTimestamp?: number | null;
}

export interface LinguisticMetrics {
  clarity: number;
  conciseness: number;
  repetition: number;
  sentenceComplexity: number;
  vocabularyRichness: number;
  fillerLanguage: number;
  weakPhrasing: number;
  hedging: number;
  transitions: number;
}

export interface StructuralOutline {
  introduction: { start: number; end: number; text: string };
  thesis: { start: number; end: number; text: string };
  arguments: Array<{ id: string; start: number; end: number; title: string; summary: string }>;
  supportingPoints: Array<{ id: string; start: number; end: number; title: string }>;
  examples: Array<{ id: string; start: number; end: number; description: string }>;
  transitions: Array<{ start: number; end: number; from: string; to: string; quality: string }>;
  conclusion: { start: number; end: number; text: string };
}

export interface SpeechDetail {
  id: string;
  title: string;
  category: SpeechCategory | string;
  speakerId?: string | null;
  speaker?: {
    id: string;
    name: string;
    role: string;
    baselineWpm: number;
    baselineFillerDensity: number;
    baselinePauseDuration: number;
  } | null;
  audioUrl?: string | null;
  durationSeconds: number;
  wordCount: number;
  wpm: number;
  fillerCount: number;
  fillerDensity: number;
  pauseCount: number;
  avgPauseDuration: number;
  longestPause: number;
  silenceRatio: number;
  paceVariation: number;
  overallScore: number;
  isIdeal: boolean;
  isFlawed: boolean;
  transcript: string;
  transcriptSegments: TranscriptSegment[];
  createdAt: string;
  rubricScores: RubricScoreItem[];
  temporalEvents: TemporalEventItem[];
  recommendations: RecommendationItem[];
  analysis?: {
    id: string;
    executiveSummary: string;
    deliveryScore: number;
    clarityScore: number;
    structureScore: number;
    contentScore: number;
    fluencyScore: number;
    engagementScore: number;
    linguisticMetrics: LinguisticMetrics;
    structuralOutline: StructuralOutline;
    contrastiveNotes: string[];
    practicePlan: Array<{ step: number; title: string; instructions: string; duration: string }>;
  } | null;
  datasetExample?: {
    id: string;
    pairId: string;
    category: string;
    idealOrFlawed: "IDEAL" | "FLAWED";
    targetFlaws: string[];
    expectedCharacteristics: string;
  } | null;
}

export interface ContrastivePair {
  pairId: string;
  category: string;
  idealSpeech: SpeechDetail;
  flawedSpeech: SpeechDetail;
  deltas: {
    wpmDiff: number;
    wpmPercent: number;
    fillerDensityDiff: number;
    overallScoreDiff: number;
    deliveryDiff: number;
    clarityDiff: number;
    structureDiff: number;
    pauseConsistencyDiff: number;
  };
  detectedContrasts: string[];
}

export interface SpeakerProfileData {
  id: string;
  name: string;
  role: string;
  baselineWpm: number;
  baselineFillerDensity: number;
  baselinePauseDuration: number;
  speechesCount: number;
  averageScore: number;
  averageWpm: number;
  averageFillerDensity: number;
  averageClarity: number;
  averageStructure: number;
  averageDelivery: number;
  scoreProgression: Array<{ date: string; title: string; score: number; speechId: string }>;
  persistentPatterns: Array<{
    type: "strength" | "flaw" | "trend";
    title: string;
    description: string;
    confidence: number;
  }>;
}

export interface AnalysisStage {
  id: string;
  name: string;
  status: "pending" | "processing" | "completed" | "error";
  detail?: string;
}
