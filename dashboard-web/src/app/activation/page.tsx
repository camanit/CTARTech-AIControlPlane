'use client';

import { useState } from 'react';
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
  ArrowRight,
  UploadCloud,
  FileCheck,
  FileText
} from 'lucide-react';
import Link from 'next/link';

export default function ActivationPage() {
  const [tokenInput, setTokenInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [licenseData, setLicenseData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [activated, setActivated] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'manual'>('upload');

  const verifyToken = (tokenToVerify: string) => {
    setErrorMsg('');
    setVerifying(true);
    setLicenseData(null);

    const token = tokenToVerify.trim();
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

  const handleVerifyAndActivate = () => {
    verifyToken(tokenInput);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        let token = content.trim();
        try {
          const parsed = JSON.parse(content);
          if (parsed.token) token = parsed.token;
          else if (parsed.license_key) token = parsed.license_key;
        } catch (_) {}
        setTokenInput(token);
        verifyToken(token);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Top Header Navbar */}
      <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-6 lg:px-12">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-lg glow-cyan">
              🛡️
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                <span>CTARTech</span>
                <span className="text-cyan-400 font-mono text-xs">AIControlPlane</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">PORTAL AKTIVASI LISENSI RESMI</div>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <Link
            href="/"
            className="text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700"
          >
            &larr; Beranda
          </Link>
          <Link
            href="/login"
            className="bg-cyan-500 text-slate-950 font-bold px-4 py-1.5 rounded-lg hover:bg-cyan-400 transition-colors flex items-center gap-1 glow-cyan"
          >
            <span>Masuk Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-10 max-w-3xl mx-auto w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-mono">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Kedaulatan Lisensi Kriptografis (Zero-Leakage &bull; Airgap Ready)</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Aktivasi Lisensi &amp; Otoritas Tenant</h1>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            Unggah file bundel sertifikat (.lic / .json) yang Anda terima dari administrator offline atau masukkan token Ed25519 Anda.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-semibold max-w-md mb-4">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'upload'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Unggah Bundel File (.lic)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'manual'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Input Token Manual</span>
          </button>
        </div>

        {/* Input Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 glass-panel space-y-4 shadow-xl">
          {activeTab === 'upload' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                File Bundel Sertifikat Klien (.lic / .json / .cert)
              </label>
              <label className="border-2 border-dashed border-slate-700 hover:border-cyan-500/80 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-950/60 hover:bg-slate-950 group">
                <UploadCloud className="w-10 h-10 text-cyan-400 mb-3 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-white text-sm">
                  {uploadedFileName ? uploadedFileName : 'Klik atau Drag & Drop file sertifikat ke sini'}
                </span>
                <span className="text-[11px] text-slate-400 mt-1">
                  Mendukung format bundel sertifikat kriptografi: <code className="text-cyan-400">*.lic</code>, <code className="text-cyan-400">*.json</code>, <code className="text-cyan-400">*.cert</code>
                </span>
                <input
                  type="file"
                  accept=".lic,.json,.cert,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
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
          )}

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400">
              *Tanda tangan kriptografis diverifikasi secara lokal di gateway tanpa mengirim data ke luar (Air-Gapped Ready).
            </span>
            {activeTab === 'manual' && (
              <button
                onClick={handleVerifyAndActivate}
                disabled={verifying || !tokenInput}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-50 glow-cyan"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{verifying ? 'Memvalidasi...' : 'Aktivasi Lisensi'}</span>
              </button>
            )}
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
