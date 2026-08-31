'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Lock, 
  EyeOff, 
  Database, 
  CheckCircle2, 
  FileCheck2,
  Server,
  FileText
} from 'lucide-react';

export default function PrivacyPage() {
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
        {/* Header Badge */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-medium mb-3">
            <Lock className="w-3.5 h-3.5" />
            <span>{lang === 'EN' ? 'Global Privacy Policy & Data Sovereignty' : 'Kebijakan Privasi & Kedaulatan Data'}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            {lang === 'EN' ? 'Privacy Policy (UU PDP & GDPR Aligned)' : 'Kebijakan Perlindungan Data Pribadi & Privasi'}
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            {lang === 'EN' 
              ? 'Effective Date: August 31, 2026 • Compliant with Indonesia Personal Data Protection Law (UU PDP No. 27/2022) & EU GDPR'
              : 'Mulai Berlaku: 31 Agustus 2026 • Sesuai Ketentuan UU No. 27/2022 tentang Pelindungan Data Pribadi & EU GDPR'}
          </p>
        </div>

        {lang === 'EN' ? (
          /* ================= ENGLISH (DEFAULT) ================= */
          <div className="space-y-8 text-slate-300 text-sm leading-relaxed">
            {/* Core Principle: Privacy by Design */}
            <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30">
              <h2 className="text-base font-bold text-cyan-300 flex items-center gap-2 mb-2">
                <EyeOff className="w-4 h-4 text-cyan-400" />
                1. Privacy by Design &amp; Zero-Trust Data Handling
              </h2>
              <p className="text-xs text-slate-300">
                CTARTech-AIControlPlane operates on the strict principle of <em>Data Minimization and Zero Implicit Trust</em>. Our runtime gateway intercepts agent actions solely to evaluate security policy constraints, verify cryptographic authorities, and enforce least-privilege guardrails.
              </p>
            </div>

            {/* Section 2: Dynamic PII Masking */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                2. Automated PII Masking &amp; Anonymization (UU PDP Art. 35 &amp; GDPR Art. 25)
              </h3>
              <p className="text-xs text-slate-300 mb-3">
                Any payload or parameter containing Personally Identifiable Information (PII) is automatically masked prior to persistence in audit registries:
              </p>
              <div className="grid sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="font-semibold text-slate-200">National ID / NIK (16 Digits)</div>
                  <div className="text-cyan-400 font-mono text-[11px] mt-1">3201************ (Masked)</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="font-semibold text-slate-200">Financial &amp; Card Numbers</div>
                  <div className="text-cyan-400 font-mono text-[11px] mt-1">4111-****-****-1234 (Masked)</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="font-semibold text-slate-200">Email Addresses</div>
                  <div className="text-cyan-400 font-mono text-[11px] mt-1">u***r@domain.com (Masked)</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="font-semibold text-slate-200">Phone Numbers (+62 / 08)</div>
                  <div className="text-cyan-400 font-mono text-[11px] mt-1">+62-812-****-6666 (Masked)</div>
                </div>
              </div>
            </div>

            {/* Section 3: Isolation of Private Vector Data Bank */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                3. Multi-Tenant Isolation &amp; Private Vector Data Bank
              </h3>
              <p className="text-xs text-slate-300">
                Customer audit logs, policy rules, and agent metadata are strictly isolated per tenant using cryptographic tenant keys and logical separation. Organization data is never used to train or fine-tune public machine learning models.
              </p>
            </div>

            {/* Section 4: Data Retention & Automated Shredding */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                4. Data Retention &amp; Cryptographic Shredding
              </h3>
              <p className="text-xs text-slate-300">
                Audit logs are retained in accordance with the Customer&apos;s configurable data retention policy (default: 90 days). Expired records undergo cryptographic zeroization (*secure shredding*) to guarantee complete irrecoverability.
              </p>
            </div>

            {/* Section 5: Data Subject Rights */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
                5. Rights of Data Subjects (UU PDP Chapter IV &amp; GDPR Chapter III)
              </h3>
              <p className="text-xs text-slate-300">
                Data subjects have the right to request access, rectification, pseudonymization, and deletion of their processed data. Data Protection Officers (DPO) may submit inquiries directly to our security operations team at <code className="text-cyan-400 font-mono">security@ctar.tech</code>.
              </p>
            </div>
          </div>
        ) : (
          /* ================= INDONESIAN (LOKAL) ================= */
          <div className="space-y-8 text-slate-300 text-sm leading-relaxed">
            {/* Prinsip Utama: Privacy by Design */}
            <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30">
              <h2 className="text-base font-bold text-cyan-300 flex items-center gap-2 mb-2">
                <EyeOff className="w-4 h-4 text-cyan-400" />
                1. Prinsip Privasi Terintegrasi (*Privacy by Design*)
              </h2>
              <p className="text-xs text-slate-300">
                CTARTech-AIControlPlane beroperasi berdasarkan prinsip ketat <em>Minimisasi Data dan Zero Implicit Trust</em>. Gateway runtime kami memproses permintaan agen semata-mata untuk evaluasi aturan keamanan, validasi batas kewenangan, dan pengamanan wewenang terendah.
              </p>
            </div>

            {/* Pasal 2: Sensor Data Pribadi (PII Masking) */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                2. Sensor &amp; Anonimisasi Data Pribadi Otomatis (Pasal 35 UU PDP No. 27/2022)
              </h3>
              <p className="text-xs text-slate-300 mb-3">
                Setiap parameter atau data yang mengandung Data Pribadi Spesifik/Umum disensor secara otomatis sebelum disimpan ke dalam log audit:
              </p>
              <div className="grid sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="font-semibold text-slate-200">Nomor Induk Kependudukan (NIK 16 Digit)</div>
                  <div className="text-cyan-400 font-mono text-[11px] mt-1">3201************ (Tersensor)</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="font-semibold text-slate-200">Nomor Rekening &amp; Kartu Bank</div>
                  <div className="text-cyan-400 font-mono text-[11px] mt-1">4111-****-****-1234 (Tersensor)</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="font-semibold text-slate-200">Alamat Email Pribadi</div>
                  <div className="text-cyan-400 font-mono text-[11px] mt-1">u***r@domain.com (Tersensor)</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="font-semibold text-slate-200">Nomor Telepon Seluler (+62 / 08)</div>
                  <div className="text-cyan-400 font-mono text-[11px] mt-1">+62-812-****-6666 (Tersensor)</div>
                </div>
              </div>
            </div>

            {/* Pasal 3: Isolasi Data Multi-Tenant */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                3. Isolasi Data Multi-Tenant &amp; Private Vector Data Bank
              </h3>
              <p className="text-xs text-slate-300">
                Seluruh log audit dan kebijakan akses diisolasi secara mutlak antar-organisasi. Data organisasi Anda tidak akan pernah digunakan untuk melatih model AI publik tanpa izin eksplisit.
              </p>
            </div>

            {/* Pasal 4: Retensi Log & Penghapusan Permanen */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                4. Kebijakan Retensi &amp; Penghapusan Data Aman
              </h3>
              <p className="text-xs text-slate-300">
                Log audit disimpan sesuai masa retensi yang ditetapkan perusahaan (standar 90 hari). Data yang kadaluarsa akan dihapus secara kriptografis (*secure shredding*) sehingga tidak dapat dipulihkan kembali.
              </p>
            </div>

            {/* Pasal 5: Hak Pemilik Data Pribadi */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
                5. Hak Subjek Data Pribadi (Bab IV UU PDP No. 27/2022)
              </h3>
              <p className="text-xs text-slate-300">
                Pemilik data berhak menuntut akses, perbaikan, pembatasan pemrosesan, dan penghapusan data pribadinya. Pengajuan dapat disampaikan ke Petugas Perlindungan Data (DPO) kami di <code className="text-cyan-400 font-mono">security@ctar.tech</code>.
              </p>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <Link href="/terms" className="text-cyan-400 hover:underline flex items-center gap-1">
            <span>&rarr; {lang === 'EN' ? 'Read Terms of Service' : 'Baca Syarat & Ketentuan Layanan'}</span>
          </Link>
          <Link href="/compliance" className="text-cyan-400 hover:underline flex items-center gap-1">
            <span>&rarr; {lang === 'EN' ? 'Open ISO Compliance & Standards Hub' : 'Buka Pusat Kepatuhan Standar ISO'}</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
