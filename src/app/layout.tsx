import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Topbar } from "@/components/Topbar";

export const metadata: Metadata = {
  title: "ORATOR - Multimodal Speech Intelligence & Temporal Evaluation Platform",
  description:
    "Analytical speech intelligence workstation featuring contrastive speech evaluation, temporal flaw grounding, and reproducible rubric-based scoring.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0a0d13] text-[#f1f5f9] min-h-screen flex antialiased">
        <Navigation />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar />
          <main className="flex-1 overflow-y-auto p-6 md:p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
