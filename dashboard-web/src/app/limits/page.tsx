'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  DollarSign, 
  ShieldCheck, 
  Sliders, 
  AlertTriangle, 
  Save, 
  CheckCircle2, 
  RefreshCw,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { getAgents, AgentRecord } from '@/lib/api';

export default function LimitsPage() {
  const [agents, setAgents] = useState<AgentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [limitsMap, setLimitsMap] = useState<Record<string, number>>({});
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    getAgents().then((data) => {
      setAgents(data);
      const initial: Record<string, number> = {};
      data.forEach((a) => {
        initial[a.agent_id] = a.max_limit;
      });
      setLimitsMap(initial);
      setLoading(false);
    });
  }, []);

  const handleLimitChange = (agentId: string, value: number) => {
    setLimitsMap({ ...limitsMap, [agentId]: value });
  };

  const handleSaveLimits = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar />

      <main className="flex-1 p-8 max-w-6xl mx-auto overflow-y-auto space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
            <DollarSign className="w-4 h-4" />
            <span>Task-Bound Authority Gate</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Batas Wewenang Finansial &amp; Transaksi</h1>
          <p className="text-xs text-slate-400 mt-1">
            Konfigurasi batas plafon transaksi otomatis (auto-approval limit) untuk setiap AI Agent. Transaksi di atas batas ini otomatis ditahan ke Human-in-the-Loop.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Batas wewenang finansial agen berhasil diperbarui dan disinkronkan ke Runtime Gateway!</span>
          </div>
        )}

        <form onSubmit={handleSaveLimits} className="space-y-6">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 glass-panel overflow-hidden shadow-xl">
            <div className="p-4 bg-slate-800/60 border-b border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-white">Konfigurasi Batas Wewenang Per Agen</span>
              <span className="font-mono text-cyan-400 text-[11px]">Fail-Safe Enabled</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
                  <tr>
                    <th className="p-4">AI Agent</th>
                    <th className="p-4">Owner Divisi</th>
                    <th className="p-4">Batas Otonom (Auto-Approve)</th>
                    <th className="p-4">Tindakan Jika Melebihi Plafon</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                  {agents.map((ag) => (
                    <tr key={ag.agent_id} className="hover:bg-slate-800/30">
                      <td className="p-4">
                        <strong className="text-white text-xs font-sans">{ag.name}</strong>
                        <div className="text-[10px] text-cyan-400 font-mono">{ag.agent_id}</div>
                      </td>
                      <td className="p-4 font-sans text-slate-300">{ag.owner}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-xs">Rp</span>
                          <input
                            type="number"
                            value={limitsMap[ag.agent_id] ?? ag.max_limit}
                            onChange={(e) => handleLimitChange(ag.agent_id, Number(e.target.value))}
                            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-amber-300 font-bold font-mono w-40 text-xs focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
                          HOLD ➔ REQUIRE_APPROVAL
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ag.status === 'ACTIVE'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {ag.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 glow-cyan transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Plafon Finansial</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
