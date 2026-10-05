"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Library,
  GitCompare,
  UserCheck,
  BrainCircuit,
  Database,
  FileSpreadsheet,
  Settings,
  BookOpen,
} from "lucide-react";

const PRIMARY_NAV = [
  { href: "/", label: "Overview", icon: Activity },
  { href: "/speeches", label: "Workstation", icon: Library },
  { href: "/contrastive-lab", label: "Contrastive Lab", icon: GitCompare },
  { href: "/speaker-profile", label: "Speaker Trajectory", icon: UserCheck },
  { href: "/ai-coach", label: "AI Coach", icon: BrainCircuit },
];

const SECONDARY_NAV = [
  { href: "/dataset", label: "Dataset", icon: Database },
  { href: "/reports", label: "Reports", icon: FileSpreadsheet },
  { href: "/methodology", label: "Methodology", icon: BookOpen },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 border-r border-[#1e2638] bg-[#0c1017] flex flex-col justify-between h-screen sticky top-0">
      <div>
        {/* Brand */}
        <div className="p-4 border-b border-[#1e2638]">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-[#f59e0b]/10 border border-[#f59e0b]/30 flex items-center justify-center text-[#f59e0b] font-mono-code font-bold text-xs">
              O
            </div>
            <span className="font-editorial text-lg font-bold tracking-tight text-[#f1f5f9]">
              ORATOR
            </span>
          </Link>
          <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-mono-code text-[#64748b]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
            <span>Track C • Demo Active</span>
          </div>
        </div>

        {/* Primary Navigation (5 Focused Items) */}
        <nav className="p-2 space-y-1">
          <div className="px-2.5 py-1 text-[9px] font-mono-code tracking-widest text-[#475569] uppercase font-semibold">
            Core Workspace
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
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded text-xs transition-colors font-medium ${
                  isActive
                    ? "bg-[#182030] text-[#f59e0b] font-semibold"
                    : "text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#131926]"
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isActive ? "text-[#f59e0b]" : "text-[#64748b]"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Secondary Tools & Utilities (Clean & Compact) */}
      <div className="p-3 border-t border-[#1e2638] bg-[#090d14] space-y-2">
        <div className="px-1 text-[9px] font-mono-code tracking-widest text-[#475569] uppercase font-semibold">
          Utilities
        </div>
        <div className="grid grid-cols-2 gap-1 text-[11px] font-mono-code">
          {SECONDARY_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded transition-colors ${
                  isActive
                    ? "bg-[#182030] text-[#f59e0b]"
                    : "text-[#64748b] hover:text-[#94a3b8]"
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="pt-2 border-t border-[#161d2d] flex items-center justify-between text-[10px] text-[#475569]">
          <Link href="/privacy" className="hover:text-[#94a3b8]">Privacy</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-[#94a3b8]">Terms</Link>
          <span>•</span>
          <span>v1.0</span>
        </div>
      </div>
    </aside>
  );
}
