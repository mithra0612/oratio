"use client";

import { useState } from "react";
import { SpeechDetail, TemporalEventItem } from "@/types";
import { Clock, AlertTriangle, Activity, BarChart3, Filter } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  ReferenceLine,
} from "recharts";

interface TemporalAnalysisClientProps {
  speeches: SpeechDetail[];
}

export function TemporalAnalysisClient({ speeches }: TemporalAnalysisClientProps) {
  const [selectedSpeechId, setSelectedSpeechId] = useState(
    speeches[0]?.id || ""
  );
  const [timeFilter, setTimeFilter] = useState<"all" | "first_half" | "second_half">("all");

  const currentSpeech =
    speeches.find((s) => s.id === selectedSpeechId) || speeches[0];

  if (!currentSpeech) {
    return <div className="p-8 text-xs font-mono-code text-[#64748b]">No speeches available.</div>;
  }

  // Generate pace curve data from transcript segments
  const paceData = currentSpeech.transcriptSegments.map((seg) => ({
    time: `${Math.round(seg.start)}s`,
    seconds: seg.start,
    wpm: seg.wpm || currentSpeech.wpm,
    baseline: currentSpeech.speaker?.baselineWpm || 135,
  }));

  // Filter pace data by time range
  const filteredPaceData = paceData.filter((d) => {
    if (timeFilter === "first_half") return d.seconds <= currentSpeech.durationSeconds / 2;
    if (timeFilter === "second_half") return d.seconds > currentSpeech.durationSeconds / 2;
    return true;
  });

  // Flaw frequency breakdown
  const flawTypeCounts = [
    {
      name: "Pace Spikes",
      count: currentSpeech.temporalEvents.filter((e) => e.eventType === "PACE_SPIKE").length,
    },
    {
      name: "Filler Clusters",
      count: currentSpeech.temporalEvents.filter((e) => e.eventType === "FILLER_DETECTED").length,
    },
    {
      name: "Long Pauses",
      count: currentSpeech.temporalEvents.filter((e) => e.eventType === "LONG_PAUSE").length,
    },
    {
      name: "Weak Transitions",
      count: currentSpeech.temporalEvents.filter((e) => e.eventType === "WEAK_TRANSITION").length,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1e2638] pb-5">
        <div>
          <span className="text-[10px] font-mono-code text-[#f59e0b] uppercase tracking-wider block">
            Temporal Flaw Grounding
          </span>
          <h2 className="font-editorial text-2xl md:text-3xl font-bold text-[#f1f5f9] tracking-tight">
            Temporal Speech Dynamics & Pacing Analytics
          </h2>
          <p className="text-xs md:text-sm text-[#94a3b8] mt-1">
            Examine time-series pace variation curves, filler clustering intervals, and pause duration distributions.
          </p>
        </div>

        {/* Speech Selector */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-mono-code text-[#64748b]">Select Speech:</label>
          <select
            value={selectedSpeechId}
            onChange={(e) => setSelectedSpeechId(e.target.value)}
            className="px-3 py-1.5 rounded bg-[#101520] border border-[#1e2638] text-xs font-mono-code text-[#f1f5f9] focus:outline-none focus:border-[#f59e0b]"
          >
            {speeches.map((s) => (
              <option key={s.id} value={s.id}>
                {s.isIdeal ? "[IDEAL]" : "[FLAWED]"} {s.title} ({s.wpm} WPM)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Time Range Filter Bar */}
      <div className="flex items-center justify-between p-3.5 rounded bg-[#101520] border border-[#1e2638] text-xs font-mono-code">
        <div className="flex items-center gap-2 text-[#94a3b8]">
          <Filter className="w-3.5 h-3.5 text-[#f59e0b]" />
          <span>Interval Window:</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTimeFilter("all")}
            className={`px-3 py-1 rounded transition-colors ${
              timeFilter === "all"
                ? "bg-[#f59e0b] text-[#0a0d13] font-bold"
                : "bg-[#0c1017] text-[#94a3b8] hover:text-[#f1f5f9]"
            }`}
          >
            Full Track (00:00 - {Math.round(currentSpeech.durationSeconds)}s)
          </button>
          <button
            onClick={() => setTimeFilter("first_half")}
            className={`px-3 py-1 rounded transition-colors ${
              timeFilter === "first_half"
                ? "bg-[#f59e0b] text-[#0a0d13] font-bold"
                : "bg-[#0c1017] text-[#94a3b8] hover:text-[#f1f5f9]"
            }`}
          >
            First Half (0 - {Math.round(currentSpeech.durationSeconds / 2)}s)
          </button>
          <button
            onClick={() => setTimeFilter("second_half")}
            className={`px-3 py-1 rounded transition-colors ${
              timeFilter === "second_half"
                ? "bg-[#f59e0b] text-[#0a0d13] font-bold"
                : "bg-[#0c1017] text-[#94a3b8] hover:text-[#f1f5f9]"
            }`}
          >
            Second Half ({Math.round(currentSpeech.durationSeconds / 2)}s - End)
          </button>
        </div>
      </div>

      {/* Pace Curve Chart */}
      <div className="bg-[#101520] border border-[#1e2638] rounded p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#1e2638] pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#f59e0b]" />
            <h4 className="text-xs font-semibold text-[#f1f5f9] font-mono-code uppercase tracking-wider">
              Speaking Rate (WPM) Dynamic Curve Over Time
            </h4>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono-code text-[#64748b]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-[#f59e0b]" /> Segment WPM
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-[#64748b] border-dashed" /> Baseline (135 WPM)
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredPaceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} fontFamily="monospace" />
              <YAxis stroke="#64748b" fontSize={11} fontFamily="monospace" domain={[90, 200]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0c1017",
                  borderColor: "#232c40",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontFamily: "monospace",
                }}
              />
              <ReferenceLine y={135} stroke="#475569" strokeDasharray="3 3" />
              <ReferenceLine y={160} stroke="#ef4444" strokeDasharray="2 2" label={{ value: "Pace Spike Ceiling", fill: "#ef4444", fontSize: 10 }} />
              <Line
                type="monotone"
                dataKey="wpm"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 3, fill: "#f59e0b" }}
                activeDot={{ r: 6, fill: "#f59e0b" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Flaw Distribution Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Flaw Frequency Chart */}
        <div className="bg-[#101520] border border-[#1e2638] rounded p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1e2638] pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#ef4444]" />
              <h4 className="text-xs font-semibold text-[#f1f5f9] font-mono-code uppercase tracking-wider">
                Grounded Flaw Frequency
              </h4>
            </div>
            <span className="text-xs font-mono-code text-[#64748b]">Total: {currentSpeech.temporalEvents.length}</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={flawTypeCounts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} fontFamily="monospace" />
                <YAxis stroke="#64748b" fontSize={11} fontFamily="monospace" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0c1017",
                    borderColor: "#232c40",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontFamily: "monospace",
                  }}
                />
                <Bar dataKey="count" fill="#ef4444" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Temporal Event List */}
        <div className="bg-[#101520] border border-[#1e2638] rounded p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1e2638] pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#38bdf8]" />
              <h4 className="text-xs font-semibold text-[#f1f5f9] font-mono-code uppercase tracking-wider">
                Timestamped Event Log
              </h4>
            </div>
          </div>

          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {currentSpeech.temporalEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-3 rounded bg-[#0c1017] border border-[#1e2638] space-y-1 font-mono-code text-xs"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={
                      evt.severity === "flaw"
                        ? "text-[#ef4444] font-bold"
                        : "text-[#f59e0b] font-bold"
                    }
                  >
                    {evt.label}
                  </span>
                  <span className="text-[10px] text-[#64748b]">
                    {Math.round(evt.startTimestamp)}s - {Math.round(evt.endTimestamp)}s
                  </span>
                </div>
                <p className="text-[11px] text-[#94a3b8] font-sans">{evt.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
