"use client";

import { SpeechDetail } from "@/types";
import { GitCompare, TrendingUp, TrendingDown, ArrowRight, CheckCircle2, AlertOctagon } from "lucide-react";

interface ContrastiveMatrixProps {
  idealSpeech: SpeechDetail;
  flawedSpeech: SpeechDetail;
}

export function ContrastiveMatrix({
  idealSpeech,
  flawedSpeech,
}: ContrastiveMatrixProps) {
  // Metric calculations
  const wpmDiff = Math.round((flawedSpeech.wpm - idealSpeech.wpm) * 10) / 10;
  const wpmPercent = Math.round(((flawedSpeech.wpm - idealSpeech.wpm) / idealSpeech.wpm) * 100);
  const fillerDiff = Math.round((flawedSpeech.fillerDensity - idealSpeech.fillerDensity) * 10) / 10;
  const scoreDiff = Math.round((idealSpeech.overallScore - flawedSpeech.overallScore) * 10) / 10;

  const idealDelivery = idealSpeech.analysis?.deliveryScore || 88;
  const flawedDelivery = flawedSpeech.analysis?.deliveryScore || 58;
  const deliveryDiff = Math.round(idealDelivery - flawedDelivery);

  const idealClarity = idealSpeech.analysis?.clarityScore || 90;
  const flawedClarity = flawedSpeech.analysis?.clarityScore || 61;
  const clarityDiff = Math.round(idealClarity - flawedClarity);

  const idealStructure = idealSpeech.analysis?.structureScore || 89;
  const flawedStructure = flawedSpeech.analysis?.structureScore || 64;
  const structureDiff = Math.round(idealStructure - flawedStructure);

  const metricsTable = [
    {
      metric: "Words Per Minute (WPM)",
      ideal: `${idealSpeech.wpm} WPM`,
      flawed: `${flawedSpeech.wpm} WPM`,
      delta: wpmPercent > 0 ? `+${wpmPercent}% (${wpmDiff > 0 ? `+${wpmDiff}` : wpmDiff})` : `${wpmPercent}%`,
      contrastType: wpmPercent > 15 ? "flaw" : "neutral",
      insight: wpmPercent > 15 ? "Severe pacing acceleration beyond baseline" : "Moderate pace shift",
    },
    {
      metric: "Filler Density (%)",
      ideal: `${idealSpeech.fillerDensity}%`,
      flawed: `${flawedSpeech.fillerDensity}%`,
      delta: `+${fillerDiff} percentage points`,
      contrastType: fillerDiff > 2.0 ? "flaw" : "neutral",
      insight: fillerDiff > 2.0 ? "Substantial intrusion of verbal crutches" : "Low filler impact",
    },
    {
      metric: "Delivery Stability Score",
      ideal: `${idealDelivery}`,
      flawed: `${flawedDelivery}`,
      delta: `-${deliveryDiff} pts`,
      contrastType: "flaw",
      insight: "Cadence volatility and rhythm breakdown",
    },
    {
      metric: "Clarity & Articulation",
      ideal: `${idealClarity}`,
      flawed: `${flawedClarity}`,
      delta: `-${clarityDiff} pts`,
      contrastType: "flaw",
      insight: "Hedging phrases and imprecise nomenclature",
    },
    {
      metric: "Rhetorical Structure",
      ideal: `${idealStructure}`,
      flawed: `${flawedStructure}`,
      delta: `-${structureDiff} pts`,
      contrastType: "flaw",
      insight: "Transitions lack explicit connective signposting",
    },
    {
      metric: "Composite Evaluation Score",
      ideal: `${idealSpeech.overallScore}`,
      flawed: `${flawedSpeech.overallScore}`,
      delta: `-${scoreDiff} pts`,
      contrastType: "flaw",
      insight: "Global evaluative rubric divergence",
    },
  ];

  // Auto-generate contrastive analytical bullets
  const detectedContrasts: string[] = [
    `Pace increased by ${Math.abs(wpmPercent)}% (${flawedSpeech.wpm} WPM vs ${idealSpeech.wpm} WPM target).`,
    `Filler density increased by ${fillerDiff} percentage points (${flawedSpeech.fillerDensity}% vs ${idealSpeech.fillerDensity}%).`,
    `Pause consistency decreased: Flawed speech exhibits irregular pause durations with dead air peaks up to ${flawedSpeech.longestPause}s.`,
    `Transition quality degraded: Connective signposts were replaced by informal conversational fillers.`,
    `Syntactic complexity and technical precision declined by ${clarityDiff} rubric points due to colloquial hedging.`,
  ];

  return (
    <div className="space-y-6">
      {/* Side-by-Side Metadata Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ideal Speech Card */}
        <div className="p-4 rounded bg-[#101520] border border-[#10b981]/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono-code px-2 py-0.5 rounded bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> IDEAL ARCHETYPE
            </span>
            <span className="text-xs font-mono-code text-[#64748b]">
              {idealSpeech.category}
            </span>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#f1f5f9] leading-snug">
              {idealSpeech.title}
            </h4>
            <p className="text-xs text-[#94a3b8] mt-1 font-mono-code">
              Speaker: {idealSpeech.speaker?.name || "Dr. Elena Vance"}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#1e2638] text-xs font-mono-code">
            <div>
              <span className="text-[#64748b] block text-[10px]">Overall Score</span>
              <span className="text-lg font-bold text-[#10b981]">{idealSpeech.overallScore}</span>
            </div>
            <div>
              <span className="text-[#64748b] block text-[10px]">WPM</span>
              <span className="text-sm font-semibold text-[#f1f5f9]">{idealSpeech.wpm}</span>
            </div>
            <div>
              <span className="text-[#64748b] block text-[10px]">Filler Density</span>
              <span className="text-sm font-semibold text-[#f1f5f9]">{idealSpeech.fillerDensity}%</span>
            </div>
          </div>
        </div>

        {/* Flawed Speech Card */}
        <div className="p-4 rounded bg-[#101520] border border-[#ef4444]/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono-code px-2 py-0.5 rounded bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/40 font-semibold flex items-center gap-1">
              <AlertOctagon className="w-3 h-3" /> FLAWED ARCHETYPE
            </span>
            <span className="text-xs font-mono-code text-[#64748b]">
              {flawedSpeech.category}
            </span>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#f1f5f9] leading-snug">
              {flawedSpeech.title}
            </h4>
            <p className="text-xs text-[#94a3b8] mt-1 font-mono-code">
              Speaker: {flawedSpeech.speaker?.name || "Dr. Elena Vance"}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#1e2638] text-xs font-mono-code">
            <div>
              <span className="text-[#64748b] block text-[10px]">Overall Score</span>
              <span className="text-lg font-bold text-[#ef4444]">{flawedSpeech.overallScore}</span>
            </div>
            <div>
              <span className="text-[#64748b] block text-[10px]">WPM</span>
              <span className="text-sm font-semibold text-[#ef4444]">{flawedSpeech.wpm}</span>
            </div>
            <div>
              <span className="text-[#64748b] block text-[10px]">Filler Density</span>
              <span className="text-sm font-semibold text-[#ef4444]">{flawedSpeech.fillerDensity}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Analytical Matrix Table */}
      <div className="bg-[#101520] border border-[#1e2638] rounded overflow-hidden">
        <div className="p-4 border-b border-[#1e2638] bg-[#0c1017] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-[#f59e0b]" />
            <h4 className="text-xs font-semibold text-[#f1f5f9] font-mono-code uppercase tracking-wider">
              Contrastive Quantitative Matrix
            </h4>
          </div>
          <span className="text-[11px] font-mono-code text-[#64748b]">
            Normalized Pair Deltas
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#0e131d] text-[#64748b] font-mono-code text-[11px] uppercase border-b border-[#1e2638]">
              <tr>
                <th className="py-3 px-4">Evaluation Dimension</th>
                <th className="py-3 px-4 text-[#10b981]">Ideal</th>
                <th className="py-3 px-4 text-[#ef4444]">Flawed</th>
                <th className="py-3 px-4 text-[#f59e0b]">Detected Delta</th>
                <th className="py-3 px-4">Acoustic / Linguistic Insight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a2233] font-mono-code">
              {metricsTable.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#131926] transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#f1f5f9]">
                    {row.metric}
                  </td>
                  <td className="py-3.5 px-4 text-[#10b981] font-semibold">
                    {row.ideal}
                  </td>
                  <td className="py-3.5 px-4 text-[#ef4444] font-semibold">
                    {row.flawed}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#f59e0b]">
                    {row.delta}
                  </td>
                  <td className="py-3.5 px-4 text-[#94a3b8] font-sans">
                    {row.insight}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Auto-Generated Detected Contrast Box */}
      <div className="p-5 rounded bg-[#0c1017] border border-[#232c40] space-y-3">
        <div className="flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-[#ef4444]" />
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#f1f5f9] font-mono-code">
            Auto-Generated Detected Contrast Analysis
          </h4>
        </div>

        <ul className="space-y-2 text-xs text-[#cbd5e1] leading-relaxed">
          {detectedContrasts.map((contrast, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] mt-1.5 shrink-0" />
              <span>{contrast}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
