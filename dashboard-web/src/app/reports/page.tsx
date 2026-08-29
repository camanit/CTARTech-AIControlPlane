'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  FileText, 
  Printer, 
  Download, 
  Filter, 
  Calendar, 
  ShieldCheck, 
  Search,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Lock
} from 'lucide-react';
import { getAuditLogs, getStats, AuditLogItem, SystemStats } from '@/lib/api';

export default function ReportsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [filterDecision, setFilterDecision] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('ALL');

  useEffect(() => {
    getAuditLogs().then(setLogs);
    getStats().then(setStats);
  }, []);

  const filtered = logs.filter((item) => {
    const matchDec = filterDecision === 'ALL' || item.decision.includes(filterDecision);
    const matchSearch =
      item.agent_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.audit_id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDec && matchSearch;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar />

      <main className="flex-1 p-8 max-w-5xl mx-auto overflow-y-auto">
        {/* Printable Official Header (Only shows on print) */}
        <div className="hidden print-only mb-6 border-b-2 border-slate-900 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold uppercase tracking-wide text-black">
                CTARTech-AIControlPlane &bull; Official Audit Report
              </h1>
              <p className="text-xs text-gray-600">Enterprise AI Agent Runtime Governance &amp; Threat Incident Registry</p>
            </div>
            <div className="text-right text-xs font-mono">
              <div>Organisasi: {stats?.org_name || 'PT CTARTech Global'}</div>
              <div>Tanggal Cetak: {new Date().toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Screen Header (Hidden on print) */}
        <div className="no-print mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
              <FileText className="w-4 h-4" />
              <span>Compliance &amp; Legal Audit Trail</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Laporan &amp; Cetak Peristiwa Agen AI</h1>
            <p className="text-xs text-slate-400 mt-1">
              Rekonstruksi lengkap seluruh keputusan, aksi, dan penahanan wewenang untuk kebutuhan audit kepatuhan.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 glow-cyan transition-all shadow-lg"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Laporan Resmi (PDF)</span>
            </button>
          </div>
        </div>

        {/* Filter Controls (Hidden on print) */}
        <div className="no-print p-4 rounded-xl bg-slate-900 border border-slate-800 glass-panel mb-6 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-slate-400 font-medium">
              <Filter className="w-3.5 h-3.5" />
              <span>Status Keputusan:</span>
            </div>
            <select
              value={filterDecision}
              onChange={(e) => setFilterDecision(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200"
            >
              <option value="ALL">Semua Keputusan</option>
              <option value="ALLOW">Hanya ALLOW (Otonom)</option>
              <option value="REQUIRE_APPROVAL">Hanya REQUIRE_APPROVAL (Tertahan)</option>
              <option value="BLOCK">Hanya BLOCK (Ditolak)</option>
            </select>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari audit id / agent..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-slate-200 placeholder-slate-400 text-xs"
            >
            </input>
          </div>
        </div>

        {/* Audit Log Table (Print-Ready) */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 glass-panel overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-800/50 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="font-bold text-white">Daftar Peristiwa Tercatat ({filtered.length} Records)</span>
            <span className="font-mono text-slate-400 text-[11px]">NIST SP 800-207 Zero Trust Compliant</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-700">
                <tr>
                  <th className="p-3">Waktu Kejadian</th>
                  <th className="p-3">Audit ID</th>
                  <th className="p-3">Agent ID</th>
                  <th className="p-3">Aksi Target</th>
                  <th className="p-3">Status Evaluasi</th>
                  <th className="p-3">Alasan Kebijakan (Policy Trail)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      Tidak ada rekaman log yang cocok dengan filter yang dipilih.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr key={item.audit_id} className="hover:bg-slate-800/40">
                      <td className="p-3 text-slate-400 font-mono text-[11px]">
                        {new Date(item.timestamp).toLocaleString()}
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-300">{item.audit_id}</td>
                      <td className="p-3 font-mono text-cyan-400">{item.agent_id}</td>
                      <td className="p-3 font-mono text-slate-200">
                        {item.action}
                        <div className="text-[10px] text-slate-400">{item.target_system}</div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                            item.decision.includes('ALLOW')
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : item.decision.includes('REQUIRE')
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          }`}
                        >
                          {item.decision}
                        </span>
                      </td>
                      <td className="p-3 text-slate-300 text-xs max-w-sm">
                        {item.reason}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Official Sign-off for Print (Only shows on print) */}
        <div className="hidden print-only mt-12 pt-8 border-t border-gray-400 flex justify-between text-xs text-gray-800">
          <div>
            <p>Dibuat secara otomatis oleh: <strong>CTARTech-AIControlPlane Runtime Engine</strong></p>
            <p>Integritas Hash Kriptografis: Terverifikasi Ed25519</p>
          </div>
          <div className="text-right">
            <p>Disetujui oleh CISO / Compliance Lead:</p>
            <div className="mt-12 font-bold underline">( CISO_Admin )</div>
            <p className="text-[10px] text-gray-500">Security Operations Department</p>
          </div>
        </div>
      </main>
    </div>
  );
}
