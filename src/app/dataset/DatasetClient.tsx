"use client";

import { useState } from "react";
import { Database, Filter, CheckCircle2, AlertOctagon, ArrowRight, GitCompare } from "lucide-react";
import Link from "next/link";

interface DatasetRecord {
  id: string;
  pairId: string;
  category: string;
  idealOrFlawed: string;
  title: string;
  targetFlaws: string[];
  expectedCharacteristics: string;
  durationSeconds: number;
  rubricScoresSummary: Record<string, number>;
  speechId?: string | null;
}

interface DatasetClientProps {
  records: DatasetRecord[];
}

export function DatasetClient({ records }: DatasetClientProps) {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [archetypeFilter, setArchetypeFilter] = useState("all");

  const categories = Array.from(new Set(records.map((r) => r.category)));

  const filteredRecords = records.filter((r) => {
    if (categoryFilter !== "all" && r.category !== categoryFilter) return false;
    if (archetypeFilter !== "all" && r.idealOrFlawed !== archetypeFilter) return false;
    return true;
  });

  const totalCount = records.length;
  const idealCount = records.filter((r) => r.idealOrFlawed === "IDEAL").length;
  const flawedCount = records.filter((r) => r.idealOrFlawed === "FLAWED").length;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1e2638] pb-5">
        <div>
          <span className="text-[10px] font-mono-code text-[#f59e0b] uppercase tracking-wider block">
            Custom Benchmark Corpus
          </span>
          <h2 className="font-editorial text-2xl md:text-3xl font-bold text-[#f1f5f9] tracking-tight">
            Contrastive Speech Intelligence Dataset
          </h2>
          <p className="text-xs md:text-sm text-[#94a3b8] mt-1">
            Curated dataset of paired ideal and flawed speech recordings with annotated temporal flaw vectors and rubric criteria.
          </p>
        </div>

        <Link
          href="/contrastive-lab"
          className="px-3.5 py-2 rounded bg-[#182030] text-[#f1f5f9] text-xs font-semibold hover:bg-[#232c40] border border-[#232c40] transition-colors flex items-center gap-1.5"
        >
          <GitCompare className="w-3.5 h-3.5 text-[#f59e0b]" />
          <span>Open Contrastive Lab</span>
        </Link>
      </div>

      {/* Dataset Statistics Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono-code text-center">
        <div className="p-4 rounded bg-[#101520] border border-[#1e2638]">
          <span className="text-[10px] text-[#64748b] uppercase block">Total Records</span>
          <span className="text-2xl font-bold text-[#f1f5f9] mt-1 block">{totalCount}</span>
          <span className="text-[10px] text-[#64748b]">Paired Speeches</span>
        </div>

        <div className="p-4 rounded bg-[#101520] border border-[#1e2638]">
          <span className="text-[10px] text-[#64748b] uppercase block">Ideal Archetypes</span>
          <span className="text-2xl font-bold text-[#10b981] mt-1 block">{idealCount}</span>
          <span className="text-[10px] text-[#10b981]">Baseline Targets</span>
        </div>

        <div className="p-4 rounded bg-[#101520] border border-[#1e2638]">
          <span className="text-[10px] text-[#64748b] uppercase block">Flawed Archetypes</span>
          <span className="text-2xl font-bold text-[#ef4444] mt-1 block">{flawedCount}</span>
          <span className="text-[10px] text-[#ef4444]">Target Defect Sets</span>
        </div>

        <div className="p-4 rounded bg-[#101520] border border-[#1e2638]">
          <span className="text-[10px] text-[#64748b] uppercase block">Benchmark Categories</span>
          <span className="text-2xl font-bold text-[#f59e0b] mt-1 block">{categories.length}</span>
          <span className="text-[10px] text-[#f59e0b]">Domain Tracks</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded bg-[#101520] border border-[#1e2638] text-xs font-mono-code">
        <div className="flex items-center gap-2 text-[#94a3b8]">
          <Filter className="w-3.5 h-3.5 text-[#f59e0b]" />
          <span>Filters:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[#64748b]">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1 rounded bg-[#0c1017] border border-[#1e2638] text-[#f1f5f9] focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#64748b]">Archetype:</span>
            <select
              value={archetypeFilter}
              onChange={(e) => setArchetypeFilter(e.target.value)}
              className="px-2.5 py-1 rounded bg-[#0c1017] border border-[#1e2638] text-[#f1f5f9] focus:outline-none"
            >
              <option value="all">All Archetypes</option>
              <option value="IDEAL">Ideal Archetypes</option>
              <option value="FLAWED">Flawed Archetypes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-[#101520] border border-[#1e2638] rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#0e131d] text-[#64748b] font-mono-code text-[11px] uppercase border-b border-[#1e2638]">
              <tr>
                <th className="py-3 px-4">Corpus Record & Pair</th>
                <th className="py-3 px-4">Archetype</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Targeted Flaw Annotations</th>
                <th className="py-3 px-4">Benchmark Scores</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a2233] font-mono-code">
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-[#131926] transition-colors">
                  <td className="py-4 px-4 font-sans">
                    <span className="font-semibold text-[#f1f5f9] block leading-snug">
                      {rec.title}
                    </span>
                    <span className="text-[11px] font-mono-code text-[#64748b] mt-0.5 block">
                      Pair ID: {rec.pairId} • {rec.category}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    {rec.idealOrFlawed === "IDEAL" ? (
                      <span className="px-2 py-0.5 rounded bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40 text-[10px] font-bold">
                        IDEAL
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/40 text-[10px] font-bold">
                        FLAWED
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-4 text-[#94a3b8]">
                    {Math.round(rec.durationSeconds)}s
                  </td>

                  <td className="py-4 px-4 max-w-xs font-sans">
                    {rec.targetFlaws.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {rec.targetFlaws.map((flaw, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded bg-[#ef4444]/15 border border-[#ef4444]/30 text-[#ef4444] text-[10px] font-mono-code"
                          >
                            {flaw}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[11px] text-[#10b981] font-mono-code">
                        Controlled Baseline
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-4 text-[#f1f5f9]">
                    <span
                      className={`font-bold ${
                        rec.idealOrFlawed === "IDEAL" ? "text-[#10b981]" : "text-[#ef4444]"
                      }`}
                    >
                      {rec.rubricScoresSummary?.overall || "N/A"}/100
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right">
                    {rec.speechId && (
                      <Link
                        href={`/speeches/${rec.speechId}`}
                        className="px-2.5 py-1 rounded bg-[#182030] text-[#f1f5f9] hover:bg-[#232c40] border border-[#232c40] transition-colors"
                      >
                        Inspect
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
