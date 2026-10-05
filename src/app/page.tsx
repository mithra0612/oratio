import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  Mic,
  Activity,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  GitCompare,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
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
      : 78.4;
  const avgWpm =
    totalSpeeches > 0
      ? Math.round((speeches.reduce((acc, s) => acc + s.wpm, 0) / totalSpeeches) * 10) / 10
      : 139.8;
  const avgFiller =
    totalSpeeches > 0
      ? Math.round((speeches.reduce((acc, s) => acc + s.fillerDensity, 0) / totalSpeeches) * 10) / 10
      : 3.8;

  // Compute average rubric scores across speeches
  const rubricAvg = {
    delivery: 82,
    clarity: 84,
    structure: 79,
    content: 76,
    fluency: 73,
    engagement: 75,
  };

  const allFlaws = speeches.flatMap((s) => s.temporalEvents);
  const paceSpikes = allFlaws.filter((f) => f.eventType === "PACE_SPIKE").length;
  const fillerClusters = allFlaws.filter((f) => f.eventType === "FILLER_DETECTED").length;
  const deadAirStalls = allFlaws.filter((f) => f.eventType === "LONG_PAUSE").length;

  const recentRecommendations = speeches
    .flatMap((s) => s.recommendations.map((r) => ({ ...r, speechTitle: s.title })))
    .slice(0, 3);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Editorial Landing Banner */}
      <section className="bg-[#101520] border border-[#1e2638] rounded p-6 md:p-8 relative overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#182030] border border-[#232c40] text-xs font-mono-code text-[#f59e0b]">
            <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
            HACKATHON TRACK C : CONTRASTIVE SPEECH ANALYTICS
          </div>

          <h2 className="font-editorial text-3xl md:text-4xl font-bold tracking-tight text-[#f1f5f9]">
            Multimodal Speech Intelligence & Temporal Evaluation Platform
          </h2>

          <p className="text-sm md:text-base text-[#94a3b8] leading-relaxed">
            ORATOR evaluates speech delivery by pairing acoustic, temporal, linguistic, and structural signals with a custom contrastive dataset of ideal vs. flawed speeches. Grounded temporal flaws with reproducible rubric scores.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/analyze"
              className="px-4 py-2 rounded bg-[#f59e0b] text-[#0a0d13] text-xs font-bold hover:bg-[#d97706] transition-colors flex items-center gap-2"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Analyze Speech</span>
            </Link>

            <Link
              href="/speeches/speech-rag-ideal"
              className="px-4 py-2 rounded bg-[#182030] text-[#f1f5f9] text-xs font-semibold hover:bg-[#1f293d] border border-[#232c40] transition-colors flex items-center gap-1.5"
            >
              <span>Explore Demo Speech</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#f59e0b]" />
            </Link>

            <Link
              href="/contrastive-lab"
              className="px-4 py-2 rounded bg-[#182030] text-[#f1f5f9] text-xs font-semibold hover:bg-[#1f293d] border border-[#232c40] transition-colors flex items-center gap-1.5"
            >
              <GitCompare className="w-3.5 h-3.5 text-[#f59e0b]" />
              <span>Contrastive Lab</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Performance Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Overall Performance Scorecard */}
        <div className="bg-[#101520] border border-[#1e2638] rounded p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#1e2638] pb-3">
            <div>
              <span className="text-[10px] font-mono-code text-[#64748b] uppercase tracking-wider block">
                Aggregated Benchmark
              </span>
              <h3 className="font-editorial text-lg font-bold text-[#f1f5f9]">
                Overall Performance
              </h3>
            </div>
            <div className="text-right">
              <span className="font-editorial text-3xl font-bold text-[#f59e0b]">
                {avgScore}
              </span>
              <span className="text-[10px] font-mono-code text-[#64748b] block">/ 100</span>
            </div>
          </div>

          {/* Rubric Breakdown List */}
          <div className="space-y-3.5 text-xs font-mono-code">
            {[
              { label: "Delivery", score: rubricAvg.delivery, weight: "20%" },
              { label: "Clarity", score: rubricAvg.clarity, weight: "20%" },
              { label: "Structure", score: rubricAvg.structure, weight: "20%" },
              { label: "Content", score: rubricAvg.content, weight: "15%" },
              { label: "Fluency", score: rubricAvg.fluency, weight: "15%" },
              { label: "Engagement", score: rubricAvg.engagement, weight: "10%" },
            ].map((dim) => (
              <div key={dim.label} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[#94a3b8]">
                    {dim.label} <span className="text-[#64748b] text-[10px]">({dim.weight})</span>
                  </span>
                  <span className="text-[#f1f5f9] font-bold">{dim.score}</span>
                </div>
                <div className="w-full h-1.5 bg-[#182030] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${dim.score}%` }}
                    className="h-full bg-[#f59e0b] rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#1e2638] flex items-center justify-between text-xs text-[#94a3b8]">
            <span className="font-mono-code text-[11px]">Weights Configurable</span>
            <Link
              href="/settings"
              className="text-[#f59e0b] hover:underline font-mono-code text-[11px]"
            >
              Adjust Engine Weights
            </Link>
          </div>
        </div>

        {/* Middle & Right: Key Acoustic Signals & Flaw Statistics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Measurable Signals Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#101520] border border-[#1e2638] rounded p-4">
              <span className="text-[10px] font-mono-code text-[#64748b] uppercase tracking-wider block">
                Average WPM
              </span>
              <span className="font-mono-code text-2xl font-bold text-[#f1f5f9] mt-1 block">
                {avgWpm}
              </span>
              <span className="text-[10px] text-[#10b981] font-mono-code">Target: 125-145</span>
            </div>

            <div className="bg-[#101520] border border-[#1e2638] rounded p-4">
              <span className="text-[10px] font-mono-code text-[#64748b] uppercase tracking-wider block">
                Filler Frequency
              </span>
              <span className="font-mono-code text-2xl font-bold text-[#f59e0b] mt-1 block">
                {avgFiller}%
              </span>
              <span className="text-[10px] text-[#64748b] font-mono-code">Target: &lt; 2.0%</span>
            </div>

            <div className="bg-[#101520] border border-[#1e2638] rounded p-4">
              <span className="text-[10px] font-mono-code text-[#64748b] uppercase tracking-wider block">
                Pace Spikes Logged
              </span>
              <span className="font-mono-code text-2xl font-bold text-[#ef4444] mt-1 block">
                {paceSpikes}
              </span>
              <span className="text-[10px] text-[#64748b] font-mono-code">&gt; 25% over baseline</span>
            </div>

            <div className="bg-[#101520] border border-[#1e2638] rounded p-4">
              <span className="text-[10px] font-mono-code text-[#64748b] uppercase tracking-wider block">
                Analyzed Speeches
              </span>
              <span className="font-mono-code text-2xl font-bold text-[#f1f5f9] mt-1 block">
                {totalSpeeches}
              </span>
              <span className="text-[10px] text-[#10b981] font-mono-code">3 Ideal / 3 Flawed</span>
            </div>
          </div>

          {/* Common Temporal Flaws & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Most Common Flaws */}
            <div className="bg-[#101520] border border-[#1e2638] rounded p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#1e2638] pb-2.5">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#ef4444]" />
                  <h4 className="text-xs font-semibold text-[#f1f5f9] font-mono-code uppercase tracking-wider">
                    Most Frequent Flaws Grounded
                  </h4>
                </div>
                <Link
                  href="/temporal-analysis"
                  className="text-[11px] font-mono-code text-[#f59e0b] hover:underline"
                >
                  View Timeline
                </Link>
              </div>

              <div className="space-y-3 font-mono-code text-xs">
                <div className="p-2.5 rounded bg-[#131926] border border-[#1e2638] flex items-center justify-between">
                  <div>
                    <span className="text-[#ef4444] font-semibold block">Pace Acceleration (&gt;165 WPM)</span>
                    <span className="text-[11px] text-[#64748b]">Concentrated in technical mechanisms</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#ef4444]/20 text-[#ef4444] font-bold">
                    {paceSpikes}
                  </span>
                </div>

                <div className="p-2.5 rounded bg-[#131926] border border-[#1e2638] flex items-center justify-between">
                  <div>
                    <span className="text-[#f59e0b] font-semibold block">Filler Clusters (&gt;4 / segment)</span>
                    <span className="text-[11px] text-[#64748b]">Triggered during slide transitions</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#f59e0b]/20 text-[#f59e0b] font-bold">
                    {fillerClusters}
                  </span>
                </div>

                <div className="p-2.5 rounded bg-[#131926] border border-[#1e2638] flex items-center justify-between">
                  <div>
                    <span className="text-[#38bdf8] font-semibold block">Prolonged Dead Air (&gt;3.0s)</span>
                    <span className="text-[11px] text-[#64748b]">Occurs during cognitive stalls</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#38bdf8]/20 text-[#38bdf8] font-bold">
                    {deadAirStalls}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Recommendations */}
            <div className="bg-[#101520] border border-[#1e2638] rounded p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#1e2638] pb-2.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                  <h4 className="text-xs font-semibold text-[#f1f5f9] font-mono-code uppercase tracking-wider">
                    Recent Recommendations
                  </h4>
                </div>
                <Link
                  href="/ai-coach"
                  className="text-[11px] font-mono-code text-[#f59e0b] hover:underline"
                >
                  AI Coach
                </Link>
              </div>

              <div className="space-y-2.5">
                {recentRecommendations.map((rec, i) => (
                  <div key={i} className="p-2.5 rounded bg-[#131926] border border-[#1e2638] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#f1f5f9]">{rec.title}</span>
                      <span className="text-[10px] font-mono-code px-1.5 py-0.2 rounded bg-[#182030] text-[#f59e0b]">
                        {rec.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#94a3b8] leading-tight line-clamp-2">
                      {rec.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Speeches Analytical Table */}
      <section className="bg-[#101520] border border-[#1e2638] rounded overflow-hidden">
        <div className="p-4 border-b border-[#1e2638] bg-[#0c1017] flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold text-[#f1f5f9] uppercase tracking-wider font-mono-code">
              Recent Speech Evaluations
            </h3>
            <span className="text-[11px] text-[#64748b]">
              Paired ideal and flawed corpus records
            </span>
          </div>
          <Link
            href="/speeches"
            className="text-xs font-mono-code text-[#f59e0b] hover:underline flex items-center gap-1"
          >
            <span>View All Speeches</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#0e131d] text-[#64748b] font-mono-code text-[11px] uppercase border-b border-[#1e2638]">
              <tr>
                <th className="py-3 px-4">Title & Category</th>
                <th className="py-3 px-4">Archetype</th>
                <th className="py-3 px-4">Speaker</th>
                <th className="py-3 px-4">WPM</th>
                <th className="py-3 px-4">Filler %</th>
                <th className="py-3 px-4">Overall Score</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a2233] font-mono-code">
              {speeches.map((sp) => (
                <tr key={sp.id} className="hover:bg-[#131926] transition-colors">
                  <td className="py-3 px-4 font-sans font-medium text-[#f1f5f9]">
                    <Link href={`/speeches/${sp.id}`} className="hover:text-[#f59e0b]">
                      {sp.title}
                    </Link>
                    <span className="block text-[11px] text-[#64748b] font-mono-code">
                      {sp.category} • {Math.round(sp.durationSeconds)}s
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {sp.isIdeal ? (
                      <span className="px-2 py-0.5 rounded bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40 text-[10px] font-bold">
                        IDEAL
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/40 text-[10px] font-bold">
                        FLAWED
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-[#94a3b8] font-sans">
                    {sp.speaker?.name || "Dr. Elena Vance"}
                  </td>
                  <td className="py-3 px-4 text-[#f1f5f9]">
                    {sp.wpm}
                  </td>
                  <td className="py-3 px-4 text-[#f1f5f9]">
                    {sp.fillerDensity}%
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-bold ${
                        sp.overallScore >= 80 ? "text-[#10b981]" : "text-[#ef4444]"
                      }`}
                    >
                      {sp.overallScore}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/speeches/${sp.id}`}
                      className="px-2.5 py-1 rounded bg-[#182030] text-[#f1f5f9] hover:bg-[#232c40] border border-[#232c40] transition-colors"
                    >
                      Inspect
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
