"use client";

import { TemporalEventItem, StructuralOutline } from "@/types";
import { Clock, AlertCircle, AlertTriangle, CheckCircle, Zap, ChevronRight } from "lucide-react";

interface TemporalTimelineProps {
  durationSeconds: number;
  currentTime: number;
  events: TemporalEventItem[];
  selectedEventId: string | null;
  onSelectEvent: (event: TemporalEventItem) => void;
  onSeek: (time: number) => void;
  structuralOutline?: StructuralOutline | null;
}

export function TemporalTimeline({
  durationSeconds,
  currentTime,
  events,
  selectedEventId,
  onSelectEvent,
  onSeek,
  structuralOutline,
}: TemporalTimelineProps) {
  const selectedEvent = events.find((e) => e.id === selectedEventId) || events[0];

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const currentPercent = durationSeconds > 0 ? (currentTime / durationSeconds) * 100 : 0;

  // Filter events into lanes
  const deliveryEvents = events.filter(
    (e) => e.eventType === "PACE_SPIKE" || e.eventType === "LONG_PAUSE"
  );
  const linguisticEvents = events.filter(
    (e) =>
      e.eventType === "FILLER_DETECTED" ||
      e.eventType === "REPETITION" ||
      e.eventType === "WEAK_TRANSITION" ||
      e.eventType === "UNCLEAR_PHRASING" ||
      e.eventType === "COMPLEX_SENTENCE"
  );
  const structuralEvents = events.filter(
    (e) =>
      e.eventType === "STRUCTURAL_TRANSITION" ||
      e.eventType === "KEY_ARGUMENT" ||
      e.eventType === "CONCLUSION"
  );

  return (
    <div className="bg-[#101520] border border-[#1e2638] rounded p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1e2638] pb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#f59e0b]" />
          <h3 className="text-xs font-semibold text-[#f1f5f9] tracking-tight uppercase font-mono-code">
            Temporal Flaw Grounding & Multi-Lane Speech Timeline
          </h3>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono-code text-[#94a3b8]">
          <span>Track Duration: {formatTime(durationSeconds)}</span>
          <span className="text-[#f59e0b]">Playhead: {formatTime(currentTime)}</span>
        </div>
      </div>

      {/* Main Multi-Lane Timeline Canvas */}
      <div className="space-y-3 pt-2">
        {/* Time Axis Ticks */}
        <div className="relative w-full h-4 border-b border-[#1e2638] text-[10px] font-mono-code text-[#64748b]">
          {[0, 0.25, 0.5, 0.75, 1.0].map((frac) => (
            <span
              key={frac}
              style={{ left: `${frac * 100}%` }}
              className="absolute -translate-x-1/2"
            >
              {formatTime(durationSeconds * frac)}
            </span>
          ))}
        </div>

        {/* Master Timeline Track Area */}
        <div className="relative bg-[#0c1017] rounded border border-[#1e2638] p-3 space-y-3 select-none">
          {/* Active Audio Playhead Bar */}
          <div
            style={{ left: `${Math.min(100, Math.max(0, currentPercent))}%` }}
            className="absolute top-0 bottom-0 w-0.5 bg-[#f59e0b] shadow-[0_0_8px_#f59e0b] z-30 pointer-events-none transition-all duration-75"
          >
            <div className="w-2.5 h-2.5 bg-[#f59e0b] rounded-full -translate-x-1/2 -top-1 absolute" />
          </div>

          {/* LANE 1: Delivery & Cadence (Pace Spikes, Long Pauses) */}
          <div className="relative">
            <div className="text-[10px] font-mono-code text-[#64748b] uppercase tracking-wider mb-1">
              Lane 1: Delivery & Cadence Volatility
            </div>
            <div className="h-8 bg-[#131926] rounded border border-[#1a2233] relative overflow-hidden">
              {deliveryEvents.map((evt) => {
                const left = (evt.startTimestamp / durationSeconds) * 100;
                const width = Math.max(3, ((evt.endTimestamp - evt.startTimestamp) / durationSeconds) * 100);
                const isSelected = selectedEventId === evt.id;

                return (
                  <button
                    key={evt.id}
                    onClick={() => {
                      onSeek(evt.startTimestamp);
                      onSelectEvent(evt);
                    }}
                    style={{ left: `${left}%`, width: `${width}%` }}
                    className={`absolute top-1 bottom-1 rounded px-1.5 flex items-center justify-center text-[10px] font-mono-code font-semibold truncate transition-all z-10 ${
                      isSelected
                        ? "bg-[#ef4444] text-[#ffffff] ring-2 ring-[#f1f5f9]"
                        : evt.eventType === "PACE_SPIKE"
                        ? "bg-[#ef4444]/20 border border-[#ef4444]/40 text-[#ef4444] hover:bg-[#ef4444]/30"
                        : "bg-[#f59e0b]/20 border border-[#f59e0b]/40 text-[#f59e0b] hover:bg-[#f59e0b]/30"
                    }`}
                    title={`${evt.label}: ${evt.description}`}
                  >
                    {evt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* LANE 2: Linguistic & Verbal Clarity (Fillers, Weak Transitions) */}
          <div className="relative">
            <div className="text-[10px] font-mono-code text-[#64748b] uppercase tracking-wider mb-1">
              Lane 2: Linguistic Signals & Verbal Crutches
            </div>
            <div className="h-8 bg-[#131926] rounded border border-[#1a2233] relative overflow-hidden">
              {linguisticEvents.map((evt) => {
                const left = (evt.startTimestamp / durationSeconds) * 100;
                const width = Math.max(3, ((evt.endTimestamp - evt.startTimestamp) / durationSeconds) * 100);
                const isSelected = selectedEventId === evt.id;

                return (
                  <button
                    key={evt.id}
                    onClick={() => {
                      onSeek(evt.startTimestamp);
                      onSelectEvent(evt);
                    }}
                    style={{ left: `${left}%`, width: `${width}%` }}
                    className={`absolute top-1 bottom-1 rounded px-1.5 flex items-center justify-center text-[10px] font-mono-code font-semibold truncate transition-all z-10 ${
                      isSelected
                        ? "bg-[#f59e0b] text-[#0a0d13] ring-2 ring-[#f1f5f9]"
                        : "bg-[#f59e0b]/20 border border-[#f59e0b]/40 text-[#f59e0b] hover:bg-[#f59e0b]/30"
                    }`}
                    title={`${evt.label}: ${evt.description}`}
                  >
                    {evt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* LANE 3: Rhetorical Architecture & Milestones */}
          <div className="relative">
            <div className="text-[10px] font-mono-code text-[#64748b] uppercase tracking-wider mb-1">
              Lane 3: Rhetorical Structure & Transitions
            </div>
            <div className="h-8 bg-[#131926] rounded border border-[#1a2233] relative overflow-hidden">
              {structuralEvents.map((evt) => {
                const left = (evt.startTimestamp / durationSeconds) * 100;
                const width = Math.max(3, ((evt.endTimestamp - evt.startTimestamp) / durationSeconds) * 100);
                const isSelected = selectedEventId === evt.id;

                return (
                  <button
                    key={evt.id}
                    onClick={() => {
                      onSeek(evt.startTimestamp);
                      onSelectEvent(evt);
                    }}
                    style={{ left: `${left}%`, width: `${width}%` }}
                    className={`absolute top-1 bottom-1 rounded px-1.5 flex items-center justify-center text-[10px] font-mono-code font-semibold truncate transition-all z-10 ${
                      isSelected
                        ? "bg-[#38bdf8] text-[#0a0d13] ring-2 ring-[#f1f5f9]"
                        : "bg-[#38bdf8]/20 border border-[#38bdf8]/40 text-[#38bdf8] hover:bg-[#38bdf8]/30"
                    }`}
                    title={`${evt.label}: ${evt.description}`}
                  >
                    {evt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Event Grounding Inspector Card */}
      {selectedEvent && (
        <div className="p-4 rounded bg-[#0c1017] border border-[#232c40] space-y-3">
          <div className="flex items-center justify-between border-b border-[#1e2638] pb-2.5">
            <div className="flex items-center gap-2">
              {selectedEvent.severity === "flaw" ? (
                <span className="p-1 rounded bg-[#ef4444]/20 text-[#ef4444]">
                  <AlertCircle className="w-4 h-4" />
                </span>
              ) : selectedEvent.severity === "warning" ? (
                <span className="p-1 rounded bg-[#f59e0b]/20 text-[#f59e0b]">
                  <AlertTriangle className="w-4 h-4" />
                </span>
              ) : (
                <span className="p-1 rounded bg-[#38bdf8]/20 text-[#38bdf8]">
                  <Zap className="w-4 h-4" />
                </span>
              )}
              <div>
                <h4 className="text-sm font-semibold text-[#f1f5f9]">
                  {selectedEvent.label}
                </h4>
                <p className="text-[11px] font-mono-code text-[#64748b]">
                  Timestamp: {formatTime(selectedEvent.startTimestamp)} - {formatTime(selectedEvent.endTimestamp)}
                  {selectedEvent.metricValue ? ` | Measured: ${selectedEvent.metricValue} ${selectedEvent.metricUnit || ""}` : ""}
                </p>
              </div>
            </div>

            <button
              onClick={() => onSeek(selectedEvent.startTimestamp)}
              className="text-xs font-mono-code px-3 py-1.5 rounded bg-[#f59e0b] text-[#0a0d13] font-semibold hover:bg-[#d97706] transition-colors flex items-center gap-1"
            >
              <span>Seek Audio</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-[#cbd5e1] leading-relaxed">
            {selectedEvent.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded bg-[#131926] border border-[#1e2638]">
              <span className="text-[10px] font-mono-code uppercase text-[#64748b] block mb-1 font-semibold">
                Signal Evidence
              </span>
              <p className="text-xs text-[#94a3b8]">{selectedEvent.evidence}</p>
            </div>

            <div className="p-3 rounded bg-[#131926] border border-[#1e2638]">
              <span className="text-[10px] font-mono-code uppercase text-[#f59e0b] block mb-1 font-semibold">
                Actionable Recommendation
              </span>
              <p className="text-xs text-[#f1f5f9]">{selectedEvent.recommendation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
