import { Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="border-b border-[#1e2638] pb-5">
        <span className="text-[10px] font-mono-code text-[#f59e0b] uppercase tracking-wider block">
          Legal & Compliance
        </span>
        <h1 className="font-editorial text-3xl font-bold text-[#f1f5f9] tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-[#94a3b8] mt-1 font-mono-code">
          Effective Date: October 2026 • ORATOR Speech Intelligence Platform Prototype
        </p>
      </div>

      <div className="space-y-6 text-xs text-[#cbd5e1] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#f1f5f9] font-editorial">
            1. Handling of Uploaded Audio Files
          </h2>
          <p>
            When you upload audio files to ORATOR for acoustic or linguistic evaluation, the audio is processed locally within the running instance environment. In the default autonomous demo configuration, speech audio is stored locally in temporary storage for waveform rendering and signal analysis. Uploaded audio files are not repurposed, redistributed, or sold.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#f1f5f9] font-editorial">
            2. Local Database Architecture
          </h2>
          <p>
            ORATOR uses a local SQLite database file (<code>dev.db</code>) managed via Prisma. All analysis records, extracted timestamps, rubric evaluations, and user-generated sessions remain strictly local to your instance unless you configure an external hosted database.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#f1f5f9] font-editorial">
            3. Third-Party AI Services
          </h2>
          <p>
            If you explicitly provide external API credentials (such as Google Gemini or OpenAI Whisper keys), your transcripts and audio segments are transmitted to those respective third-party service providers solely to perform inference. If no API keys are provided, ORATOR utilizes internal deterministic signal extraction algorithms, and zero data leaves your local machine.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#f1f5f9] font-editorial">
            4. User Control & Data Retention
          </h2>
          <p>
            Users retain complete ownership and control over their uploaded speeches, custom transcripts, and evaluation outputs. Speeches can be deleted from the library at any time via the user interface or database pruning.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#f1f5f9] font-editorial">
            5. Prototype Notice
          </h2>
          <p>
            This application is an engineering prototype developed for Hackathon Track C (Contrastive Speech Analytics & Temporal Flaw Grounding). We make no representations regarding formal enterprise certifications (such as HIPAA, SOC2, or GDPR) beyond the described local operational architecture.
          </p>
        </section>
      </div>
    </div>
  );
}
