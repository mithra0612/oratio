"use client";

import { SpeechDetail } from "@/types";
import { Printer, ArrowLeft, CheckCircle2, AlertOctagon, FileSpreadsheet } from "lucide-react";
import Link from "next/link";

interface ReportViewClientProps {
  speech: SpeechDetail;
}

export function ReportViewClient({ speech }: ReportViewClientProps) {
  const handlePrint = () => {
    window.print();
  };

  const analysis = speech.analysis;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Action Header (Hidden in Print) */}
      <div className="print:hidden flex items-center justify-between border-b border-[#1e2638] pb-4">
        <Link
          href="/reports"
          className="text-xs font-mono-code text-[#94a3b8] hover:text-[#f1f5f9] flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Reports</span>
        </Link>

        <button
          onClick={handlePrint}
          className="px-4 py-2 rounded bg-[#f59e0b] text-[#0a0d13] text-xs font-bold hover:bg-[#d97706] transition-colors flex items-center gap-2"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Export PDF Dossier</span>
        </button>
      </div>

      {/* Official Report Document */}
      <div className="p-8 md:p-12 rounded bg-[#101520] border border-[#1e2638] space-y-8 print:bg-white print:text-black print:border-none print:p-0">
        {/* Document Header */}
        <div className="border-b border-[#1e2638] print:border-gray-300 pb-6 flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono-code text-[#f59e0b] print:text-amber-700 uppercase tracking-widest block font-bold">
              ORATOR SPEECH INTELLIGENCE DOSSIER
            </span>
            <h1 className="font-editorial text-3xl font-bold text-[#f1f5f9] print:text-black tracking-tight">
              {speech.title}
            </h1>
            <p className="text-xs font-mono-code text-[#94a3b8] print:text-gray-600">
              Evaluated: {new Date(speech.createdAt).toLocaleDateString()} • Speaker: {speech.speaker?.name || "Dr. Elena Vance"} ({speech.speaker?.role || "Speaker"})
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono-code text-[#64748b] print:text-gray-500 block uppercase">
              Overall Score
            </span>
            <span
              className={`font-editorial text-4xl font-bold ${
                speech.overallScore >= 80 ? "text-[#10b981] print:text-green-700" : "text-[#ef4444] print:text-red-700"
              }`}
            >
              {speech.overallScore}
            </span>
            <span className="text-[10px] font-mono-code text-[#64748b] print:text-gray-500 block">/ 100</span>
          </div>
        </div>

        {/* 1. Executive Summary */}
        <section className="space-y-2">
          <h2 className="text-xs font-mono-code font-bold uppercase tracking-wider text-[#f59e0b] print:text-amber-800 border-b border-[#1e2638] print:border-gray-200 pb-1">
            1. Executive Summary
          </h2>
          <p className="text-xs md:text-sm text-[#cbd5e1] print:text-gray-800 leading-relaxed font-sans">
            {analysis?.executiveSummary || "Evaluation completed across acoustic, linguistic, and structural dimensions."}
          </p>
        </section>

        {/* 2. Reproducible Rubric Breakdown */}
        <section className="space-y-3">
          <h2 className="text-xs font-mono-code font-bold uppercase tracking-wider text-[#f59e0b] print:text-amber-800 border-b border-[#1e2638] print:border-gray-200 pb-1">
            2. Evaluative Rubric Breakdown
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 font-mono-code text-xs">
            {speech.rubricScores.map((rubric) => (
              <div
                key={rubric.id}
                className="p-3 rounded bg-[#0c1017] print:bg-gray-50 border border-[#1e2638] print:border-gray-200 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[#94a3b8] print:text-gray-700 font-semibold">{rubric.category}</span>
                  <span
                    className={`font-bold ${
                      rubric.score >= 80 ? "text-[#10b981] print:text-green-700" : "text-[#ef4444] print:text-red-700"
                    }`}
                  >
                    {rubric.score}
                  </span>
                </div>
                <p className="text-[11px] text-[#64748b] print:text-gray-600 font-sans line-clamp-2">
                  {rubric.evidence}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Delivery & Acoustic Analysis */}
        <section className="space-y-2 font-mono-code text-xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#f59e0b] print:text-amber-800 border-b border-[#1e2638] print:border-gray-200 pb-1">
            3. Delivery & Acoustic Metrics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div className="p-2.5 rounded bg-[#0c1017] print:bg-gray-50 border border-[#1e2638] print:border-gray-200">
              <span className="text-[10px] text-[#64748b] print:text-gray-600 block uppercase">Pace (WPM)</span>
              <span className="text-sm font-bold text-[#f1f5f9] print:text-black">{speech.wpm}</span>
            </div>
            <div className="p-2.5 rounded bg-[#0c1017] print:bg-gray-50 border border-[#1e2638] print:border-gray-200">
              <span className="text-[10px] text-[#64748b] print:text-gray-600 block uppercase">Filler Density</span>
              <span className="text-sm font-bold text-[#f1f5f9] print:text-black">{speech.fillerDensity}%</span>
            </div>
            <div className="p-2.5 rounded bg-[#0c1017] print:bg-gray-50 border border-[#1e2638] print:border-gray-200">
              <span className="text-[10px] text-[#64748b] print:text-gray-600 block uppercase">Pace Variation</span>
              <span className="text-sm font-bold text-[#f1f5f9] print:text-black">{speech.paceVariation} WPM</span>
            </div>
            <div className="p-2.5 rounded bg-[#0c1017] print:bg-gray-50 border border-[#1e2638] print:border-gray-200">
              <span className="text-[10px] text-[#64748b] print:text-gray-600 block uppercase">Longest Pause</span>
              <span className="text-sm font-bold text-[#f1f5f9] print:text-black">{speech.longestPause}s</span>
            </div>
          </div>
        </section>

        {/* 4. Grounded Temporal Flaws */}
        <section className="space-y-3">
          <h2 className="text-xs font-mono-code font-bold uppercase tracking-wider text-[#f59e0b] print:text-amber-800 border-b border-[#1e2638] print:border-gray-200 pb-1">
            4. Grounded Temporal Flaw Audit ({speech.temporalEvents.length} Events)
          </h2>
          <div className="space-y-2.5 font-mono-code text-xs">
            {speech.temporalEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-3 rounded bg-[#0c1017] print:bg-gray-50 border border-[#1e2638] print:border-gray-200 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-bold ${
                      evt.severity === "flaw" ? "text-[#ef4444] print:text-red-700" : "text-[#f59e0b] print:text-amber-700"
                    }`}
                  >
                    {evt.label}
                  </span>
                  <span className="text-[11px] text-[#64748b] print:text-gray-600">
                    Timestamp: {Math.round(evt.startTimestamp)}s - {Math.round(evt.endTimestamp)}s
                  </span>
                </div>
                <p className="text-xs text-[#94a3b8] print:text-gray-800 font-sans">{evt.description}</p>
                <p className="text-[11px] text-[#f59e0b] print:text-amber-800 font-sans">
                  <strong>Recommendation:</strong> {evt.recommendation}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Targeted Practice Plan */}
        {analysis?.practicePlan && (
          <section className="space-y-3">
            <h2 className="text-xs font-mono-code font-bold uppercase tracking-wider text-[#f59e0b] print:text-amber-800 border-b border-[#1e2638] print:border-gray-200 pb-1">
              5. Actionable Practice Plan
            </h2>
            <div className="space-y-2">
              {analysis.practicePlan.map((step) => (
                <div
                  key={step.step}
                  className="p-3 rounded bg-[#0c1017] print:bg-gray-50 border border-[#1e2638] print:border-gray-200 space-y-0.5 text-xs font-sans"
                >
                  <div className="flex items-center justify-between font-mono-code">
                    <span className="font-bold text-[#f1f5f9] print:text-black">
                      Step {step.step}: {step.title}
                    </span>
                    <span className="text-[10px] text-[#64748b] print:text-gray-600">{step.duration}</span>
                  </div>
                  <p className="text-[#94a3b8] print:text-gray-700 text-xs leading-relaxed">
                    {step.instructions}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
