"use client";

import { useState } from "react";
import Link from "next/link";
import {
  SpeechDetail,
  TemporalEventItem,
  RubricScoreItem,
} from "@/types";
import { AudioWaveformPlayer } from "@/components/AudioWaveformPlayer";
import { InteractiveTranscript } from "@/components/InteractiveTranscript";
import { TemporalTimeline } from "@/components/TemporalTimeline";
import {
  Activity,
  CheckCircle2,
  AlertOctagon,
  Clock,
  Sparkles,
  FileSpreadsheet,
  BrainCircuit,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";

interface SpeechDetailClientProps {
  speech: SpeechDetail;
}

export function SpeechDetailClient({ speech }: SpeechDetailClientProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(
    speech.temporalEvents[0]?.id || null
  );

  const handleSelectEvent = (evt: TemporalEventItem) => {
    setSelectedEventId(evt.id);
  };

  const handleSeek = (timeSeconds: number) => {
    setCurrentTime(timeSeconds);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Speech Identity Banner (NO CARD BORDERS) */}
      <div className="bg-[#101520] rounded-2xl p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            {speech.isIdeal ? (
              <span className="text-[10px] font-mono-code px-2.5 py-0.5 rounded-full bg-[#10b981]/20 text-[#10b981] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> BALANCED CADENCE
              </span>
            ) : (
              <span className="text-[10px] font-mono-code px-2.5 py-0.5 rounded-full bg-[#ef4444]/20 text-[#ef4444] font-bold flex items-center gap-1">
                <AlertOctagon className="w-3 h-3" /> FLAGGED FLAWS
              </span>
            )}
            <span className="text-xs font-mono-code text-[#64748b]">
              Category: {speech.category}
            </span>
          </div>

          <h2 className="font-editorial text-2xl md:text-3xl font-bold text-[#f1f5f9] tracking-tight">
            {speech.title}
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono-code text-[#94a3b8]">
            <span>Speaker: {speech.speaker?.name || "You"}</span>
            <span>•</span>
            <span>Duration: {Math.round(speech.durationSeconds)}s</span>
            <span>•</span>
            <span>Word Count: {speech.wordCount} words</span>
            <span>•</span>
            <span className="text-[#f59e0b] font-semibold">{speech.wpm} WPM</span>
          </div>
        </div>

        {/* Global Scorecard Callout */}
        <div className="flex items-center gap-6 border-t lg:border-t-0 lg:border-l border-[#182030] pt-4 lg:pt-0 lg:pl-8">
          <div className="text-center">
            <span className="text-[10px] font-mono-code text-[#64748b] uppercase tracking-wider block">
              Composite Rubric Score
            </span>
            <span
              className={`font-editorial text-4xl font-bold ${
                speech.overallScore >= 80 ? "text-[#10b981]" : "text-[#ef4444]"
              }`}
            >
              {speech.overallScore}
            </span>
            <span className="text-[10px] font-mono-code text-[#64748b] block">/ 100</span>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              href="/ai-coach"
              className="text-xs font-mono-code px-3.5 py-2 rounded-xl bg-[#182030] text-[#f1f5f9] hover:bg-[#232c40] transition-colors flex items-center gap-2 shadow-sm"
            >
              <BrainCircuit className="w-3.5 h-3.5 text-[#f59e0b]" />
              <span>Ask AI Coach</span>
            </Link>

            <Link
              href={`/reports/${speech.id}`}
              className="text-xs font-mono-code px-3.5 py-2 rounded-xl bg-[#182030] text-[#f1f5f9] hover:bg-[#232c40] transition-colors flex items-center gap-2 shadow-sm"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>Generate Report</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Audio Waveform Experience */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono-code text-[#64748b] uppercase tracking-wider">
            Acoustic Signal & WaveSurfer Player
          </span>
          <span className="text-[11px] font-mono-code text-[#f59e0b]">
            Click anywhere on waveform or markers to seek
          </span>
        </div>
        <AudioWaveformPlayer
          audioUrl={speech.audioUrl}
          durationSeconds={speech.durationSeconds}
          events={speech.temporalEvents}
          currentTime={currentTime}
          onTimeUpdate={setCurrentTime}
          onSeek={handleSeek}
          activeEventId={selectedEventId}
          onEventClick={handleSelectEvent}
        />
      </section>

      {/* Temporal Timeline & Flaw Grounding Lane */}
      <section className="space-y-2">
        <TemporalTimeline
          durationSeconds={speech.durationSeconds}
          currentTime={currentTime}
          events={speech.temporalEvents}
          selectedEventId={selectedEventId}
          onSelectEvent={handleSelectEvent}
          onSeek={handleSeek}
          structuralOutline={speech.analysis?.structuralOutline}
        />
      </section>

      {/* Two-Column Workstation: Interactive Transcript vs Rubric Breakdown */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Synchronized Interactive Transcript */}
        <div className="space-y-2">
          <span className="text-xs font-mono-code text-[#64748b] uppercase tracking-wider">
            Synchronized Transcript
          </span>
          <InteractiveTranscript
            segments={speech.transcriptSegments}
            currentTime={currentTime}
            onSeek={handleSeek}
            events={speech.temporalEvents}
            selectedEventId={selectedEventId}
            onSelectEvent={handleSelectEvent}
            baselineWpm={speech.speaker?.baselineWpm || 135}
          />
        </div>

        {/* Right Column: Reproducible Rubric Scoring Engine */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-code text-[#64748b] uppercase tracking-wider">
              Reproducible Evaluative Rubric
            </span>
            <Link
              href="/settings"
              className="text-[11px] font-mono-code text-[#f59e0b] hover:underline"
            >
              Weights Engine
            </Link>
          </div>

          <div className="space-y-3 h-[520px] overflow-y-auto pr-1">
            {speech.rubricScores.map((rubric) => (
              <div
                key={rubric.id}
                className="p-4 rounded-2xl bg-[#101520] space-y-2.5 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-editorial text-base font-bold text-[#f1f5f9]">
                      {rubric.category}
                    </span>
                    <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#182030] text-[#64748b]">
                      Weight: {Math.round(rubric.weight * 100)}%
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono-code text-sm font-bold ${
                        rubric.score >= 80 ? "text-[#10b981]" : "text-[#ef4444]"
                      }`}
                    >
                      {rubric.score}
                    </span>
                    <span className="text-[10px] font-mono-code text-[#64748b]">/ 100</span>
                  </div>
                </div>

                {/* Score Progress Bar */}
                <div className="w-full h-1 bg-[#182030] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${rubric.score}%` }}
                    className={`h-full ${
                      rubric.score >= 80 ? "bg-[#10b981]" : "bg-[#ef4444]"
                    }`}
                  />
                </div>

                {/* Evidence */}
                <div className="text-xs space-y-1">
                  <span className="text-[10px] font-mono-code text-[#64748b] uppercase tracking-wider font-semibold block">
                    Evidence:
                  </span>
                  <p className="text-[#94a3b8] leading-relaxed">{rubric.evidence}</p>
                </div>

                {/* Detected Issue if present */}
                {rubric.issueDetected && (
                  <div className="text-xs space-y-1 p-2.5 rounded-xl bg-[#ef4444]/10 text-[#ef4444]">
                    <span className="text-[10px] font-mono-code uppercase tracking-wider font-bold block flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Issue Detected:
                    </span>
                    <p className="leading-relaxed">{rubric.issueDetected}</p>
                  </div>
                )}

                {/* Actionable Recommendation */}
                <div className="text-xs space-y-1 p-3 rounded-xl bg-[#0c1017]">
                  <span className="text-[10px] font-mono-code text-[#f59e0b] uppercase tracking-wider font-bold block">
                    Actionable Recommendation:
                  </span>
                  <p className="text-[#cbd5e1] leading-relaxed">{rubric.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Structural & Linguistic Analysis Deep Dive (NO CARD BORDERS) */}
      {speech.analysis && (
        <section className="bg-[#101520] rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
          <div className="border-b border-[#182030] pb-4">
            <span className="text-[10px] font-mono-code text-[#64748b] uppercase tracking-wider block">
              Linguistic Structure & Rhetorical Architecture
            </span>
            <h3 className="font-editorial text-xl font-bold text-[#f1f5f9] mt-0.5">
              Executive Evaluation Summary
            </h3>
            <p className="text-xs md:text-sm text-[#cbd5e1] mt-2 leading-relaxed">
              {speech.analysis.executiveSummary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Linguistic Dimensions */}
            <div className="space-y-3 font-mono-code text-xs">
              <span className="text-[10px] text-[#64748b] uppercase tracking-wider block font-semibold">
                Linguistic Signal Breakdown
              </span>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(speech.analysis.linguisticMetrics).map(([k, v]) => (
                  <div key={k} className="p-3 rounded-xl bg-[#0c1017]">
                    <span className="text-[10px] text-[#64748b] block capitalize">
                      {k.replace(/([A-Z])/g, " $1")}
                    </span>
                    <span className="text-sm font-bold text-[#f1f5f9]">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Practice Plan Steps */}
            <div className="space-y-3 font-mono-code text-xs">
              <span className="text-[10px] text-[#f59e0b] uppercase tracking-wider block font-semibold">
                Targeted Practice Plan
              </span>
              <div className="space-y-2">
                {speech.analysis.practicePlan.map((step) => (
                  <div
                    key={step.step}
                    className="p-3.5 rounded-xl bg-[#0c1017] space-y-1 font-sans"
                  >
                    <div className="flex items-center justify-between font-mono-code text-xs">
                      <span className="text-[#f59e0b] font-semibold">
                        Step {step.step}: {step.title}
                      </span>
                      <span className="text-[10px] text-[#64748b]">{step.duration}</span>
                    </div>
                    <p className="text-xs text-[#94a3b8] leading-relaxed">
                      {step.instructions}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
