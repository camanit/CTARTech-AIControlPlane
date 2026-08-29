'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  Bot, 
  Plus, 
  Search, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Power, 
  RefreshCw,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { getAgents, registerAgent, toggleAgentStatus, AgentRecord } from '@/lib/api';

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [agentId, setAgentId] = useState('');
  const [name, setName] = useState('');
  const [owner, setOwner] = useState('');
  const [maxLimit, setMaxLimit] = useState(500000);
  const [description, setDescription] = useState('');
  const [addSuccess, setAddSuccess] = useState(false);

  const fetchAgentsData = async () => {
    try {
      const data = await getAgents();
      setAgents(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgentsData();
    const interval = setInterval(fetchAgentsData, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleAgent = async (agentId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const actionLabel = nextStatus === 'ACTIVE' ? 'mengaktifkan kembali' : 'MEMATIKAN (Kill-Switch)';
    if (!confirm(`Apakah Anda yakin ingin ${actionLabel} agen ${agentId}?`)) return;

    try {
      await toggleAgentStatus(agentId, nextStatus);
      fetchAgentsData();
    } catch (e: any) {
      alert('Gagal mengubah status wewenang agen: ' + e.message);
    }
  };

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerAgent({
        agent_id: agentId.trim(),
        name: name.trim(),
        owner: owner.trim(),
        max_limit: Number(maxLimit),
        description: description.trim(),
      });
      setAddSuccess(true);
      setTimeout(() => {
        setIsAddModalOpen(false);
        setAddSuccess(false);
        setAgentId('');
        setName('');
        setOwner('');
        setDescription('');
      }, 1200);
      fetchAgentsData();
    } catch (e: any) {
      alert('Gagal mendaftarkan agen: ' + e.message);
    }
  };

  const filtered = agents.filter(
    (a) =>
      a.agent_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar />

      <main className="flex-1 p-8 max-w-6xl mx-auto overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400 uppercase tracking-wider mb-2">
              <Bot className="w-4 h-4" />
              <span>Central Authority Registry</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">AI Agent Registry &amp; Kill-Switch</h1>
            <p className="text-xs text-slate-400 mt-1">
              Daftar seluruh entitas agen AI non-manusia yang memiliki wewenang eksekusi pada infrastruktur organisasi.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAgentsData}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
              title="Segarkan Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 glow-cyan transition-all shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Daftarkan Agen Baru</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 glass-panel flex items-center justify-between gap-4 text-xs">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari ID agen, nama, atau penanggung jawab..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Total Agen: <strong className="text-cyan-400 font-bold">{agents.length} Terdaftar</strong>
          </div>
        </div>

        {/* Agents Table */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 glass-panel overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-700">
                <tr>
                  <th className="p-4">Agent Identifier</th>
                  <th className="p-4">Nama Tampilan</th>
                  <th className="p-4">Human Owner</th>
                  <th className="p-4">Batas Nominal Finansial</th>
                  <th className="p-4">Deskripsi Tugas</th>
                  <th className="p-4">Status Otoritas</th>
                  <th className="p-4 text-right">Emergency Kill-Switch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      {loading ? 'Memuat daftar agen...' : 'Belum ada AI Agent yang terdaftar.'}
                    </td>
                  </tr>
                ) : (
                  filtered.map((ag) => (
                    <tr key={ag.agent_id} className="hover:bg-slate-800/30">
                      <td className="p-4 font-mono font-bold text-cyan-300">{ag.agent_id}</td>
                      <td className="p-4 font-semibold text-white">{ag.name}</td>
                      <td className="p-4 text-slate-300">{ag.owner}</td>
                      <td className="p-4 font-mono text-amber-300 font-bold">
                        Rp {ag.max_limit.toLocaleString()}
                      </td>
                      <td className="p-4 text-slate-400 text-xs max-w-xs truncate">
                        {ag.description || '-'}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold border ${
                            ag.status === 'ACTIVE'
                              ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
                              : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                          }`}
                        >
                          {ag.status === 'ACTIVE' ? 'AUTHORIZED' : 'REVOKED (KILLED)'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleToggleAgent(ag.agent_id, ag.status)}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border shadow-sm ${
                            ag.status === 'ACTIVE'
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                          }`}
                        >
                          {ag.status === 'ACTIVE' ? '🛑 Kill Switch' : '✅ Aktifkan'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal Add Agent */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-cyan-400" />
              <span>Daftarkan AI Agent Baru</span>
            </h3>

            {addSuccess ? (
              <div className="p-4 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-500/30 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Agen berhasil didaftarkan ke Central Registry!</span>
              </div>
            ) : (
              <form onSubmit={handleCreateAgent} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Agent ID Unik (contoh: finance_agent_02)</label>
                  <input
                    type="text"
                    required
                    value={agentId}
                    onChange={(e) => setAgentId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                    placeholder="agent_sales_bot"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Nama Tampilan Agen</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                    placeholder="Sales Order Approval Bot"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Penanggung Jawab (Human Owner)</label>
                  <input
                    type="text"
                    required
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                    placeholder="Divisi Sales & Marketing"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Batas Wewenang Finansial Otomatis (Rp)</label>
                  <input
                    type="number"
                    required
                    value={maxLimit}
                    onChange={(e) => setMaxLimit(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Deskripsi Tugas</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                    placeholder="Otomatisasi persetujuan diskon klien..."
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 glow-cyan"
                  >
                    Simpan Agen
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
