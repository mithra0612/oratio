import Link from "next/link";
import { prisma } from "@/lib/db";
import { FileSpreadsheet, ArrowRight, Printer, CheckCircle2, AlertOctagon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ReportsIndexPage() {
  const speeches = await prisma.speech.findMany({
    include: {
      speaker: true,
      rubricScores: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1e2638] pb-5">
        <div>
          <span className="text-[10px] font-mono-code text-[#f59e0b] uppercase tracking-wider block">
            Analytical Reports
          </span>
          <h2 className="font-editorial text-2xl md:text-3xl font-bold text-[#f1f5f9] tracking-tight">
            Speech Evaluation Dossiers & Reports
          </h2>
          <p className="text-xs md:text-sm text-[#94a3b8] mt-1">
            Complete executive summaries, rubric breakdowns, and grounded flaw remediation plans formatted for review and export.
          </p>
        </div>
      </div>

      {/* Grid of Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {speeches.map((sp) => (
          <div
            key={sp.id}
            className="p-5 rounded bg-[#101520] border border-[#1e2638] flex flex-col justify-between space-y-4 hover:border-[#2d374d] transition-colors"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                {sp.isIdeal ? (
                  <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#10b981]/20 text-[#10b981] font-bold">
                    IDEAL EVALUATION
                  </span>
                ) : (
                  <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#ef4444]/20 text-[#ef4444] font-bold">
                    FLAWED EVALUATION
                  </span>
                )}
                <span className="text-[11px] font-mono-code text-[#64748b]">
                  {sp.category}
                </span>
              </div>

              <h3 className="font-editorial text-lg font-bold text-[#f1f5f9]">
                {sp.title}
              </h3>

              <div className="flex items-center gap-3 text-xs font-mono-code text-[#94a3b8]">
                <span>Speaker: {sp.speaker?.name || "Dr. Elena Vance"}</span>
                <span>•</span>
                <span>Overall: {sp.overallScore}/100</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1e2638] flex items-center justify-between">
              <span className="text-[11px] font-mono-code text-[#64748b]">
                Includes Practice Plan & Flaw Audit
              </span>

              <Link
                href={`/reports/${sp.id}`}
                className="px-3.5 py-1.5 rounded bg-[#182030] text-[#f1f5f9] hover:bg-[#232c40] border border-[#232c40] text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>View Full Report</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#f59e0b]" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
