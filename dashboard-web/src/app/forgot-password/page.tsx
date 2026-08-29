'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, CheckCircle2, AlertCircle, ArrowRight, KeyRound, ShieldCheck } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'request' | 'reset' | 'success'>('request');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleRequestReset = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email) {
      setErrorMsg('Masukkan alamat email yang terdaftar.');
      return;
    }
    // Advance to reset password
    setStep('reset');
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPassword.length < 6) {
      setErrorMsg('Kata sandi baru minimal 6 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    // Save updated password in localStorage
    if (typeof window !== 'undefined') {
      const storedUsers = localStorage.getItem('itcg_registered_users');
      let usersMap = storedUsers ? JSON.parse(storedUsers) : {};
      usersMap[email.toLowerCase()] = newPassword;
      localStorage.setItem('itcg_registered_users', JSON.stringify(usersMap));
    }

    setStep('success');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-6 relative font-sans">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-2xl mx-auto glow-cyan">
            🛡️
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Pemulihan Kata Sandi</h1>
          <p className="text-xs text-slate-400">Atur ulang kata sandi akun CTARTech-AIControlPlane Anda</p>
        </div>

        {/* Card */}
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 glass-panel shadow-2xl space-y-5">
          {errorMsg && (
            <div className="p-3 bg-rose-500/15 border border-rose-500/30 text-rose-300 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {step === 'request' && (
            <form onSubmit={handleRequestReset} className="space-y-4 text-xs">
              <p className="text-slate-400 text-xs leading-relaxed">
                Masukkan alamat email yang terdaftar pada akun Tenant atau Superadmin Anda untuk memverifikasi dan mereset kata sandi.
              </p>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Alamat Email Terdaftar</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@perusahaan.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white font-mono placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs bg-cyan-500 text-slate-950 hover:bg-cyan-400 glow-cyan flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                <span>Lanjutkan Reset Kata Sandi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-400">
                Email Terverifikasi: <strong>{email}</strong>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Kata Sandi Baru</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white font-mono placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Konfirmasi Kata Sandi Baru</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi baru"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white font-mono placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs bg-emerald-500 text-slate-950 hover:bg-emerald-400 flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                <span>Simpan Kata Sandi Baru</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === 'success' && (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white">Kata Sandi Berhasil Diperbarui!</h3>
              <p className="text-xs text-slate-400">
                Silakan masuk kembali menggunakan email dan kata sandi baru Anda.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center w-full py-3 rounded-xl font-bold text-xs bg-cyan-500 text-slate-950 hover:bg-cyan-400 glow-cyan transition-all"
              >
                <span>Kembali ke Halaman Masuk</span>
              </Link>
            </div>
          )}

          <div className="pt-2 text-center text-xs text-slate-400 border-t border-slate-800">
            Ingat kata sandi?{' '}
            <Link href="/login" className="text-cyan-400 font-semibold hover:underline">
              Masuk disini
            </Link>
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="text-xs text-slate-400 hover:text-white">
            &larr; Kembali ke Beranda Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
}
