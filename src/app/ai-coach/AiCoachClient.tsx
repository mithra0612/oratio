"use client";

import { useState } from "react";
import { BrainCircuit, Send, Sparkles, Clock, CheckCircle2, User, Bot, Loader2 } from "lucide-react";
import { SpeechDetail } from "@/types";

interface Message {
  id: string;
  sender: "user" | "coach";
  text: string;
  timestamp: string;
}

const SUGGESTED_QUERIES = [
  "How can I improve before my next presentation?",
  "What was my biggest weakness in the latest speech?",
  "Where did I speak too quickly?",
  "How did my latest speech compare with my previous speech?",
  "What should I practice?",
  "Which flaw appears most frequently?",
];

interface AiCoachClientProps {
  speeches: SpeechDetail[];
}

export function AiCoachClient({ speeches }: AiCoachClientProps) {
  const [selectedSpeechId, setSelectedSpeechId] = useState(speeches[0]?.id || "");
  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-welcome",
      sender: "coach",
      text: `Welcome to the ORATOR Speech Intelligence Coach. I am grounded in your empirical speech analytics, acoustic time-series, and rubric evaluations.

Ask me about your pacing volatility, transition quality, timestamped flaw clusters, or longitudinal progress across sessions.`,
      timestamp: "Just now",
    },
  ]);

  const currentSpeech = speeches.find((s) => s.id === selectedSpeechId) || speeches[0];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: textToSend,
          speechId: selectedSpeechId,
        }),
      });

      const data = await res.json();
      const coachMsg: Message = {
        id: `msg-coach-${Date.now()}`,
        sender: "coach",
        text: data.answer || "Unable to retrieve coaching advice.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, coachMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: "coach",
          text: "An error occurred while evaluating your question. Please try again.",
          timestamp: "Just now",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1e2638] pb-5">
        <div>
          <span className="text-[10px] font-mono-code text-[#f59e0b] uppercase tracking-wider block">
            Grounded Intelligence
          </span>
          <h2 className="font-editorial text-2xl md:text-3xl font-bold text-[#f1f5f9] tracking-tight">
            AI Speech Intelligence Coach
          </h2>
          <p className="text-xs md:text-sm text-[#94a3b8] mt-1">
            Diagnostic coaching referencing your recorded acoustic signals, grounded timestamps, and calibrated practice drills.
          </p>
        </div>

        {/* Speech Context Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono-code text-[#64748b]">Context:</span>
          <select
            value={selectedSpeechId}
            onChange={(e) => setSelectedSpeechId(e.target.value)}
            className="px-3 py-1.5 rounded bg-[#101520] border border-[#1e2638] text-xs font-mono-code text-[#f1f5f9] focus:outline-none focus:border-[#f59e0b]"
          >
            {speeches.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title} ({s.overallScore}/100)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Suggested Questions Grid */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono-code text-[#64748b] uppercase tracking-wider block font-semibold">
          Recommended Analytical Questions
        </span>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUERIES.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-xs font-mono-code px-3 py-1.5 rounded bg-[#101520] hover:bg-[#182030] text-[#cbd5e1] hover:text-[#f59e0b] border border-[#1e2638] hover:border-[#f59e0b]/40 transition-colors text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="bg-[#101520] border border-[#1e2638] rounded flex flex-col h-[520px]">
        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "coach" && (
                <div className="w-8 h-8 rounded bg-[#f59e0b]/10 border border-[#f59e0b]/30 flex items-center justify-center text-[#f59e0b] shrink-0">
                  <BrainCircuit className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl p-4 rounded text-xs leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-[#182133] text-[#f1f5f9] border border-[#2d374d]"
                    : "bg-[#0c1017] text-[#cbd5e1] border border-[#1e2638] whitespace-pre-wrap"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono-code text-[#64748b] mb-1.5">
                  <span className="font-semibold uppercase">
                    {msg.sender === "user" ? "You" : "ORATOR AI Coach"}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>
                {msg.text}
              </div>

              {msg.sender === "user" && (
                <div className="w-8 h-8 rounded bg-[#182030] border border-[#232c40] flex items-center justify-center text-[#f1f5f9] shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded bg-[#f59e0b]/10 border border-[#f59e0b]/30 flex items-center justify-center text-[#f59e0b] shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3.5 rounded bg-[#0c1017] border border-[#1e2638] text-xs font-mono-code text-[#94a3b8] flex items-center gap-2">
                <span>Analyzing speech evidence and temporal flaw vectors...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-[#1e2638] bg-[#0c1017] flex items-center gap-3">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder="Ask the AI Coach a diagnostic question about your speech..."
            className="flex-1 px-3 py-2 text-xs rounded bg-[#101520] border border-[#1e2638] text-[#f1f5f9] focus:outline-none focus:border-[#f59e0b]"
          />

          <button
            onClick={() => handleSend()}
            disabled={isLoading || !inputQuery.trim()}
            className="px-4 py-2 rounded bg-[#f59e0b] text-[#0a0d13] text-xs font-bold hover:bg-[#d97706] disabled:opacity-50 transition-colors flex items-center gap-1.5"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
