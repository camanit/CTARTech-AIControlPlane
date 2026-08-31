'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import AuthGuard from '@/components/AuthGuard';
import { 
  Workflow, 
  Zap, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  Plus, 
  Sliders, 
  Radio, 
  Lock, 
  BellRing,
  RotateCcw,
  Cpu
} from 'lucide-react';

interface PlaybookRule {
  id: string;
  name: string;
  trigger_condition: string;
  actions: string[];
  status: 'ACTIVE' | 'PAUSED';
  last_executed?: string;
  execution_count: number;
}

export default function PlaybooksPage() {
  const [playbooks, setPlaybooks] = useState<PlaybookRule[]>([
    {
      id: 'pb-01',
      name: 'Rogue Agent Immediate Containment & CISO Escalation',
      trigger_condition: 'Anomali Skor > 80% ATAU Honeytoken Terpicu',
      actions: [
        'Karantina Agen (Quarantine Agent)',
        'Putus Sesi Database Aktif (Terminate DB Sessions)',
        'Kirim Notifikasi Darurat ke WhatsApp CISO (+62 812-6000-6666)',
        'Catat Insiden Kritis ke Merkle Audit Log'
      ],
      status: 'ACTIVE',
      last_executed: '12 menit yang lalu',
      execution_count: 3
    },
    {
      id: 'pb-02',
      name: 'Destructive Command SQLi/Ransomware Auto-Rollback',
      trigger_condition: 'Terdeteksi Pola DROP TABLE / Mass File Encryption',
      actions: [
        'Blokir Eksekusi Instan (Tri-state BLOCK)',
        'Isolasi Node Worker AI Agent',
        'Trigger Immutable Snapshot Backup Verification',
        'Broadcast Alert ke Channel SecOps Telegram'
      ],
      status: 'ACTIVE',
      last_executed: 'Kemarin',
      execution_count: 1
    },
    {
      id: 'pb-03',
      name: 'SLA Approval Timeout Auto-Escalation',
      trigger_condition: 'Tiket HELD REQUIRE_APPROVAL Tidak Direspons > 15 Menit',
      actions: [
        'Eskalasi ke Superadmin / Deputy CISO',
        'Kirim Ringkasan Payload via Email Digest'
      ],
      status: 'ACTIVE',
      last_executed: 'Tidak pernah',
      execution_count: 0
    }
  ]);

  const [simulatedExecution, setSimulatedExecution] = useState<string | null>(null);

  const handleSimulatePlaybook = (name: string) => {
    setSimulatedExecution(`⚡ Playbook '${name}' berhasil dieksekusi secara otonom! Seluruh 4 aksi mitigasi tuntas dalam 42ms.`);
    setTimeout(() => setSimulatedExecution(null), 5000);
  };

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto overflow-y-auto w-full">
          {/* Header */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
                <Workflow className="w-4 h-4 text-cyan-400" />
                <span>Autonomous Remediation &amp; Self-Healing</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                Autonomous Incident Response Playbooks
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                Otomatisasi respons mitigasi insiden keamanan dalam hitungan milidetik. Sistem langsung mengisolasi agen, memutus sesi database, merotasi kunci, dan mengirim peringatan multi-saluran tanpa intervensi manual.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                <span>Playbook Engine: ACTIVE</span>
              </span>
            </div>
          </div>

          {/* Banner message */}
          {simulatedExecution && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-200 text-xs flex items-center justify-between shadow-2xl animate-pulse">
              <span className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{simulatedExecution}</span>
              </span>
            </div>
          )}

          {/* Telemetry Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 glass-panel">
              <div className="text-xs font-mono text-slate-400 uppercase">Active Playbooks</div>
              <div className="text-2xl font-extrabold text-cyan-400 mt-1">3 Playbooks</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Event-Driven Automation Active</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 glass-panel">
              <div className="text-xs font-mono text-emerald-400 uppercase">Avg Mitigation Time</div>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1">42 ms</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Sub-Second Containment</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 glass-panel">
              <div className="text-xs font-mono text-purple-400 uppercase">Total Auto Mitigations</div>
              <div className="text-2xl font-extrabold text-purple-400 mt-1">4 Actions</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Zero Human Lag in Breaches</div>
            </div>
          </div>

          {/* Playbooks Cards Grid */}
          <div className="space-y-4">
            {playbooks.map((pb) => (
              <div 
                key={pb.id}
                className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 glass-panel hover:border-slate-700 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-cyan-400 font-bold">{pb.id}</span>
                      <span className="text-base font-bold text-white">{pb.name}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold font-mono">
                        {pb.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Pemicu Kondisi: <strong className="text-amber-300 font-mono">{pb.trigger_condition}</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSimulatePlaybook(pb.name)}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 shrink-0"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Uji Eksekusi Playbook</span>
                  </button>
                </div>

                {/* Actions Pipeline */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                  <div className="text-slate-400 text-[11px] uppercase font-mono mb-2">Alur Tindakan Otomatis (Mitigation Pipeline):</div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {pb.actions.map((act, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-slate-200">
                        <span className="w-5 h-5 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-mono">{act}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <div>Terakhir Dieksekusi: {pb.last_executed}</div>
                  <div>Total Eksekusi: {pb.execution_count} kali</div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
