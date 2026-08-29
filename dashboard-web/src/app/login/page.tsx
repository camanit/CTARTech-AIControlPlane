'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, Crown, Building2, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<'tenant' | 'superadmin'>('superadmin');
  const [email, setEmail] = useState('arahmand99@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleChange = (newRole: 'tenant' | 'superadmin') => {
    setRole(newRole);
    setErrorMsg('');
    if (newRole === 'superadmin') {
      setEmail('arahmand99@gmail.com');
    } else {
      setEmail('ciso@perusahaan.com');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPwd = password.trim();

    if (!cleanEmail || !cleanPwd) {
      setErrorMsg('Silakan lengkapi alamat email dan kata sandi.');
      setLoading(false);
      return;
    }

    // Check stored custom users first
    let usersMap: Record<string, string> = {};
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('itcg_registered_users');
      if (stored) {
        try { usersMap = JSON.parse(stored); } catch (err) {}
      }
    }

    // Default accounts:
    // Superadmin: arahmand99@gmail.com -> admin / admin123
    // Tenant: ciso@perusahaan.com -> admin123 / password123
    const isSuperadminMatch =
      cleanEmail === 'arahmand99@gmail.com' &&
      (cleanPwd === 'admin' || cleanPwd === 'admin123' || usersMap[cleanEmail] === cleanPwd);

    const isTenantMatch =
      (cleanEmail === 'ciso@perusahaan.com' &&
        (cleanPwd === 'admin123' || cleanPwd === 'password123' || usersMap[cleanEmail] === cleanPwd)) ||
      (usersMap[cleanEmail] && usersMap[cleanEmail] === cleanPwd);

    if (role === 'superadmin') {
      if (!isSuperadminMatch) {
        setErrorMsg('Kata sandi Superadmin salah. Silakan periksa kembali.');
        setLoading(false);
        return;
      }

      // Validated
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'itcg_auth_user',
          JSON.stringify({ email: cleanEmail, role: 'superadmin', name: 'Superadmin HQ' })
        );
      }
      router.push('/superadmin');
    } else {
      if (!isTenantMatch) {
        setErrorMsg('Email atau kata sandi Tenant salah. Silakan periksa kembali.');
        setLoading(false);
        return;
      }

      // Validated
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'itcg_auth_user',
          JSON.stringify({ email: cleanEmail, role: 'tenant', name: 'CISO / Tenant Admin' })
        );
      }
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-6 relative font-sans">
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-2xl mx-auto glow-cyan">
            🛡️
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">CTARTech-AIControlPlane</h1>
          <p className="text-xs text-slate-400">Zero-Trust Identity &amp; Runtime Security Portal</p>
        </div>

        {/* Card */}
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 glass-panel shadow-2xl space-y-6">
          {/* Role Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => handleRoleChange('tenant')}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                role === 'tenant'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Tenant Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('superadmin')}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                role === 'superadmin'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Superadmin HQ</span>
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-500/15 border border-rose-500/30 text-rose-300 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Alamat Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@perusahaan.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white font-mono placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-slate-400 font-medium">Kata Sandi</label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] text-cyan-400 hover:underline transition-colors"
                >
                  Lupa kata sandi?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi akun"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-10 py-2.5 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${
                role === 'superadmin'
                  ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                  : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 glow-cyan'
              }`}
            >
              <span>{loading ? 'Memverifikasi...' : `Masuk sebagai ${role === 'superadmin' ? 'Superadmin' : 'Tenant Admin'}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-400 border-t border-slate-800">
            Belum memiliki akun?{' '}
            <Link href="/register" className="text-cyan-400 font-semibold hover:underline">
              Daftar Baru
            </Link>{' '}
            atau{' '}
            <Link href="/activation" className="text-cyan-400 font-semibold hover:underline">
              Aktivasi Lisensi
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
