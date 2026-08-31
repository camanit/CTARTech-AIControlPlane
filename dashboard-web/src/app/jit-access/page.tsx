'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import AuthGuard from '@/components/AuthGuard';
import { 
  Clock, 
  KeyRound, 
  RefreshCw, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Sliders, 
  Lock, 
  Unlock, 
  Copy,
  Plus
} from 'lucide-react';

interface JitTokenSession {
  token_id: string;
  agent_id: string;
  task_scope: string;
  ttl_seconds: number;
  remaining_seconds: number;
  status: 'ACTIVE' | 'EXPIRED';
  issued_at: string;
}

export default function JitAccessPage() {
  const [sessions, setSessions] = useState<JitTokenSession[]>([
    {
      token_id: 'jit_tok_99182aa1',
      agent_id: 'agent_finance_01',
      task_scope: 'EXECUTE_PAYMENT_VOUCHER_#99',
      ttl_seconds: 60,
      remaining_seconds: 42,
      status: 'ACTIVE',
      issued_at: 'Baru saja'
    },
    {
      token_id: 'jit_tok_33918bf2',
      agent_id: 'agent_hr_compliance',
      task_scope: 'READ_EMPLOYEE_ATTENDANCE_LOGS',
      ttl_seconds: 120,
      remaining_seconds: 0,
      status: 'EXPIRED',
      issued_at: '10 menit yang lalu'
    }
  ]);

  const [selectedAgent, setSelectedAgent] = useState('agent_finance_01');
  const [taskScope, setTaskScope] = useState('EXECUTE_SINGLE_BATCH_REFUND');
  const [ttlChoice, setTtlChoice] = useState(60);
  const [issuedMessage, setIssuedMessage] = useState<string | null>(null);

  // Issue a new JIT Task Token
  const handleIssueJitToken = () => {
    const randomHex = Math.random().toString(36).substring(2, 10);
    const newSession: JitTokenSession = {
      token_id: `jit_tok_${randomHex}`,
      agent_id: selectedAgent,
      task_scope: taskScope,
      ttl_seconds: ttlChoice,
      remaining_seconds: ttlChoice,
      status: 'ACTIVE',
      issued_at: 'Baru saja'
    };

    setSessions([newSession, ...sessions]);
    setIssuedMessage(`Token JIT '${newSession.token_id}' berhasil diterbitkan untuk '${selectedAgent}' (Masa aktif: ${ttlChoice}s)!`);
    setTimeout(() => setIssuedMessage(null), 4000);
  };

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto overflow-y-auto w-full">
          {/* Header */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Zero-Trust Least Privilege &bull; Ephemeral Access</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                Just-In-Time (JIT) Ephemeral Token &amp; Secret Rotation
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                Cegah kebocoran token statis permanen. Agen AI hanya diberikan kredensial berdurasi mikro (TTL detik/menit) yang kadaluarsa otomatis saat tugas selesai.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>JIT Issuer: READY</span>
              </span>
            </div>
          </div>

          {/* Banner message */}
          {issuedMessage && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 shadow-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{issuedMessage}</span>
            </div>
          )}

          {/* Generator Form Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 glass-panel mb-8">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Terbitkan Token JIT Wewenang Mikro Baru (*Task-Bound*)</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1.5">Pilih Agen AI Penerima:</label>
                <select
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 font-mono"
                >
                  <option value="agent_finance_01">agent_finance_01 (Finance Payment)</option>
                  <option value="agent_hr_compliance">agent_hr_compliance (HR Payroll)</option>
                  <option value="agent_support_bot">agent_support_bot (Support LLM)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5">Scope Tugas Khusus (Single-Use):</label>
                <input
                  type="text"
                  value={taskScope}
                  onChange={(e) => setTaskScope(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 font-mono"
                  placeholder="Contoh: EXECUTE_PAYMENT_VOUCHER_#101"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5">Masa Aktif Wewenang (TTL):</label>
                <div className="flex items-center gap-2">
                  <select
                    value={ttlChoice}
                    onChange={(e) => setTtlChoice(Number(e.target.value))}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-emerald-400 font-mono font-bold"
                  >
                    <option value={30}>30 Detik (Ultra-Strict)</option>
                    <option value={60}>60 Detik (1 Menit)</option>
                    <option value={300}>300 Detik (5 Menit)</option>
                    <option value={900}>900 Detik (15 Menit)</option>
                  </select>

                  <button
                    onClick={handleIssueJitToken}
                    className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Terbitkan</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Active Sessions List */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 glass-panel overflow-hidden">
            <div className="p-4 bg-slate-800/50 border-b border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-white">Sesi Token JIT Aktif ({sessions.length})</span>
              <span className="font-mono text-emerald-400 text-[11px]">Strict Least-Privilege Ledger</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-700">
                  <tr>
                    <th className="p-3.5">Token ID JIT</th>
                    <th className="p-3.5">Target AI Agent</th>
                    <th className="p-3.5">Scope Tugas Terikat</th>
                    <th className="p-3.5">Masa Berlaku (TTL)</th>
                    <th className="p-3.5">Status Akses</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {sessions.map((s) => (
                    <tr key={s.token_id} className="hover:bg-slate-800/40">
                      <td className="p-3.5 font-mono text-cyan-300 font-bold">
                        {s.token_id}
                      </td>
                      <td className="p-3.5 font-mono text-slate-300">
                        {s.agent_id}
                      </td>
                      <td className="p-3.5 font-mono text-emerald-300 text-[11px]">
                        {s.task_scope}
                      </td>
                      <td className="p-3.5 text-slate-400 font-mono">
                        {s.ttl_seconds} Detik ({s.issued_at})
                      </td>
                      <td className="p-3.5">
                        {s.status === 'ACTIVE' ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold font-mono flex items-center gap-1 w-fit">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                            ACTIVE ({s.remaining_seconds}s sisa)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-bold font-mono w-fit">
                            EXPIRED (REVOKED)
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
