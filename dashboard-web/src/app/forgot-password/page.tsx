'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, CheckCircle2, AlertCircle, ArrowRight, KeyRound, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { lang, setLang } = useLanguage();

  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'request' | 'reset' | 'success'>('request');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleRequestReset = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email) {
      setErrorMsg(lang === 'EN' ? 'Please enter your registered email address.' : 'Masukkan alamat email yang terdaftar.');
      return;
    }
    // Advance to reset password
    setStep('reset');
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPassword.length < 6) {
      setErrorMsg(lang === 'EN' ? 'New password must be at least 6 characters.' : 'Kata sandi baru minimal 6 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg(lang === 'EN' ? 'Passwords do not match.' : 'Konfirmasi kata sandi tidak cocok.');
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
      {/* Top Right Language Switcher */}
      <div className="absolute top-6 right-6 flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
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

      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-2xl mx-auto glow-cyan">
            🛡️
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            {lang === 'EN' ? 'Account Password Recovery' : 'Pemulihan Kata Sandi'}
          </h1>
          <p className="text-xs text-slate-400">
            {lang === 'EN' 
              ? 'Reset credentials for your CTARTech-AIControlPlane account' 
              : 'Atur ulang kata sandi akun CTARTech-AIControlPlane Anda'}
          </p>
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
                {lang === 'EN' 
                  ? 'Enter the email address registered with your Tenant or Superadmin account to verify and reset your password.' 
                  : 'Masukkan alamat email yang terdaftar pada akun Tenant atau Superadmin Anda untuk memverifikasi dan mereset kata sandi.'}
              </p>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">
                  {lang === 'EN' ? 'Registered Email Address' : 'Alamat Email Terdaftar'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@enterprise.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white font-mono placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs bg-cyan-500 text-slate-950 hover:bg-cyan-400 glow-cyan flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                <span>{lang === 'EN' ? 'Continue Password Reset' : 'Lanjutkan Reset Kata Sandi'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-300 text-xs">
                {lang === 'EN' ? 'Resetting password for: ' : 'Mereset kata sandi untuk akun: '}
                <strong className="font-mono text-white">{email}</strong>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">
                  {lang === 'EN' ? 'New Password' : 'Kata Sandi Baru'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={lang === 'EN' ? 'Minimum 6 characters' : 'Minimal 6 karakter'}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white font-mono placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">
                  {lang === 'EN' ? 'Confirm New Password' : 'Konfirmasi Kata Sandi Baru'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={lang === 'EN' ? 'Re-enter new password' : 'Ketik ulang kata sandi baru'}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white font-mono placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs bg-cyan-500 text-slate-950 hover:bg-cyan-400 glow-cyan flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                <span>{lang === 'EN' ? 'Save New Password' : 'Simpan Kata Sandi Baru'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center space-y-4 py-4 text-xs">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white">
                {lang === 'EN' ? 'Password Reset Successfully!' : 'Kata Sandi Berhasil Diperbarui!'}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {lang === 'EN'
                  ? 'Your account password has been updated. You can now sign in with your new credentials.'
                  : 'Kata sandi akun Anda telah berhasil diatur ulang. Anda sekarang dapat masuk menggunakan kata sandi baru.'}
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-lg glow-cyan"
              >
                <span>{lang === 'EN' ? 'Proceed to Sign In' : 'Kembali ke Halaman Masuk'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        <div className="text-center">
          <Link href="/login" className="text-xs text-slate-400 hover:text-white transition-colors">
            &larr; {lang === 'EN' ? 'Back to Sign In' : 'Kembali ke Halaman Masuk'}
          </Link>
        </div>
      </div>
    </div>
  );
}
