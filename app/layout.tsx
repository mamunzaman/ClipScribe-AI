import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DemoAccessShell } from "@/components/auth/DemoAccessShell";
import { AppBackground } from "@/components/layout/AppBackground";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClipScribe AI — Premium AI Transcription Studio",
  description:
    "Upload audio or video and get clean, accurate transcripts. Modern AI transcription for creators and teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <div className="relative flex min-h-screen flex-col">
          <AppBackground />
          <DemoAccessShell>
            <Header />
            <main className="relative z-10 flex-1">{children}</main>
            <Footer />
          </DemoAccessShell>
        </div>
      </body>
    </html>
  );
}
