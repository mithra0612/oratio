import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  Mic,
  Upload,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  AlertCircle,
  BrainCircuit,
  AudioLines,
  Sparkles,
  Volume2,
  Activity,
  User,
  Zap,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  let speeches: any[] = [];
  try {
    speeches = await prisma.speech.findMany({
      include: {
        speaker: true,
        rubricScores: true,
        temporalEvents: true,
        recommendations: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("Failed to load speeches in OverviewPage:", err);
  }

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

  const allFlaws = speeches.flatMap((s) => s.temporalEvents);
  const paceSpikes = allFlaws.filter((f) => f.eventType === "PACE_SPIKE").length;
  const fillerClusters = allFlaws.filter((f) => f.eventType === "FILLER_DETECTED").length;
  const deadAirStalls = allFlaws.filter((f) => f.eventType === "LONG_PAUSE").length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#121927] to-[#0c1017] rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-xl">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#182030] text-xs font-mono-code text-[#f59e0b]">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <span>PERSONAL VOICE NOTE INTELLIGENCE</span>
          </div>

          <h2 className="font-editorial text-3xl md:text-5xl font-bold tracking-tight text-[#f1f5f9] leading-tight">
            Master your speaking pace, clarity & voice delivery.
          </h2>

          <p className="text-sm md:text-base text-[#94a3b8] leading-relaxed">
            Record a live voice note or upload an audio memo. Oratio analyzes your speaking cadence, identifies filler words, flags dead air stalls, and grounds delivery flaws directly to the audio waveform.
          </p>
        </div>

        {/* PRIMARY TWO INTAKE CARDS (NO BORDERS, NO OPTION 1 / OPTION 2 LABELS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-6 border-t border-[#182030]">
          {/* Record Live */}
          <Link
            href="/analyze?mode=record"
            className="group p-6 rounded-2xl bg-[#0c1017] hover:bg-[#111622] transition-all flex items-start gap-4 shadow-lg hover:shadow-2xl"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#ef4444] to-[#f87171] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#ef4444]/20 group-hover:scale-105 transition-transform">
              <Mic className="w-6 h-6" />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono-code text-[#10b981] flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" /> Live Microphone Studio
                </span>
              </div>
              <h3 className="font-editorial text-xl font-bold text-[#f1f5f9] group-hover:text-[#f59e0b] transition-colors">
                Record Voice Note Live
              </h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                One-click studio recording with live volume visualization, real-time speech transcription, and instant delivery analysis.
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-xs font-mono-code text-[#f59e0b] font-semibold">
                <span>Start recording now</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Upload Audio */}
          <Link
            href="/analyze?mode=upload"
            className="group p-6 rounded-2xl bg-[#0c1017] hover:bg-[#111622] transition-all flex items-start gap-4 shadow-lg hover:shadow-2xl"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#f59e0b] to-[#d97706] text-[#0a0d13] flex items-center justify-center shrink-0 shadow-md shadow-[#f59e0b]/20 group-hover:scale-105 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono-code text-[#94a3b8]">
                  MP3, WAV, M4A, OGG, WEBM
                </span>
              </div>
              <h3 className="font-editorial text-xl font-bold text-[#f1f5f9] group-hover:text-[#f59e0b] transition-colors">
                Upload Voice Note Audio
              </h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Drop in any recorded audio note or voice memo. Computes exact audio duration, waveform, pacing curve, and filler counts.
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-xs font-mono-code text-[#f59e0b] font-semibold">
                <span>Select audio file</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ACTIONABLE VOICE DELIVERY STATS (Personal Analytics, NO CARD BORDERS) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono-code text-[#f59e0b] uppercase tracking-wider block">
              Actionable Telemetry
            </span>
            <h3 className="font-editorial text-xl font-bold text-[#f1f5f9]">
              Voice Delivery Statistics
            </h3>
          </div>
          <Link
            href="/speeches"
            className="text-xs font-mono-code text-[#94a3b8] hover:text-[#f59e0b] transition-colors flex items-center gap-1"
          >
            <span>View All Notes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Pacing & WPM */}
          <div className="p-5 rounded-2xl bg-[#101520] space-y-3 shadow-md">
            <div className="flex items-center justify-between text-xs font-mono-code text-[#64748b]">
              <span>SPEAKING PACE</span>
              <Activity className="w-4 h-4 text-[#f59e0b]" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-editorial text-3xl font-bold text-[#f1f5f9]">{avgWpm}</span>
                <span className="text-xs font-mono-code text-[#94a3b8]">WPM</span>
              </div>
              <p className="text-[11px] text-[#64748b] mt-1">
                Target: <span className="text-[#10b981] font-semibold">130 - 150 WPM</span>
              </p>
            </div>
            <div className="pt-2 border-t border-[#182030] flex items-center justify-between text-[11px] font-mono-code text-[#94a3b8]">
              <span>Pacing spikes:</span>
              <span className={paceSpikes > 0 ? "text-[#ef4444] font-semibold" : "text-[#10b981]"}>
                {paceSpikes} detected
              </span>
            </div>
          </div>

          {/* Card 2: Filler Words */}
          <div className="p-5 rounded-2xl bg-[#101520] space-y-3 shadow-md">
            <div className="flex items-center justify-between text-xs font-mono-code text-[#64748b]">
              <span>FILLER WORDS</span>
              <AlertCircle className="w-4 h-4 text-[#f59e0b]" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-editorial text-3xl font-bold text-[#f1f5f9]">{avgFiller}%</span>
                <span className="text-xs font-mono-code text-[#94a3b8]">density</span>
              </div>
              <p className="text-[11px] text-[#64748b] mt-1">
                Ideal threshold: <span className="text-[#10b981] font-semibold">&lt; 2.5%</span>
              </p>
            </div>
            <div className="pt-2 border-t border-[#182030] flex items-center justify-between text-[11px] font-mono-code text-[#94a3b8]">
              <span>Filler clusters:</span>
              <span className={fillerClusters > 0 ? "text-[#f59e0b] font-semibold" : "text-[#10b981]"}>
                {fillerClusters} instances
              </span>
            </div>
          </div>

          {/* Card 3: Pauses & Dead Air */}
          <div className="p-5 rounded-2xl bg-[#101520] space-y-3 shadow-md">
            <div className="flex items-center justify-between text-xs font-mono-code text-[#64748b]">
              <span>PAUSE QUALITY</span>
              <Clock className="w-4 h-4 text-[#f59e0b]" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-editorial text-3xl font-bold text-[#f1f5f9]">{deadAirStalls}</span>
                <span className="text-xs font-mono-code text-[#94a3b8]">stalls &gt;2.5s</span>
              </div>
              <p className="text-[11px] text-[#64748b] mt-1">
                Natural breath rhythm vs. hesitation
              </p>
            </div>
            <div className="pt-2 border-t border-[#182030] flex items-center justify-between text-[11px] font-mono-code text-[#94a3b8]">
              <span>Dead air status:</span>
              <span className={deadAirStalls === 0 ? "text-[#10b981]" : "text-[#ef4444]"}>
                {deadAirStalls === 0 ? "Optimal Flow" : "Stalls Found"}
              </span>
            </div>
          </div>

          {/* Card 4: Composite Score */}
          <div className="p-5 rounded-2xl bg-[#101520] space-y-3 shadow-md">
            <div className="flex items-center justify-between text-xs font-mono-code text-[#64748b]">
              <span>DELIVERY SCORE</span>
              <Sparkles className="w-4 h-4 text-[#f59e0b]" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-editorial text-3xl font-bold text-[#10b981]">{avgScore}</span>
                <span className="text-xs font-mono-code text-[#64748b]">/ 100</span>
              </div>
              <p className="text-[11px] text-[#64748b] mt-1">
                Weighted across cadence & clarity
              </p>
            </div>
            <div className="pt-2 border-t border-[#182030] flex items-center justify-between text-[11px] font-mono-code text-[#94a3b8]">
              <span>Notes analyzed:</span>
              <span className="text-[#f1f5f9] font-semibold">{totalSpeeches} notes</span>
            </div>
          </div>
        </div>
      </section>

      {/* RECENT VOICE NOTES VAULT (NO CARD BORDERS) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono-code text-[#f59e0b] uppercase tracking-wider block">
              Vault
            </span>
            <h3 className="font-editorial text-xl font-bold text-[#f1f5f9]">
              Recent Voice Notes
            </h3>
          </div>
          <Link
            href="/speeches"
            className="text-xs font-mono-code px-3 py-1.5 rounded-lg bg-[#131926] text-[#94a3b8] hover:text-[#f59e0b] transition-colors flex items-center gap-1.5"
          >
            <AudioLines className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span>Open Full Vault</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {speeches.slice(0, 6).map((sp) => {
            return (
              <div
                key={sp.id}
                className="p-6 rounded-2xl bg-[#101520] hover:bg-[#141b29] transition-all flex flex-col justify-between space-y-4 group shadow-md"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[10px] font-mono-code">
                    <span className="px-2.5 py-1 rounded bg-[#182030] text-[#94a3b8]">
                      {sp.category}
                    </span>
                    <span className="text-[#64748b]">
                      {Math.round(sp.durationSeconds)}s duration
                    </span>
                  </div>

                  <Link
                    href={`/speeches/${sp.id}`}
                    className="font-editorial text-lg font-bold text-[#f1f5f9] group-hover:text-[#f59e0b] transition-colors block line-clamp-1"
                  >
                    {sp.title}
                  </Link>

                  <div className="flex items-center gap-3 text-xs font-mono-code text-[#64748b]">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-[#94a3b8]" />
                      <span className="text-[#94a3b8]">{sp.speaker?.name || "You"}</span>
                    </span>
                    <span>•</span>
                    <span className="text-[#f59e0b] font-semibold">{sp.wpm} WPM</span>
                    <span>•</span>
                    <span>{sp.fillerDensity}% fillers</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#182030] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono-code text-[#64748b]">Score:</span>
                    <span
                      className={`text-sm font-mono-code font-bold ${
                        sp.overallScore >= 80 ? "text-[#10b981]" : "text-[#f59e0b]"
                      }`}
                    >
                      {sp.overallScore}
                    </span>
                  </div>

                  <Link
                    href={`/speeches/${sp.id}`}
                    className="text-xs font-mono-code text-[#94a3b8] group-hover:text-[#f1f5f9] flex items-center gap-1 transition-colors"
                  >
                    <span>Inspect Waveform</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#f59e0b] group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* AI COACH CALLOUT (NO CARD BORDERS) */}
      <section className="p-6 rounded-2xl bg-gradient-to-r from-[#141b29] to-[#0f1420] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-[#f59e0b]" />
            <h4 className="font-editorial text-lg font-bold text-[#f1f5f9]">
              Ask Your AI Voice Coach
            </h4>
          </div>
          <p className="text-xs text-[#94a3b8]">
            Get timestamp-grounded delivery feedback, rehearsal drills, and answers to queries like <em>&quot;Where was I rushing?&quot;</em>
          </p>
        </div>

        <Link
          href="/ai-coach"
          className="px-5 py-2.5 rounded-xl bg-[#182030] text-[#f1f5f9] hover:bg-[#232c40] text-xs font-mono-code font-semibold transition-colors flex items-center gap-2 self-start md:self-auto shrink-0 shadow-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#f59e0b]" />
          <span>Open Coach Chat</span>
        </Link>
      </section>
    </div>
  );
}
