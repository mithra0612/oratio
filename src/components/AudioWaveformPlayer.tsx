"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import WaveSurfer from "wavesurfer.js";
import { Play, Pause, RotateCcw, Volume2, FastForward, Activity } from "lucide-react";
import { TemporalEventItem } from "@/types";

interface AudioWaveformPlayerProps {
  audioUrl?: string | null;
  durationSeconds: number;
  events?: TemporalEventItem[];
  currentTime: number;
  onTimeUpdate: (time: number) => void;
  onSeek?: (time: number) => void;
  activeEventId?: string | null;
  onEventClick?: (event: TemporalEventItem) => void;
}

export function AudioWaveformPlayer({
  audioUrl,
  durationSeconds,
  events = [],
  currentTime,
  onTimeUpdate,
  onSeek,
  activeEventId,
  onEventClick,
}: AudioWaveformPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const isSeekingInternalRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize WaveSurfer
    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#263248",
      progressColor: "#f59e0b",
      cursorColor: "#f59e0b",
      cursorWidth: 2,
      height: 72,
      barWidth: 2,
      barGap: 2,
      barRadius: 1,
      normalize: true,
      url: audioUrl || "/samples/ideal-rag.wav",
    });

    ws.on("ready", () => {
      setIsReady(true);
    });

    ws.on("timeupdate", (time) => {
      if (!isSeekingInternalRef.current) {
        onTimeUpdate(time);
      }
    });

    ws.on("play", () => setIsPlaying(true));
    ws.on("pause", () => setIsPlaying(false));
    ws.on("finish", () => setIsPlaying(false));

    wavesurferRef.current = ws;

    return () => {
      ws.destroy();
    };
  }, [audioUrl, onTimeUpdate]);

  // Sync external seek (e.g. from transcript click or timeline marker click)
  const seekToTime = useCallback(
    (targetSeconds: number) => {
      if (!wavesurferRef.current) return;
      const totalDur = wavesurferRef.current.getDuration() || durationSeconds || 1;
      const progress = Math.max(0, Math.min(1, targetSeconds / totalDur));
      isSeekingInternalRef.current = true;
      wavesurferRef.current.seekTo(progress);
      onTimeUpdate(targetSeconds);
      setTimeout(() => {
        isSeekingInternalRef.current = false;
      }, 50);
    },
    [durationSeconds, onTimeUpdate]
  );

  // Expose seeking on external currentTime changes if significantly drifted
  useEffect(() => {
    if (!wavesurferRef.current || !isReady || isPlaying) return;
    const currentAudioTime = wavesurferRef.current.getCurrentTime();
    if (Math.abs(currentAudioTime - currentTime) > 0.6) {
      const totalDur = wavesurferRef.current.getDuration() || durationSeconds || 1;
      wavesurferRef.current.seekTo(Math.max(0, Math.min(1, currentTime / totalDur)));
    }
  }, [currentTime, durationSeconds, isPlaying, isReady]);

  const togglePlay = () => {
    if (!wavesurferRef.current) return;
    wavesurferRef.current.playPause();
  };

  const restart = () => {
    seekToTime(0);
  };

  const changeRate = (rate: number) => {
    if (!wavesurferRef.current) return;
    setPlaybackRate(rate);
    wavesurferRef.current.setPlaybackRate(rate);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 10);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${ms}`;
  };

  return (
    <div className="bg-[#101520] border border-[#1e2638] rounded p-4 space-y-3">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono-code text-xs">
            <span className="text-[#f59e0b] font-semibold">{formatTime(currentTime)}</span>
            <span className="text-[#64748b]">/</span>
            <span className="text-[#94a3b8]">{formatTime(durationSeconds)}</span>
          </div>

          <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#182030] text-[#94a3b8] border border-[#232c40]">
            {isReady ? "Acoustic Signal Loaded" : "Decoding Waveform..."}
          </span>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-1 bg-[#0a0d13] p-1 rounded border border-[#1e2638]">
          {[0.75, 1.0, 1.25, 1.5].map((rate) => (
            <button
              key={rate}
              onClick={() => changeRate(rate)}
              className={`text-[10px] font-mono-code px-2 py-0.5 rounded transition-colors ${
                playbackRate === rate
                  ? "bg-[#f59e0b] text-[#0a0d13] font-semibold"
                  : "text-[#64748b] hover:text-[#f1f5f9]"
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>

      {/* Waveform Canvas Container */}
      <div className="relative pt-2 pb-1">
        <div ref={containerRef} className="w-full cursor-pointer" />

        {/* Visual Temporal Flaw Pins on the Waveform Track */}
        {durationSeconds > 0 && (
          <div className="relative w-full h-4 mt-1">
            {events.map((evt) => {
              const leftPercent = Math.min(100, Math.max(0, (evt.startTimestamp / durationSeconds) * 100));
              const isSelected = activeEventId === evt.id;
              const isFlaw = evt.severity === "flaw";
              const isWarning = evt.severity === "warning";

              const colorClass = isFlaw
                ? "bg-[#ef4444] border-[#ef4444]"
                : isWarning
                ? "bg-[#f59e0b] border-[#f59e0b]"
                : "bg-[#38bdf8] border-[#38bdf8]";

              return (
                <button
                  key={evt.id}
                  onClick={() => {
                    seekToTime(evt.startTimestamp);
                    onEventClick?.(evt);
                  }}
                  title={`[${formatTime(evt.startTimestamp)}] ${evt.label}: ${evt.description}`}
                  style={{ left: `${leftPercent}%` }}
                  className={`absolute -top-1.5 -translate-x-1/2 w-2.5 h-2.5 rounded-full border transition-all ${colorClass} ${
                    isSelected ? "ring-2 ring-[#f1f5f9] scale-150 z-20" : "opacity-80 hover:opacity-100 hover:scale-125 z-10"
                  }`}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Transport Controls */}
      <div className="flex items-center justify-between pt-1 border-t border-[#1e2638]">
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            disabled={!isReady}
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#f59e0b] text-[#0a0d13] font-semibold text-xs hover:bg-[#d97706] disabled:opacity-50 transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? "Pause" : "Play Speech"}</span>
          </button>

          <button
            onClick={restart}
            className="p-1.5 rounded bg-[#182030] text-[#94a3b8] hover:text-[#f1f5f9] border border-[#232c40] transition-colors"
            title="Restart playback"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono-code text-[#64748b]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#ef4444]" /> Flaw
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#f59e0b]" /> Warning
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#38bdf8]" /> Milestone
          </span>
        </div>
      </div>
    </div>
  );
}
