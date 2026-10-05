import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="border-b border-[#1e2638] pb-5">
        <span className="text-[10px] font-mono-code text-[#f59e0b] uppercase tracking-wider block">
          Legal & Compliance
        </span>
        <h1 className="font-editorial text-3xl font-bold text-[#f1f5f9] tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs text-[#94a3b8] mt-1 font-mono-code">
          Effective Date: October 2026 • ORATOR Speech Intelligence Platform Prototype
        </p>
      </div>

      <div className="space-y-6 text-xs text-[#cbd5e1] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#f1f5f9] font-editorial">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using the ORATOR speech intelligence workstation, you agree to be bound by these Terms of Service. If you disagree with any portion of these terms, you may cease using the prototype at any time.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#f1f5f9] font-editorial">
            2. Research & Evaluation Prototype Status
          </h2>
          <p>
            ORATOR is explicitly provided as a research demonstration and hackathon evaluation prototype. The platform is supplied on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express or implied.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#f1f5f9] font-editorial">
            3. Disclaimer of Psychological & Medical Utility
          </h2>
          <p>
            ORATOR provides communication pacing, acoustic variance, and rhetorical delivery feedback. The software is <strong>not</strong> designed, intended, or certified to diagnose, evaluate, or infer any psychological condition, medical status, emotional stability, or cognitive impairment. Users agree not to utilize ORATOR metrics for clinical or employment screening evaluations.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#f1f5f9] font-editorial">
            4. Permitted Use & User Content
          </h2>
          <p>
            You agree not to upload abusive, unlawful, or infringing audio material. You represent that you possess the necessary rights and consents to submit any audio or transcripts for algorithmic evaluation.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#f1f5f9] font-editorial">
            5. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by applicable law, the authors, contributors, and maintainers of ORATOR shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use this software.
          </p>
        </section>
      </div>
    </div>
  );
}
