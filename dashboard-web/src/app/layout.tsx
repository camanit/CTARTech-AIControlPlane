import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AuthGuard from "@/components/AuthGuard";
import { LanguageProvider } from "@/lib/LanguageContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "CTARTech-AIControlPlane | Zero-Trust AI Agent Security Gateway",
  description: "Enterprise AI Agent Governance, Runtime Guardrails, and Human-in-the-Loop Orchestration. Powered by Rust Axum & Next.js 14.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <AuthGuard>{children}</AuthGuard>
        </LanguageProvider>
      </body>
    </html>
  );
}
