'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import AuthGuard from '@/components/AuthGuard';
import { 
  ShieldAlert, 
  Activity, 
  UserCheck, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Lock, 
  Unlock, 
  Sliders, 
  Eye, 
  Database,
  Radio,
  Zap,
  TrendingUp,
  Cpu,
  Clock
} from 'lucide-react';
import { getAgents, AgentRecord } from '@/lib/api';

interface AnomalyProfile {
  agent_id: string;
  name: string;
  anomaly_score: number; // 0 to 100
  status: 'NORMAL' | 'SUSPICIOUS' | 'CRITICAL_ANOMALY';
  normal_qps: number;
  current_qps: number;
  off_hours_calls: number;
  sensitive_target_access: string[];
  last_anomaly_detected: string;
  threat_type: string;
}

export default function ITDRPage() {
  const [agents, setAgents] = useState<AgentRecord[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'CRITICAL' | 'SUSPICIOUS'>('ALL');
  const [quarantinedAgents, setQuarantinedAgents] = useState<string[]>([]);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Mock initial behavioral baseline & ITDR profiles
  const [profiles, setProfiles] = useState<AnomalyProfile[]>([
    {
      agent_id: 'agent_finance_01',
      name: 'Finance Payment & Refund Agent',
      anomaly_score: 88,
      status: 'CRITICAL_ANOMALY',
      normal_qps: 12,
      current_qps: 420,
      off_hours_calls: 34,
      sensitive_target_access: ['core_banking_db', 'payment_gateway_prod', 'customer_pii_vault'],
      last_anomaly_detected: '2 menit yang lalu',
      threat_type: 'Velocity Spike & Potential Session Hijacking'
    },
    {
      agent_id: 'agent_hr_compliance',
      name: 'HR & Payroll Assistant',
      anomaly_score: 62,
      status: 'SUSPICIOUS',
      normal_qps: 5,
      current_qps: 45,
      off_hours_calls: 12,
      sensitive_target_access: ['payroll_records', 'tax_id_repository'],
      last_anomaly_detected: '14 menit yang lalu',
      threat_type: 'Off-Hours Sensitive PII Query'
    },
    {
      agent_id: 'agent_support_bot',
      name: 'Customer Support LLM Planner',
      anomaly_score: 8,
      status: 'NORMAL',
      normal_qps: 85,
      current_qps: 90,
      off_hours_calls: 0,
      sensitive_target_access: ['knowledge_base_public', 'faq_vector_index'],
      last_anomaly_detected: 'Tidak ada anomali',
      threat_type: 'Baseline Compliant'
    },
    {
      agent_id: 'agent_crm_sync',
      name: 'Enterprise CRM Sync Worker',
      anomaly_score: 14,
      status: 'NORMAL',
      normal_qps: 30,
      current_qps: 32,
      off_hours_calls: 2,
      sensitive_target_access: ['crm_leads_table'],
      last_anomaly_detected: 'Tidak ada anomali',
      threat_type: 'Baseline Compliant'
    }
  ]);

  useEffect(() => {
    getAgents().then(setAgents);
  }, []);

  const handleQuarantine = (agentId: string) => {
    if (!quarantinedAgents.includes(agentId)) {
      setQuarantinedAgents([...quarantinedAgents, agentId]);
      setActionMessage(`AI Agent '${agentId}' berhasil diisolasi (Quarantined) dan wewenang runtime dicabut!`);
    } else {
      setQuarantinedAgents(quarantinedAgents.filter(id => id !== agentId));
      setActionMessage(`Isolasi AI Agent '${agentId}' telah dicabut. Status kembali aktif.`);
    }
    setTimeout(() => setActionMessage(null), 4000);
  };

  const filteredProfiles = profiles.filter(p => {
    if (filterSeverity === 'CRITICAL') return p.status === 'CRITICAL_ANOMALY';
    if (filterSeverity === 'SUSPICIOUS') return p.status === 'SUSPICIOUS';
    return true;
  });

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto overflow-y-auto w-full">
          {/* Header */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-purple-400 uppercase tracking-wider mb-1">
                <Radio className="w-4 h-4 text-purple-400 animate-pulse" />
                <span>Identity Threat Detection &amp; Response (ITDR)</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                AI-ITDR &amp; Behavioral Anomaly Engine
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                Pemantauan profil perilaku Non-Human Identity (NHI) &amp; Agen AI secara real-time untuk mendeteksi pembajakan sesi, eskalasi hak istimewa, dan eksfiltrasi data.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
                <span>ITDR Sentry: ACTIVE</span>
              </span>
            </div>
          </div>

          {/* Action Notification Banner */}
          {actionMessage && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between shadow-lg">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{actionMessage}</span>
              </span>
            </div>
          )}

          {/* Telemetry Quick Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 glass-panel">
              <div className="text-xs font-mono text-slate-400 uppercase">Monitored NHI Agents</div>
              <div className="text-2xl font-extrabold text-white mt-1">4 Active Agents</div>
              <div className="text-[11px] text-slate-500 mt-0.5">100% Behavioral Baseline Coverage</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 glass-panel">
              <div className="text-xs font-mono text-rose-400 uppercase">Critical Anomalies</div>
              <div className="text-2xl font-extrabold text-rose-400 mt-1">1 Agent Risk</div>
              <div className="text-[11px] text-rose-300/80 mt-0.5">Velocity Spike (420 QPS)</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 glass-panel">
              <div className="text-xs font-mono text-amber-400 uppercase">Suspicious Deviations</div>
              <div className="text-2xl font-extrabold text-amber-400 mt-1">1 Deviation</div>
              <div className="text-[11px] text-amber-300/80 mt-0.5">Off-Hours Sensitive PII Query</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 glass-panel">
              <div className="text-xs font-mono text-cyan-400 uppercase">Quarantined NHI</div>
              <div className="text-2xl font-extrabold text-cyan-400 mt-1">{quarantinedAgents.length} Agents</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Zero-Trust Auto-Containment</div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 glass-panel mb-6 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Filter Tingkat Risiko:</span>
              <button
                onClick={() => setFilterSeverity('ALL')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  filterSeverity === 'ALL' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Semua ({profiles.length})
              </button>
              <button
                onClick={() => setFilterSeverity('CRITICAL')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  filterSeverity === 'CRITICAL' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Kritis (1)
              </button>
              <button
                onClick={() => setFilterSeverity('SUSPICIOUS')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  filterSeverity === 'SUSPICIOUS' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Mencurigakan (1)
              </button>
            </div>

            <div className="text-xs text-slate-400 font-mono">
              Algoritma: Dynamic Sliding Window Exponential Moving Average (EMA)
            </div>
          </div>

          {/* Agent Behavioral Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProfiles.map((p) => {
              const isQuarantined = quarantinedAgents.includes(p.agent_id);

              return (
                <div 
                  key={p.agent_id}
                  className={`p-6 rounded-2xl border transition-all ${
                    isQuarantined
                      ? 'bg-slate-950/90 border-slate-800 opacity-60'
                      : p.status === 'CRITICAL_ANOMALY'
                      ? 'bg-rose-950/10 border-rose-500/50 shadow-lg shadow-rose-500/5'
                      : p.status === 'SUSPICIOUS'
                      ? 'bg-amber-950/10 border-amber-500/40'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-base">{p.name}</span>
                        {isQuarantined && (
                          <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[10px] font-mono font-bold">
                            QUARANTINED
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-xs text-cyan-400 mt-0.5">{p.agent_id}</div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-mono text-slate-400">Anomaly Score</div>
                      <div className={`text-xl font-extrabold font-mono mt-0.5 ${
                        p.anomaly_score > 70 ? 'text-rose-400' : p.anomaly_score > 40 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {p.anomaly_score}%
                      </div>
                    </div>
                  </div>

                  {/* Threat Description */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs mb-4">
                    <div className="text-slate-400 font-medium">Diagnosa Ancaman:</div>
                    <div className="text-white font-semibold mt-0.5">{p.threat_type}</div>
                    <div className="text-[10px] text-slate-500 mt-1">Terdeteksi: {p.last_anomaly_detected}</div>
                  </div>

                  {/* Behavioral Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="text-slate-400 text-[11px]">Baseline Normal:</div>
                      <div className="text-slate-200 font-mono font-bold mt-0.5">{p.normal_qps} QPS</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="text-slate-400 text-[11px]">Trafik Saat Ini:</div>
                      <div className={`font-mono font-bold mt-0.5 ${p.current_qps > p.normal_qps * 3 ? 'text-rose-400' : 'text-slate-200'}`}>
                        {p.current_qps} QPS
                      </div>
                    </div>
                  </div>

                  {/* Target Systems Touched */}
                  <div className="mb-4">
                    <div className="text-xs text-slate-400 mb-1.5">Sistem Target yang Diakses:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {p.sensitive_target_access.map((sys, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300"
                        >
                          {sys}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <div className="text-[11px] text-slate-400">
                      {isQuarantined ? 'Akses diblokir sementara' : 'Sistem mengevaluasi wewenang'}
                    </div>

                    <button
                      onClick={() => handleQuarantine(p.agent_id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isQuarantined
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                          : 'bg-rose-500 hover:bg-rose-400 text-white shadow-md shadow-rose-500/20'
                      }`}
                    >
                      {isQuarantined ? (
                        <>
                          <Unlock className="w-3.5 h-3.5" />
                          <span>Cabut Karantina</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Karantina Agen (Quarantine)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
