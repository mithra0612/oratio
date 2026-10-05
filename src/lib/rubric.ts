import { RubricScoreItem } from "@/types";

export interface RubricWeights {
  delivery: number;
  clarity: number;
  structure: number;
  content: number;
  fluency: number;
  engagement: number;
}

export const DEFAULT_WEIGHTS: RubricWeights = {
  delivery: 0.20,
  clarity: 0.20,
  structure: 0.20,
  content: 0.15,
  fluency: 0.15,
  engagement: 0.10,
};

export interface RubricCalculationInput {
  wpm: number;
  fillerDensity: number;
  pauseCount: number;
  avgPauseDuration: number;
  longestPause: number;
  paceVariation: number;
  silenceRatio: number;
  semanticScores?: {
    clarity?: number;
    structure?: number;
    content?: number;
    engagement?: number;
    delivery?: number;
    fluency?: number;
  };
  weights?: Partial<RubricWeights>;
}

export interface RubricEvaluationResult {
  overallScore: number;
  categoryScores: {
    delivery: number;
    clarity: number;
    structure: number;
    content: number;
    fluency: number;
    engagement: number;
  };
  rubricItems: RubricScoreItem[];
}

export function calculateRubricScores(
  speechId: string,
  input: RubricCalculationInput
): RubricEvaluationResult {
  const weights: RubricWeights = {
    delivery: input.weights?.delivery ?? DEFAULT_WEIGHTS.delivery,
    clarity: input.weights?.clarity ?? DEFAULT_WEIGHTS.clarity,
    structure: input.weights?.structure ?? DEFAULT_WEIGHTS.structure,
    content: input.weights?.content ?? DEFAULT_WEIGHTS.content,
    fluency: input.weights?.fluency ?? DEFAULT_WEIGHTS.fluency,
    engagement: input.weights?.engagement ?? DEFAULT_WEIGHTS.engagement,
  };

  // 1. Delivery
  let deliveryScore = 90;
  if (input.wpm < 110) deliveryScore -= (110 - input.wpm) * 0.6;
  else if (input.wpm > 160) deliveryScore -= (input.wpm - 160) * 0.7;
  if (input.paceVariation > 25) deliveryScore -= (input.paceVariation - 25) * 0.8;
  if (input.longestPause > 3.0) deliveryScore -= Math.min(15, (input.longestPause - 3.0) * 4);
  if (input.semanticScores?.delivery) deliveryScore = deliveryScore * 0.4 + input.semanticScores.delivery * 0.6;
  deliveryScore = Math.max(30, Math.min(98, Math.round(deliveryScore * 10) / 10));

  // 2. Clarity
  let clarityScore = 92;
  if (input.fillerDensity > 2.0) clarityScore -= (input.fillerDensity - 2.0) * 4.5;
  if (input.semanticScores?.clarity) clarityScore = clarityScore * 0.4 + input.semanticScores.clarity * 0.6;
  clarityScore = Math.max(35, Math.min(98, Math.round(clarityScore * 10) / 10));

  // 3. Structure
  let structureScore = input.semanticScores?.structure ?? 80;
  if (input.pauseCount < 3) structureScore -= 6;
  structureScore = Math.max(30, Math.min(98, Math.round(structureScore * 10) / 10));

  // 4. Content
  let contentScore = input.semanticScores?.content ?? 82;
  contentScore = Math.max(35, Math.min(98, Math.round(contentScore * 10) / 10));

  // 5. Fluency
  let fluencyScore = 95;
  if (input.fillerDensity > 1.5) fluencyScore -= (input.fillerDensity - 1.5) * 6;
  if (input.longestPause > 2.5) fluencyScore -= (input.longestPause - 2.5) * 3;
  if (input.semanticScores?.fluency) fluencyScore = fluencyScore * 0.4 + input.semanticScores.fluency * 0.6;
  fluencyScore = Math.max(30, Math.min(98, Math.round(fluencyScore * 10) / 10));

  // 6. Engagement
  let engagementScore = input.semanticScores?.engagement ?? 78;
  if (input.wpm < 115 || input.wpm > 170) engagementScore -= 8;
  engagementScore = Math.max(30, Math.min(98, Math.round(engagementScore * 10) / 10));

  const totalWeight =
    weights.delivery +
    weights.clarity +
    weights.structure +
    weights.content +
    weights.fluency +
    weights.engagement;

  const overallScore = Math.round(
    ((deliveryScore * weights.delivery +
      clarityScore * weights.clarity +
      structureScore * weights.structure +
      contentScore * weights.content +
      fluencyScore * weights.fluency +
      engagementScore * weights.engagement) /
      totalWeight) *
      10
  ) / 10;

  // Punchy, crisp rubric items (1-line each)
  const rubricItems: RubricScoreItem[] = [
    {
      id: `rubric-${speechId}-delivery`,
      speechId,
      category: "Delivery",
      score: deliveryScore,
      weight: weights.delivery,
      evidence: `Pace averaged ${input.wpm} WPM (variance ±${input.paceVariation} WPM).`,
      issueDetected:
        input.paceVariation > 25
          ? `Pace spike detected (volatility ±${input.paceVariation} WPM).`
          : input.wpm > 160
          ? `Speaking rate exceeds 160 WPM presentation ceiling.`
          : null,
      explanation: deliveryScore >= 80 ? "Stable vocal cadence and controlled rhythm." : "Cadence accelerates erratically during technical explanations.",
      recommendation: deliveryScore >= 80 ? "Maintain current rhythm; use pauses before key points." : "Anchor pace at 130 WPM using a breath pause at slide transitions.",
    },
    {
      id: `rubric-${speechId}-clarity`,
      speechId,
      category: "Clarity",
      score: clarityScore,
      weight: weights.clarity,
      evidence: `Filler density measured at ${input.fillerDensity}%.`,
      issueDetected: input.fillerDensity > 4.0 ? `Excessive filler crutches (${input.fillerDensity}%).` : null,
      explanation: clarityScore >= 80 ? "Crisp articulation with zero verbal crutches." : "Verbal fillers and informal hedging blur technical precision.",
      recommendation: clarityScore >= 80 ? "Continue crisp articulation." : "Use 1-second silent pauses instead of 'um' or 'basically'.",
    },
    {
      id: `rubric-${speechId}-structure`,
      speechId,
      category: "Structure",
      score: structureScore,
      weight: weights.structure,
      evidence: "Distinct thesis, supporting points, and conclusion detected.",
      issueDetected: structureScore < 75 ? "Transitions between arguments lack verbal signposts." : null,
      explanation: structureScore >= 80 ? "Cohesive logical progression with clear signposts." : "Sections connect abruptly without connective context.",
      recommendation: structureScore >= 80 ? "Optimal progression." : "Use explicit signposts: 'Turning next to our architecture...'",
    },
    {
      id: `rubric-${speechId}-content`,
      speechId,
      category: "Content",
      score: contentScore,
      weight: weights.content,
      evidence: "Empirical technical arguments with verifiable metrics.",
      issueDetected: contentScore < 75 ? "Arguments rely on assertions rather than numbers." : null,
      explanation: contentScore >= 80 ? "High informational density and concrete specifics." : "Claims require empirical grounding.",
      recommendation: "Back every core premise with a quantitative benchmark metric.",
    },
    {
      id: `rubric-${speechId}-fluency`,
      speechId,
      category: "Fluency",
      score: fluencyScore,
      weight: weights.fluency,
      evidence: `Avg pause ${input.avgPauseDuration}s (longest pause ${input.longestPause}s).`,
      issueDetected: input.longestPause > 3.0 ? `Unintended pause of ${input.longestPause}s disrupted narrative flow.` : null,
      explanation: fluencyScore >= 80 ? "Smooth cadence between syntactic clauses." : "Hesitations and long pauses break presentation momentum.",
      recommendation: "Rehearse complex sentence sequences aloud to prevent cognitive stalls.",
    },
    {
      id: `rubric-${speechId}-engagement`,
      speechId,
      category: "Engagement",
      score: engagementScore,
      weight: weights.engagement,
      evidence: "Conversational presence across the speech arc.",
      issueDetected: engagementScore < 75 ? "Flat monotone tempo lacking dynamic inflection." : null,
      explanation: engagementScore >= 80 ? "Dynamic prosodic variation sustains attention." : "Monotone tempo reduces audience immersion.",
      recommendation: "Vary speaking volume and tempo when introducing critical takeaways.",
    },
  ];

  return {
    overallScore,
    categoryScores: {
      delivery: deliveryScore,
      clarity: clarityScore,
      structure: structureScore,
      content: contentScore,
      fluency: fluencyScore,
      engagement: engagementScore,
    },
    rubricItems,
  };
}
