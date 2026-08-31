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

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
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
    if (confirm('Apakah Anda yakin ingin keluar dari sesi portal?')) {
      try {
        localStorage.removeItem('itcg_auth_user');
        sessionStorage.clear();
      } catch (e) {}
      window.location.replace('/login');
    }
  };

  // 1-to-1 unique route mapping for AI Control Plane Pillars
  const coreModules = [
    { name: '1. Visibility & SOC Overview', path: '/dashboard', icon: Activity },
    { name: '2. Agent Identity & Registry', path: '/agents', icon: UserCheck },
    { name: '3. Financial Limits Gate', path: '/limits', icon: DollarSign },
    { name: '4. Runtime Guardrails Interceptor', path: '/guardrails', icon: ShieldAlert },
    { name: '5. Dynamic Policy Engine (OPA)', path: '/policies', icon: Cpu },
    { name: '6. Human-in-the-Loop Queue', path: '/approvals', icon: Zap },
    { name: '7. Governance Matrix & Reports', path: '/reports', icon: FileCheck2 },
    { name: '8. Kepatuhan ISO & Privasi', path: '/compliance', icon: ShieldCheck },
    { name: '9. AI-ITDR Threat Sentry', path: '/itdr', icon: Radio },
    { name: '10. Edge WAF & OSI Defense', path: '/waf', icon: Flame },
    { name: '11. Honeytokens Canary', path: '/honeytokens', icon: Sparkles },
    { name: '12. JIT Access & Rotation', path: '/jit-access', icon: Clock },
    { name: '13. Incident Playbooks', path: '/playbooks', icon: Workflow },
  ];

  const operationsModules = [
    { name: 'Gateway Notifikasi', path: '/notifications', icon: Send, badge: 'GATEWAY' },
    { name: 'Profil & Ubah Password', path: '/profile', icon: User, badge: 'MY_ID' },
    { name: 'Superadmin & License', path: '/superadmin', icon: KeyRound, badge: 'PRO' },
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
          title="Buka Pengaturan Profil & Keamanan"
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
            title="Keluar / Logout"
            className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </Link>
      )}

      {/* Core AI Control Plane Pillars */}
      <div className="mb-2 px-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
        AI Control Plane Pillars
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
          AI &amp; Operations
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
            <span>Aktivasi Lisensi</span>
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
