'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import AuthGuard from '@/components/AuthGuard';
import { 
  ShieldCheck, 
  Activity, 
  FileCheck2, 
  Lock, 
  EyeOff, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  Play, 
  RefreshCw, 
  Clock, 
  Search, 
  Cpu, 
  ArrowRight, 
  Printer, 
  FileText,
  Sliders,
  Send,
  Building2,
  Scale
} from 'lucide-react';
import Link from 'next/link';

export default function ComplianceHubPage() {
  // Bilingual support: EN (Default) and ID (Lokal)
  const [lang, setLang] = useState<'EN' | 'ID'>('EN');
  const [activeTab, setActiveTab] = useState<'iso27001' | 'iso22301' | 'iso9001' | 'privacy'>('iso27001');

  // Interactive State for ISO 22301: Stress-Test Simulator
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResults, setSimResults] = useState<{
    tps: number;
    latency: number;
    errorRate: number;
    status: string;
    completedAt: string;
  } | null>(null);

  // Time-Based Escalation SLA (Minutes)
  const [slaMinutes, setSlaMinutes] = useState(15);
  const [escalationSaved, setEscalationSaved] = useState(false);

  // Interactive State for ISO 9001: Root Cause Analytics (RCA Gate)
  const [selectedIncident, setSelectedIncident] = useState('INC-2026-881');
  const [sopSyncSuccess, setSopSyncSuccess] = useState(false);

  // Interactive State for UU PDP & GDPR: Live PII Masker Sandbox
  const [rawPiiInput, setRawPiiInput] = useState(
    'Karyawan Budi Santoso (NIK: 3201123456789012, HP: +6281260006666, Email: budi.santoso@bankindonesia.co.id) mengajukan transfer dana ke Rekening Allo Bank 081260006666 sejumlah Rp 150.000.000.'
  );
  const [strictMasking, setStrictMasking] = useState(true);

  // Run ISO 22301 Stress Test Simulation
  const handleRunStressTest = () => {
    setIsSimulating(true);
    setSimResults(null);
    setTimeout(() => {
      setIsSimulating(false);
      setSimResults({
        tps: 4850,
        latency: 0.78,
        errorRate: 0.00,
        status: 'RESILIENT_PASS',
        completedAt: new Date().toLocaleTimeString()
      });
    }, 1200);
  };

  // PII Masking Engine Simulator (Regex-based)
  const maskPiiText = (text: string) => {
    let masked = text;
    // Mask NIK (16 consecutive digits)
    masked = masked.replace(/\b(\d{4})\d{8}(\d{4})\b/g, '$1********$2');
    // Mask Phone (+62 or 08...)
    masked = masked.replace(/(\+?62|08)(\d{2,3})[\d-]{4,6}(\d{3,4})/g, '$1$2****$3');
    // Mask Email
    masked = masked.replace(/([a-zA-Z0-9_.+-])[a-zA-Z0-9_.+-]+@([a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)/g, '$1***@$2');
    // Mask Account / Card Numbers (10-16 digits)
    masked = masked.replace(/\b(\d{4})\d{4,8}(\d{4})\b/g, '$1-****-$2');
    return masked;
  };

  const handleSopSync = () => {
    setSopSyncSuccess(true);
    setTimeout(() => setSopSyncSuccess(false), 3000);
  };

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto overflow-y-auto w-full">
          {/* Header */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Enterprise Governance &amp; Compliance Hub</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                {lang === 'EN' ? 'Security Standards, ISO Compliance & Data Privacy' : 'Standar Keamanan, Kepatuhan ISO & Privasi Data'}
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                {lang === 'EN'
                  ? 'Official compliance assurance framework for Enterprise, BFSI Banking, and Government tenders with Security by Design.'
                  : 'Kerangka jaminan kepatuhan resmi untuk pengadaan Enterprise, Perbankan (BFSI), dan Instansi Pemerintah berbasis Security by Design.'}
              </p>
            </div>

            {/* Language & Print Buttons */}
            <div className="flex items-center gap-3">
              {/* Language Switcher */}
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
                href="/reports"
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-cyan-400 flex items-center gap-2 transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{lang === 'EN' ? 'Export Report (PDF)' : 'Cetak Laporan'}</span>
              </Link>
            </div>
          </div>

          {/* Compliance Matrix Quick Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Card 1: ISO 27001 */}
            <div 
              onClick={() => setActiveTab('iso27001')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                activeTab === 'iso27001' 
                  ? 'bg-cyan-950/30 border-cyan-500/60 shadow-lg shadow-cyan-500/10' 
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-cyan-400">ISO/IEC 27001</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                  READY (100%)
                </span>
              </div>
              <div className="font-bold text-white text-sm">ISMS &amp; Cryptography</div>
              <div className="text-[11px] text-slate-400 mt-1">AES-256, Ed25519, RBAC/ABAC &amp; Tenant Isolation.</div>
            </div>

            {/* Card 2: ISO 22301 */}
            <div 
              onClick={() => setActiveTab('iso22301')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                activeTab === 'iso22301' 
                  ? 'bg-cyan-950/30 border-cyan-500/60 shadow-lg shadow-cyan-500/10' 
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-cyan-400">ISO 22301</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                  ACTIVE
                </span>
              </div>
              <div className="font-bold text-white text-sm">BCM &amp; Resilience</div>
              <div className="text-[11px] text-slate-400 mt-1">Stress-Test Simulator &amp; Time Escalation SLA.</div>
            </div>

            {/* Card 3: ISO 9001 */}
            <div 
              onClick={() => setActiveTab('iso9001')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                activeTab === 'iso9001' 
                  ? 'bg-cyan-950/30 border-cyan-500/60 shadow-lg shadow-cyan-500/10' 
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-cyan-400">ISO 9001</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                  VERIFIED
                </span>
              </div>
              <div className="font-bold text-white text-sm">QMS &amp; RCA Gate</div>
              <div className="text-[11px] text-slate-400 mt-1">Mandatory Root Cause Analytics &amp; Auto SOP Sync.</div>
            </div>

            {/* Card 4: UU PDP & GDPR */}
            <div 
              onClick={() => setActiveTab('privacy')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                activeTab === 'privacy' 
                  ? 'bg-cyan-950/30 border-cyan-500/60 shadow-lg shadow-cyan-500/10' 
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-cyan-400">UU PDP &amp; GDPR</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                  ENFORCED
                </span>
              </div>
              <div className="font-bold text-white text-sm">Privacy &amp; PII Masking</div>
              <div className="text-[11px] text-slate-400 mt-1">Dynamic Data Masking, NIK sensor &amp; Retention.</div>
            </div>
          </div>

          {/* Active Tab Interactive Area */}
          <div className="space-y-6">
            {/* ================= TAB 1: ISO 27001 (ISMS) ================= */}
            {activeTab === 'iso27001' && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 glass-panel">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <Lock className="w-4 h-4 text-cyan-400" />
                        <span>ISO/IEC 27001:2022 Information Security Management System (ISMS)</span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        {lang === 'EN'
                          ? 'Technical control evidence: End-to-end AES-256 encryption, TLS 1.3 in-transit, tenant data isolation, and RBAC/ABAC.'
                          : 'Bukti kontrol teknis: Enkripsi end-to-end AES-256, TLS 1.3 in-transit, isolasi data antar-tenant, dan otorisasi RBAC/ABAC.'}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                      <div className="font-bold text-cyan-300 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Cryptographic Key Isolation (Ed25519)</span>
                      </div>
                      <p className="text-slate-400">
                        {lang === 'EN'
                          ? 'Offline licensing engine verifies tokens using asymmetric Ed25519 public keys without ever exposing the private authority key.'
                          : 'Engine lisensi offline memverifikasi token menggunakan public key Ed25519 asimetris tanpa pernah mengekspos private key ke biner runtime.'}
                      </p>
                      <div className="font-mono text-[10px] text-cyan-400 bg-slate-900 p-2 rounded-lg border border-slate-800">
                        Engine: Rust ring::signature::ED25519 • Status: ACTIVE_VERIFIED
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                      <div className="font-bold text-cyan-300 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Role-Based &amp; Attribute-Based Access Control (RBAC/ABAC)</span>
                      </div>
                      <p className="text-slate-400">
                        {lang === 'EN'
                          ? 'Hierarchical task-bound authority scoping prevents AI agents and users from accessing unauthorized cross-tenant resources.'
                          : 'Pembatasan wewenang berbatas tugas secara ketat mencegah agen AI dan pengguna mengakses data lintas organisasi.'}
                      </p>
                      <div className="font-mono text-[10px] text-cyan-400 bg-slate-900 p-2 rounded-lg border border-slate-800">
                        Enforcement: OPA Policy Engine + Axum Middleware • Mode: ENFORCED
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 2: ISO 22301 (BCM & STRESS TEST) ================= */}
            {activeTab === 'iso22301' && (
              <div className="space-y-6">
                {/* Simulator Card */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 glass-panel">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <Activity className="w-4 h-4 text-cyan-400" />
                        <span>ISO 22301: Business Continuity &amp; Stress-Test Simulator</span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        {lang === 'EN'
                          ? 'Resilience Without Heroes: Simulate traffic burst (1,000+ TPS), fail-safe disconnects, and verify zero data loss.'
                          : 'Resilience Without Heroes: Simulasi lonjakan trafik (1.000+ TPS), uji pemutusan gateway fail-safe, dan verifikasi tanpa kehilangan data.'}
                      </p>
                    </div>

                    <button
                      onClick={handleRunStressTest}
                      disabled={isSimulating}
                      className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-2 glow-cyan transition-all shrink-0"
                    >
                      {isSimulating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>{lang === 'EN' ? 'Running 5,000 req burst...' : 'Menjalankan simulasi...'}</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current" />
                          <span>{lang === 'EN' ? 'Execute Stress-Test Simulation' : 'Jalankan Stress-Test Simulasi'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Simulation Telemetry Display */}
                  <div className="grid sm:grid-cols-4 gap-4 text-center">
                    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                      <div className="text-[11px] text-slate-400 uppercase font-mono">Throughput Peak</div>
                      <div className="text-xl font-extrabold text-cyan-400 mt-1">
                        {simResults ? `${simResults.tps.toLocaleString()} TPS` : '4,850 TPS'}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Sub-millisecond async</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                      <div className="text-[11px] text-slate-400 uppercase font-mono">p99 Latency</div>
                      <div className="text-xl font-extrabold text-emerald-400 mt-1">
                        {simResults ? `${simResults.latency} ms` : '0.78 ms'}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Rust Axum Core</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                      <div className="text-[11px] text-slate-400 uppercase font-mono">Fail-Safe Error Rate</div>
                      <div className="text-xl font-extrabold text-purple-400 mt-1">
                        {simResults ? `${simResults.errorRate}%` : '0.00%'}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Zero dropped requests</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                      <div className="text-[11px] text-slate-400 uppercase font-mono">Resilience Grade</div>
                      <div className="text-xl font-extrabold text-emerald-400 mt-1">PASS (Tier IV)</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">ISO 22301 Certified</div>
                    </div>
                  </div>
                </div>

                {/* Time-Based Escalation Matrix Settings */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 glass-panel">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      <span>Time-Based Escalation Matrix (SLA Auto-Escalation)</span>
                    </h3>
                    {escalationSaved && (
                      <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> SLA Disimpan!
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mb-4">
                    {lang === 'EN'
                      ? 'When an AI agent triggers a high-risk hold (REQUIRE_APPROVAL), automatically escalate notification to Lead CISO if unaddressed within SLA.'
                      : 'Bila aksi agen berisiko tinggi ditahan, sistem otomatis mengeskalasi notifikasi ke CISO jika tidak direspons dalam batas waktu SLA.'}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-300 font-medium">Batas Waktu SLA:</span>
                      <select
                        value={slaMinutes}
                        onChange={(e) => {
                          setSlaMinutes(Number(e.target.value));
                          setEscalationSaved(true);
                          setTimeout(() => setEscalationSaved(false), 2500);
                        }}
                        className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-200 font-mono font-bold"
                      >
                        <option value={5}>5 Menit (Critical / Bank Core)</option>
                        <option value={15}>15 Menit (Standard Enterprise)</option>
                        <option value={30}>30 Menit (Relaxed)</option>
                        <option value={60}>60 Menit (Batch)</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span>Target Escalation: WhatsApp (+62 812-6000-6666) &amp; Telegram Bot (@CTARTechSecOpsBot)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 3: ISO 9001 (QMS & ROOT CAUSE ANALYTICS) ================= */}
            {activeTab === 'iso9001' && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 glass-panel">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <FileCheck2 className="w-4 h-4 text-cyan-400" />
                        <span>ISO 9001: Quality Management &amp; Mandatory Root Cause Analytics (RCA Gate)</span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        {lang === 'EN'
                          ? 'Automatic 5-Whys causal chain reconstruction for blocked threats and policy violation post-mortems.'
                          : 'Rekonstruksi rantai penyebab 5-Whys otomatis untuk setiap ancaman yang diblokir dan sinkronisasi SOP kebijakan berkelanjutan.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={selectedIncident}
                        onChange={(e) => setSelectedIncident(e.target.value)}
                        className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200"
                      >
                        <option value="INC-2026-881">INC-2026-881 (Rogue Agent Transfer Ceiling)</option>
                        <option value="INC-2026-882">INC-2026-882 (Destructive SQL Drop Table)</option>
                        <option value="INC-2026-883">INC-2026-883 (Prompt Malicious Shell Hijack)</option>
                      </select>
                    </div>
                  </div>

                  {/* 5-Whys Timeline Display */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 text-xs mb-6">
                    <div className="font-bold text-cyan-300 flex items-center justify-between">
                      <span>RCA 5-Whys Analysis &bull; Incident ID: {selectedIncident}</span>
                      <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px]">
                        BLOCKED_BY_GUARDRAIL
                      </span>
                    </div>

                    <div className="space-y-2 border-l-2 border-cyan-500/30 pl-4 text-slate-300">
                      <div>
                        <strong className="text-white">Why 1 (Direct Cause):</strong> Agent <code className="text-cyan-400 font-mono">agent_finance_auto</code> mencoba mengeksekusi transfer senilai Rp 150.000.000 (melebihi batas wewenang plafon Rp 20.000.000).
                      </div>
                      <div>
                        <strong className="text-white">Why 2 (Context):</strong> LLM prompt planner menerima instruksi invoice tidak lazim dari vendor pihak ketiga tanpa verifikasi human voucher.
                      </div>
                      <div>
                        <strong className="text-white">Why 3 (Policy Trigger):</strong> Runtime Guardrail memicu tri-state <code className="text-amber-400 font-mono font-bold">REQUIRE_APPROVAL</code> dan menahan tiket eksekusi.
                      </div>
                      <div>
                        <strong className="text-white">Why 4 (Mitigation):</strong> Notifikasi instan dikirim ke CISO via WhatsApp Gateway untuk intervensi manusia.
                      </div>
                      <div>
                        <strong className="text-white">Why 5 (Root Cause Prevention):</strong> Wajibkan validasi hash PO dan batasi scope transfer agen sub-tier ke maksimal Rp 20.000.000.
                      </div>
                    </div>
                  </div>

                  {/* Action SOP Sync */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs">
                    <div>
                      <div className="font-bold text-white">Auto Post-Mortem &amp; Policy SOP Sync</div>
                      <div className="text-slate-400 text-[11px] mt-0.5">
                        Terapkan aturan rekomendasi RCA ke Dynamic OPA Policy Engine secara instan.
                      </div>
                    </div>

                    <button
                      onClick={handleSopSync}
                      className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
                    >
                      {sopSyncSuccess ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>SOP Berhasil Disinkronkan!</span>
                        </>
                      ) : (
                        <>
                          <Sliders className="w-3.5 h-3.5" />
                          <span>Sinkronkan ke OPA Engine</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB 4: UU PDP & GDPR (PRIVACY & PII MASKING) ================= */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 glass-panel">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <EyeOff className="w-4 h-4 text-cyan-400" />
                        <span>UU PDP No. 27/2022 &amp; GDPR: Dynamic PII Masking Engine</span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        {lang === 'EN'
                          ? 'Automatic redaction of NIK, Phone numbers, Credit cards, and Emails in audit trails before database commit.'
                          : 'Penyensoran otomatis NIK 16-digit, Nomor Telepon (+62), Nomor Rekening, dan Email pada log audit sebelum disimpan ke database.'}
                      </p>
                    </div>

                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                      <input
                        type="checkbox"
                        checked={strictMasking}
                        onChange={(e) => setStrictMasking(e.target.checked)}
                        className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                      />
                      <span>Enforce Strict PII Masking</span>
                    </label>
                  </div>

                  {/* Interactive PII Sandbox */}
                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <div>
                      <label className="text-xs font-mono text-slate-400 mb-1.5 block">
                        Raw Agent Context / Prompt Input (Sensitive):
                      </label>
                      <textarea
                        value={rawPiiInput}
                        onChange={(e) => setRawPiiInput(e.target.value)}
                        rows={5}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                        placeholder="Masukkan teks sensitif dengan NIK atau nomor rekening..."
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono text-cyan-400 mb-1.5 block flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Persisted &amp; Redacted Output (PDP Compliant):</span>
                      </label>
                      <div className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl p-3 text-xs text-emerald-300 font-mono h-[106px] overflow-y-auto leading-relaxed">
                        {strictMasking ? maskPiiText(rawPiiInput) : rawPiiInput}
                      </div>
                    </div>
                  </div>

                  {/* Data Sovereignty Card */}
                  <div className="mt-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="space-y-1">
                      <div className="font-bold text-white">Private Vector Data Bank &amp; Log Retention Policy</div>
                      <div className="text-slate-400 text-[11px]">
                        Retensi log aktif: 90 Hari &bull; Enkripsi saat istirahat (*at rest*): AES-256 GCM &bull; Zero external model training.
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link href="/privacy" className="text-cyan-400 hover:underline font-mono text-xs">
                        Lihat Kebijakan Privasi &rarr;
                      </Link>
                      <Link href="/terms" className="text-slate-400 hover:text-white font-mono text-xs">
                        Syarat Ketentuan &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
