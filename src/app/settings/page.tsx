"use client";

import { useEffect, useState } from "react";
import { Settings, Sliders, ShieldCheck, Key, CheckCircle2, RotateCcw, Save } from "lucide-react";

export default function SettingsPage() {
  const [weights, setWeights] = useState({
    delivery: 0.20,
    clarity: 0.20,
    structure: 0.20,
    content: 0.15,
    fluency: 0.15,
    engagement: 0.10,
  });

  const [demoMode, setDemoMode] = useState(true);
  const [apiStatus, setApiStatus] = useState({
    geminiConfigured: false,
    whisperConfigured: false,
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setWeights({
            delivery: data.settings.weightDelivery,
            clarity: data.settings.weightClarity,
            structure: data.settings.weightStructure,
            content: data.settings.weightContent,
            fluency: data.settings.weightFluency,
            engagement: data.settings.weightEngagement,
          });
          setDemoMode(data.settings.demoMode);
        }
        if (data.apiStatus) {
          setApiStatus(data.apiStatus);
        }
      })
      .catch((e) => console.error("Failed to load settings:", e));
  }, []);

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

  const handleWeightChange = (key: keyof typeof weights, value: number) => {
    setWeights((prev) => ({ ...prev, [key]: Math.round(value * 100) / 100 }));
  };

  const handleSave = async () => {
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          demoMode,
          weightDelivery: weights.delivery,
          weightClarity: weights.clarity,
          weightStructure: weights.structure,
          weightContent: weights.content,
          weightFluency: weights.fluency,
          weightEngagement: weights.engagement,
        }),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (e) {
      console.error("Failed to save settings:", e);
    }
  };

  const resetDefaults = () => {
    setWeights({
      delivery: 0.20,
      clarity: 0.20,
      structure: 0.20,
      content: 0.15,
      fluency: 0.15,
      engagement: 0.10,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-[#1e2638] pb-5">
        <span className="text-[10px] font-mono-code text-[#f59e0b] uppercase tracking-wider block">
          Platform Configuration
        </span>
        <h2 className="font-editorial text-2xl md:text-3xl font-bold text-[#f1f5f9] tracking-tight">
          System Settings & Evaluative Rubric Calibration
        </h2>
        <p className="text-xs md:text-sm text-[#94a3b8] mt-1">
          Adjust reproducible rubric scoring weights, configure runtime demo modes, and inspect external API integration health.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded bg-[#10b981]/15 border border-[#10b981]/30 text-xs font-mono-code text-[#10b981] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Rubric weights and platform preferences saved successfully.</span>
        </div>
      )}

      {/* 1. Rubric Weights Calibration */}
      <div className="bg-[#101520] border border-[#1e2638] rounded p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-[#1e2638] pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#f59e0b]" />
            <h3 className="font-editorial text-lg font-bold text-[#f1f5f9]">
              1. Reproducible Rubric Weights
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-mono-code font-bold ${
                Math.abs(totalWeight - 1.0) < 0.02
                  ? "text-[#10b981]"
                  : "text-[#ef4444]"
              }`}
            >
              Sum: {Math.round(totalWeight * 100)}% (Target: 100%)
            </span>
            <button
              onClick={resetDefaults}
              className="text-xs font-mono-code text-[#64748b] hover:text-[#f1f5f9] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <div className="space-y-4 font-mono-code text-xs">
          {[
            { key: "delivery" as const, label: "Delivery Stability (Pace bounded, pause quality)", val: weights.delivery },
            { key: "clarity" as const, label: "Clarity & Precision (Filler density, articulation)", val: weights.clarity },
            { key: "structure" as const, label: "Rhetorical Structure (Thesis, transitions, wrap-up)", val: weights.structure },
            { key: "content" as const, label: "Content Substance (Empirical grounding, density)", val: weights.content },
            { key: "fluency" as const, label: "Fluency & Cadence (Zero hesitations or stalls)", val: weights.fluency },
            { key: "engagement" as const, label: "Vocal Engagement (Prosodic dynamism, energy)", val: weights.engagement },
          ].map((item) => (
            <div key={item.key} className="space-y-1.5 p-3 rounded bg-[#0c1017] border border-[#1e2638]">
              <div className="flex items-center justify-between">
                <span className="text-[#cbd5e1] font-semibold">{item.label}</span>
                <span className="text-[#f59e0b] font-bold">{Math.round(item.val * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.50"
                step="0.05"
                value={item.val}
                onChange={(e) => handleWeightChange(item.key, parseFloat(e.target.value))}
                className="w-full accent-[#f59e0b] cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 2. Runtime Mode */}
      <div className="bg-[#101520] border border-[#1e2638] rounded p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#1e2638] pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#10b981]" />
            <h3 className="font-editorial text-lg font-bold text-[#f1f5f9]">
              2. Demo Mode & Autonomous Fallbacks
            </h3>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded bg-[#0c1017] border border-[#1e2638]">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#f1f5f9] block">
              Autonomous Demo Mode (Mandatory Zero-Key Operation)
            </span>
            <p className="text-[11px] text-[#94a3b8] max-w-xl leading-relaxed">
              When active, the platform functions autonomously using seeded speech recordings, deterministic metrics, and offline semantic evaluation engines. No external API keys are required for judging.
            </p>
          </div>

          <button
            onClick={() => setDemoMode(!demoMode)}
            className={`px-3 py-1.5 rounded text-xs font-mono-code font-bold transition-colors ${
              demoMode
                ? "bg-[#10b981] text-[#0a0d13]"
                : "bg-[#182030] text-[#64748b] border border-[#232c40]"
            }`}
          >
            {demoMode ? "ENABLED (Active)" : "DISABLED"}
          </button>
        </div>
      </div>

      {/* 3. API Integrations Status */}
      <div className="bg-[#101520] border border-[#1e2638] rounded p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#1e2638] pb-3">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-[#38bdf8]" />
            <h3 className="font-editorial text-lg font-bold text-[#f1f5f9]">
              3. External Inference API Status
            </h3>
          </div>
          <span className="text-[10px] font-mono-code text-[#64748b]">
            Secrets securely read from environment
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono-code text-xs">
          <div className="p-3.5 rounded bg-[#0c1017] border border-[#1e2638] flex items-center justify-between">
            <div>
              <span className="font-bold text-[#f1f5f9] block">Google Gemini API</span>
              <span className="text-[10px] text-[#64748b]">Semantic & Structural Evaluation</span>
            </div>
            {apiStatus.geminiConfigured ? (
              <span className="px-2 py-0.5 rounded bg-[#10b981]/20 text-[#10b981] text-[10px] font-bold">
                CONNECTED
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-[#182030] text-[#94a3b8] text-[10px]">
                OFFLINE FALLBACK
              </span>
            )}
          </div>

          <div className="p-3.5 rounded bg-[#0c1017] border border-[#1e2638] flex items-center justify-between">
            <div>
              <span className="font-bold text-[#f1f5f9] block">Whisper / Transcription API</span>
              <span className="text-[10px] text-[#64748b]">Acoustic Phonetic Transcription</span>
            </div>
            {apiStatus.whisperConfigured ? (
              <span className="px-2 py-0.5 rounded bg-[#10b981]/20 text-[#10b981] text-[10px] font-bold">
                CONNECTED
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-[#182030] text-[#94a3b8] text-[10px]">
                LOCAL CORPUS
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded bg-[#f59e0b] text-[#0a0d13] text-xs font-bold hover:bg-[#d97706] transition-colors flex items-center gap-2"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save System Settings</span>
        </button>
      </div>
    </div>
  );
}
