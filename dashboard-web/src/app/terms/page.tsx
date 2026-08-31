'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Globe2, 
  FileText, 
  CheckCircle2, 
  Scale, 
  AlertTriangle,
  Lock,
  Cpu
} from 'lucide-react';

export default function TermsPage() {
  // English is DEFAULT (EN), Indonesian (ID) is local
  const [lang, setLang] = useState<'EN' | 'ID'>('EN');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-slate-950 font-black text-sm shadow-md shadow-cyan-500/20">
              <ShieldCheck className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <span className="font-extrabold tracking-wider text-white text-base">
              CTAR<span className="text-cyan-400">AIControlPlane</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {/* Language Selector Switcher */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
              <button
                onClick={() => setLang('EN')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  lang === 'EN' 
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                EN (Default)
              </button>
              <button
                onClick={() => setLang('ID')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  lang === 'ID' 
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ID (Lokal)
              </button>
            </div>

            <Link
              href="/"
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{lang === 'EN' ? 'Back to Home' : 'Kembali'}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
        {/* Document Header Badge */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-medium mb-3">
            <Scale className="w-3.5 h-3.5" />
            <span>{lang === 'EN' ? 'Legal Terms of Service & Master Agreement' : 'Syarat & Ketentuan Layanan Resmi'}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            {lang === 'EN' ? 'Terms of Service & AI Governance Agreement' : 'Syarat Ketentuan & Tata Kelola Agen AI'}
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            {lang === 'EN' 
              ? 'Last Revised: August 31, 2026 • Compliant with ISO/IEC 27001, ISO 22301, ISO 9001 & UU PDP No. 27/2022'
              : 'Terakhir Diperbarui: 31 Agustus 2026 • Sesuai Standar ISO/IEC 27001, ISO 22301, ISO 9001 & UU PDP No. 27/2022'}
          </p>
        </div>

        {lang === 'EN' ? (
          /* ================= ENGLISH (DEFAULT) ================= */
          <div className="space-y-8 text-slate-300 text-sm leading-relaxed">
            {/* Executive Summary */}
            <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30">
              <h2 className="text-base font-bold text-cyan-300 flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                1. Purpose &amp; Scope of the AI Control Plane
              </h2>
              <p className="text-xs text-slate-300">
                CTARTech-AIControlPlane (&quot;ITCowboy Guard&quot;) provides runtime governance, security guardrails, policy enforcement (OPA-compatible), financial limit gating, and human-in-the-loop authorization for autonomous AI agents, machine identities, and LLM-driven workflows. By accessing or integrating our SDKs/API Gateway, the Customer (&quot;Organization&quot;) agrees to be bound by these Terms.
              </p>
            </div>

            {/* Section 2: Task-Bound Authority & Least Privilege */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                2. AI Agent Identity &amp; Task-Bound Authority (Principle of Least Privilege)
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-xs text-slate-300">
                <li>
                  <strong>Agent Registration:</strong> All AI Agents, autonomous processes, and microservices executing business logic must be registered with a unique cryptographic identity and assigned explicit operational limits.
                </li>
                <li>
                  <strong>Runtime Verification:</strong> The Platform evaluates every action tri-state decision (<span className="text-emerald-400 font-mono font-bold">ALLOW</span>, <span className="text-amber-400 font-mono font-bold">REQUIRE_APPROVAL</span>, or <span className="text-rose-400 font-mono font-bold">BLOCK</span>). Actions exceeding threshold limits are automatically quarantined.
                </li>
                <li>
                  <strong>Fail-Safe Default:</strong> In the event of gateway communication interruption, the Client SDK defaults to a secure fail-safe posture, blocking all high-risk or destructive actions unless explicitly whitelisted.
                </li>
              </ul>
            </div>

            {/* Section 3: Human-in-the-Loop & Liability Allocation */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <Scale className="w-4 h-4 text-cyan-400" />
                3. Human-in-the-Loop Approval &amp; Allocation of Responsibility
              </h3>
              <p className="text-xs text-slate-300 mb-3">
                Decisions approved by designated human approvers (CISO, SecOps Lead, or Task Owners) via the Human-in-the-Loop Portal, WhatsApp, or Telegram Webhooks are legally attributed to the approving human identity.
              </p>
              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200/90 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Destructive Actions:</strong> The Platform will strictly mandate human verification on sensitive operations (e.g., table deletion, customer data export, bulk fund transfers) to prevent catastrophic rogue agent behavior.
                </span>
              </div>
            </div>

            {/* Section 4: Offline Cryptographic Licensing & Zero-Leakage */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400" />
                4. Offline Cryptographic Licensing &amp; Air-Gap Deployments
              </h3>
              <p className="text-xs text-slate-300">
                Licenses are cryptographically signed using asymmetric Ed25519 cryptography. The Core Gateway validates licenses using the public key alone without requiring persistent outbound telemetry or internet connectivity, guaranteeing complete sovereignty for Banking, Defense, and Air-Gapped environments.
              </p>
            </div>

            {/* Section 5: Standards Compliance (ISO 27001, 22301, 9001, PDP) */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                5. Compliance Alignment &amp; Audit Readiness
              </h3>
              <div className="grid sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="font-bold text-cyan-300">ISO/IEC 27001 (ISMS)</div>
                  <div className="text-slate-400 mt-1">End-to-end AES-256 encryption, TLS 1.3, multi-tenant isolation, RBAC/ABAC policy engine.</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="font-bold text-cyan-300">ISO 22301 (BCM)</div>
                  <div className="text-slate-400 mt-1">Stress-test simulator, sub-millisecond fail-safe resilience, automated SLA time-based escalation.</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="font-bold text-cyan-300">ISO 9001 (QMS)</div>
                  <div className="text-slate-400 mt-1">Mandatory Root Cause Analytics (RCA Gate) &amp; continuous post-mortem SOP policy synchronization.</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="font-bold text-cyan-300">UU PDP &amp; GDPR</div>
                  <div className="text-slate-400 mt-1">Dynamic PII masking, token pseudonymization, automated retention policies, and sovereignty.</div>
                </div>
              </div>
            </div>

            {/* Section 6: Open Source & Enterprise Licensing */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h3 className="text-base font-bold text-white mb-2">6. License &amp; Governing Law</h3>
              <p className="text-xs text-slate-300">
                The open-source core is distributed under the GNU Affero General Public License v3 (AGPLv3). Enterprise and Air-Gap deployments are governed by commercial enterprise SLA agreements under the laws of the Republic of Indonesia with international arbitration readiness.
              </p>
            </div>
          </div>
        ) : (
          /* ================= INDONESIAN (LOKAL) ================= */
          <div className="space-y-8 text-slate-300 text-sm leading-relaxed">
            {/* Ringkasan Eksekutif */}
            <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30">
              <h2 className="text-base font-bold text-cyan-300 flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                1. Maksud &amp; Ruang Lingkup AI Control Plane
              </h2>
              <p className="text-xs text-slate-300">
                CTARTech-AIControlPlane (&quot;ITCowboy Guard&quot;) menyediakan tata kelola runtime, perisai keamanan (*guardrails*), penegakan kebijakan (*policy enforcement* OPA), pembatasan transaksi finansial, dan otorisasi manusia (*Human-in-the-Loop*) untuk agen AI otonom, identitas mesin, dan otomatisasi LLM. Dengan menggunakan SDK atau API Gateway kami, Pengguna/Organisasi menyetujui seluruh ketentuan ini.
              </p>
            </div>

            {/* Pasal 2: Wewenang Berbatas Tugas & Least Privilege */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                2. Identitas Agen AI &amp; Wewenang Berbatas Tugas (*Least Privilege*)
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-xs text-slate-300">
                <li>
                  <strong>Pendaftaran Agen:</strong> Seluruh Agen AI dan mikrolayanan yang mengeksekusi logika bisnis wajib terdaftar dengan identitas kriptografis unik dan batas wewenang yang tegas.
                </li>
                <li>
                  <strong>Verifikasi Runtime:</strong> Platform mengevaluasi keputusan tiga status (<span className="text-emerald-400 font-mono font-bold">ALLOW</span>, <span className="text-amber-400 font-mono font-bold">REQUIRE_APPROVAL</span>, atau <span className="text-rose-400 font-mono font-bold">BLOCK</span>). Aksi yang melampaui batas wewenang otomatis ditahan untuk persetujuan.
                </li>
                <li>
                  <strong>Mekanisme Fail-Safe:</strong> Jika terjadi gangguan komunikasi dengan gateway, SDK klien beralih ke mode perlindungan *fail-safe*, otomatis memblokir aksi berisiko tinggi.
                </li>
              </ul>
            </div>

            {/* Pasal 3: Persetujuan Manusia & Alokasi Tanggung Jawab */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <Scale className="w-4 h-4 text-cyan-400" />
                3. Persetujuan Manusia (*Human-in-the-Loop*) &amp; Alokasi Tanggung Jawab
              </h3>
              <p className="text-xs text-slate-300 mb-3">
                Keputusan yang disetujui oleh petugas resmi (CISO, Lead SecOps, atau Pemilik Tugas) melalui Portal Persetujuan, WhatsApp, atau Telegram secara hukum diatribusikan kepada identitas manusia yang menyetujui.
              </p>
              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200/90 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Aksi Destruktif:</strong> Sistem mewajibkan persetujuan manusia pada operasi sensitif (seperti penghapusan database, ekspor data pelanggan massal, transfer dana di atas plafon) guna mencegah aksi liar agen AI.
                </span>
              </div>
            </div>

            {/* Pasal 4: Lisensi Kriptografis Offline */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400" />
                4. Lisensi Kriptografis Offline &amp; Lingkungan Air-Gap
              </h3>
              <p className="text-xs text-slate-300">
                Lisensi ditandatangani secara kriptografis menggunakan algoritma asimetris Ed25519. Gateway Core memverifikasi lisensi hanya dengan *Public Key* tanpa membutuhkan telemetri keluar atau internet, menjamin kedaulatan data penuh bagi sektor Perbankan, BUMN, dan Pemerintahan.
              </p>
            </div>

            {/* Pasal 5: Kepatuhan Standar ISO & UU PDP */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                5. Kesiapan Kepatuhan Standar (ISO 27001, 22301, 9001 &amp; UU PDP)
              </h3>
              <div className="grid sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="font-bold text-cyan-300">ISO/IEC 27001 (ISMS)</div>
                  <div className="text-slate-400 mt-1">Enkripsi end-to-end AES-256, TLS 1.3, isolasi multi-tenant, matriks kontrol akses RBAC/ABAC.</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="font-bold text-cyan-300">ISO 22301 (BCM)</div>
                  <div className="text-slate-400 mt-1">Simulator stress-test, ketahanan fail-safe sub-milidetik, eskalasi otomatis berbasis SLA waktu.</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="font-bold text-cyan-300">ISO 9001 (QMS)</div>
                  <div className="text-slate-400 mt-1">Mandatory Root Cause Analytics (RCA Gate) &amp; sinkronisasi SOP kebijakan perbaikan berkelanjutan.</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="font-bold text-cyan-300">UU PDP No. 27/2022 &amp; GDPR</div>
                  <div className="text-slate-400 mt-1">Sensor data pribadi (PII masking), pseudonymization, kebijakan retensi log otomatis, dan kedaulatan data.</div>
                </div>
              </div>
            </div>

            {/* Pasal 6: Lisensi & Yurisdiksi Hukum */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h3 className="text-base font-bold text-white mb-2">6. Lisensi &amp; Hukum yang Berlaku</h3>
              <p className="text-xs text-slate-300">
                Versi publik berlisensi GNU Affero General Public License v3 (AGPLv3). Implementasi enterprise dan instalasi on-premise tunduk pada perjanjian SLA komersial di bawah hukum Republik Indonesia.
              </p>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <Link href="/privacy" className="text-cyan-400 hover:underline flex items-center gap-1">
            <span>&rarr; {lang === 'EN' ? 'Read Privacy Policy (UU PDP & GDPR)' : 'Baca Kebijakan Privasi (UU PDP & GDPR)'}</span>
          </Link>
          <Link href="/compliance" className="text-cyan-400 hover:underline flex items-center gap-1">
            <span>&rarr; {lang === 'EN' ? 'Open ISO Compliance & Standards Hub' : 'Buka Pusat Kepatuhan Standar ISO'}</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
