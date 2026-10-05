"use client";

import { useState } from "react";
import { ContrastiveMatrix } from "@/components/ContrastiveMatrix";
import { SpeechDetail } from "@/types";
import { GitCompare, Volume2, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ContrastiveLabClientProps {
  pairs: Array<{
    pairId: string;
    category: string;
    idealSpeech: SpeechDetail;
    flawedSpeech: SpeechDetail;
  }>;
  allSpeeches: SpeechDetail[];
}

export function ContrastiveLabClient({
  pairs,
  allSpeeches,
}: ContrastiveLabClientProps) {
  const [selectedPairIndex, setSelectedPairIndex] = useState(0);

  const activePair = pairs[selectedPairIndex] || pairs[0];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1e2638] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#182030] border border-[#232c40] text-xs font-mono-code text-[#f59e0b] mb-2">
            <GitCompare className="w-3.5 h-3.5" />
            HACKATHON TRACK C : CONTRASTIVE EVALUATION
          </div>
          <h2 className="font-editorial text-2xl md:text-3xl font-bold text-[#f1f5f9] tracking-tight">
            Contrastive Speech Lab
          </h2>
          <p className="text-xs md:text-sm text-[#94a3b8] mt-1">
            Compare paired ideal vs. flawed speeches side-by-side to ground temporal defects and understand delivery deltas.
          </p>
        </div>

        {/* Pair Quick Selector */}
        <div className="flex items-center gap-2 font-mono-code text-xs">
          {pairs.map((pair, idx) => (
            <button
              key={pair.pairId}
              onClick={() => setSelectedPairIndex(idx)}
              className={`px-3 py-1.5 rounded border transition-colors ${
                selectedPairIndex === idx
                  ? "bg-[#f59e0b] text-[#0a0d13] font-bold border-[#f59e0b]"
                  : "bg-[#101520] text-[#94a3b8] hover:text-[#f1f5f9] border-[#1e2638]"
              }`}
            >
              Pair {idx + 1}: {pair.category}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Pair View */}
      {activePair ? (
        <div className="space-y-6">
          <ContrastiveMatrix
            idealSpeech={activePair.idealSpeech}
            flawedSpeech={activePair.flawedSpeech}
          />

          {/* Quick links to inspect individual speeches */}
          <div className="flex items-center justify-between p-4 rounded bg-[#101520] border border-[#1e2638] text-xs font-mono-code">
            <Link
              href={`/speeches/${activePair.idealSpeech.id}`}
              className="text-[#10b981] hover:underline flex items-center gap-1.5"
            >
              <span>Inspect Ideal Archetype ({activePair.idealSpeech.overallScore}/100)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href={`/speeches/${activePair.flawedSpeech.id}`}
              className="text-[#ef4444] hover:underline flex items-center gap-1.5"
            >
              <span>Inspect Flawed Archetype ({activePair.flawedSpeech.overallScore}/100)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-xs font-mono-code text-[#64748b]">
          No contrastive pairs available in the database.
        </div>
      )}
    </div>
  );
}
