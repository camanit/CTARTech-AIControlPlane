'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  UserCheck, 
  Activity, 
  Zap, 
  FileCheck2, 
  KeyRound, 
  LogOut, 
  User, 
  Send, 
  Globe,
  DollarSign,
  ShieldAlert,
  Cpu,
  Radio,
  Flame,
  Sparkles,
  Clock,
  Workflow
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, setLang } = useLanguage();

  const [currentUser, setCurrentUser] = useState<any>({
    email: 'arahmand99@gmail.com',
    role: 'Superadmin / SecOps Lead'
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('itcg_auth_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        setCurrentUser({
          email: parsed.email || 'arahmand99@gmail.com',
          role: parsed.role === 'superadmin' ? 'Superadmin / SecOps Lead' : 'CISO / Tenant Lead'
        });
      }
    } catch (e) {}
  }, [pathname]);

  const handleLogout = () => {
    if (confirm(lang === 'EN' ? 'Are you sure you want to sign out from the portal session?' : 'Apakah Anda yakin ingin keluar dari sesi portal?')) {
      try {
        localStorage.removeItem('itcg_auth_user');
        sessionStorage.clear();
      } catch (e) {}
      window.location.replace('/login');
    }
  };

  // 1-to-1 unique route mapping for AI Control Plane Pillars (Bilingual EN / ID)
  const coreModules = [
    { 
      name: lang === 'EN' ? '1. Visibility & SOC Overview' : '1. Overview & Pemantauan SOC', 
      path: '/dashboard', 
      icon: Activity 
    },
    { 
      name: lang === 'EN' ? '2. Agent Identity & Registry' : '2. Registri Identitas Agen', 
      path: '/agents', 
      icon: UserCheck 
    },
    { 
      name: lang === 'EN' ? '3. Financial Limits Gate' : '3. Plafon Limit Finansial', 
      path: '/limits', 
      icon: DollarSign 
    },
    { 
      name: lang === 'EN' ? '4. Runtime Guardrails Interceptor' : '4. Guardrail Pencegah Perintah', 
      path: '/guardrails', 
      icon: ShieldAlert 
    },
    { 
      name: lang === 'EN' ? '5. Dynamic Policy Engine (OPA)' : '5. Mesin Kebijakan Dinamis (OPA)', 
      path: '/policies', 
      icon: Cpu 
    },
    { 
      name: lang === 'EN' ? '6. Human-in-the-Loop Queue' : '6. Antrean Persetujuan Manusia', 
      path: '/approvals', 
      icon: Zap 
    },
    { 
      name: lang === 'EN' ? '7. Governance Matrix & Reports' : '7. Matriks Laporan & Audit', 
      path: '/reports', 
      icon: FileCheck2 
    },
    { 
      name: lang === 'EN' ? '8. ISO Compliance & Data Privacy' : '8. Kepatuhan ISO & Privasi Data', 
      path: '/compliance', 
      icon: ShieldCheck 
    },
    { 
      name: lang === 'EN' ? '9. AI-ITDR Threat Sentry' : '9. AI-ITDR Sentry Ancaman', 
      path: '/itdr', 
      icon: Radio 
    },
    { 
      name: lang === 'EN' ? '10. Edge WAF & OSI Defense' : '10. Edge WAF & Pertahanan OSI', 
      path: '/waf', 
      icon: Flame 
    },
    { 
      name: lang === 'EN' ? '11. Honeytokens Canary Trap' : '11. Honeytokens Jebakan Canary', 
      path: '/honeytokens', 
      icon: Sparkles 
    },
    { 
      name: lang === 'EN' ? '12. JIT Access & Rotation' : '12. JIT Token & Rotasi Kunci', 
      path: '/jit-access', 
      icon: Clock 
    },
    { 
      name: lang === 'EN' ? '13. Incident Playbooks' : '13. Playbook Mitigasi Otomatis', 
      path: '/playbooks', 
      icon: Workflow 
    },
  ];

  const operationsModules = [
    { 
      name: lang === 'EN' ? 'Notification Gateway' : 'Gateway Notifikasi', 
      path: '/notifications', 
      icon: Send, 
      badge: 'GATEWAY' 
    },
    { 
      name: lang === 'EN' ? 'Profile & Security' : 'Profil & Keamanan', 
      path: '/profile', 
      icon: User, 
      badge: 'MY_ID' 
    },
    { 
      name: lang === 'EN' ? 'Superadmin & License' : 'Superadmin & Lisensi', 
      path: '/superadmin', 
      icon: KeyRound, 
      badge: 'PRO' 
    },
  ];

  return (
    <aside className="w-64 bg-slate-900/90 backdrop-blur-md text-slate-300 min-h-screen p-4 flex flex-col border-r border-slate-800 flex-shrink-0 no-print">
      {/* Brand Header */}
      <Link href="/" className="flex items-center gap-3 px-2 py-3 mb-3 rounded-xl hover:bg-slate-800/60 transition-all">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/20">
          <ShieldCheck className="w-5 h-5 text-slate-950 stroke-[2.5]" />
        </div>
        <div>
          <div className="text-sm font-extrabold text-white tracking-wider flex items-center gap-1">
            <span>CTAR</span>
            <span className="text-cyan-400">AIControlPlane</span>
          </div>
          <div className="text-[10px] text-slate-400 font-medium">AI Agent Control Plane</div>
        </div>
      </Link>

      {/* User Session Profile Badge */}
      {currentUser && (
        <Link 
          href="/profile" 
          title={lang === 'EN' ? 'Open Profile & Security Settings' : 'Buka Pengaturan Profil & Keamanan'}
          className="mb-5 p-2.5 bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 rounded-xl flex items-center justify-between transition-all group"
        >
          <div className="flex items-center gap-2 truncate">
            <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 flex items-center justify-center text-xs font-bold shrink-0 transition-all">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="truncate">
              <div className="text-[11px] font-bold text-slate-200 truncate">{currentUser.email}</div>
              <div className="text-[9px] text-cyan-400 font-mono font-semibold">{currentUser.role}</div>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleLogout();
            }}
            title={lang === 'EN' ? 'Sign Out / Logout' : 'Keluar / Logout'}
            className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </Link>
      )}

      {/* Language Switcher Bar in Sidebar */}
      <div className="mb-4 p-1.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
        <span className="text-[10px] font-mono text-slate-400 font-bold px-1.5">LANGUAGE</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setLang('EN')}
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
              lang === 'EN' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLang('ID')}
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
              lang === 'ID' ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            ID
          </button>
        </div>
      </div>

      {/* Core AI Control Plane Pillars */}
      <div className="mb-2 px-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
        {lang === 'EN' ? 'AI Control Plane Pillars' : 'Pilar Kontrol Agen AI'}
      </div>
      <nav className="space-y-1 flex-1 overflow-y-auto pr-1">
        {coreModules.map((mod, idx) => {
          const Icon = mod.icon;
          const isActive = pathname === mod.path;
          return (
            <Link
              key={idx}
              href={mod.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/30 font-semibold shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span className="truncate">{mod.name}</span>
            </Link>
          );
        })}

        {/* Intelligence & Operations Section */}
        <div className="mt-4 mb-2 px-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
          {lang === 'EN' ? 'Operations & Management' : 'Operasional & Manajemen'}
        </div>
        {operationsModules.map((mod, idx) => {
          const Icon = mod.icon;
          const isActive = pathname === mod.path;
          return (
            <Link
              key={`ops-${idx}`}
              href={mod.path}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/10 text-purple-300 border border-purple-500/30 font-semibold shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                <span className="truncate">{mod.name}</span>
              </div>
              {mod.badge && (
                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                  mod.badge === 'GATEWAY'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {mod.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Status & License Activator */}
      <div className="pt-3 mt-auto border-t border-slate-800/80 text-[11px] text-slate-400 flex flex-col gap-2 px-2">
        <Link 
          href="/activation" 
          className="w-full flex items-center justify-between p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all font-mono font-semibold"
        >
          <span className="flex items-center gap-2">
            <KeyRound className="w-3.5 h-3.5" />
            <span>{lang === 'EN' ? 'License Activation' : 'Aktivasi Lisensi'}</span>
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-200">LOCAL</span>
        </Link>
        <div className="flex justify-between items-center px-1 text-[10px] text-slate-500">
          <Link href="/" className="hover:text-cyan-400 flex items-center gap-1">
            <Globe className="w-3 h-3" />
            <span>Landing</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/terms" className="hover:text-cyan-400">Terms</Link>
            <span>&bull;</span>
            <Link href="/privacy" className="hover:text-cyan-400">Privacy</Link>
          </div>
          <button onClick={handleLogout} className="hover:text-rose-400">
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
