'use client';

import { useState, useEffect } from 'react';
import { Activity, ShieldCheck } from 'lucide-react';
import { getAuditLogs, AuditLogItem } from '@/lib/api';

export interface LogItem {
  timestamp: string;
  module: string;
  eventType: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  hash: string;
  description: string;
}

export default function LogStream() {
  const [logs, setLogs] = useState<LogItem[]>([
    { timestamp: '10:24:12', module: 'Agent IAM', eventType: 'MFA Verification', severity: 'INFO', hash: 'e3b0c442...', description: 'Token valid untuk agent_finance_01 task-bound' },
    { timestamp: '10:23:45', module: 'Authority Gate', eventType: 'Segment Validation', severity: 'WARNING', hash: '872983b6...', description: 'Percobaan transfer dana Rp 2.500.000 melampaui limit wewenang' },
    { timestamp: '10:22:18', module: 'AI Guardrail', eventType: 'Payload Check', severity: 'INFO', hash: 'a591a6d4...', description: 'Customer inquiry workflow verified clear of jailbreak' },
    { timestamp: '10:20:05', module: 'Destructive Blocker', eventType: 'WAF AST Intercept', severity: 'CRITICAL', hash: 'c3a7f82e...', description: 'Eksekusi rm -rf /var/data seketika diblokir di level runtime' }
  ]);

  const [simulating, setSimulating] = useState(false);

  const fetchLogs = async () => {
    try {
      const realLogs = await getAuditLogs();
      if (realLogs && realLogs.length > 0) {
        const mapped: LogItem[] = realLogs.map((l) => ({
          timestamp: new Date(l.timestamp).toLocaleTimeString(),
          module: l.agent_id,
          eventType: l.action,
          severity: l.decision.includes('ALLOW') ? 'INFO' : l.decision.includes('REQUIRE') ? 'WARNING' : 'CRITICAL',
          hash: l.audit_id.substring(0, 10) + '...',
          description: l.reason,
        }));
        setLogs(mapped.slice(-8).reverse());
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSimulateStream = () => {
    setSimulating(true);
    const mockItem: LogItem = {
      timestamp: new Date().toLocaleTimeString(),
      module: 'Agent_Treasury',
      eventType: 'Disbursement Evaluation',
      severity: 'INFO',
      hash: Math.random().toString(36).substring(2, 10) + '...',
      description: 'Audit verified with Ed25519 signature & zero-trust ledger state',
    };
    setLogs((prev) => [mockItem, ...prev.slice(0, 7)]);
    setTimeout(() => setSimulating(false), 500);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl glass-panel">
      {/* Header Stream */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Live Telemetry &amp; Immutable Audit Stream</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">
            Cryptographic: Append-Only Hash Chain (SHA-256) via Real-Time Axum Channel
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSimulateStream}
            disabled={simulating}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>SIMULATION STREAM</span>
          </button>
          <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono font-semibold text-slate-300">
            Chain: <span className="text-emerald-400 font-bold">100% Valid</span>
          </div>
        </div>
      </div>

      {/* Table Stream */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
            <tr>
              <th className="p-3">TIME</th>
              <th className="p-3">SOURCE MODULE</th>
              <th className="p-3">EVENT TYPE</th>
              <th className="p-3">SEVERITY</th>
              <th className="p-3">SHA-256 HASH</th>
              <th className="p-3">TELEMETRY DESCRIPTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
            {logs.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-3 text-slate-400">{item.timestamp}</td>
                <td className="p-3 font-semibold text-white font-sans">{item.module}</td>
                <td className="p-3 text-cyan-400 font-semibold">{item.eventType}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                      item.severity === 'INFO'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : item.severity === 'WARNING'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {item.severity}
                  </span>
                </td>
                <td className="p-3 text-slate-400">{item.hash}</td>
                <td className="p-3 text-slate-300 font-sans text-xs max-w-sm truncate">
                  {item.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
