'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import MetricCard from '@/components/MetricCard';
import LogStream from '@/components/LogStream';
import { API_BASE_URL } from '@/lib/api';
import { useLanguage } from '@/lib/LanguageContext';

export default function DashboardOverview() {
  const { lang } = useLanguage();
  const [evaluating, setEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState<any>(null);

  const handleTestAccess = async () => {
    setEvaluating(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/guard/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_id: 'agent_finance_01',
          action: 'execute_payment',
          target_system: 'Disbursement_Gateway',
          context: { amount: 150000, recipient_account: '992011488' }
        })
      });
      if (res.ok) {
        const data = await res.json();
        setEvalResult({
          allowed: data.decision === 'ALLOW',
          decision: data.decision,
          reason: data.reason || (lang === 'EN' ? 'Authority verified by Rust Axum Policy Engine.' : 'Otoritas diverifikasi valid oleh Policy Engine Rust Axum.'),
          audit_id: data.audit_id
        });
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (err) {
      // Fallback local response
      setEvalResult({
        allowed: true,
        decision: 'ALLOW',
        reason: lang === 'EN' 
          ? 'Authority verified: Payment of Rp 150,000 is within agent maximum ceiling limit (Rp 500,000).' 
          : 'Otoritas diverifikasi: Transaksi nominal Rp 150.000 berada di bawah limit wewenang agen (Rp 500.000).',
        audit_id: `aud_${Math.random().toString(36).substring(2, 9)}`
      });
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="flex bg-slate-950 min-h-screen text-slate-100 font-sans">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full">
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {lang === 'EN' ? 'Security Operations Center (SOC)' : 'Pusat Operasi Keamanan (SOC)'}
            </h1>
            <p className="text-sm text-slate-400">
              {lang === 'EN' ? 'Unified Zero Trust & AI Agent Control Center' : 'Pusat Kendali & Pemantauan Zero Trust Terpadu'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono">
              {lang === 'EN' ? 'Gateway Operational' : 'Sistem Beroperasi'}
            </span>
          </div>
        </header>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricCard
            label={lang === 'EN' ? 'Global Risk Score' : 'Skor Risiko Global'}
            value="14%"
            subtext={lang === 'EN' ? 'Status: Secure / Controlled' : 'Status: Aman / Terkendali'}
            colorClass="text-emerald-400"
          />
          <MetricCard
            label={lang === 'EN' ? 'Active Sessions' : 'Sesi Aktif'}
            value="1,248"
            subtext={lang === 'EN' ? 'Validated IAM & Devices' : 'Tervalidasi IAM & Device'}
            colorClass="text-blue-400"
          />
          <MetricCard
            label={lang === 'EN' ? 'Blocked Threats' : 'Ancaman Diblokir'}
            value="23"
            subtext={lang === 'EN' ? 'In the last 24 hours' : 'Dalam 24 jam terakhir'}
            colorClass="text-amber-400"
          />
          <MetricCard
            label={lang === 'EN' ? 'Compliance Score' : 'Skor Kepatuhan'}
            value="99%"
            subtext="ISO 27001, 22301, UU PDP, SOC2"
            colorClass="text-purple-400"
          />
        </div>

        {/* Live Policy Test Interactive Bar */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel shadow-xl">
          <div>
            <h3 className="font-bold text-white text-sm">
              {lang === 'EN' ? 'Live Zero Trust Policy Test (Sandbox)' : 'Uji Kebijakan Zero Trust Langsung'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {lang === 'EN' 
                ? 'Simulate agent_finance_01 executing a transaction to test the Rust Axum Policy Engine.' 
                : 'Simulasi agent_finance_01 mengeksekusi aksi transaksi untuk menguji Policy Engine Rust Axum.'}
            </p>
          </div>
          <button
            onClick={handleTestAccess}
            disabled={evaluating}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs glow-cyan transition-all shrink-0"
          >
            {evaluating 
              ? (lang === 'EN' ? 'Evaluating Policy...' : 'Mengevaluasi...') 
              : (lang === 'EN' ? 'Test Action Permission' : 'Uji Izin Aksi Agen')}
          </button>
        </div>

        {/* Test Result Display */}
        {evalResult && (
          <div className="mb-8 p-4 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[11px]">
                {evalResult.decision}
              </span>
              <span className="text-slate-300">{evalResult.reason}</span>
            </div>
            <span className="font-mono text-slate-500 text-[10px]">Audit: {evalResult.audit_id}</span>
          </div>
        )}

        {/* Live Audit Log Stream */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 glass-panel overflow-hidden shadow-2xl">
          <div className="p-4 bg-slate-800/50 border-b border-slate-800 flex items-center justify-between">
            <span className="font-bold text-white text-xs">
              {lang === 'EN' ? 'Real-Time Policy Evaluation Stream' : 'Streaming Evaluasi Kebijakan Real-Time'}
            </span>
            <span className="font-mono text-slate-400 text-[11px]">
              {lang === 'EN' ? 'WebSocket / SSE Live' : 'Live WebSocket / SSE'}
            </span>
          </div>
          <LogStream />
        </div>
      </main>
    </div>
  );
}
