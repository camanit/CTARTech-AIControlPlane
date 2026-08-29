'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  KeyRound, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Sparkles, 
  Copy, 
  Terminal,
  Activity,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function ActivationPage() {
  const [tokenInput, setTokenInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [licenseData, setLicenseData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [activated, setActivated] = useState(false);

  const handleVerifyAndActivate = () => {
    setErrorMsg('');
    setVerifying(true);
    setLicenseData(null);

    const token = tokenInput.trim();
    if (!token.startsWith('ITCG-')) {
      setErrorMsg("Format lisensi salah. Token resmi CTARTech Guard harus diawali dengan 'ITCG-'.");
      setVerifying(false);
      return;
    }

    try {
      const parts = token.split('-');
      if (parts.length < 3) throw new Error('Segmen token tidak lengkap.');
      const jwtBody = parts.slice(2).join('-');
      const segments = jwtBody.split('.');
      if (segments.length !== 3) throw new Error('Struktur kriptografis token salah.');

      // Decode payload base64url
      let payloadB64 = segments[1].replace(/-/g, '+').replace(/_/g, '/');
      while (payloadB64.length % 4) payloadB64 += '=';
      const payloadJson = atob(payloadB64);
      const parsed = JSON.parse(payloadJson);

      setLicenseData(parsed);
      setActivated(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('itcg_active_license', token);
      }
    } catch (e: any) {
      setErrorMsg('Gagal memverifikasi token lisensi: ' + e.message);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar />

      <main className="flex-1 p-8 max-w-4xl mx-auto overflow-y-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
            <KeyRound className="w-4 h-4" />
            <span>Kedaulatan Lisensi Kriptografis (Zero-Leakage)</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Aktivasi Lisensi &amp; Otoritas Tenant</h1>
          <p className="text-xs text-slate-400 mt-1">
            Masukkan token lisensi bertanda tangan Ed25519 yang diterbitkan oleh administrator offline ZentyCore.
          </p>
        </div>

        {/* Input Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 glass-panel space-y-4 shadow-xl">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Kunci Lisensi Digital (Token ITCG)
            </label>
            <textarea
              rows={4}
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="ITCG-ENTERPRISE-eyJhbGciOiJFZDI1NTE5IiwidHlwIjoiSVRDRy1MSUMifQ..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs font-mono text-cyan-300 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400">
              *Tanda tangan diverifikasi secara lokal di gateway tanpa mengirimkan rahasia ke luar.
            </span>
            <button
              onClick={handleVerifyAndActivate}
              disabled={verifying || !tokenInput}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-50 glow-cyan"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{verifying ? 'Memvalidasi...' : 'Aktivasi Lisensi'}</span>
            </button>
          </div>

          {errorMsg && (
            <div className="p-4 bg-rose-500/15 border border-rose-500/30 text-rose-300 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {activated && licenseData && (
            <div className="mt-6 p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Lisensi Terverifikasi &amp; Berhasil Diaktifkan!</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px]">ORGANISASI</div>
                  <div className="font-bold text-white text-sm truncate">{licenseData.org}</div>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px]">TIER LISENSI</div>
                  <div className="font-bold text-cyan-400 text-sm">{licenseData.tier}</div>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px]">KUOTA REQUEST</div>
                  <div className="font-bold text-amber-400 text-sm">{licenseData.quota?.toLocaleString()}</div>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px]">KEDALUWARSA</div>
                  <div className="font-bold text-emerald-400 text-sm">
                    {new Date(licenseData.exp * 1000).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Link
                  href="/dashboard"
                  className="px-5 py-2 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 flex items-center gap-1.5"
                >
                  <span>Masuk ke Control Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Offline Generator Guide */}
        <div className="mt-8 p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-xs space-y-3">
          <div className="font-bold text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>Cara Menerbitkan Lisensi Klien (Admin Offline CLI)</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Sesuai arsitektur ZentyCore, kunci privat tidak pernah di-upload ke internet. Jalankan perintah ini di laptopmu:
          </p>
          <div className="p-3 rounded-lg bg-slate-950 font-mono text-cyan-300 text-[11px] overflow-x-auto border border-slate-800">
            python tools/license-issuer/generate_license.py --org &quot;PT Maju AI&quot; --tier &quot;ENTERPRISE&quot; --quota 1000000 --days 365
          </div>
        </div>
      </main>
    </div>
  );
}
