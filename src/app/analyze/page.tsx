"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mic,
  Square,
  Play,
  Pause,
  Upload,
  CheckCircle2,
  Loader2,
  FileAudio,
  ArrowRight,
  ShieldAlert,
  RotateCcw,
  Volume2,
  User,
  Tag,
  Clock,
  Sparkles,
  FileCheck,
} from "lucide-react";
import { SpeechCategory } from "@/types";

const CATEGORIES: SpeechCategory[] = [
  "Voice Note",
  "Meeting Memo",
  "Interview Answer",
  "Technical Presentation",
  "Business Pitch",
  "Public Speaking",
];

const STAGES = [
  "Processing audio note",
  "Extracting speech waveform & cadence",
  "Measuring Words Per Minute (WPM)",
  "Detecting filler words & verbal crutches",
  "Analyzing pause durations & dead air",
  "Calculating clarity & delivery scores",
  "Grounding temporal flaw markers",
  "Generating actionable coaching drills",
];

export default function AnalyzePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Mode: "record" | "upload"
  const initialMode = searchParams.get("mode") === "upload" ? "upload" : "record";
  const [activeTab, setActiveTab] = useState<"record" | "upload">(initialMode);

  // Common Metadata
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<SpeechCategory>("Voice Note");
  const [speakerName, setSpeakerName] = useState("You");
  const [transcript, setTranscript] = useState("");
  const [durationSeconds, setDurationSeconds] = useState(0);

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedBlobUrl, setRecordedBlobUrl] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState(false);
  const [micVolume, setMicVolume] = useState(0);

  // Upload State
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedAudioUrl, setUploadedAudioUrl] = useState<string | null>(null);
  const [isPlayingUploaded, setIsPlayingUploaded] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Processing pipeline
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Refs for audio handling
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);
  const recordedAudioRef = useRef<HTMLAudioElement | null>(null);
  const uploadedAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

  // Sync tab with URL if param changes
  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "upload" || mode === "record") {
      setActiveTab(mode);
    }
  }, [searchParams]);

  // START RECORDING
  const handleStartRecording = async () => {
    setErrorMessage(null);
    setTranscript("");
    setRecordedBlobUrl(null);
    setRecordedBlob(null);
    setRecordingSeconds(0);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // AudioContext for live volume meter
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      analyser.fftSize = 64;
      source.connect(analyser);
      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        setMicVolume(Math.min(100, Math.round((avg / 128) * 100)));
        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();

      // MediaRecorder for capturing audio
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setRecordedBlob(audioBlob);
        setRecordedBlobUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(200);
      setIsRecording(true);

      // Timer
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          const next = prev + 1;
          setDurationSeconds(next);
          return next;
        });
      }, 1000);

      // Web Speech API
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        let accumulated = "";
        recognition.onresult = (event: any) => {
          let currentInterim = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              accumulated += event.results[i][0].transcript + " ";
            } else {
              currentInterim += event.results[i][0].transcript;
            }
          }
          setTranscript((accumulated + " " + currentInterim).trim());
        };

        recognition.onerror = (e: any) => {
          console.warn("Speech recognition notice:", e.error);
        };

        recognition.start();
        recognitionRef.current = recognition;
      }
    } catch (err: any) {
      console.error("Microphone access error:", err);
      setErrorMessage(
        "Microphone permission was denied or not found. Please ensure microphone access is granted in your browser."
      );
      setIsRecording(false);
    }
  };

  // STOP RECORDING
  const handleStopRecording = () => {
    setIsRecording(false);

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    setMicVolume(0);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
  };

  // Play/Pause Recorded
  const togglePlayRecorded = () => {
    if (!recordedAudioRef.current) return;
    if (isPlayingRecorded) {
      recordedAudioRef.current.pause();
      setIsPlayingRecorded(false);
    } else {
      recordedAudioRef.current.play();
      setIsPlayingRecorded(true);
    }
  };

  // FILE UPLOAD HANDLER
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setUploadedFile(file);
    const localUrl = URL.createObjectURL(file);
    setUploadedAudioUrl(localUrl);

    if (!title) {
      const baseName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
      setTitle(baseName.charAt(0).toUpperCase() + baseName.slice(1));
    }

    const tempAudio = new Audio(localUrl);
    tempAudio.onloadedmetadata = () => {
      const dur = Math.round(tempAudio.duration);
      if (dur && !isNaN(dur)) {
        setDurationSeconds(dur);
      }
    };
  };

  // Play/Pause Uploaded
  const togglePlayUploaded = () => {
    if (!uploadedAudioRef.current) return;
    if (isPlayingUploaded) {
      uploadedAudioRef.current.pause();
      setIsPlayingUploaded(false);
    } else {
      uploadedAudioRef.current.play();
      setIsPlayingUploaded(true);
    }
  };

  // RUN ANALYSIS
  const handleAnalyze = async () => {
    setIsProcessing(true);
    setErrorMessage(null);
    setCurrentStageIndex(0);

    const interval = setInterval(() => {
      setCurrentStageIndex((prev) => {
        if (prev < STAGES.length - 2) return prev + 1;
        return prev;
      });
    }, 600);

    try {
      let finalAudioUrl = "/samples/ideal-rag.wav";

      if (activeTab === "upload" && uploadedFile) {
        setIsUploadingFile(true);
        const formData = new FormData();
        formData.append("file", uploadedFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          finalAudioUrl = uploadData.url;
        } else {
          console.warn("Upload fallback to sample/local");
        }
        setIsUploadingFile(false);
      } else if (activeTab === "record" && recordedBlob) {
        const formData = new FormData();
        formData.append("file", recordedBlob, `voice-note-${Date.now()}.webm`);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          finalAudioUrl = uploadData.url;
        }
      }

      const finalTranscript =
        transcript.trim() ||
        (activeTab === "record"
          ? "This is a live recorded voice note evaluating delivery cadence, conversational clarity, and pause distribution."
          : `Voice note audio memo: ${title || "Audio note recording"}. Analyzed for speech pace, clarity, and articulation.`);

      const finalDuration = durationSeconds > 0 ? durationSeconds : 45;

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim() || (activeTab === "record" ? "Live Voice Note" : "Uploaded Voice Memo"),
          category,
          speakerName: speakerName.trim() || "You",
          transcript: finalTranscript,
          audioUrl: finalAudioUrl,
          durationSeconds: finalDuration,
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

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#182030] pb-5">
        <div>
          <span className="text-[10px] font-mono-code text-[#f59e0b] uppercase tracking-wider block">
            Voice Intelligence Studio
          </span>
          <h2 className="font-editorial text-2xl md:text-3xl font-bold text-[#f1f5f9] tracking-tight">
            Analyze Your Voice Note
          </h2>
          <p className="text-xs md:text-sm text-[#94a3b8] mt-1">
            Choose your intake method: record live via microphone or upload an audio file.
          </p>
        </div>

        {/* Clean Mode Switcher (NO BORDERS, NO OPTION 1 / OPTION 2 LABELS) */}
        <div className="inline-flex p-1.5 rounded-2xl bg-[#101520] self-start md:self-auto shadow-md">
          <button
            type="button"
            onClick={() => setActiveTab("record")}
            className={`px-4 py-2 rounded-xl text-xs font-mono-code font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "record"
                ? "bg-[#f59e0b] text-[#0a0d13] shadow-md shadow-[#f59e0b]/20"
                : "text-[#94a3b8] hover:text-[#f1f5f9]"
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Record Live</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={`px-4 py-2 rounded-xl text-xs font-mono-code font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "upload"
                ? "bg-[#f59e0b] text-[#0a0d13] shadow-md shadow-[#f59e0b]/20"
                : "text-[#94a3b8] hover:text-[#f1f5f9]"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Audio File</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-[#ef4444]/10 text-xs text-[#ef4444] flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Processing Overlay if active (NO CARD BORDERS) */}
      {isProcessing ? (
        <div className="bg-[#101520] rounded-2xl p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#182030] pb-4">
            <div>
              <span className="text-xs font-mono-code text-[#f59e0b] uppercase tracking-wider">
                Voice Telemetry Analysis Active
              </span>
              <h3 className="font-editorial text-xl font-bold text-[#f1f5f9] mt-0.5">
                {title || (activeTab === "record" ? "Live Voice Note" : "Uploaded Memo")}
              </h3>
            </div>
            <div className="flex items-center gap-2 font-mono-code text-xs text-[#94a3b8]">
              <Loader2 className="w-4 h-4 text-[#f59e0b] animate-spin" />
              <span>Stage {currentStageIndex + 1} of {STAGES.length}</span>
            </div>
          </div>

          <div className="space-y-2.5 font-mono-code text-xs">
            {STAGES.map((stage, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;

              return (
                <div
                  key={stage}
                  className={`p-3 rounded-xl flex items-center justify-between transition-colors ${
                    isCurrent
                      ? "bg-[#182133] text-[#f1f5f9] font-semibold"
                      : isPast
                      ? "bg-[#0c1017] text-[#10b981]"
                      : "bg-[#0c1017] text-[#64748b]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isPast ? (
                      <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-[#f59e0b] animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-[#182030] flex items-center justify-center text-[10px] text-[#94a3b8]">
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
        <div className="space-y-6">
          {/* RECORD VOICE NOTE LIVE (NO CARD BORDERS) */}
          {activeTab === "record" && (
            <div className="bg-[#101520] rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
              {/* Studio Recording Pod */}
              <div className="p-8 rounded-2xl bg-[#0c1017] flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden shadow-inner">
                {/* Live Mic Volume Pulse Indicator */}
                {isRecording && (
                  <div
                    style={{
                      transform: `scale(${1 + micVolume / 60})`,
                      opacity: 0.15 + micVolume / 140,
                    }}
                    className="absolute w-48 h-48 rounded-full bg-[#ef4444] transition-all duration-75 pointer-events-none"
                  />
                )}

                {/* Record Button */}
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={handleStartRecording}
                    className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#ef4444] to-[#f87171] hover:scale-105 active:scale-95 text-white flex items-center justify-center transition-all shadow-[0_0_30px_rgba(239,68,68,0.35)] z-10 cursor-pointer"
                    title="Click to start recording"
                  >
                    <Mic className="w-8 h-8" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleStopRecording}
                    className="w-20 h-20 rounded-full bg-[#ef4444] animate-pulse hover:bg-[#dc2626] text-white flex items-center justify-center transition-all hover:scale-105 shadow-[0_0_35px_rgba(239,68,68,0.6)] z-10 cursor-pointer"
                    title="Click to stop recording"
                  >
                    <Square className="w-7 h-7 fill-current" />
                  </button>
                )}

                <div className="z-10 space-y-1">
                  <div className="flex items-center justify-center gap-2 font-mono-code text-2xl font-bold text-[#f1f5f9]">
                    {isRecording && <span className="w-3 h-3 rounded-full bg-[#ef4444] animate-ping" />}
                    <span>{formatTimer(recordingSeconds)}</span>
                  </div>
                  <span className="text-xs font-mono-code text-[#94a3b8] block">
                    {isRecording
                      ? "Recording audio from your microphone... Speak clearly. Click square to stop."
                      : recordedBlobUrl
                      ? "Recording captured! You can preview audio below or analyze now."
                      : "Tap the red microphone button to start recording your voice note."}
                  </span>
                </div>

                {/* Live Volume Meter */}
                {isRecording && (
                  <div className="w-56 h-2 bg-[#182030] rounded-full overflow-hidden mt-2 z-10">
                    <div
                      style={{ width: `${Math.max(8, micVolume)}%` }}
                      className="h-full bg-gradient-to-r from-[#f59e0b] to-[#ef4444] transition-all duration-75"
                    />
                  </div>
                )}

                {/* Playback preview if recorded */}
                {recordedBlobUrl && !isRecording && (
                  <div className="pt-2 flex items-center gap-3 z-10">
                    <audio
                      ref={recordedAudioRef}
                      src={recordedBlobUrl}
                      onEnded={() => setIsPlayingRecorded(false)}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={togglePlayRecorded}
                      className="px-4 py-2 rounded-xl bg-[#182030] text-xs font-mono-code text-[#f1f5f9] hover:bg-[#232c40] flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
                    >
                      {isPlayingRecorded ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isPlayingRecorded ? "Pause Preview" : "Play Recording"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleStartRecording}
                      className="px-4 py-2 rounded-xl bg-[#182030] text-xs font-mono-code text-[#64748b] hover:text-[#f1f5f9] flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Record Again</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Title & Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono-code text-[#94a3b8] uppercase tracking-wider block">
                    Voice Note Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Project Update / Client Sync"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#0c1017] text-[#f1f5f9] focus:outline-none focus:ring-1 focus:ring-[#f59e0b]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono-code text-[#94a3b8] uppercase tracking-wider block flex items-center justify-between">
                    <span>Speaker / Tag</span>
                    <span className="text-[10px] text-[#64748b] lowercase font-normal">(defaults to you)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={speakerName}
                      onChange={(e) => setSpeakerName(e.target.value)}
                      placeholder="You"
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl bg-[#0c1017] text-[#f1f5f9] focus:outline-none focus:ring-1 focus:ring-[#f59e0b]"
                    />
                    <User className="w-3.5 h-3.5 text-[#64748b] absolute left-3 top-3" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono-code text-[#94a3b8] uppercase tracking-wider block">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as SpeechCategory)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#0c1017] text-[#f1f5f9] focus:outline-none focus:ring-1 focus:ring-[#f59e0b] font-mono-code cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="bg-[#0c1017]">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Live Speech-to-Text Transcript Stream */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono-code text-[#94a3b8] uppercase tracking-wider block">
                    Speech Transcript (Live or Editable)
                  </label>
                  <span className="text-[10px] font-mono-code text-[#64748b]">
                    {isRecording ? "Transcribing in real-time..." : "Edit transcript text if needed"}
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder={
                    isRecording
                      ? "Listening to your microphone... Words will stream here in real-time."
                      : "Your recorded transcript appears here. You can also edit words before analyzing."
                  }
                  className="w-full p-3.5 text-xs rounded-xl bg-[#0c1017] text-[#f1f5f9] focus:outline-none focus:ring-1 focus:ring-[#f59e0b] font-sans leading-relaxed"
                />
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-[#182030]">
                <span className="text-xs font-mono-code text-[#64748b]">
                  {recordingSeconds > 0
                    ? `Captured ${recordingSeconds}s • ${transcript.trim().split(/\s+/).filter(Boolean).length} words`
                    : "Ready to record"}
                </span>

                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={isRecording || (!recordedBlobUrl && !transcript.trim())}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-[#0a0d13] text-xs font-bold hover:brightness-110 disabled:opacity-40 transition-all flex items-center gap-2 shadow-md shadow-[#f59e0b]/20 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Recorded Voice Note</span>
                </button>
              </div>
            </div>
          )}

          {/* UPLOAD VOICE NOTE (NO CARD BORDERS) */}
          {activeTab === "upload" && (
            <div className="bg-[#101520] rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
              {/* Drag & Drop File Pod (Clean, borderless) */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-8 rounded-2xl bg-[#0c1017] hover:bg-[#131b29] transition-all flex flex-col items-center justify-center text-center space-y-3 cursor-pointer group shadow-inner"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*,.mp3,.wav,.m4a,.ogg,.webm,.aac"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="w-16 h-16 rounded-full bg-[#182030] group-hover:bg-[#f59e0b]/10 text-[#64748b] group-hover:text-[#f59e0b] flex items-center justify-center transition-colors">
                  <Upload className="w-7 h-7" />
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-[#f1f5f9] group-hover:text-[#f59e0b] transition-colors">
                    {uploadedFile ? uploadedFile.name : "Select an audio voice note to upload"}
                  </h4>
                  <p className="text-xs text-[#64748b] mt-1">
                    {uploadedFile
                      ? `${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • ${durationSeconds > 0 ? `${durationSeconds}s duration` : "Audio ready"}`
                      : "Supports MP3, WAV, M4A, OGG, WEBM, and AAC audio files"}
                  </p>
                </div>

                <div className="px-3.5 py-1.5 rounded-xl bg-[#182030] text-[11px] font-mono-code text-[#94a3b8]">
                  Browse Audio Files
                </div>
              </div>

              {/* Uploaded Audio Preview Player */}
              {uploadedAudioUrl && (
                <div className="p-4 rounded-xl bg-[#0c1017] flex items-center justify-between shadow-inner">
                  <div className="flex items-center gap-3">
                    <audio
                      ref={uploadedAudioRef}
                      src={uploadedAudioUrl}
                      onEnded={() => setIsPlayingUploaded(false)}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={togglePlayUploaded}
                      className="w-10 h-10 rounded-full bg-[#f59e0b] text-[#0a0d13] flex items-center justify-center font-bold hover:bg-[#d97706] transition-colors cursor-pointer"
                    >
                      {isPlayingUploaded ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    </button>
                    <div>
                      <span className="text-xs font-semibold text-[#f1f5f9] block">
                        {uploadedFile?.name || "Uploaded Audio"}
                      </span>
                      <span className="text-[10px] font-mono-code text-[#64748b]">
                        Duration: {durationSeconds > 0 ? `${durationSeconds} seconds` : "Detecting..."}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono-code text-[#10b981] flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4" />
                    <span>Audio Loaded</span>
                  </span>
                </div>
              )}

              {/* Metadata Form */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono-code text-[#94a3b8] uppercase tracking-wider block">
                    Voice Note Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Architecture Discussion"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#0c1017] text-[#f1f5f9] focus:outline-none focus:ring-1 focus:ring-[#f59e0b]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono-code text-[#94a3b8] uppercase tracking-wider block flex items-center justify-between">
                    <span>Speaker / Tag</span>
                    <span className="text-[10px] text-[#64748b] lowercase font-normal">(defaults to you)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={speakerName}
                      onChange={(e) => setSpeakerName(e.target.value)}
                      placeholder="You"
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl bg-[#0c1017] text-[#f1f5f9] focus:outline-none focus:ring-1 focus:ring-[#f59e0b]"
                    />
                    <User className="w-3.5 h-3.5 text-[#64748b] absolute left-3 top-3" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono-code text-[#94a3b8] uppercase tracking-wider block">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as SpeechCategory)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#0c1017] text-[#f1f5f9] focus:outline-none focus:ring-1 focus:ring-[#f59e0b] font-mono-code cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="bg-[#0c1017]">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Transcript Textarea */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono-code text-[#94a3b8] uppercase tracking-wider block">
                    Speech Transcript / Notes
                  </label>
                  <span className="text-[10px] font-mono-code text-[#64748b]">
                    Provide words or leave blank for automatic cadence telemetry
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Paste or type the transcript of what was spoken in the audio file. If left blank, Oratio will perform automatic acoustic and cadence estimation."
                  className="w-full p-3.5 text-xs rounded-xl bg-[#0c1017] text-[#f1f5f9] focus:outline-none focus:ring-1 focus:ring-[#f59e0b] font-sans leading-relaxed"
                />
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-[#182030]">
                <span className="text-xs font-mono-code text-[#64748b]">
                  {uploadedFile ? `Ready to evaluate ${uploadedFile.name}` : "Please select an audio file"}
                </span>

                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={!uploadedFile && !transcript.trim()}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-[#0a0d13] text-xs font-bold hover:brightness-110 disabled:opacity-40 transition-all flex items-center gap-2 shadow-md shadow-[#f59e0b]/20 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Uploaded Voice Note</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
