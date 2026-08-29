'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  Cpu, 
  Code2, 
  Plus, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Trash2, 
  Sliders, 
  ToggleLeft, 
  ToggleRight,
  Sparkles,
  RefreshCw,
  Layers
} from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

export interface DynamicPolicyRule {
  field: string;
  operator: string;
  value: any;
}

export interface DynamicPolicy {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  priority: number;
  match_type: string;
  rules: DynamicPolicyRule[];
  decision: string;
  reason: string;
  created_at: string;
}

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<DynamicPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [testPayload, setTestPayload] = useState(JSON.stringify({
    agent_id: 'agent_finance_01',
    action: 'execute_payment',
    target_system: 'Bank_API',
    context: {
      amount: 50000,
      recipient_account: 'rek_blacklist_01',
      is_after_hours: true
    }
  }, null, 2));
  const [testResult, setTestResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPolicyName, setNewPolicyName] = useState('');
  const [newPolicyDesc, setNewPolicyDesc] = useState('');
  const [newPolicyDecision, setNewPolicyDecision] = useState('REQUIRE_APPROVAL');
  const [newPolicyField, setNewPolicyField] = useState('action');
  const [newPolicyOperator, setNewPolicyOperator] = useState('EQUALS');
  const [newPolicyValue, setNewPolicyValue] = useState('wipe_database');
  const [newPolicyReason, setNewPolicyReason] = useState('Aksi pembersihan basis data dicegah oleh aturan OPA.');

  const fetchPolicies = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/policies`);
      if (res.ok) {
        const data = await res.json();
        setPolicies(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const handleToggle = async (policyId: string) => {
    try {
      await fetch(`${API_BASE_URL}/api/v1/policies/${policyId}/toggle`, {
        method: 'POST'
      });
      fetchPolicies();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (policyId: string) => {
    if (confirm('Hapus kebijakan dinamis ini dari sistem?')) {
      try {
        await fetch(`${API_BASE_URL}/api/v1/policies/${policyId}`, {
          method: 'DELETE'
        });
        fetchPolicies();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleTestPolicy = async () => {
    setTesting(true);
    try {
      const parsed = JSON.parse(testPayload);
      const res = await fetch(`${API_BASE_URL}/api/v1/guard/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed)
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err: any) {
      setTestResult({
        decision: 'ERROR',
        reason: `Format JSON tidak valid atau Gateway Offline: ${err.message}`
      });
    } finally {
      setTesting(false);
    }
  };

  const handleCreatePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    const newPol = {
      id: `pol_${Math.random().toString(36).substring(2, 9)}`,
      name: newPolicyName,
      description: newPolicyDesc,
      enabled: true,
      priority: 15,
      match_type: 'ALL',
      rules: [
        {
          field: newPolicyField,
          operator: newPolicyOperator,
          value: newPolicyValue
        }
      ],
      decision: newPolicyDecision,
      reason: newPolicyReason,
      created_at: new Date().toISOString()
    };

    try {
      await fetch(`${API_BASE_URL}/api/v1/policies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPol)
      });
      setShowAddModal(false);
      fetchPolicies();
      setNewPolicyName('');
      setNewPolicyDesc('');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar />

      <main className="flex-1 p-8 max-w-7xl mx-auto overflow-y-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
              <Cpu className="w-4 h-4" />
              <span>Dynamic Policy Engine &bull; OPA / JSON Declarative Format</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Dynamic Policy Engine (OPA Studio)</h1>
            <p className="text-xs text-slate-400 mt-1">
              Definisikan aturan tata kelola agen AI secara deklaratif runtime tanpa perlu kompilasi ulang kode atau restart server.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-2 glow-cyan transition-all self-start"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Aturan OPA Baru</span>
          </button>
        </div>

        {/* OPA Interactive Simulation Sandbox */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 glass-panel shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>Interactive OPA Policy Sandbox (Uji Aturan Terhadap Gateway)</span>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              Axum Policy Evaluator (:8000)
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="block text-slate-400 mb-1 text-[11px] font-sans font-semibold">
                Payload Uji Coba Agen (JSON):
              </label>
              <textarea
                value={testPayload}
                onChange={(e) => setTestPayload(e.target.value)}
                rows={7}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleTestPolicy}
                disabled={testing}
                className="mt-2 w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 glow-cyan transition-all"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{testing ? 'Mengevaluasi...' : 'Eksekusi Evaluasi OPA Sekarang'}</span>
              </button>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 text-[11px] font-sans font-semibold">
                Hasil Evaluasi Dynamic Policy:
              </label>
              {testResult ? (
                <div
                  className={`p-4 rounded-xl border h-[155px] overflow-y-auto space-y-2 text-xs font-mono ${
                    testResult.decision === 'BLOCK'
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                      : testResult.decision === 'REQUIRE_APPROVAL'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm uppercase">[{testResult.decision}]</span>
                    <span className="text-[10px] text-slate-400 font-sans">Audit ID: {testResult.audit_id}</span>
                  </div>
                  <p className="text-xs text-slate-200">{testResult.reason}</p>
                  {testResult.approval_id && (
                    <div className="text-[10px] text-amber-400 bg-slate-950 p-1.5 rounded border border-amber-500/30">
                      HOLD Ticket Generated: {testResult.approval_id}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 h-[155px] flex items-center justify-center text-slate-500 text-xs text-center font-sans">
                  Tekan tombol "Eksekusi Evaluasi OPA" untuk menguji kecocokan aturan secara langsung.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Policies List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              ● Daftar Aturan Deklaratif Aktif ({policies.length} Policies)
            </h2>
            <button
              onClick={fetchPolicies}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Refresh</span>
            </button>
          </div>

          <div className="grid gap-4">
            {policies.map((pol) => (
              <div
                key={pol.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 glass-panel shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-white text-sm">{pol.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                        pol.decision === 'BLOCK'
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                          : pol.decision === 'REQUIRE_APPROVAL'
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {pol.decision}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      ID: {pol.id}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">{pol.description}</p>

                  <div className="flex flex-wrap gap-2 text-xs font-mono pt-1">
                    {pol.rules.map((rule, rIdx) => (
                      <span
                        key={rIdx}
                        className="px-2.5 py-1 rounded bg-slate-950 text-cyan-300 border border-slate-800 text-[11px]"
                      >
                        <code>{rule.field}</code>{' '}
                        <span className="text-amber-400 font-bold">{rule.operator}</span>{' '}
                        <code className="text-slate-300">{JSON.stringify(rule.value)}</code>
                      </span>
                    ))}
                  </div>

                  <div className="text-[11px] text-slate-400 italic">
                    Pesan Alasan: "{pol.reason}"
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <button
                    onClick={() => handleToggle(pol.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all border flex items-center gap-1.5 ${
                      pol.enabled
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                        : 'bg-slate-800 text-slate-500 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    <span>{pol.enabled ? 'ACTIVE' : 'DISABLED'}</span>
                  </button>

                  <button
                    onClick={() => handleDelete(pol.id)}
                    className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Hapus Kebijakan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Tambah Kebijakan */}
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h3 className="font-bold text-white text-base">Tambah Aturan OPA / JSON Baru</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreatePolicy} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Nama Kebijakan</label>
                  <input
                    type="text"
                    required
                    value={newPolicyName}
                    onChange={(e) => setNewPolicyName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="Contoh: Intersepsi Perintah Terminal Berbahaya"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Deskripsi</label>
                  <textarea
                    value={newPolicyDesc}
                    onChange={(e) => setNewPolicyDesc(e.target.value)}
                    rows={2}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="Penjelasan latar belakang aturan wewenang ini..."
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Field Payload</label>
                    <select
                      value={newPolicyField}
                      onChange={(e) => setNewPolicyField(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                    >
                      <option value="action">action</option>
                      <option value="target_system">target_system</option>
                      <option value="agent_id">agent_id</option>
                      <option value="context.amount">context.amount</option>
                      <option value="context.recipient_account">context.recipient_account</option>
                      <option value="context.command">context.command</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Operator</label>
                    <select
                      value={newPolicyOperator}
                      onChange={(e) => setNewPolicyOperator(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                    >
                      <option value="EQUALS">EQUALS</option>
                      <option value="NOT_EQUALS">NOT_EQUALS</option>
                      <option value="CONTAINS">CONTAINS</option>
                      <option value="GREATER_THAN">GREATER_THAN</option>
                      <option value="LESS_THAN">LESS_THAN</option>
                      <option value="IN">IN</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Keputusan</label>
                    <select
                      value={newPolicyDecision}
                      onChange={(e) => setNewPolicyDecision(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                    >
                      <option value="BLOCK">BLOCK</option>
                      <option value="REQUIRE_APPROVAL">REQUIRE_APPROVAL</option>
                      <option value="ALLOW">ALLOW</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Nilai Pembanding (Value)</label>
                  <input
                    type="text"
                    required
                    value={newPolicyValue}
                    onChange={(e) => setNewPolicyValue(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                    placeholder="Contoh: wipe_database atau 500000"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Alasan Keputusan</label>
                  <input
                    type="text"
                    required
                    value={newPolicyReason}
                    onChange={(e) => setNewPolicyReason(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                    placeholder="Pesan yang diberikan saat aturan ini kena (triggered)"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                  >
                    Simpan Aturan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
