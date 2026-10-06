import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Topbar } from "@/components/Topbar";

export const metadata: Metadata = {
  title: "Oratio - Voice Note Intelligence & Delivery Coach",
  description:
    "Analyze your voice notes with live recording or audio upload, actionable pacing (WPM), filler density, and temporal flaw telemetry.",
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
