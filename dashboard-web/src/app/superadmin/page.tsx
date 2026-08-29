'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  KeyRound, 
  CreditCard, 
  Sparkles, 
  Receipt, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck,
  Building2,
  Lock,
  ArrowRight,
  Copy
} from 'lucide-react';
import { TenantData } from '@/lib/api';

export default function SuperadminPage() {
  const [tenantName, setTenantName] = useState('PT Bank Central Enterprise Tbk');
  const [tier, setTier] = useState('Enterprise Production (Unlimited API Calls + Full AI)');
  const [mode, setMode] = useState('Air-Gapped Offline Cryptographic Signed File (.lic)');
  const [generating, setGenerating] = useState(false);
  const [licenseResult, setLicenseResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [invoiceOpen, setInvoiceOpen] = useState(false);

  // Activity Stream items matching Screenshot 2
  const activityLogs = [
    { time: '19:27:12', tag: 'API_CALL', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', org: 'PT Fintech Nusantara Global', desc: 'Express middleware @ctartech/ai-controlplane attested agent token #fin-99120' },
    { time: '19:25:30', tag: 'PAYMENT_RECEIVED', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', org: 'webpay.ctar.tech', desc: 'Order #ORD-ZT-88910 paid via QRIS Instant Settlement (Rp 500.000) - License Key auto-issued' },
    { time: '19:23:05', tag: 'QUOTA_WARNING', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', org: 'PT Retail Niaga Express', desc: 'Monthly API call limit exceeded: 50,110 / 50,000. Rate limiter throttling initiated.' },
    { time: '19:20:18', tag: 'AIRGAP_ATTEST', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', org: 'Kementerian Pertahanan Siber RI', desc: 'Airgap Node #KEMHAN-04 periodic SHA-256 Merkle Ledger state verified locally (Ed25519 Valid)' },
    { time: '19:18:02', tag: 'KEY_ROTATED', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', org: 'PT Logistik Digital Mandiri', desc: 'Superadmin triggered BLAKE3 Salted Hash key rotation for tenant profile.' },
  ];

  const handleGenerateLicense = () => {
    setGenerating(true);
    setTimeout(() => {
      const now = Math.floor(Date.now() / 1000);
      const exp = now + 365 * 86400;
      const slug = tenantName.toLowerCase().replace(/ /g, '_').replace(/\./g, '');
      const token = `ITCG-ENTERPRISE-eyJhbGciOiJFZDI1NTE5IiwidHlwIjoiSVRDRy1MSUMifQ.${btoa(JSON.stringify({
        iss: 'CTARTech AIControlPlane Sovereign Authority',
        org: tenantName,
        tier: 'ENTERPRISE',
        quota: 1000000,
        exp,
      }))}.sig_ed25519_${Math.random().toString(36).substring(2, 12)}`;

      setLicenseResult({
        token,
        tenant: tenantName,
        tier,
        expDate: new Date(exp * 1000).toLocaleDateString(),
        quota: '1,000,000 Request Actions',
      });
      setGenerating(false);
    }, 600);
  };

  const handleCopy = () => {
    if (licenseResult?.token) {
      navigator.clipboard.writeText(licenseResult.token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex bg-slate-950 min-h-screen text-slate-100 font-sans">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto space-y-6 max-w-7xl mx-auto">
        {/* Top Header */}
        <header className="flex justify-between items-center pb-2">
          <div>
            <h1 className="text-2xl font-bold text-white">Superadmin &amp; Licensing Authority</h1>
            <p className="text-xs text-slate-400">Pusat Manajemen Lisensi, Pembayaran WebPay, dan Hak Akses Multi-Tenant</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></span>
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase">Superadmin HQ Active</span>
          </div>
        </header>

        {/* Real-time Activity Stream Box matching Screenshot 2 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl glass-panel space-y-2.5 font-mono text-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-sans flex items-center gap-2">
            <span>● Real-Time Licensing &amp; Billing Event Stream</span>
          </div>
          {activityLogs.map((log, idx) => (
            <div key={idx} className="flex items-center gap-3 py-1 text-[11px] border-b border-slate-800/50 last:border-0">
              <span className="text-slate-500 shrink-0">{log.time}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${log.color} shrink-0`}>
                {log.tag}
              </span>
              <span className="text-cyan-300 font-bold shrink-0">[{log.org}]</span>
              <span className="text-slate-300 truncate">{log.desc}</span>
            </div>
          ))}
        </div>

        {/* Two Side-by-Side Cards matching Screenshot 2 */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Card 1: Quick Online License Generator & Hash Vault */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl glass-panel flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2.5 text-sm font-bold text-white mb-4">
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>Quick Online License Generator &amp; Hash Vault</span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Tenant / Organization Legal Name</label>
                  <input
                    type="text"
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-amber-500"
                    placeholder="PT Bank Central Enterprise Tbk"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Entitlement Tier</label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Enterprise Production (Unlimited API Calls + Full AI)">
                      💎 Enterprise Production (Unlimited API Calls + Full AI)
                    </option>
                    <option value="Enterprise Airgap (Offline Local Verifier)">
                      🏛️ Enterprise Airgap (Offline Local Verifier)
                    </option>
                    <option value="Professional Tier (500.000 API Calls)">
                      🛡️ Professional Tier (500.000 API Calls)
                    </option>
                    <option value="Starter Tier (100.000 API Calls)">
                      🚀 Starter Tier (100.000 API Calls)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">License Delivery Mode</label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Air-Gapped Offline Cryptographic Signed File (.lic)">
                      🔒 Air-Gapped Offline Cryptographic Signed File (.lic)
                    </option>
                    <option value="Instant Cloud Provisioning (WebPay)">
                      ⚡ Instant Cloud Provisioning (WebPay)
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={handleGenerateLicense}
                disabled={generating}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>{generating ? 'Menandatangani Kriptografi...' : 'Issue Cryptographically Signed License'}</span>
              </button>

              {licenseResult && (
                <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-amber-500/30 text-xs font-mono space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-amber-400 font-bold">TOKEN LISENSI RESMI:</span>
                    <button
                      onClick={handleCopy}
                      className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 text-[10px] flex items-center gap-1 font-sans"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copied ? 'Tersalin!' : 'Salin Token'}</span>
                    </button>
                  </div>
                  <div className="text-slate-300 break-all text-[11px] bg-slate-900 p-2 rounded border border-slate-800">
                    {licenseResult.token}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: CTARTech WebPay Gateway & Faktur Pajak matching Screenshot 2 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl glass-panel flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5 text-sm font-bold text-white">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>CTARTech WebPay Gateway &amp; Faktur Pajak</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  webpay.ctar.tech
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Gerbang pembayaran resmi multi-metode terpadu untuk provisioning otomatis lisensi ZentyCore &amp; AIControlPlane:
              </p>

              {/* Inner Portal Box */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs mb-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className="text-amber-400">⚡</span>
                    <span>CTARTech WebPay Portal</span>
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    App: wp_live_catX...yruI
                  </span>
                </div>

                <div className="space-y-1.5 text-slate-300 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400">&bull;</span>
                    <span><strong>QRIS Instant Settlement</strong> (GoPay, OVO, Dana, ShopeePay, BCA)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400">&bull;</span>
                    <span><strong>Virtual Account 24/7</strong> (BCA, Mandiri, BRI, BNI, Permata)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400">&bull;</span>
                    <span><strong>Corporate Invoicing &amp; e-Faktur PPN 11%</strong> (Otomatis)</span>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="https://webpay.ctar.tech"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Proses Pembayaran via webpay.ctar.tech</span>
                  </a>
                </div>
              </div>

              <button
                onClick={() => setInvoiceOpen(!invoiceOpen)}
                className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 flex items-center justify-center gap-2 transition-all"
              >
                <Receipt className="w-4 h-4 text-cyan-400" />
                <span>Generate Mock Faktur Pajak (PPN 11%)</span>
              </button>

              {invoiceOpen && (
                <div className="mt-3 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1 font-mono">
                  <div className="text-cyan-400 font-bold">FAKTUR PAJAK ELEKTRONIK #INV-2026-08912</div>
                  <div className="text-slate-400 text-[11px]">DPP: Rp 16.216.216 &bull; PPN (11%): Rp 1.783.784</div>
                  <div className="text-emerald-400 font-bold text-[11px]">TOTAL SETTLEMENT: Rp 18.000.000 LUNAS</div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-800/60">
              <span>Endpoint: POST /api/v1/license/validate-key</span>
              <span>BLAKE3 Cryptographic Vault</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
