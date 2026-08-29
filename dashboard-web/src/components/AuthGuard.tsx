'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  const checkAuth = () => {
    // Public routes that do NOT require authentication
    const publicPaths = ['/', '/login', '/register', '/forgot-password', '/activation'];
    if (publicPaths.includes(pathname)) {
      setAuthorized(true);
      setChecking(false);
      return;
    }

    try {
      const stored = localStorage.getItem('itcg_auth_user');
      if (!stored) {
        setAuthorized(false);
        setChecking(false);
        window.location.replace('/login');
        return;
      }

      const user = JSON.parse(stored);
      if (!user || !user.email) {
        localStorage.removeItem('itcg_auth_user');
        setAuthorized(false);
        setChecking(false);
        window.location.replace('/login');
        return;
      }

      // Check Superadmin route restriction
      if (pathname.startsWith('/superadmin') && user.role !== 'superadmin') {
        alert('Akses Ditolak: Halaman Superadmin hanya dapat diakses oleh akun Superadmin HQ.');
        window.location.replace('/dashboard');
        return;
      }

      setAuthorized(true);
      setChecking(false);
    } catch (e) {
      localStorage.removeItem('itcg_auth_user');
      setAuthorized(false);
      setChecking(false);
      window.location.replace('/login');
    }
  };

  useEffect(() => {
    checkAuth();

    // Prevent caching when user presses browser Back/Forward buttons (bfcache)
    const handlePageShow = (event: PageTransitionEvent) => {
      checkAuth();
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [pathname]);

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 font-sans">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mb-3 animate-pulse glow-cyan">
          <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
        </div>
        <p className="text-xs font-mono text-cyan-400">Verifying Zero-Trust Active Session...</p>
      </div>
    );
  }

  if (authorized) {
    return <>{children}</>;
  }

  return null;
}
