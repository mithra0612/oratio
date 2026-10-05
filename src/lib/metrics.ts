import { TemporalEventItem, TranscriptSegment } from "@/types";

export const COMMON_FILLERS = [
  "um",
  "uh",
  "like",
  "you know",
  "sort of",
  "kind of",
  "basically",
  "literally",
  "actually",
  "right?",
  "i mean",
  "so yeah",
];

export const HEDGING_PHRASES = [
  "i guess",
  "sort of maybe",
  "i think possibly",
  "in my humble opinion",
  "more or less",
  "could be wrong but",
  "just kind of",
];

/**
 * Calculate deterministic Words Per Minute (WPM)
 */
export function calculateWpm(wordCount: number, durationSeconds: number): number {
  if (durationSeconds <= 0 || wordCount <= 0) return 0;
  const minutes = durationSeconds / 60;
  return Math.round((wordCount / minutes) * 10) / 10;
}

/**
 * Count total words from raw text
 */
export function countWords(text: string): number {
  if (!text) return 0;
  const clean = text.trim().replace(/\s+/g, " ");
  return clean.length === 0 ? 0 : clean.split(" ").length;
}

/**
 * Detect filler words and calculate filler density percentage
 */
export function analyzeFillers(text: string): {
  count: number;
  density: number;
  occurrences: Array<{ word: string; index: number }>;
} {
  if (!text) return { count: 0, density: 0, occurrences: [] };
  const lower = text.toLowerCase();
  const words = countWords(text);
  const occurrences: Array<{ word: string; index: number }> = [];

  COMMON_FILLERS.forEach((filler) => {
    // Word boundary regex
    const regex = new RegExp(`\\b${filler}\\b`, "gi");
    let match;
    while ((match = regex.exec(lower)) !== null) {
      occurrences.push({ word: filler, index: match.index });
    }
  });

  const count = occurrences.length;
  const density = words > 0 ? Math.round((count / words) * 1000) / 10 : 0; // percentage with 1 decimal
  return { count, density, occurrences };
}

/**
 * Compute silence and pause metrics from timestamped segments
 */
export function analyzePauses(
  segments: Array<{ start: number; end: number }>,
  totalDurationSeconds: number,
  pauseThresholdSeconds: number = 0.6
): {
  pauseCount: number;
  avgPauseDuration: number;
  longestPause: number;
  silenceRatio: number;
  pauses: Array<{ start: number; end: number; duration: number }>;
} {
  if (!segments || segments.length === 0) {
    return {
      pauseCount: 0,
      avgPauseDuration: 0,
      longestPause: 0,
      silenceRatio: 0,
      pauses: [],
    };
  }

  const pauses: Array<{ start: number; end: number; duration: number }> = [];
  let totalPauseDuration = 0;

  for (let i = 0; i < segments.length - 1; i++) {
    const currentEnd = segments[i].end;
    const nextStart = segments[i + 1].start;
    const gap = Math.max(0, nextStart - currentEnd);

    if (gap >= pauseThresholdSeconds) {
      pauses.push({
        start: Math.round(currentEnd * 10) / 10,
        end: Math.round(nextStart * 10) / 10,
        duration: Math.round(gap * 10) / 10,
      });
      totalPauseDuration += gap;
    }
  }

  const pauseCount = pauses.length;
  const avgPauseDuration =
    pauseCount > 0 ? Math.round((totalPauseDuration / pauseCount) * 10) / 10 : 0;
  const longestPause =
    pauses.length > 0 ? Math.max(...pauses.map((p) => p.duration)) : 0;
  const silenceRatio =
    totalDurationSeconds > 0
      ? Math.round((totalPauseDuration / totalDurationSeconds) * 1000) / 10
      : 0;

  return {
    pauseCount,
    avgPauseDuration,
    longestPause: Math.round(longestPause * 10) / 10,
    silenceRatio,
    pauses,
  };
}

/**
 * Detect pace spikes where segment WPM exceeds baseline by threshold
 */
export function detectPaceSpikes(
  segments: TranscriptSegment[],
  baselineWpm: number = 135,
  spikeThresholdPercent: number = 25
): Array<{
  segmentIndex: number;
  start: number;
  end: number;
  wpm: number;
  percentAboveBaseline: number;
}> {
  const spikes: Array<{
    segmentIndex: number;
    start: number;
    end: number;
    wpm: number;
    percentAboveBaseline: number;
  }> = [];

  segments.forEach((seg, idx) => {
    const duration = seg.end - seg.start;
    if (duration < 1.0) return; // skip micro-segments
    const words = countWords(seg.text);
    const segWpm = calculateWpm(words, duration);

    if (segWpm > baselineWpm * (1 + spikeThresholdPercent / 100)) {
      const percentAbove = Math.round(((segWpm - baselineWpm) / baselineWpm) * 100);
      spikes.push({
        segmentIndex: idx,
        start: seg.start,
        end: seg.end,
        wpm: segWpm,
        percentAboveBaseline: percentAbove,
      });
    }
  });

  return spikes;
}

/**
 * Calculate pace variation (standard deviation of segment WPMs)
 */
export function calculatePaceVariation(segments: TranscriptSegment[]): number {
  if (segments.length < 2) return 0;
  const wpms = segments
    .map((s) => {
      const dur = s.end - s.start;
      if (dur < 0.5) return null;
      return calculateWpm(countWords(s.text), dur);
    })
    .filter((w): w is number => w !== null);

  if (wpms.length < 2) return 0;
  const mean = wpms.reduce((a, b) => a + b, 0) / wpms.length;
  const variance =
    wpms.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / wpms.length;
  return Math.round(Math.sqrt(variance) * 10) / 10;
}

/**
 * Detect repeated consecutive phrases/words (repetition flaw)
 */
export function detectRepetitions(text: string): Array<{
  phrase: string;
  count: number;
}> {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/);
  const repetitions: Array<{ phrase: string; count: number }> = [];

  for (let i = 0; i < words.length - 1; i++) {
    if (words[i] && words[i] === words[i + 1] && words[i].length > 2) {
      repetitions.push({ phrase: `${words[i]} ${words[i]}`, count: 2 });
    }
  }

  return repetitions;
}

/**
 * Generate temporal flaw events deterministically from speech signals
 */
export function generateDeterministicTemporalEvents(
  speechId: string,
  segments: TranscriptSegment[],
  baselineWpm: number = 135
): TemporalEventItem[] {
  const events: TemporalEventItem[] = [];

  // 1. Detect Pace Spikes
  const spikes = detectPaceSpikes(segments, baselineWpm, 25);
  spikes.forEach((spike, idx) => {
    events.push({
      id: `evt-pace-${idx}-${Math.round(spike.start)}`,
      speechId,
      eventType: "PACE_SPIKE",
      severity: spike.percentAboveBaseline > 40 ? "flaw" : "warning",
      startTimestamp: spike.start,
      endTimestamp: spike.end,
      label: "Pace Spike",
      description: `Speaking rate accelerated to ${spike.wpm} WPM (+${spike.percentAboveBaseline}% over baseline of ${baselineWpm} WPM).`,
      evidence: `Delivery reached ${spike.wpm} WPM across ${Math.round((spike.end - spike.start) * 10) / 10} seconds.`,
      recommendation: "Reduce delivery speed during this explanation to allow complex concepts to register.",
      metricValue: spike.wpm,
      metricUnit: "WPM",
    });
  });

  // 2. Detect Long Pauses between segments
  for (let i = 0; i < segments.length - 1; i++) {
    const gap = segments[i + 1].start - segments[i].end;
    if (gap > 2.2) {
      events.push({
        id: `evt-pause-${i}-${Math.round(segments[i].end)}`,
        speechId,
        eventType: "LONG_PAUSE",
        severity: gap > 3.5 ? "flaw" : "warning",
        startTimestamp: Math.round(segments[i].end * 10) / 10,
        endTimestamp: Math.round(segments[i + 1].start * 10) / 10,
        label: "Long Pause",
        description: `Unintended dead air pause of ${Math.round(gap * 10) / 10}s detected.`,
        evidence: `Silent gap of ${Math.round(gap * 10) / 10} seconds before next sentence.`,
        recommendation: "Use a transition anchor phrase rather than prolonged silence to maintain audience momentum.",
        metricValue: Math.round(gap * 10) / 10,
        metricUnit: "sec",
      });
    }
  }

  // 3. Detect Fillers per segment
  segments.forEach((seg, idx) => {
    const fillerRes = analyzeFillers(seg.text);
    if (fillerRes.count >= 2) {
      events.push({
        id: `evt-filler-${idx}-${Math.round(seg.start)}`,
        speechId,
        eventType: "FILLER_DETECTED",
        severity: fillerRes.count >= 3 ? "flaw" : "warning",
        startTimestamp: seg.start,
        endTimestamp: seg.end,
        label: "Filler Cluster",
        description: `High density of filler words (${fillerRes.count} fillers in short window: ${fillerRes.occurrences.map((o) => `"${o.word}"`).join(", ")}).`,
        evidence: `Segment contains ${fillerRes.count} filler vocalizations (${fillerRes.density}% density).`,
        recommendation: "Replace vocalized fillers with deliberate 0.5s micro-pauses while framing your thought.",
        metricValue: fillerRes.count,
        metricUnit: "fillers",
      });
    }
  });

  // Sort events chronologically
  return events.sort((a, b) => a.startTimestamp - b.startTimestamp);
}
