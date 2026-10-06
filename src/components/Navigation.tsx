"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Mic,
  AudioLines,
  BrainCircuit,
  FileSpreadsheet,
  Settings,
} from "lucide-react";

const PRIMARY_NAV = [
  { href: "/analyze", label: "Analyze Studio", description: "Record or Upload", icon: Mic },
  { href: "/speeches", label: "Voice Vault", description: "My Notes & Stats", icon: AudioLines },
  { href: "/ai-coach", label: "AI Voice Coach", description: "Personal Feedback", icon: BrainCircuit },
];

const UTILITY_NAV = [
  { href: "/reports", label: "Dossier Reports", icon: FileSpreadsheet },
  { href: "/settings", label: "Rubric Settings", icon: Settings },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-[#1e2638] bg-[#0c1017] flex flex-col justify-between h-screen sticky top-0">
      <div>
        {/* Brand */}
        <div className="p-5 border-b border-[#1e2638]">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#f59e0b] to-[#d97706] flex items-center justify-center text-[#0a0d13] font-bold text-sm shadow-md shadow-[#f59e0b]/20">
              <Mic className="w-4 h-4 text-[#0a0d13]" />
            </div>
            <div>
              <span className="font-editorial text-lg font-bold tracking-tight text-[#f1f5f9] block leading-none">
                Oratio
              </span>
              <span className="text-[10px] font-mono-code text-[#64748b] tracking-wider uppercase">
                Voice Note Intelligence
              </span>
            </div>
          </Link>
          <div className="mt-3 flex items-center justify-between px-2 py-1 rounded bg-[#101520] border border-[#1e2638] text-[10px] font-mono-code text-[#94a3b8]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              <span>Voice Engine Active</span>
            </span>
            <span className="text-[#f59e0b] font-semibold">Ready</span>
          </div>
        </div>

        {/* Primary Navigation */}
        <nav className="p-3 space-y-1.5">
          <div className="px-2 py-1 text-[9px] font-mono-code tracking-widest text-[#475569] uppercase font-semibold">
            Core Studio
          </div>
          {PRIMARY_NAV.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs transition-all font-medium group ${
                  isActive
                    ? "bg-[#182030] text-[#f59e0b] font-semibold border border-[#f59e0b]/30 shadow-sm"
                    : "text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#131926] border border-transparent"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${
                    isActive
                      ? "bg-[#f59e0b]/20 text-[#f59e0b]"
                      : "bg-[#101520] text-[#64748b] group-hover:text-[#94a3b8]"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                </div>
                <div>
                  <span className="block leading-none">{item.label}</span>
                  <span className="text-[10px] font-mono-code text-[#64748b] block mt-0.5">
                    {item.description}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Utilities & Quick Actions */}
      <div className="p-4 border-t border-[#1e2638] bg-[#090d14] space-y-3">
        <div className="px-1 text-[9px] font-mono-code tracking-widest text-[#475569] uppercase font-semibold">
          Utilities
        </div>
        <div className="space-y-1 text-xs font-mono-code">
          {UTILITY_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded transition-colors ${
                  isActive
                    ? "bg-[#182030] text-[#f59e0b]"
                    : "text-[#64748b] hover:text-[#94a3b8]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="pt-2 border-t border-[#161d2d] flex items-center justify-between text-[10px] font-mono-code text-[#475569]">
          <Link href="/privacy" className="hover:text-[#94a3b8]">Privacy</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-[#94a3b8]">Terms</Link>
          <span>•</span>
          <span className="text-[#64748b]">Local SQLite</span>
        </div>
      </div>
    </aside>
  );
}
