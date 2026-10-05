"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mic,
  Upload,
  CheckCircle2,
  Loader2,
  FileAudio,
  Play,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { SpeechCategory } from "@/types";

const CATEGORIES: SpeechCategory[] = [
  "Technical Presentation",
  "Interview Answer",
  "Business Pitch",
  "Academic Presentation",
  "Public Speaking",
  "Product Explanation",
];

const PRESET_SAMPLES = [
  {
    title: "Explaining Neural Retrieval-Augmented Generation",
    category: "Technical Presentation",
    duration: 80,
    audioUrl: "/samples/ideal-rag.wav",
    transcript:
      "Today we are addressing the fundamental limitation of static language models: knowledge boundaries. Retrieval-Augmented Generation bridges this gap by decoupling parametric memory from real-time dynamic retrieval. Instead of hallucinating facts, the pipeline queries a dense vector database to supply grounded context directly into the prompt window. In our benchmark evaluation across one hundred thousand queries, this approach slashed hallucination rates by eighty-four percent while preserving sub-second latency.",
  },
  {
    title: "Pitching BioCrest Sustainable Packaging",
    category: "Business Pitch",
    duration: 70,
    audioUrl: "/samples/ideal-pitch.wav",
    transcript:
      "Global supply chains generate ninety million tons of single-use plastic packaging every single year. Our platform, BioCrest, replaces petroleum polymer wrappers with marine-degradable mycelium composites at cost parity. We have already secured pilot contracts with three enterprise logistics partners, representing two million dollars in annual recurring revenue. Our gross margins exceed sixty-two percent, enabled by our patented continuous fungal fermentation process. Join us in decarbonizing commercial freight.",
  },
  {
    title: "Approach to Distributed Systems & Fault Tolerance",
    category: "Interview Answer",
    duration: 85,
    audioUrl: "/samples/ideal-distributed.wav",
    transcript:
      "When architecting distributed systems, I prioritize deterministic consensus, partition tolerance, and strict observability. In my previous role, our primary payment gateway suffered cascading failures under sudden traffic bursts exceeding fifty thousand transactions per second. I led the migration from an ad-hoc locking pattern to a Raft-based distributed log with adaptive client-side rate limiting. This eliminated all split-brain states and maintained ninety-nine point nine-nine percent service availability during peak volumes.",
  },
];

const STAGES = [
  "Uploading",
  "Transcribing",
  "Extracting speech signals",
  "Analyzing linguistic structure",
  "Evaluating delivery",
  "Running rubric evaluation",
  "Grounding temporal flaws",
  "Generating recommendations",
  "Preparing report",
];

export default function AnalyzePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<SpeechCategory>("Technical Presentation");
  const [transcript, setTranscript] = useState("");
  const [audioUrl, setAudioUrl] = useState("/samples/ideal-rag.wav");
  const [durationSeconds, setDurationSeconds] = useState(75);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const applyPreset = (preset: typeof PRESET_SAMPLES[0]) => {
    setTitle(preset.title);
    setCategory(preset.category as SpeechCategory);
    setTranscript(preset.transcript);
    setAudioUrl(preset.audioUrl);
    setDurationSeconds(preset.duration);
  };

  const handleStartAnalysis = async () => {
    setIsProcessing(true);
    setErrorMessage(null);
    setCurrentStageIndex(0);

    // Multi-stage visual progression
    const interval = setInterval(() => {
      setCurrentStageIndex((prev) => {
        if (prev < STAGES.length - 2) return prev + 1;
        return prev;
      });
    }, 700);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || `${category} Evaluation`,
          category,
          transcript,
          audioUrl,
          durationSeconds,
        }),
      });

      clearInterval(interval);
      setCurrentStageIndex(STAGES.length - 1);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Analysis failed");
      }

      const data = await res.json();
      setTimeout(() => {
        router.push(`/speeches/${data.speechId}`);
      }, 500);
    } catch (err: any) {
      clearInterval(interval);
      setIsProcessing(false);
      setErrorMessage(err.message || "An error occurred during evaluation.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Title */}
      <div>
        <span className="text-[10px] font-mono-code text-[#f59e0b] uppercase tracking-wider block">
          Analytical Ingestion
        </span>
        <h2 className="font-editorial text-2xl md:text-3xl font-bold text-[#f1f5f9] tracking-tight">
          Analyze Speech Delivery & Ground Temporal Flaws
        </h2>
        <p className="text-xs md:text-sm text-[#94a3b8] mt-1">
          Upload an audio file or select a calibrated sample from our corpus to run the multimodal intelligence pipeline.
        </p>
      </div>

      {/* Main Processing Overlay if active */}
      {isProcessing ? (
        <div className="bg-[#101520] border border-[#1e2638] rounded p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#1e2638] pb-4">
            <div>
              <span className="text-xs font-mono-code text-[#f59e0b] uppercase tracking-wider">
                Processing Pipeline Active
              </span>
              <h3 className="font-editorial text-xl font-bold text-[#f1f5f9] mt-0.5">
                {title || `${category} Evaluation`}
              </h3>
            </div>
            <div className="flex items-center gap-2 font-mono-code text-xs text-[#94a3b8]">
              <Loader2 className="w-4 h-4 text-[#f59e0b] animate-spin" />
              <span>Stage {currentStageIndex + 1} of {STAGES.length}</span>
            </div>
          </div>

          {/* Stepper Display */}
          <div className="space-y-3 font-mono-code text-xs">
            {STAGES.map((stage, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;

              return (
                <div
                  key={stage}
                  className={`p-3 rounded border flex items-center justify-between transition-colors ${
                    isCurrent
                      ? "bg-[#182133] border-[#f59e0b] text-[#f1f5f9] font-semibold"
                      : isPast
                      ? "bg-[#0c1017] border-[#1e2638] text-[#10b981]"
                      : "bg-[#0c1017] border-[#161c28] text-[#64748b]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isPast ? (
                      <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-[#f59e0b] animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-[#2d374d] flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </div>
                    )}
                    <span>{stage}</span>
                  </div>

                  <span className="text-[10px] uppercase tracking-wider">
                    {isPast ? "Done" : isCurrent ? "Processing" : "Pending"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Configuration & Ingestion Form */
        <div className="space-y-6">
          {errorMessage && (
            <div className="p-4 rounded bg-[#ef4444]/10 border border-[#ef4444]/30 text-xs text-[#ef4444] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Preset Sample Picker */}
          <div className="bg-[#101520] border border-[#1e2638] rounded p-5 space-y-3">
            <span className="text-[10px] font-mono-code text-[#64748b] uppercase tracking-wider block">
              Quick Preset (Recommended for Judging)
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {PRESET_SAMPLES.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => applyPreset(sample)}
                  className="p-3 text-left rounded bg-[#0c1017] border border-[#1e2638] hover:border-[#f59e0b]/50 transition-colors space-y-1 group"
                >
                  <span className="text-[10px] font-mono-code text-[#f59e0b] block">
                    {sample.category}
                  </span>
                  <h4 className="text-xs font-semibold text-[#f1f5f9] group-hover:text-[#f59e0b] transition-colors line-clamp-1">
                    {sample.title}
                  </h4>
                  <p className="text-[11px] text-[#64748b] line-clamp-2">
                    {sample.transcript}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="bg-[#101520] border border-[#1e2638] rounded p-6 space-y-5">
            {/* Title & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono-code text-[#94a3b8] uppercase tracking-wider block">
                  Speech Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Distributed Consensus Under Network Partitions"
                  className="w-full px-3 py-2 text-xs rounded bg-[#0c1017] border border-[#1e2638] text-[#f1f5f9] focus:border-[#f59e0b] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono-code text-[#94a3b8] uppercase tracking-wider block">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as SpeechCategory)}
                  className="w-full px-3 py-2 text-xs rounded bg-[#0c1017] border border-[#1e2638] text-[#f1f5f9] focus:border-[#f59e0b] focus:outline-none font-mono-code"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-[#0c1017]">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Audio Upload or URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono-code text-[#94a3b8] uppercase tracking-wider block">
                Audio Recording Asset
              </label>
              <div className="p-4 rounded bg-[#0c1017] border border-dashed border-[#2d374d] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-[#182030] text-[#f59e0b]">
                    <FileAudio className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#f1f5f9] block">
                      {audioUrl.split("/").pop()}
                    </span>
                    <span className="text-[10px] font-mono-code text-[#64748b]">
                      Duration: ~{durationSeconds} seconds • Multi-tone Prosodic WAV
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAudioUrl("/samples/ideal-rag.wav")}
                    className="text-[10px] font-mono-code px-2.5 py-1 rounded bg-[#131926] text-[#94a3b8] hover:text-[#f1f5f9] border border-[#1e2638]"
                  >
                    Load Ideal WAV
                  </button>
                  <button
                    type="button"
                    onClick={() => setAudioUrl("/samples/flawed-rag.wav")}
                    className="text-[10px] font-mono-code px-2.5 py-1 rounded bg-[#131926] text-[#ef4444] hover:text-[#f1f5f9] border border-[#ef4444]/30"
                  >
                    Load Flawed WAV
                  </button>
                </div>
              </div>
            </div>

            {/* Transcript Text */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono-code text-[#94a3b8] uppercase tracking-wider block">
                Speech Transcript (or Audio Transcription)
              </label>
              <textarea
                rows={5}
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Enter or paste speech text for linguistic and temporal evaluation..."
                className="w-full p-3 text-xs rounded bg-[#0c1017] border border-[#1e2638] text-[#f1f5f9] focus:border-[#f59e0b] focus:outline-none font-sans leading-relaxed"
              />
            </div>

            {/* Action Button */}
            <div className="pt-2 flex items-center justify-between border-t border-[#1e2638]">
              <span className="text-[11px] font-mono-code text-[#64748b]">
                Deterministic Signal Extraction + Gemini / Offline Evaluator
              </span>

              <button
                type="button"
                onClick={handleStartAnalysis}
                className="px-5 py-2.5 rounded bg-[#f59e0b] text-[#0a0d13] text-xs font-bold hover:bg-[#d97706] transition-colors flex items-center gap-2"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Start Multimodal Analysis</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
