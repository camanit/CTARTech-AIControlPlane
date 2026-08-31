'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import AuthGuard from '@/components/AuthGuard';
import { 
  ShieldAlert, 
  Sparkles, 
  KeyRound, 
  Database, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  RefreshCw, 
  Trash2, 
  Radio, 
  Zap, 
  Send,
  Lock,
  EyeOff
} from 'lucide-react';

interface HoneytokenItem {
  id: string;
  token_key: string;
  type: 'API_KEY' | 'DB_MOCK_ROW' | 'ENDPOINT';
  target_location: string;
  status: 'ARMED' | 'TRIGGERED';
  triggered_by?: string;
  triggered_at?: string;
}

export default function HoneytokensPage() {
  const [tokens, setTokens] = useState<HoneytokenItem[]>([
    {
      id: 'ht-01',
      token_key: 'ak_honey_live_99481a7b8e19',
      type: 'API_KEY',
      target_location: 'LLM Agent Context / Mock Env',
      status: 'ARMED'
    },
    {
      id: 'ht-02',
      token_key: 'decoy_cust_id_99999 (Sultan Saldo Rp 999 M)',
      type: 'DB_MOCK_ROW',
      target_location: 'Table: customer_vip_mock_shadow',
      status: 'ARMED'
    },
    {
      id: 'ht-03',
      token_key: 'https://api.gateway.internal/v1/mock/export_all_salaries',
      type: 'ENDPOINT',
      target_location: 'Tool Prompt Discovery Mock',
      status: 'ARMED'
    }
  ]);

  const [newTokenModal, setNewTokenModal] = useState(false);
  const [tokenType, setTokenType] = useState<'API_KEY' | 'DB_MOCK_ROW' | 'ENDPOINT'>('API_KEY');
  const [targetLocation, setTargetLocation] = useState('');
  const [tripwireAlert, setTripwireAlert] = useState<string | null>(null);

  // Generate a new honeytoken
  const handleCreateToken = () => {
    const randomHex = Math.random().toString(36).substring(2, 12);
    const newKey = tokenType === 'API_KEY' 
      ? `ak_honey_${randomHex}` 
      : tokenType === 'DB_MOCK_ROW'
      ? `decoy_record_${randomHex}`
      : `https://api.internal/v1/trap/${randomHex}`;

    const item: HoneytokenItem = {
      id: `ht-${Date.now()}`,
      token_key: newKey,
      type: tokenType,
      target_location: targetLocation || 'LLM Agent Memory Decoy',
      status: 'ARMED'
    };

    setTokens([item, ...tokens]);
    setNewTokenModal(false);
    setTargetLocation('');
  };

  // Simulate Rogue Agent Touching the Honeytoken
  const handleSimulateTripwire = (id: string) => {
    const updated = tokens.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: 'TRIGGERED' as const,
          triggered_by: 'agent_rogue_shadow_09',
          triggered_at: new Date().toLocaleTimeString()
        };
      }
      return t;
    });

    setTokens(updated);
    setTripwireAlert(`🚨 ZERO-FALSE-POSITIVE TRIPWIRE DIPICU! Agent 'agent_rogue_shadow_09' menyentuh Honeytoken '${id}'. Emergency Lockdown diaktifkan!`);
  };

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto overflow-y-auto w-full">
          {/* Header */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>AI Deception Tech &amp; Canary Defense</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                Honeytokens &amp; Honeypots Manager
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                Tanamkan kredensial umpan (*Canary Tokens*) di memori dan prompt AI Agent. Jika agen yang disusupi mencoba menyentuh umpan, sistem langsung memicu *Zero-False-Positive Emergency Lockdown*.
              </p>
            </div>

            <button
              onClick={() => setNewTokenModal(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20 shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Buat Honeytoken Baru</span>
            </button>
          </div>

          {/* Tripwire Alarm Banner */}
          {tripwireAlert && (
            <div className="mb-6 p-4 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-200 text-xs flex items-center justify-between shadow-2xl animate-pulse">
              <span className="flex items-center gap-2 font-bold">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>{tripwireAlert}</span>
              </span>
              <button
                onClick={() => setTripwireAlert(null)}
                className="text-xs bg-rose-900/60 px-3 py-1 rounded-lg hover:bg-rose-900 text-white font-mono"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Telemetry Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 glass-panel">
              <div className="text-xs font-mono text-slate-400 uppercase">Armed Canary Traps</div>
              <div className="text-2xl font-extrabold text-amber-400 mt-1">
                {tokens.filter(t => t.status === 'ARMED').length} Active Traps
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Siaga Menjebak Prompt Injection</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 glass-panel">
              <div className="text-xs font-mono text-rose-400 uppercase">Triggered Intrusions</div>
              <div className="text-2xl font-extrabold text-rose-400 mt-1">
                {tokens.filter(t => t.status === 'TRIGGERED').length} Incidents
              </div>
              <div className="text-[11px] text-rose-300/80 mt-0.5">100% High-Confidence Breach Alert</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 glass-panel">
              <div className="text-xs font-mono text-cyan-400 uppercase">Tripwire Response</div>
              <div className="text-2xl font-extrabold text-cyan-400 mt-1">Instant Lockdown</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Auto-Revoke + Broadcast Telegram/WA</div>
            </div>
          </div>

          {/* Honeytokens List */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 glass-panel overflow-hidden">
            <div className="p-4 bg-slate-800/50 border-b border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-white">Daftar Honeytoken Aktif ({tokens.length})</span>
              <span className="font-mono text-amber-400 text-[11px]">Deception Defense Protocol</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-700">
                  <tr>
                    <th className="p-3.5">ID &amp; Tipe Umpan</th>
                    <th className="p-3.5">Kunci / Endpoint Honeytoken</th>
                    <th className="p-3.5">Lokasi Penanaman</th>
                    <th className="p-3.5">Status Perisai</th>
                    <th className="p-3.5 text-right">Uji Tripwire Sandbox</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {tokens.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-800/40">
                      <td className="p-3.5">
                        <div className="font-mono font-bold text-slate-200">{t.id}</div>
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-amber-400">
                          {t.type}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-cyan-300 font-medium max-w-xs truncate">
                        {t.token_key}
                      </td>
                      <td className="p-3.5 text-slate-400 text-xs">
                        {t.target_location}
                      </td>
                      <td className="p-3.5">
                        {t.status === 'ARMED' ? (
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold font-mono flex items-center gap-1 w-fit">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                            ARMED_ACTIVE
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[10px] font-bold font-mono flex items-center gap-1 w-fit">
                            🚨 TRIGGERED BY {t.triggered_by} ({t.triggered_at})
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        {t.status === 'ARMED' && (
                          <button
                            onClick={() => handleSimulateTripwire(t.id)}
                            className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500 hover:text-white text-rose-300 border border-rose-500/40 text-[11px] font-bold transition-all"
                          >
                            Simulasikan Serangan (Trigger)
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal Form Buat Honeytoken Baru */}
          {newTokenModal && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span>Deploy New Canary Honeytoken</span>
                </h2>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Tipe Jebakan Honeytoken:</label>
                    <select
                      value={tokenType}
                      onChange={(e: any) => setTokenType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
                    >
                      <option value="API_KEY">Decoy API Key Token (ak_honey_...)</option>
                      <option value="DB_MOCK_ROW">Mock Database VIP Record</option>
                      <option value="ENDPOINT">Fake Restricted API Endpoint</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Lokasi Penanaman Umpan:</label>
                    <input
                      type="text"
                      placeholder="Contoh: LLM System Prompt / Mock Database Table"
                      value={targetLocation}
                      onChange={(e) => setTargetLocation(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 placeholder-slate-500"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end gap-2 text-xs">
                  <button
                    onClick={() => setNewTokenModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleCreateToken}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                  >
                    Tanamkan Honeytoken
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
