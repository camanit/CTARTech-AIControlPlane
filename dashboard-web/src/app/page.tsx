'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Bot, 
  Activity, 
  KeyRound, 
  Lock, 
  Terminal, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  FileText, 
  CreditCard,
  ChevronRight,
  Send,
  Building2,
  Users,
  DollarSign,
  ShieldAlert,
  Cpu,
  MessageSquare,
  Radio,
  Flame,
  Sparkles,
  Clock,
  Workflow,
  Scale
} from 'lucide-react';

export default function LandingPage() {
  // English is DEFAULT (EN), Indonesian (ID) is local choice
  const [lang, setLang] = useState<'EN' | 'ID'>('EN');

  const pricingPlans = [
    {
      name: 'Starter',
      price: lang === 'EN' ? '$160' : 'Rp 2.500.000',
      period: lang === 'EN' ? '/month' : '/bulan',
      quota: lang === 'EN' ? '100,000 Requests/mo' : '100.000 Request/bln',
      desc: lang === 'EN' 
        ? 'Ideal for startups and dev teams deploying their first autonomous AI agents.' 
        : 'Cocok untuk startup dan tim dev yang mulai mendeploy AI Agent pertama mereka.',
      features: lang === 'EN' ? [
        'Up to 5 Registered AI Agents',
        'Runtime Policy Engine & Guardrails',
        'Telegram & Email Alert Webhooks',
        'Standard 30-Day Audit Trail',
        'Python & Node.js Client SDKs',
      ] : [
        'Hingga 5 Registered AI Agents',
        'Runtime Policy Engine & Guardrail',
        'Telegram & Email Alert Webhooks',
        'Standard 30-hari Audit Trail',
        'Python & Node.js Client SDKs',
      ],
      cta: lang === 'EN' ? 'Choose Starter' : 'Pilih Starter',
      badge: null,
      payUrl: 'https://webpay.ctar.tech/?apiKey=wp_live_1VPaRKbaFcclNDGG6J5jTFygM3WdjkYc&plan=starter&amount=2500000',
    },
    {
      name: 'Professional',
      price: lang === 'EN' ? '$480' : 'Rp 7.500.000',
      period: lang === 'EN' ? '/month' : '/bulan',
      quota: lang === 'EN' ? '500,000 Requests/mo' : '500.000 Request/bln',
      desc: lang === 'EN' 
        ? 'Standard for growing enterprises running multi-department AI workflow automation.' 
        : 'Standar perusahaan berkembang dengan banyak agen otomatisasi lintas departemen.',
      features: lang === 'EN' ? [
        'Up to 25 Registered AI Agents',
        'WhatsApp Gateway (KaoWhat / Fonnte)',
        'Human-in-the-Loop Instant Approval',
        'Emergency Kill-Switch API & Web',
        'Official Compliance & Audit Reports',
        'Multi-tenant Cloud Support',
      ] : [
        'Hingga 25 Registered AI Agents',
        'WhatsApp Gateway (kaowhat.com/Fonnte)',
        'Human-in-the-Loop Instant Approval',
        'Emergency Kill-Switch API & Web',
        'Laporan Peristiwa & Cetak Audit Trail',
        'Multi-tenant Support',
      ],
      cta: lang === 'EN' ? 'Choose Professional' : 'Pilih Professional',
      badge: 'POPULAR',
      payUrl: 'https://webpay.ctar.tech/?apiKey=wp_live_1VPaRKbaFcclNDGG6J5jTFygM3WdjkYc&plan=pro&amount=7500000',
    },
    {
      name: 'Enterprise',
      price: lang === 'EN' ? '$1,150' : 'Rp 18.000.000',
      period: lang === 'EN' ? '/month' : '/bulan',
      quota: lang === 'EN' ? '2,000,000+ Requests/mo' : '2.000.000+ Request/bln',
      desc: lang === 'EN' 
        ? 'Full enterprise scalability with sub-millisecond Rust Axum core and 99.99% SLA.' 
        : 'Skalabilitas penuh dengan performa Rust Axum sub-milidetik dan SLA 99.99%.',
      features: lang === 'EN' ? [
        'Unlimited Registered AI Agents',
        'AI-ITDR & Behavioral Anomaly Engine',
        'Edge WAF & Honeytokens Canary Defense',
        'Just-In-Time (JIT) Ephemeral Token Rotation',
        'Dynamic OPA Policy Studio Engine',
        'Dedicated SLA & 24/7 SecOps Support',
      ] : [
        'Unlimited Registered AI Agents',
        'AI-ITDR & Behavioral Anomaly Engine',
        'Edge WAF & Honeytokens Canary Defense',
        'Just-In-Time (JIT) Ephemeral Token Rotation',
        'Dynamic OPA Policy Studio Engine',
        'Dedicated SLA & 24/7 SecOps Support',
      ],
      cta: lang === 'EN' ? 'Deploy Enterprise' : 'Pilih Enterprise',
      badge: 'SCALE',
      payUrl: 'https://webpay.ctar.tech/?apiKey=wp_live_1VPaRKbaFcclNDGG6J5jTFygM3WdjkYc&plan=enterprise&amount=18000000',
    },
    {
      name: 'Government / AirGap',
      price: lang === 'EN' ? 'Custom Quote' : 'Hubungi Sales',
      period: '',
      quota: lang === 'EN' ? '100% Offline AirGap License' : 'Lisensi Offline AirGap 100%',
      desc: lang === 'EN' 
        ? 'Dedicated on-premise installation for Banking Core, Defense, and Sovereign Infrastructure.' 
        : 'Instalasi khusus on-premise di infrastruktur perbankan core atau instansi kementerian.',
      features: lang === 'EN' ? [
        'Zero Internet Telemetry Required (Air-Gapped)',
        'Asymmetric Ed25519 Cryptographic Verification',
        'Full Source Code Audit & Escrow Access',
        'ISO 27001, ISO 22301, ISO 9001 & UU PDP / GDPR',
        'Custom Core Rust Gateway Integration',
        'AirGap Master License Keypad (Port 9090)',
      ] : [
        'Tanpa Koneksi Internet Luar (Air-Gapped)',
        'Verifikasi Kriptografis Asimetris Ed25519',
        'Akses Penuh Audit Source Code',
        'ISO 27001, ISO 22301, ISO 9001 & UU PDP / GDPR',
        'Kustomisasi Core Rust Gateway',
        'Master License Keypad (Port 9090)',
      ],
      cta: lang === 'EN' ? 'Consult Enterprise' : 'Konsultasi Tim Khusus',
      badge: 'GOV / AIRGAP',
      payUrl: 'https://wa.me/6281260006666?text=Halo%20CTARTech,%20saya%20tertarik%20dengan%20Paket%20Government%20AirGap%20AIControlPlane',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 flex flex-col">
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center text-slate-950 font-black text-base shadow-lg shadow-cyan-500/20">
            <ShieldCheck className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-extrabold tracking-wider text-white text-lg flex items-center gap-1">
              CTAR<span className="text-cyan-400">AIControlPlane</span>
            </span>
            <span className="text-[10px] text-cyan-500/80 font-mono block -mt-1 font-semibold">POWERED BY RUST AXUM</span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs text-slate-300 font-medium">
          <a href="#problem" className="hover:text-cyan-400 transition-colors">
            {lang === 'EN' ? 'Manifesto' : 'Manifesto'}
          </a>
          <a href="#features" className="hover:text-cyan-400 transition-colors">
            {lang === 'EN' ? 'Core Pillars' : 'Fitur Utama'}
          </a>
          <Link href="/compliance" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
            <Scale className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'EN' ? 'ISO Compliance & PDP' : 'Kepatuhan ISO & Privasi'}</span>
          </Link>
          <a href="#pricing" className="hover:text-cyan-400 transition-colors">
            {lang === 'EN' ? 'Pricing & Plans' : 'Paket Langganan'}
          </a>
          <Link href="/activation" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
            <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'EN' ? 'License Key' : 'Aktivasi Lisensi'}</span>
          </Link>
        </nav>

        {/* Right CTA & Language Switcher */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setLang('EN')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                lang === 'EN' 
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('ID')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                lang === 'ID' 
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ID
            </button>
          </div>

          <Link
            href="/login"
            className="text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors hidden sm:block"
          >
            {lang === 'EN' ? 'Sign In' : 'Masuk'}
          </Link>
          <Link
            href="/dashboard"
            className="text-xs bg-cyan-500 text-slate-950 font-bold px-4 py-2 rounded-xl hover:bg-cyan-400 transition-all flex items-center gap-1.5 glow-cyan shadow-lg"
          >
            <span>{lang === 'EN' ? 'Open Dashboard' : 'Buka Dashboard'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 lg:px-12 text-center max-w-5xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-6">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>
            {lang === 'EN' 
              ? 'Zero-Trust Authority & Runtime Security for Autonomous AI Agents' 
              : 'Zero-Trust Authority & Runtime Security for AI Agents'}
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
          {lang === 'EN' ? (
            <>
              Govern Your AI Agents Before They Become{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">
                The Ultimate Insider
              </span>
            </>
          ) : (
            <>
              Kendalikan AI Agent Anda Sebelum Menjadi{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">
                The Ultimate Insider
              </span>
            </>
          )}
        </h1>

        <p className="text-base md:text-lg text-slate-400 max-w-3xl leading-relaxed mb-8">
          {lang === 'EN' ? (
            <>
              AI Agents are not ordinary software. They are <strong>non-human workers with authority</strong> to query production databases, trigger payments, and invoke third-party APIs. CTARTech-AIControlPlane provides real-time runtime zero-trust guardrails.
            </>
          ) : (
            <>
              Agen AI bukan sekadar software biasa. Mereka adalah <strong>pekerja non-manusia yang memiliki wewenang</strong> untuk membaca database, memanggil API, dan mengubah saldo keuangan bisnis. CTARTech-AIControlPlane hadir sebagai gerbang proteksi runtime real-time.
            </>
          )}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <Link
            href="/dashboard"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm px-6 py-3 rounded-xl hover:opacity-90 transition-all flex items-center gap-2 glow-cyan"
          >
            <Activity className="w-4 h-4" />
            <span>{lang === 'EN' ? 'Access Control Dashboard' : 'Akses Control Dashboard'}</span>
          </Link>
          <Link
            href="/activation"
            className="bg-slate-900 border border-slate-700 text-slate-200 font-semibold text-sm px-6 py-3 rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2"
          >
            <KeyRound className="w-4 h-4 text-cyan-400" />
            <span>{lang === 'EN' ? 'Activate License Key' : 'Masukkan Kunci Lisensi'}</span>
          </Link>
        </div>

        {/* Live Terminal Telemetry Box */}
        <div className="w-full max-w-3xl bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-2xl text-left font-mono text-xs overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3 text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-[11px] text-slate-400 ml-2">ctartech-runtime-interceptor // live-telemetry</span>
            </div>
            <div className="text-[10px] text-cyan-400 font-bold">RUST CORE ENGINE :8000 OK</div>
          </div>
          <div className="space-y-1.5 text-slate-300">
            <div className="text-emerald-400 flex items-center gap-2">
              <span>[12:57:51] EVALUATE agent_finance_01 -&gt; execute_payment (Rp 150.000)</span>
              <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded text-[10px] font-bold">ALLOW</span>
            </div>
            <div className="text-amber-400 flex items-center gap-2">
              <span>[12:58:04] EVALUATE agent_finance_01 -&gt; execute_payment (Rp 150.000.000)</span>
              <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded text-[10px] font-bold">REQUIRE_APPROVAL</span>
            </div>
            <div className="text-slate-500 text-[11px] pl-4">
              &gt; Reason: Limit transfer per-transaksi terlampaui (Maks Rp 20.000.000). Notifikasi dikirim ke WhatsApp CISO.
            </div>
            <div className="text-rose-400 flex items-center gap-2">
              <span>[12:58:22] EVALUATE agent_analytics_bot -&gt; export_customer_data (All Tenants)</span>
              <span className="px-1.5 py-0.2 bg-rose-500/20 text-rose-300 rounded text-[10px] font-bold">BLOCK</span>
            </div>
            <div className="text-slate-500 text-[11px] pl-4">
              &gt; Reason: Aksi destruktif/eksfiltrasi data massal dilarang oleh Guardrail Aturan OPA #104.
            </div>
          </div>
        </div>
      </section>

      {/* Manifesto / Problem Section */}
      <section id="problem" className="py-20 px-6 lg:px-12 border-t border-slate-800/60 bg-slate-950/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">
              {lang === 'EN' ? 'THE SHIFT IN CYBERSECURITY' : 'PERGESERAN PARADIGMA KEAMANAN'}
            </h2>
            <h3 className="text-3xl font-extrabold text-white">
              {lang === 'EN' 
                ? 'From Human Access Management to AI Autonomous Authority' 
                : 'Dari Manajemen Akses Manusia ke Wewenang Agen AI'}
            </h3>
            <p className="text-slate-400 text-sm mt-3 max-w-2xl mx-auto">
              {lang === 'EN' 
                ? 'Modern identity threats no longer break through perimeter firewalls—they walk in through the front door using delegated AI agent credentials.' 
                : 'Di era otomatisasi modern, celah keamanan bukan lagi dibobol dari luar jaringan, melainkan menyusup lewat identitas mesin dan agen AI yang tidak terkontrol.'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
                <Radio className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">
                {lang === 'EN' ? '1. AI-ITDR Threat Sentry' : '1. AI-ITDR & Behavioral Engine'}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {lang === 'EN'
                  ? 'Continuous profiling of Non-Human Identities (NHI) to detect velocity spikes, off-hour anomalies, and session hijacking.'
                  : 'Memantau pola kerja deterministik AI Agent. Jika terjadi anomali pemanggilan data di luar kebiasaan, sistem langsung memicu auto-revocation.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">
                {lang === 'EN' ? '2. Honeytokens Canary Defense' : '2. Honeytokens & Deception'}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {lang === 'EN'
                  ? 'Plant decoy credentials in LLM prompt contexts. Zero-false-positive instant lockdown triggered upon unauthorized touch.'
                  : 'Menanamkan jebakan kredensial umpan di memori AI Agent. Jika agen disusupi dan mencoba menyentuh umpan, isolasi seketika diaktifkan.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">
                {lang === 'EN' ? '3. Just-In-Time Ephemeral Tokens' : '3. Just-In-Time (JIT) Access'}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {lang === 'EN'
                  ? 'Strict least-privilege dynamic tokens valid for micro-durations (seconds/minutes) per task execution, eliminating static key leakages.'
                  : 'Wewenang akses diberikan dalam durasi mikro yang sangat singkat saat tugas dikerjakan saja, bukan akses permanen yang rentan bocor.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 lg:px-12 border-t border-slate-800/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">
              {lang === 'EN' ? 'TRANSPARENT ENTERPRISE PRICING' : 'SKALABILITAS & HARGA TRANSPARAN'}
            </h2>
            <h3 className="text-3xl font-extrabold text-white">
              {lang === 'EN' ? 'SaaS Cloud & Air-Gap Offline Licensing' : 'Paket Berlangganan Cloud & Lisensi AirGap'}
            </h3>
            <p className="text-slate-400 text-sm mt-3 max-w-xl mx-auto">
              {lang === 'EN'
                ? 'From agile development teams to mission-critical banking infrastructure.'
                : 'Mulai dari tim pengembang agile hingga infrastruktur perbankan dan kedaulatan data nasional.'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingPlans.map((plan, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-2xl bg-slate-900/90 border flex flex-col justify-between relative transition-all ${
                  plan.badge === 'POPULAR'
                    ? 'border-cyan-500 shadow-xl shadow-cyan-500/10'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                    {plan.badge}
                  </span>
                )}

                <div>
                  <div className="text-sm font-bold text-slate-300">{plan.name}</div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-white">{plan.price}</span>
                    <span className="text-xs text-slate-400">{plan.period}</span>
                  </div>
                  <div className="text-[11px] font-mono text-cyan-400 mt-1 font-semibold">{plan.quota}</div>
                  <p className="text-xs text-slate-400 mt-3 leading-relaxed">{plan.desc}</p>

                  <div className="border-t border-slate-800 my-4"></div>

                  <ul className="space-y-2 text-xs text-slate-300 mb-6">
                    {plan.features.map((feat, fidx) => (
                      <li key={fidx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={plan.payUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`w-full py-2.5 rounded-xl text-center text-xs font-bold transition-all block ${
                    plan.badge === 'POPULAR'
                      ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 py-8 px-6 lg:px-12 text-center text-xs text-slate-400">
        <div className="flex flex-wrap items-center justify-between max-w-6xl mx-auto gap-4">
          <div>&copy; 2026 CTARTech-AIControlPlane &bull; Public License: GNU Affero General Public License v3</div>
          <div className="flex flex-wrap items-center gap-5">
            <Link href="/compliance" className="hover:text-cyan-400">
              {lang === 'EN' ? 'ISO Compliance & PDP' : 'Kepatuhan ISO & Privasi'}
            </Link>
            <Link href="/terms" className="hover:text-cyan-400">
              {lang === 'EN' ? 'Terms of Service' : 'Syarat Ketentuan'}
            </Link>
            <Link href="/privacy" className="hover:text-cyan-400">
              {lang === 'EN' ? 'Privacy Policy' : 'Kebijakan Privasi'}
            </Link>
            <Link href="/activation" className="hover:text-cyan-400">
              {lang === 'EN' ? 'License Key' : 'Aktivasi Lisensi'}
            </Link>
            <Link href="/reports" className="hover:text-cyan-400">
              {lang === 'EN' ? 'Audit Reports' : 'Cetak Laporan'}
            </Link>
            <Link href="/superadmin" className="hover:text-cyan-400">
              Superadmin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
