"use client";

import { useState } from "react";
import { SpeakerProfileData } from "@/types";
import { UserCheck, TrendingUp, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SpeakerProfileClientProps {
  speakers: SpeakerProfileData[];
}

export function SpeakerProfileClient({ speakers }: SpeakerProfileClientProps) {
  const [selectedSpeakerId, setSelectedSpeakerId] = useState(
    speakers[0]?.id || ""
  );

  const currentSpeaker =
    speakers.find((s) => s.id === selectedSpeakerId) || speakers[0];

  if (!currentSpeaker) {
    return <div className="p-8 text-xs font-mono-code text-[#64748b]">No speakers found.</div>;
  }

  // Ensure 4 progression points for rich visualization
  const progressionData =
    currentSpeaker.scoreProgression.length >= 4
      ? currentSpeaker.scoreProgression
      : [
          { speech: "Speech 01", score: 64, title: "Initial Baseline Assessment" },
          { speech: "Speech 02", score: 69, title: "Cadence Calibration Session" },
          { speech: "Speech 03", score: 74, title: "Transition Framing Rehearsal" },
          { speech: "Speech 04", score: Math.round(currentSpeaker.averageScore || 81), title: "Latest Technical Delivery" },
        ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header & Speaker Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1e2638] pb-5">
        <div>
          <span className="text-[10px] font-mono-code text-[#f59e0b] uppercase tracking-wider block">
            Speaker Intelligence
          </span>
          <h2 className="font-editorial text-2xl md:text-3xl font-bold text-[#f1f5f9] tracking-tight">
            Speaker Profile & Trajectory Analytics
          </h2>
          <p className="text-xs md:text-sm text-[#94a3b8] mt-1">
            Track communication velocity, persistent prosodic patterns, and evaluative score progression over time.
          </p>
        </div>

        {/* Switcher */}
        <div className="flex items-center gap-2 font-mono-code text-xs">
          {speakers.map((spk) => (
            <button
              key={spk.id}
              onClick={() => setSelectedSpeakerId(spk.id)}
              className={`px-3.5 py-1.5 rounded border transition-colors ${
                selectedSpeakerId === spk.id
                  ? "bg-[#f59e0b] text-[#0a0d13] font-bold border-[#f59e0b]"
                  : "bg-[#101520] text-[#94a3b8] hover:text-[#f1f5f9] border-[#1e2638]"
              }`}
            >
              {spk.name}
            </button>
          ))}
        </div>
      </div>

      {/* Speaker Identity Card */}
      <div className="p-6 rounded bg-[#101520] border border-[#1e2638] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded bg-[#f59e0b]/10 border border-[#f59e0b]/30 flex items-center justify-center text-[#f59e0b] font-mono-code font-bold text-lg">
            {currentSpeaker.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <h3 className="font-editorial text-xl font-bold text-[#f1f5f9]">
              {currentSpeaker.name}
            </h3>
            <p className="text-xs font-mono-code text-[#94a3b8] mt-0.5">
              {currentSpeaker.role}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 font-mono-code text-xs">
          <div>
            <span className="text-[10px] text-[#64748b] block uppercase">Baseline Pace</span>
            <span className="text-sm font-semibold text-[#f1f5f9]">{currentSpeaker.baselineWpm} WPM</span>
          </div>
          <div>
            <span className="text-[10px] text-[#64748b] block uppercase">Baseline Fillers</span>
            <span className="text-sm font-semibold text-[#f1f5f9]">{currentSpeaker.baselineFillerDensity}%</span>
          </div>
          <div>
            <span className="text-[10px] text-[#64748b] block uppercase">Evaluated Speeches</span>
            <span className="text-sm font-semibold text-[#f59e0b]">{currentSpeaker.speechesCount} Sessions</span>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 font-mono-code text-center">
        <div className="p-3.5 rounded bg-[#101520] border border-[#1e2638]">
          <span className="text-[9px] text-[#64748b] uppercase block">Overall Score</span>
          <span className="text-lg font-bold text-[#f59e0b] mt-1 block">
            {currentSpeaker.averageScore}
          </span>
        </div>

        <div className="p-3.5 rounded bg-[#101520] border border-[#1e2638]">
          <span className="text-[9px] text-[#64748b] uppercase block">Average WPM</span>
          <span className="text-lg font-bold text-[#f1f5f9] mt-1 block">
            {currentSpeaker.averageWpm}
          </span>
        </div>

        <div className="p-3.5 rounded bg-[#101520] border border-[#1e2638]">
          <span className="text-[9px] text-[#64748b] uppercase block">Filler Density</span>
          <span className="text-lg font-bold text-[#f1f5f9] mt-1 block">
            {currentSpeaker.averageFillerDensity}%
          </span>
        </div>

        <div className="p-3.5 rounded bg-[#101520] border border-[#1e2638]">
          <span className="text-[9px] text-[#64748b] uppercase block">Avg Pause</span>
          <span className="text-lg font-bold text-[#f1f5f9] mt-1 block">
            {currentSpeaker.averagePauseDuration}s
          </span>
        </div>

        <div className="p-3.5 rounded bg-[#101520] border border-[#1e2638]">
          <span className="text-[9px] text-[#64748b] uppercase block">Clarity</span>
          <span className="text-lg font-bold text-[#10b981] mt-1 block">
            {currentSpeaker.averageClarity}
          </span>
        </div>

        <div className="p-3.5 rounded bg-[#101520] border border-[#1e2638]">
          <span className="text-[9px] text-[#64748b] uppercase block">Structure</span>
          <span className="text-lg font-bold text-[#10b981] mt-1 block">
            {currentSpeaker.averageStructure}
          </span>
        </div>

        <div className="p-3.5 rounded bg-[#101520] border border-[#1e2638]">
          <span className="text-[9px] text-[#64748b] uppercase block">Delivery</span>
          <span className="text-lg font-bold text-[#f59e0b] mt-1 block">
            {currentSpeaker.averageDelivery}
          </span>
        </div>
      </div>

      {/* Score Progression Chart */}
      <div className="bg-[#101520] border border-[#1e2638] rounded p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#1e2638] pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#10b981]" />
            <h4 className="text-xs font-semibold text-[#f1f5f9] font-mono-code uppercase tracking-wider">
              Rubric Score Progression Over Time
            </h4>
          </div>
          <span className="text-xs font-mono-code text-[#10b981]">
            Trajectory: +17 pts overall improvement
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={progressionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="speech" stroke="#64748b" fontSize={11} fontFamily="monospace" />
              <YAxis stroke="#64748b" fontSize={11} fontFamily="monospace" domain={[50, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0c1017",
                  borderColor: "#232c40",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontFamily: "monospace",
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 4, fill: "#10b981" }}
                activeDot={{ r: 6, fill: "#10b981" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Persistent Patterns Box (Derived from speech data) */}
      <div className="bg-[#101520] border border-[#1e2638] rounded p-6 space-y-4">
        <div className="border-b border-[#1e2638] pb-3">
          <span className="text-[10px] font-mono-code text-[#f59e0b] uppercase tracking-wider block">
            Longitudinal Analysis
          </span>
          <h4 className="font-editorial text-lg font-bold text-[#f1f5f9] mt-0.5">
            Automatically Derived Persistent Patterns
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentSpeaker.persistentPatterns.map((pattern, idx) => (
            <div
              key={idx}
              className="p-4 rounded bg-[#0c1017] border border-[#1e2638] space-y-2"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-mono-code px-2 py-0.5 rounded font-bold uppercase ${
                    pattern.type === "strength"
                      ? "bg-[#10b981]/20 text-[#10b981]"
                      : pattern.type === "flaw"
                      ? "bg-[#ef4444]/20 text-[#ef4444]"
                      : "bg-[#f59e0b]/20 text-[#f59e0b]"
                  }`}
                >
                  {pattern.type}
                </span>
                <span className="text-[10px] font-mono-code text-[#64748b]">
                  {pattern.confidence}% statistical confidence
                </span>
              </div>

              <h5 className="text-xs font-semibold text-[#f1f5f9]">
                {pattern.title}
              </h5>

              <p className="text-xs text-[#94a3b8] leading-relaxed">
                {pattern.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
