'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  ShieldCheck, 
  Search,
  Sliders,
  Clock,
  Eye,
  X
} from 'lucide-react';
import { getPendingApprovals, resolveApproval, PendingApprovalItem } from '@/lib/api';

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<PendingApprovalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContext, setSelectedContext] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING'>('PENDING');

  const fetchApprovals = async () => {
    try {
      const data = await getPendingApprovals();
      setApprovals(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
    const interval = setInterval(fetchApprovals, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleResolve = async (approvalId: string, decision: 'APPROVE' | 'REJECT') => {
    const defaultName = 'CISO_Admin';
    const approver = prompt(`Konfirmasi keputusan [${decision}] untuk tiket ${approvalId}. Masukkan nama verifikator:`, defaultName);
    if (!approver) return;

    try {
      await resolveApproval(approvalId, decision, approver, `Resolved from Human-in-the-Loop Portal`);
      fetchApprovals();
    } catch (e: any) {
      alert('Gagal memproses approval: ' + e.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar />

      <main className="flex-1 p-8 max-w-6xl mx-auto overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Escalation &amp; Interception Queue</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Human-in-the-Loop Action Approvals</h1>
            <p className="text-xs text-slate-400 mt-1">
              Aksi berisiko tinggi atau melampaui batas wewenang yang ditahan di level runtime dan membutuhkan persetujuan manual pimpinan.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchApprovals}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
              title="Segarkan Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <div className="px-4 py-2 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span>{approvals.length} Aksi Menunggu Keputusan</span>
            </div>
          </div>
        </div>

        {/* Approvals Table */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 glass-panel overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-700">
                <tr>
                  <th className="p-4">Approval ID</th>
                  <th className="p-4">AI Agent Pelaksana</th>
                  <th className="p-4">Target Aksi &amp; Sistem</th>
                  <th className="p-4">Pemicu Intersepsi (Policy)</th>
                  <th className="p-4">Waktu Ditahan</th>
                  <th className="p-4 text-center">Payload Data</th>
                  <th className="p-4 text-right">Keputusan CISO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {approvals.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-slate-400 space-y-2">
                      <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto stroke-[1.5]" />
                      <div className="font-semibold text-white">Semua Aksi Berjalan Aman!</div>
                      <p className="text-xs text-slate-400">Tidak ada tiket aksi agen AI yang sedang tertahan saat ini.</p>
                    </td>
                  </tr>
                ) : (
                  approvals.map((item) => (
                    <tr key={item.approval_id} className="hover:bg-slate-800/30">
                      <td className="p-4 font-mono font-bold text-amber-300">{item.approval_id}</td>
                      <td className="p-4">
                        <strong className="text-white text-xs">{item.agent_name}</strong>
                        <div className="text-[10px] font-mono text-cyan-400">{item.agent_id}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-mono text-slate-200 font-semibold">{item.action}</div>
                        <div className="text-[10px] text-slate-400">Target: {item.target_system}</div>
                      </td>
                      <td className="p-4 text-amber-200 text-xs max-w-xs">{item.reason}</td>
                      <td className="p-4 font-mono text-[11px] text-slate-400">
                        {new Date(item.created_at).toLocaleTimeString()}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => setSelectedContext(item.context)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[10px] font-mono text-cyan-300 border border-slate-700 flex items-center gap-1 mx-auto"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Lihat JSON</span>
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleResolve(item.approval_id, 'APPROVE')}
                            className="px-3.5 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors shadow-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleResolve(item.approval_id, 'REJECT')}
                            className="px-3.5 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold text-xs hover:bg-rose-500/30 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Payload Context JSON */}
        {selectedContext && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
              <button
                onClick={() => setSelectedContext(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Rincian Payload Parameter Aksi Agen</span>
              </h3>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-xs overflow-x-auto max-h-80">
                {JSON.stringify(selectedContext, null, 2)}
              </pre>
              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedContext(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
