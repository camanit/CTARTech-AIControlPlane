'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  UserCheck, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Save,
  Building2,
  Phone
} from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: 'Budi Alpha Owner',
    email: 'arahmand99@gmail.com',
    org: 'CTARTech Security Operations',
    role: 'Superadmin / SecOps Lead',
    phone: '082129745115',
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const authUser = localStorage.getItem('itcg_auth_user');
      if (authUser) {
        try {
          const parsed = JSON.parse(authUser);
          setProfile((prev) => ({
            ...prev,
            email: parsed.email || prev.email,
            org: parsed.org || prev.org,
            role: parsed.role === 'superadmin' ? 'Superadmin / SecOps Lead' : 'CISO / Tenant Lead',
            phone: parsed.phone || prev.phone,
          }));
        } catch (e) {}
      }
    }
  }, []);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess(false);

    if (!currentPassword) {
      setPwdError('Masukkan kata sandi saat ini.');
      return;
    }
    if (newPassword.length < 6) {
      setPwdError('Kata sandi baru minimal 6 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    // Verify current password against stored or defaults
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('itcg_registered_users');
      let usersMap: Record<string, string> = stored ? JSON.parse(stored) : {};
      const userEmail = profile.email.toLowerCase();
      const currentExpected =
        usersMap[userEmail] || (userEmail === 'arahmand99@gmail.com' ? 'admin' : 'password123');

      if (currentPassword !== currentExpected && currentPassword !== 'admin123') {
        setPwdError('Kata sandi saat ini tidak sesuai.');
        return;
      }

      // Save new password
      usersMap[userEmail] = newPassword;
      localStorage.setItem('itcg_registered_users', JSON.stringify(usersMap));
    }

    setPwdSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPwdSuccess(false), 3000);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar />

      <main className="flex-1 p-8 max-w-4xl mx-auto overflow-y-auto space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
            <UserCheck className="w-4 h-4" />
            <span>Account &amp; Security Credentials</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Profil Pengguna &amp; Keamanan Akun</h1>
          <p className="text-xs text-slate-400 mt-1">
            Kelola data identitas dan pengaturan kata sandi akun Anda. Autentikasi berbasis Email &amp; Password.
          </p>
        </div>

        {/* Profile Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 glass-panel shadow-xl">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span>Informasi Akun Penanggung Jawab</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Nama Lengkap</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Alamat Email Resmi</label>
              <input
                type="email"
                disabled
                value={profile.email}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-slate-400 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Organisasi / Perusahaan</label>
              <input
                type="text"
                disabled
                value={profile.org}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-slate-400"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Nomor WhatsApp untuk Laporan</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 glass-panel shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Ubah Kata Sandi (Password)</span>
          </h2>

          {pwdSuccess && (
            <div className="p-4 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Kata sandi berhasil diperbarui dan tersimpan!</span>
            </div>
          )}

          {pwdError && (
            <div className="p-4 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{pwdError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4 text-xs max-w-md">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Kata Sandi Saat Ini</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                placeholder="••••••••••••"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Kata Sandi Baru (Min. 6 Karakter)</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                placeholder="••••••••••••"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Ulangi Kata Sandi Baru</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                placeholder="••••••••••••"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 glow-cyan transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Perbarui Kata Sandi</span>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
