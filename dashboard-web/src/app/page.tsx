'use client';

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
  Users
} from 'lucide-react';

export default function LandingPage() {
  const pricingPlans = [
    {
      name: 'Starter',
      price: 'Rp 2.500.000',
      period: '/bulan',
      quota: '100.000 Request/bln',
      desc: 'Cocok untuk startup dan tim dev yang mulai mendeploy AI Agent pertama mereka.',
      features: [
        'Hingga 5 Registered AI Agents',
        'Runtime Policy Engine & Guardrail',
        'Telegram & Email Alert Webhooks',
        'Standard 30-hari Audit Trail',
        'Python SDK itcowboy_guard',
      ],
      cta: 'Pilih Starter',
      badge: null,
      payUrl: 'https://webpay.ctar.tech/?apiKey=wp_live_1VPaRKbaFcclNDGG6J5jTFygM3WdjkYc&plan=starter&amount=2500000',
    },
    {
      name: 'Professional',
      price: 'Rp 7.500.000',
      period: '/bulan',
      quota: '500.000 Request/bln',
      desc: 'Standar perusahaan berkembang dengan banyak agen otomatisasi lintas departemen.',
      features: [
        'Hingga 25 Registered AI Agents',
        'WhatsApp Gateway (kaowhat.com/Fonnte)',
        'Human-in-the-Loop Instant Approval',
        'Emergency Kill-Switch API & Web',
        'Laporan Peristiwa & Cetak Audit Trail',
        'Multi-tenant Support',
      ],
      cta: 'Pilih Professional',
      badge: 'POPULAR',
      payUrl: 'https://webpay.ctar.tech/?apiKey=wp_live_1VPaRKbaFcclNDGG6J5jTFygM3WdjkYc&plan=pro&amount=7500000',
    },
    {
      name: 'Enterprise',
      price: 'Rp 18.000.000',
      period: '/bulan',
      quota: '2.000.000+ Request/bln',
      desc: 'Skalabilitas penuh dengan performa Rust Axum sub-milidetik dan SLA 99.99%.',
      features: [
        'Unlimited AI Agents & Workflows',
        'Offline Cryptographic Key Issuer (Ed25519)',
        'Custom Fine-Grained Policy Engine',
        'Multi-Channel Gateway (WA, SMS, Email)',
        'Dedicated Superadmin Master Access',
        'Integrasi Langsung webpay.ctar.tech',
        'Full Compliance Print & SOC2 Export',
      ],
      cta: 'Pilih Enterprise',
      badge: 'ENTERPRISE',
      payUrl: 'https://webpay.ctar.tech/?apiKey=wp_live_1VPaRKbaFcclNDGG6J5jTFygM3WdjkYc&plan=enterprise&amount=18000000',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header Navbar */}
      <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6 lg:px-12">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-lg glow-cyan">
            🛡️
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
              <span>CTARTech</span>
              <span className="text-cyan-400 font-mono text-xs">AIControlPlane</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">POWERED BY RUST AXUM</div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs text-slate-300 font-medium">
          <a href="#problem" className="hover:text-cyan-400 transition-colors">Manifesto</a>
          <a href="#features" className="hover:text-cyan-400 transition-colors">Fitur Utama</a>
          <a href="#pricing" className="hover:text-cyan-400 transition-colors">Paket Langganan</a>
          <Link href="/activation" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
            <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
            <span>Aktivasi Lisensi</span>
          </Link>
          <Link href="/superadmin" className="hover:text-amber-400 transition-colors">
            Superadmin
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors"
          >
            Masuk
          </Link>
          <Link
            href="/dashboard"
            className="text-xs bg-cyan-500 text-slate-950 font-bold px-4 py-2 rounded-lg hover:bg-cyan-400 transition-colors flex items-center gap-1.5 glow-cyan"
          >
            <span>Buka Dashboard</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 lg:px-12 text-center max-w-5xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-6">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>Zero-Trust Authority & Runtime Security for AI Agents</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
          Kendalikan AI Agent Anda Sebelum Menjadi <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">The Ultimate Insider</span>
        </h1>

        <p className="text-base md:text-lg text-slate-400 max-w-3xl leading-relaxed mb-8">
          Agen AI bukan sekadar software biasa. Mereka adalah <strong>pekerja non-manusia yang memiliki wewenang</strong> untuk membaca database, memanggil API, dan mengubah saldo keuangan bisnis. CTARTech-AIControlPlane hadir sebagai gerbang proteksi runtime real-time.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <Link
            href="/dashboard"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm px-6 py-3 rounded-xl hover:opacity-90 transition-all flex items-center gap-2 glow-cyan"
          >
            <Activity className="w-4 h-4" />
            <span>Akses Control Dashboard</span>
          </Link>
          <Link
            href="/activation"
            className="bg-slate-900 border border-slate-700 text-slate-200 font-semibold text-sm px-6 py-3 rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2"
          >
            <KeyRound className="w-4 h-4 text-cyan-400" />
            <span>Masukkan Kunci Lisensi</span>
          </Link>
        </div>

        {/* Live Threat Telemetry Preview Box */}
        <div className="w-full max-w-4xl bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-left shadow-2xl glass-panel">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
              <span className="text-slate-400 ml-2">ctartech-runtime-interceptor // live-telemetry</span>
            </div>
            <div className="text-emerald-400 font-bold">RUST CORE ENGINE :8000 OK</div>
          </div>
          <div className="mt-4 font-mono text-xs space-y-2 text-slate-300">
            <div className="flex items-center justify-between text-slate-400 border-b border-slate-800/60 pb-1">
              <span>[12:57:51] EVALUATE agent_finance_01 -&gt; execute_payment (Rp 150.000)</span>
              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">ALLOW</span>
            </div>
            <div className="flex items-center justify-between text-slate-400 border-b border-slate-800/60 pb-1">
              <span>[12:57:51] EVALUATE agent_finance_01 -&gt; execute_payment (Rp 2.500.000 &gt; Limit)</span>
              <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">REQUIRE_APPROVAL (HELD)</span>
            </div>
            <div className="flex items-center justify-between text-slate-400 border-b border-slate-800/60 pb-1">
              <span>[12:57:51] EVALUATE agent_finance_01 -&gt; export_customer_data (CRM Database)</span>
              <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">REQUIRE_APPROVAL (CISO HELD)</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>[12:57:52] EVALUATE agent_finance_01 -&gt; run_terminal_command (rm -rf /var/data)</span>
              <span className="text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">BLOCK (INTERCEPTED)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Manifesto Section */}
      <section id="problem" className="py-16 px-6 lg:px-12 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Paradoks Keamanan AI</span>
            <h2 className="text-2xl md:text-3xl font-bold text-white mt-2">
              Bukan Sekadar Akses (Access), Tapi Wewenang (Authority)
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-slate-300">
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-rose-400 font-bold mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>IAM Tradisional: Kalah Cepat</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                IAM konvensional dirancang untuk manusia yang bekerja jam 9-5. AI Agent beroperasi 24/7, memanggil belasan tool dalam hitungan detik, dan membuat keputusan otonom tanpa tiket persetujuan manual di setiap langkah.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-slate-900 border border-cyan-500/30">
              <div className="text-cyan-400 font-bold mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>CTARTech Guard: Task-Bound Authority</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Guardrail hidup langsung di jalur eksekusi (*execution path*). Setiap transaksi dicek batas nominalnya, aksi destruktif dikunci, dan jika berisiko, notifikasi langsung ditembak ke WhatsApp &amp; Telegram CISO.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 lg:px-12 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Transparan &amp; Terukur</span>
          <h2 className="text-3xl font-bold text-white mt-2">Pilih Paket Langganan Enterprise</h2>
          <p className="text-slate-400 text-sm mt-2">
            Pembayaran otomatis terintegrasi langsung dengan gateway <strong>webpay.ctar.tech</strong>.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-7 flex flex-col justify-between relative transition-all ${
                plan.badge === 'POPULAR'
                  ? 'bg-slate-900 border-2 border-cyan-500/80 shadow-[0_0_30px_rgba(6,182,212,0.2)]'
                  : 'bg-slate-900/60 border border-slate-800'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-[10px] font-black tracking-widest px-3 py-0.5 rounded-full uppercase">
                  {plan.badge}
                </div>
              )}

              <div>
                <div className="font-bold text-xl text-white mb-1">{plan.name}</div>
                <p className="text-xs text-slate-400 mb-6">{plan.desc}</p>
                <div className="mb-6">
                  <span className="text-3xl font-extrabold text-white font-mono">{plan.price}</span>
                  <span className="text-xs text-slate-400">{plan.period}</span>
                  <div className="text-xs text-cyan-400 font-mono mt-1">{plan.quota}</div>
                </div>

                <div className="space-y-3 mb-8 text-xs text-slate-300">
                  {plan.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href={plan.payUrl}
                target="_blank"
                rel="noreferrer"
                className={`w-full py-3 rounded-xl font-bold text-xs text-center flex items-center justify-center gap-2 transition-all ${
                  plan.badge === 'POPULAR'
                    ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 glow-cyan'
                    : 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700'
                }`}
              >
                <span>{plan.cta} via Webpay</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Community Support & Donation Section */}
      <section className="py-12 px-6 lg:px-12 max-w-4xl mx-auto">
        <div className="rounded-2xl p-8 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-slate-800 shadow-2xl glass-panel text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono">
            <span>☕ Dukung Kedaulatan AI Nasional</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Dukungan Donasi &amp; Kontak Komunitas</h2>
          <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
            Dukung kelanjutan riset, pemeliharaan pustaka open-source AGPL-3.0, serta penguatan infrastruktur kedaulatan tata kelola AI nasional.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-left text-xs">
            {/* Allo Bank Box */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-lg shrink-0">
                🏦
              </div>
              <div>
                <div className="font-bold text-white text-sm">Allo Bank Indonesia</div>
                <div className="text-cyan-400 font-mono font-bold text-xs mt-0.5">No. Rek: 0812 6000 6666</div>
                <div className="text-[10px] text-slate-500">Donasi &amp; Riset Kedaulatan AI</div>
              </div>
            </div>

            {/* WhatsApp Community Box */}
            <a
              href="https://wa.me/6281260006666"
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-xl bg-slate-950/80 hover:bg-emerald-950/20 border border-slate-800 hover:border-emerald-500/40 flex items-center gap-3 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 flex items-center justify-center font-bold text-lg shrink-0 transition-all">
                💬
              </div>
              <div>
                <div className="font-bold text-white text-sm group-hover:text-emerald-300">WhatsApp Support</div>
                <div className="text-emerald-400 font-mono font-bold text-xs mt-0.5">+62 812-6000-6666</div>
                <div className="text-[10px] text-slate-500">Konsultasi Enterprise &amp; Komunitas</div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 py-8 px-6 lg:px-12 text-center text-xs text-slate-400">
        <div className="flex flex-wrap items-center justify-between max-w-6xl mx-auto gap-4">
          <div>&copy; 2026 CTARTech-AIControlPlane &bull; Public License: GNU Affero General Public License v3</div>
          <div className="flex items-center gap-6">
            <Link href="/activation" className="hover:text-cyan-400">Aktivasi Lisensi</Link>
            <Link href="/reports" className="hover:text-cyan-400">Cetak Laporan</Link>
            <Link href="/superadmin" className="hover:text-cyan-400">Superadmin Master</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
