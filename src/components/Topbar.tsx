"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mic, Sparkles, Database, ExternalLink } from "lucide-react";

export function Topbar() {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === "/") return "Executive Overview";
    if (pathname.startsWith("/analyze")) return "Speech Intelligence Pipeline";
    if (pathname.startsWith("/speeches")) return "Speech Evaluation Library";
    if (pathname.startsWith("/contrastive-lab")) return "Contrastive Speech Lab";
    if (pathname.startsWith("/temporal-analysis")) return "Temporal Flaw Grounding";
    if (pathname.startsWith("/speaker-profile")) return "Speaker Intelligence & Trajectory";
    if (pathname.startsWith("/ai-coach")) return "Interactive AI Speech Coach";
    if (pathname.startsWith("/reports")) return "Speech Evaluation Reports";
    if (pathname.startsWith("/dataset")) return "Contrastive Benchmark Dataset";
    if (pathname.startsWith("/methodology")) return "Analytical Methodology";
    if (pathname.startsWith("/settings")) return "Platform Settings & Rubric Calibration";
    if (pathname.startsWith("/privacy")) return "Privacy Policy";
    if (pathname.startsWith("/terms")) return "Terms of Service";
    return "Analytical Workspace";
  };

  return (
    <header className="h-14 border-b border-[#1e2638] bg-[#0c1017]/90 backdrop-blur sticky top-0 z-30 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono-code text-[#64748b] uppercase tracking-wider">
          WORKSPACE /
        </span>
        <h1 className="text-sm font-semibold text-[#f1f5f9] tracking-tight">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Quick Demo Navigation */}
        <Link
          href="/speeches/speech-rag-ideal"
          className="text-xs font-mono-code px-2.5 py-1 rounded bg-[#131926] border border-[#1e2638] text-[#94a3b8] hover:text-[#f59e0b] hover:border-[#f59e0b]/40 transition-colors flex items-center gap-1.5"
        >
          <span>Demo Speech (Ideal RAG)</span>
          <ExternalLink className="w-3 h-3" />
        </Link>

        <Link
          href="/contrastive-lab"
          className="text-xs font-mono-code px-2.5 py-1 rounded bg-[#131926] border border-[#1e2638] text-[#94a3b8] hover:text-[#f59e0b] hover:border-[#f59e0b]/40 transition-colors"
        >
          Compare Pair
        </Link>

        <Link
          href="/analyze"
          className="text-xs font-medium px-3 py-1.5 rounded bg-[#f59e0b] text-[#0a0d13] font-semibold hover:bg-[#d97706] transition-colors flex items-center gap-1.5"
        >
          <Mic className="w-3.5 h-3.5" />
          <span>Analyze Speech</span>
        </Link>
      </div>
    </header>
  );
}
