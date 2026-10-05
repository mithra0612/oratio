"use client";

import { useEffect, useRef } from "react";
import { TranscriptSegment, TemporalEventItem } from "@/types";
import { AlertCircle, AlertTriangle, CheckCircle, Clock, Zap } from "lucide-react";

interface InteractiveTranscriptProps {
  segments: TranscriptSegment[];
  currentTime: number;
  onSeek: (time: number) => void;
  events?: TemporalEventItem[];
  selectedEventId?: string | null;
  onSelectEvent?: (event: TemporalEventItem) => void;
  baselineWpm?: number;
}

export function InteractiveTranscript({
  segments,
  currentTime,
  onSeek,
  events = [],
  selectedEventId,
  onSelectEvent,
  baselineWpm = 135,
}: InteractiveTranscriptProps) {
  const activeSegmentRef = useRef<HTMLDivElement>(null);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Find events occurring during each segment
  const getEventsForSegment = (seg: TranscriptSegment) => {
    return events.filter(
      (e) =>
        (e.startTimestamp >= seg.start && e.startTimestamp < seg.end) ||
        (e.endTimestamp > seg.start && e.endTimestamp <= seg.end) ||
        (seg.start >= e.startTimestamp && seg.end <= e.endTimestamp)
    );
  };

  return (
    <div className="bg-[#101520] border border-[#1e2638] rounded flex flex-col h-[520px]">
      {/* Transcript Header */}
      <div className="p-4 border-b border-[#1e2638] flex items-center justify-between bg-[#0e131d]">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#f59e0b]" />
          <h3 className="text-xs font-semibold text-[#f1f5f9] tracking-tight uppercase font-mono-code">
            Synchronized Transcript & Grounded Flaws
          </h3>
        </div>
        <span className="text-[11px] font-mono-code text-[#64748b]">
          Click segment to seek audio
        </span>
      </div>

      {/* Segments Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {segments.map((seg, idx) => {
          const isActive = currentTime >= seg.start && currentTime < seg.end;
          const segEvents = getEventsForSegment(seg);

          return (
            <div
              key={seg.id || idx}
              ref={isActive ? activeSegmentRef : null}
              className={`p-3.5 rounded border transition-all ${
                isActive
                  ? "bg-[#182133] border-[#f59e0b] shadow-[0_0_15px_rgba(245,158,11,0.06)]"
                  : "bg-[#0c1017] border-[#1a2233] hover:border-[#2d374d]"
              }`}
            >
              {/* Segment Timestamp and WPM Header */}
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => onSeek(seg.start)}
                  className="flex items-center gap-1.5 text-xs font-mono-code text-[#f59e0b] hover:underline"
                >
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(seg.start)}</span>
                </button>

                {seg.wpm && (
                  <span
                    className={`text-[10px] font-mono-code px-2 py-0.5 rounded ${
                      seg.wpm > baselineWpm * 1.25
                        ? "bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30"
                        : "bg-[#182030] text-[#94a3b8]"
                    }`}
                  >
                    {seg.wpm} WPM {seg.wpm > baselineWpm * 1.25 ? `(+${Math.round(((seg.wpm - baselineWpm) / baselineWpm) * 100)}%)` : ""}
                  </span>
                )}
              </div>

              {/* Segment Text */}
              <p
                onClick={() => onSeek(seg.start)}
                className={`text-sm cursor-pointer leading-relaxed ${
                  isActive ? "text-[#f8fafc] font-medium" : "text-[#cbd5e1]"
                }`}
              >
                "{seg.text}"
              </p>

              {/* Inline Grounded Events */}
              {segEvents.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-[#1e2638] space-y-2">
                  {segEvents.map((evt) => {
                    const isFlaw = evt.severity === "flaw";
                    const isWarning = evt.severity === "warning";
                    const isSelected = selectedEventId === evt.id;

                    return (
                      <div
                        key={evt.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSeek(evt.startTimestamp);
                          onSelectEvent?.(evt);
                        }}
                        className={`p-2.5 rounded cursor-pointer border text-xs transition-colors ${
                          isSelected
                            ? "bg-[#1f293d] border-[#f1f5f9]"
                            : isFlaw
                            ? "bg-[#ef4444]/10 border-[#ef4444]/30 hover:bg-[#ef4444]/20"
                            : isWarning
                            ? "bg-[#f59e0b]/10 border-[#f59e0b]/30 hover:bg-[#f59e0b]/20"
                            : "bg-[#38bdf8]/10 border-[#38bdf8]/30 hover:bg-[#38bdf8]/20"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5 font-semibold">
                            {isFlaw ? (
                              <AlertCircle className="w-3.5 h-3.5 text-[#ef4444]" />
                            ) : isWarning ? (
                              <AlertTriangle className="w-3.5 h-3.5 text-[#f59e0b]" />
                            ) : (
                              <Zap className="w-3.5 h-3.5 text-[#38bdf8]" />
                            )}
                            <span
                              className={
                                isFlaw
                                  ? "text-[#ef4444]"
                                  : isWarning
                                  ? "text-[#f59e0b]"
                                  : "text-[#38bdf8]"
                              }
                            >
                              {evt.label}
                            </span>
                          </div>

                          <span className="font-mono-code text-[10px] text-[#94a3b8]">
                            {formatTime(evt.startTimestamp)} - {formatTime(evt.endTimestamp)}
                          </span>
                        </div>

                        <p className="text-[#94a3b8] text-[11px] mb-1.5 leading-normal">
                          {evt.description}
                        </p>

                        <div className="p-1.5 rounded bg-[#0a0d13]/60 text-[11px] text-[#cbd5e1] space-y-0.5 border border-[#1e2638]">
                          <div>
                            <span className="text-[#64748b] font-semibold uppercase text-[9px] mr-1">
                              Evidence:
                            </span>
                            <span>{evt.evidence}</span>
                          </div>
                          <div>
                            <span className="text-[#f59e0b] font-semibold uppercase text-[9px] mr-1">
                              Recommendation:
                            </span>
                            <span>{evt.recommendation}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
