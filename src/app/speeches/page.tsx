import Link from "next/link";
import { prisma } from "@/lib/db";
import { Library, CheckCircle2, AlertOctagon, ArrowRight, Mic, GitCompare } from "lucide-react";

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

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1e2638] pb-5">
        <div>
          <span className="text-[10px] font-mono-code text-[#f59e0b] uppercase tracking-wider block">
            Corpus Repository
          </span>
          <h2 className="font-editorial text-2xl md:text-3xl font-bold text-[#f1f5f9] tracking-tight">
            Speech Evaluation Library
          </h2>
          <p className="text-xs md:text-sm text-[#94a3b8] mt-1">
            Browse evaluated speeches across categories with rubric scores, acoustic signals, and temporal flaw markers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/contrastive-lab"
            className="px-3.5 py-2 rounded bg-[#182030] text-[#f1f5f9] text-xs font-semibold hover:bg-[#232c40] border border-[#232c40] transition-colors flex items-center gap-1.5"
          >
            <GitCompare className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span>Contrastive Lab</span>
          </Link>

          <Link
            href="/analyze"
            className="px-4 py-2 rounded bg-[#f59e0b] text-[#0a0d13] text-xs font-bold hover:bg-[#d97706] transition-colors flex items-center gap-2"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Analyze New Speech</span>
          </Link>
        </div>
      </div>

      {/* Grid of Speeches */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {speeches.map((sp) => {
          const paceFlaws = sp.temporalEvents.filter((e) => e.eventType === "PACE_SPIKE").length;
          const fillerFlaws = sp.temporalEvents.filter((e) => e.eventType === "FILLER_DETECTED").length;

          return (
            <div
              key={sp.id}
              className={`p-5 rounded bg-[#101520] border transition-all flex flex-col justify-between space-y-4 hover:border-[#f59e0b]/40 ${
                sp.isIdeal ? "border-[#10b981]/30" : "border-[#ef4444]/30"
              }`}
            >
              <div className="space-y-3">
                {/* Badges */}
                <div className="flex items-center justify-between">
                  {sp.isIdeal ? (
                    <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> IDEAL
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/40 font-bold flex items-center gap-1">
                      <AlertOctagon className="w-3 h-3" /> FLAWED
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
                  <p className="text-xs text-[#94a3b8] mt-1 font-mono-code">
                    {sp.speaker?.name || "Dr. Elena Vance"} • {Math.round(sp.durationSeconds)}s
                  </p>
                </div>

                {/* Transcript Snippet */}
                <p className="text-xs text-[#94a3b8] line-clamp-2 italic leading-relaxed">
                  "{sp.transcript}"
                </p>
              </div>

              {/* Metrics & Actions */}
              <div className="pt-3 border-t border-[#1e2638] space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center font-mono-code">
                  <div className="p-2 rounded bg-[#0c1017] border border-[#1a2233]">
                    <span className="text-[9px] text-[#64748b] block uppercase">Score</span>
                    <span
                      className={`text-sm font-bold ${
                        sp.overallScore >= 80 ? "text-[#10b981]" : "text-[#ef4444]"
                      }`}
                    >
                      {sp.overallScore}
                    </span>
                  </div>

                  <div className="p-2 rounded bg-[#0c1017] border border-[#1a2233]">
                    <span className="text-[9px] text-[#64748b] block uppercase">WPM</span>
                    <span className="text-sm font-semibold text-[#f1f5f9]">{sp.wpm}</span>
                  </div>

                  <div className="p-2 rounded bg-[#0c1017] border border-[#1a2233]">
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
                    Report
                  </Link>

                  <Link
                    href={`/speeches/${sp.id}`}
                    className="text-xs font-semibold px-3 py-1.5 rounded bg-[#182030] text-[#f1f5f9] hover:bg-[#232c40] border border-[#232c40] transition-colors flex items-center gap-1.5"
                  >
                    <span>Inspect Evaluation</span>
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
