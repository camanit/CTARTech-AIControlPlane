'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Building2, Phone, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function RegisterPage() {
  const router = useRouter();
  const { lang, setLang } = useLanguage();

  const [orgName, setOrgName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 6) {
      setErrorMsg(lang === 'EN' ? 'Password must be at least 6 characters long.' : 'Kata sandi minimal harus 6 karakter.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg(lang === 'EN' ? 'Passwords do not match.' : 'Konfirmasi kata sandi tidak cocok.');
      return;
    }

    // Save registered user
    if (typeof window !== 'undefined') {
      const cleanEmail = email.trim().toLowerCase();
      const storedUsers = localStorage.getItem('itcg_registered_users');
      let usersMap = storedUsers ? JSON.parse(storedUsers) : {};
      usersMap[cleanEmail] = password;
      localStorage.setItem('itcg_registered_users', JSON.stringify(usersMap));

      // Save active profile
      localStorage.setItem(
        'itcg_auth_user',
        JSON.stringify({ email: cleanEmail, org: orgName, phone, role: 'tenant' })
      );
    }

    router.push('/activation');
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
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-2xl mx-auto glow-cyan">
            🛡️
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            {lang === 'EN' ? 'Register New Organization Account' : 'Daftarkan Akun Organisasi Baru'}
          </h1>
          <p className="text-xs text-slate-400">
            {lang === 'EN' ? 'Direct Email & Password Authentication' : 'Autentikasi berbasis Email & Kata Sandi'}
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 glass-panel shadow-2xl space-y-5">
          {errorMsg && (
            <div className="p-3 bg-rose-500/15 border border-rose-500/30 text-rose-300 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">
                {lang === 'EN' ? 'Company / Organization Name' : 'Nama Perusahaan / Organisasi'}
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="PT Enterprise Global Tech"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">
                {lang === 'EN' ? 'Official Work Email' : 'Alamat Email Resmi'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ciso@enterprise.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white font-mono placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">
                {lang === 'EN' ? 'WhatsApp Number for Security Alerts' : 'Nomor WhatsApp untuk Laporan'}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+62 812-6000-6666"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white font-mono placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">
                {lang === 'EN' ? 'Account Password' : 'Kata Sandi Akun'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={lang === 'EN' ? 'Minimum 6 characters' : 'Minimal 6 karakter'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white font-mono placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">
                {lang === 'EN' ? 'Confirm Password' : 'Konfirmasi Kata Sandi'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={lang === 'EN' ? 'Re-type password' : 'Ketik ulang kata sandi'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white font-mono placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all flex items-center justify-center gap-2 glow-cyan"
            >
              <span>{lang === 'EN' ? 'Register Account & Continue' : 'Daftar Akun & Lanjutkan'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="border-t border-slate-800 pt-4 text-center text-slate-400 text-xs">
            {lang === 'EN' ? 'Already have an account? ' : 'Sudah memiliki akun? '}
            <Link href="/login" className="text-cyan-400 hover:underline font-semibold">
              {lang === 'EN' ? 'Sign In Here' : 'Masuk di Sini'}
            </Link>
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
            &larr; {lang === 'EN' ? 'Back to Landing Page' : 'Kembali ke Beranda Landing Page'}
          </Link>
        </div>
      </div>
    </div>
  );
}
