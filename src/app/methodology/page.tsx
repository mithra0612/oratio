import { BookOpen, ShieldAlert, CheckCircle2, Cpu, Clock, Layers, GitCompare } from "lucide-react";

export default function MethodologyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="border-b border-[#1e2638] pb-5">
        <span className="text-[10px] font-mono-code text-[#f59e0b] uppercase tracking-wider block">
          Academic & Technical Foundation
        </span>
        <h1 className="font-editorial text-3xl md:text-4xl font-bold text-[#f1f5f9] tracking-tight">
          Analytical Methodology & System Architecture
        </h1>
        <p className="text-sm text-[#94a3b8] mt-2 leading-relaxed">
          ORATOR is an empirical speech intelligence and temporal flaw grounding platform designed to provide reproducible, rubric-based feedback through multi-modal acoustic, linguistic, and structural telemetry.
        </p>
      </div>

      {/* 1. Signal Extraction */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-[#f59e0b]">
          <Cpu className="w-5 h-5" />
          <h2 className="font-editorial text-xl font-bold text-[#f1f5f9]">
            1. Signal Extraction & Acoustic Telemetry
          </h2>
        </div>
        <p className="text-xs md:text-sm text-[#cbd5e1] leading-relaxed">
          ORATOR extracts deterministic acoustic indicators directly from recorded audio waveforms and time-aligned phonetic transcript segments:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono-code text-xs pt-1">
          <div className="p-3.5 rounded bg-[#101520] border border-[#1e2638] space-y-1">
            <span className="text-[#f59e0b] font-bold block">Temporal Pacing (WPM)</span>
            <p className="text-[#94a3b8] font-sans text-xs">
              Measured by dividing segment word tokens by elapsed time intervals (seconds / 60). Baselines are maintained at 125-145 WPM.
            </p>
          </div>

          <div className="p-3.5 rounded bg-[#101520] border border-[#1e2638] space-y-1">
            <span className="text-[#f59e0b] font-bold block">Filler Density (%)</span>
            <p className="text-[#94a3b8] font-sans text-xs">
              Ratio of detected filler vocalizations ('um', 'uh', 'basically', 'like', 'you know') relative to total spoken word count.
            </p>
          </div>

          <div className="p-3.5 rounded bg-[#101520] border border-[#1e2638] space-y-1">
            <span className="text-[#f59e0b] font-bold block">Pause Distribution & Dead Air</span>
            <p className="text-[#94a3b8] font-sans text-xs">
              Syntactic pauses are segmented with threshold &gt;0.6s. Pauses exceeding 2.5s are flagged as unintentional cognitive hesitations.
            </p>
          </div>

          <div className="p-3.5 rounded bg-[#101520] border border-[#1e2638] space-y-1">
            <span className="text-[#f59e0b] font-bold block">Pace Volatility (σ)</span>
            <p className="text-[#94a3b8] font-sans text-xs">
              Standard deviation of segment-by-segment speaking rates, quantifying erratic speed accelerations and sudden deceleration.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Linguistic & Structural Analysis */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-[#38bdf8]">
          <Layers className="w-5 h-5" />
          <h2 className="font-editorial text-xl font-bold text-[#f1f5f9]">
            2. Linguistic Structure & Rhetorical Architecture
          </h2>
        </div>
        <p className="text-xs md:text-sm text-[#cbd5e1] leading-relaxed">
          ORATOR evaluates structural coherence by parsing transcripts into rhetorical functional components: Introduction, Core Thesis, Primary Arguments, Supporting Empirical Citations, Connective Transitions, and Summative Conclusion.
        </p>
        <p className="text-xs md:text-sm text-[#94a3b8] leading-relaxed">
          Linguistic indicators evaluate clarity, conciseness, verbal hedging ('I guess', 'maybe', 'sort of'), and transition signposts. Evaluations enforce structured JSON schemas validated against strict Zod type constraints.
        </p>
      </section>

      {/* 3. Contrastive Evaluation */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-[#10b981]">
          <GitCompare className="w-5 h-5" />
          <h2 className="font-editorial text-xl font-bold text-[#f1f5f9]">
            3. Contrastive Speech Evaluation
          </h2>
        </div>
        <p className="text-xs md:text-sm text-[#cbd5e1] leading-relaxed">
          Traditional speech feedback relies on isolated, ungrounded LLM prompts. In contrast, ORATOR anchors evaluations against a curated contrastive corpus of paired <strong>IDEAL</strong> and <strong>FLAWED</strong> speech archetypes across six core communication categories.
        </p>
        <p className="text-xs md:text-sm text-[#94a3b8] leading-relaxed">
          By contrasting flawed deliveries against ideal baselines, the platform generates verifiable delta metrics (e.g. "+33% pace acceleration", "+6.6% filler density surge", "loss of transition signposting") rather than generic qualitative observations.
        </p>
      </section>

      {/* 4. Reproducible Rubric Engine */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-[#f59e0b]">
          <CheckCircle2 className="w-5 h-5" />
          <h2 className="font-editorial text-xl font-bold text-[#f1f5f9]">
            4. Reproducible Scoring Engine
          </h2>
        </div>
        <p className="text-xs md:text-sm text-[#cbd5e1] leading-relaxed">
          The scoring engine computes reproducible composite performance from measurable signals combined with structured semantic scoring:
        </p>
        <div className="p-4 rounded bg-[#101520] border border-[#1e2638] font-mono-code text-xs space-y-2">
          <div className="flex justify-between border-b border-[#1e2638] pb-1.5 font-bold text-[#f1f5f9]">
            <span>Category</span>
            <span>Default Engine Weight</span>
            <span>Primary Deterministic Signals</span>
          </div>
          <div className="flex justify-between text-[#94a3b8]">
            <span>Delivery</span>
            <span>20%</span>
            <span>WPM bounded in 125-145, pace variation &lt; 20</span>
          </div>
          <div className="flex justify-between text-[#94a3b8]">
            <span>Clarity</span>
            <span>20%</span>
            <span>Filler density &lt; 2.0%, absence of colloquial crutches</span>
          </div>
          <div className="flex justify-between text-[#94a3b8]">
            <span>Structure</span>
            <span>20%</span>
            <span>Explicit signposts, distinct thesis and conclusion</span>
          </div>
          <div className="flex justify-between text-[#94a3b8]">
            <span>Content</span>
            <span>15%</span>
            <span>Quantitative empirical citations, domain density</span>
          </div>
          <div className="flex justify-between text-[#94a3b8]">
            <span>Fluency</span>
            <span>15%</span>
            <span>Average pause duration &lt; 1.5s, zero stalls &gt; 3.0s</span>
          </div>
          <div className="flex justify-between text-[#94a3b8]">
            <span>Engagement</span>
            <span>10%</span>
            <span>Prosodic inflection, vocal dynamic modulation</span>
          </div>
        </div>
      </section>

      {/* 5. Temporal Grounding */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-[#ef4444]">
          <Clock className="w-5 h-5" />
          <h2 className="font-editorial text-xl font-bold text-[#f1f5f9]">
            5. Temporal Flaw Grounding
          </h2>
        </div>
        <p className="text-xs md:text-sm text-[#cbd5e1] leading-relaxed">
          Every detected delivery flaw is grounded with exact millisecond timestamps, evidence logs, and contextual recommendations. Users can scrub audio directly to defect timestamps to inspect pace spikes, dead air hesitations, and filler clusters in context.
        </p>
      </section>

      {/* 6. Scientific Limitations & Boundaries */}
      <section className="p-5 rounded bg-[#181d28] border border-[#2d374d] space-y-2">
        <div className="flex items-center gap-2 text-[#f59e0b]">
          <ShieldAlert className="w-4 h-4" />
          <h3 className="font-editorial text-base font-bold text-[#f1f5f9]">
            6. Scientific Limitations & Ethical Constraints
          </h3>
        </div>
        <p className="text-xs text-[#94a3b8] leading-relaxed font-sans">
          ORATOR evaluates acoustic cadence, verbal fluency, and linguistic structure. The platform does <strong>not</strong> make clinical, psychological, or medical assertions. Acoustic signals are characterized using non-diagnostic terminology such as <em>delivery stability</em>, <em>pace variation</em>, and <em>prosodic signals</em>. Voice metrics are communicative indicators and must not be interpreted as proxies for cognitive condition or mental health.
        </p>
      </section>
    </div>
  );
}
