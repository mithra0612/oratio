import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  AudioLines,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  Mic,
  Upload,
  User,
  Activity,
  AlertCircle,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SpeechesPage() {
  const speeches = await prisma.speech.findMany({
    include: {
      speaker: true,
      rubricScores: true,
      temporalEvents: true,
      recommendations: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const totalSpeeches = speeches.length;
  const avgScore =
    totalSpeeches > 0
      ? Math.round((speeches.reduce((acc, s) => acc + s.overallScore, 0) / totalSpeeches) * 10) / 10
      : 86.5;
  const avgWpm =
    totalSpeeches > 0
      ? Math.round((speeches.reduce((acc, s) => acc + s.wpm, 0) / totalSpeeches) * 10) / 10
      : 137.5;
  const avgFiller =
    totalSpeeches > 0
      ? Math.round((speeches.reduce((acc, s) => acc + s.fillerDensity, 0) / totalSpeeches) * 10) / 10
      : 1.2;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#182030] pb-5">
        <div>
          <span className="text-[10px] font-mono-code text-[#f59e0b] uppercase tracking-wider block">
            Personal Repository
          </span>
          <h2 className="font-editorial text-2xl md:text-3xl font-bold text-[#f1f5f9] tracking-tight">
            Voice Vault & Delivery Library
          </h2>
          <p className="text-xs md:text-sm text-[#94a3b8] mt-1">
            Review your recorded and uploaded voice notes, pacing trajectories, and temporal flaw telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/analyze?mode=upload"
            className="px-4 py-2 rounded-xl bg-[#182030] text-[#f1f5f9] text-xs font-semibold hover:bg-[#232c40] transition-colors flex items-center gap-2 shadow-sm"
          >
            <Upload className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span>Upload Audio</span>
          </Link>

          <Link
            href="/analyze?mode=record"
            className="px-4 py-2 rounded-xl bg-[#f59e0b] text-[#0a0d13] text-xs font-bold hover:bg-[#d97706] transition-colors flex items-center gap-2 shadow-md shadow-[#f59e0b]/20"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Record Live Note</span>
          </Link>
        </div>
      </div>

      {/* Aggregate Stats Strip (NO CARD BORDERS) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#101520] space-y-1 shadow-md">
          <span className="text-[10px] font-mono-code text-[#64748b] uppercase">Total Voice Notes</span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-editorial text-2xl font-bold text-[#f1f5f9]">{totalSpeeches}</span>
            <span className="text-xs font-mono-code text-[#64748b]">notes</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#101520] space-y-1 shadow-md">
          <span className="text-[10px] font-mono-code text-[#64748b] uppercase">Average Cadence</span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-editorial text-2xl font-bold text-[#f1f5f9]">{avgWpm}</span>
            <span className="text-xs font-mono-code text-[#f59e0b]">WPM</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#101520] space-y-1 shadow-md">
          <span className="text-[10px] font-mono-code text-[#64748b] uppercase">Filler Density</span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-editorial text-2xl font-bold text-[#f1f5f9]">{avgFiller}%</span>
            <span className="text-xs font-mono-code text-[#10b981]">avg</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#101520] space-y-1 shadow-md">
          <span className="text-[10px] font-mono-code text-[#64748b] uppercase">Delivery Score</span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-editorial text-2xl font-bold text-[#10b981]">{avgScore}</span>
            <span className="text-xs font-mono-code text-[#64748b]">/ 100</span>
          </div>
        </div>
      </div>

      {/* Grid of Speeches (NO CARD BORDERS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {speeches.map((sp) => {
          return (
            <div
              key={sp.id}
              className="p-6 rounded-2xl bg-[#101520] hover:bg-[#131b29] transition-all flex flex-col justify-between space-y-4 shadow-md group"
            >
              <div className="space-y-3">
                {/* Badges */}
                <div className="flex items-center justify-between">
                  {sp.isIdeal ? (
                    <span className="text-[10px] font-mono-code px-2.5 py-0.5 rounded-full bg-[#10b981]/15 text-[#10b981] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> BALANCED CADENCE
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono-code px-2.5 py-0.5 rounded-full bg-[#ef4444]/15 text-[#ef4444] font-bold flex items-center gap-1">
                      <AlertOctagon className="w-3 h-3" /> FLAGGED FLAWS
                    </span>
                  )}

                  <span className="text-[10px] font-mono-code text-[#64748b]">
                    {sp.category}
                  </span>
                </div>

                {/* Title & Speaker */}
                <div>
                  <Link
                    href={`/speeches/${sp.id}`}
                    className="font-editorial text-lg font-bold text-[#f1f5f9] hover:text-[#f59e0b] transition-colors leading-snug line-clamp-2"
                  >
                    {sp.title}
                  </Link>
                  <p className="text-xs text-[#94a3b8] mt-1 font-mono-code flex items-center gap-1.5">
                    <User className="w-3 h-3 text-[#64748b]" />
                    <span>{sp.speaker?.name || "You"}</span>
                    <span>•</span>
                    <span>{Math.round(sp.durationSeconds)}s</span>
                  </p>
                </div>

                {/* Transcript Snippet */}
                <p className="text-xs text-[#94a3b8] line-clamp-2 italic leading-relaxed">
                  &ldquo;{sp.transcript}&rdquo;
                </p>
              </div>

              {/* Metrics & Actions (NO CARD BORDERS) */}
              <div className="pt-3 border-t border-[#182030] space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center font-mono-code">
                  <div className="p-2.5 rounded-xl bg-[#0c1017]">
                    <span className="text-[9px] text-[#64748b] block uppercase">Score</span>
                    <span
                      className={`text-sm font-bold ${
                        sp.overallScore >= 80 ? "text-[#10b981]" : "text-[#ef4444]"
                      }`}
                    >
                      {sp.overallScore}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#0c1017]">
                    <span className="text-[9px] text-[#64748b] block uppercase">WPM</span>
                    <span className="text-sm font-semibold text-[#f1f5f9]">{sp.wpm}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#0c1017]">
                    <span className="text-[9px] text-[#64748b] block uppercase">Flaws</span>
                    <span className="text-sm font-semibold text-[#f59e0b]">
                      {sp.temporalEvents.length}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <Link
                    href={`/reports/${sp.id}`}
                    className="text-[11px] font-mono-code text-[#64748b] hover:text-[#f1f5f9] transition-colors"
                  >
                    Export Dossier
                  </Link>

                  <Link
                    href={`/speeches/${sp.id}`}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#182030] text-[#f1f5f9] hover:bg-[#232c40] transition-colors flex items-center gap-1.5"
                  >
                    <span>Inspect Waveform</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#f59e0b]" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
