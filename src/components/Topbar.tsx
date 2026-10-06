"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mic, Upload, AudioLines } from "lucide-react";

export function Topbar() {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === "/") return "Voice Intelligence Dashboard";
    if (pathname.startsWith("/analyze")) return "Voice Note Studio";
    if (pathname.startsWith("/speeches")) return "Voice Vault & Delivery Stats";
    if (pathname.startsWith("/ai-coach")) return "Interactive AI Voice Coach";
    if (pathname.startsWith("/reports")) return "Voice Evaluation Reports";
    if (pathname.startsWith("/settings")) return "Rubric & Scoring Settings";
    if (pathname.startsWith("/privacy")) return "Privacy Policy";
    if (pathname.startsWith("/terms")) return "Terms of Service";
    return "Voice Studio";
  };

  return (
    <header className="h-14 border-b border-[#1e2638] bg-[#0c1017]/90 backdrop-blur sticky top-0 z-30 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono-code text-[#64748b] uppercase tracking-wider">
          ORATIO /
        </span>
        <h1 className="text-sm font-semibold text-[#f1f5f9] tracking-tight">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/speeches"
          className="text-xs font-mono-code px-3 py-1.5 rounded bg-[#131926] border border-[#1e2638] text-[#94a3b8] hover:text-[#f1f5f9] hover:border-[#2d374d] transition-colors flex items-center gap-1.5"
        >
          <AudioLines className="w-3.5 h-3.5 text-[#f59e0b]" />
          <span>My Notes</span>
        </Link>

        <Link
          href="/analyze?mode=upload"
          className="text-xs font-mono-code px-3 py-1.5 rounded bg-[#131926] border border-[#1e2638] text-[#94a3b8] hover:text-[#f59e0b] hover:border-[#f59e0b]/40 transition-colors flex items-center gap-1.5"
        >
          <Upload className="w-3.5 h-3.5 text-[#f59e0b]" />
          <span>Upload Audio</span>
        </Link>

        <Link
          href="/analyze?mode=record"
          className="text-xs font-medium px-3.5 py-1.5 rounded bg-[#f59e0b] text-[#0a0d13] font-bold hover:bg-[#d97706] transition-colors flex items-center gap-1.5 shadow-sm shadow-[#f59e0b]/20"
        >
          <Mic className="w-3.5 h-3.5" />
          <span>Record Live</span>
        </Link>
      </div>
    </header>
  );
}
