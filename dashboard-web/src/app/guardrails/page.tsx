'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { 
  ShieldAlert, 
  Lock, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  Sliders,
  Save,
  Radio
} from 'lucide-react';

interface GuardRule {
  id: string;
  name: string;
  pattern: string;
  severity: 'BLOCK' | 'REQUIRE_APPROVAL';
  description: string;
  enabled: boolean;
}

export default function GuardrailsPage() {
  const [rules, setRules] = useState<GuardRule[]>([
    {
      id: 'rule-01',
      name: 'Pencegahan Injeksi Shell & Terminal Destruktif',
      pattern: 'rm -rf, shutdown, format, bash -i, /bin/sh',
      severity: 'BLOCK',
      description: 'Menolak secara keras eksekusi perintah shell berbahaya di server.',
      enabled: true,
    },
    {
      id: 'rule-02',
      name: 'Kunci Ekspor Data Pelanggan (CRM/PII Exfiltration)',
      pattern: 'export_customer_data, dump_crm_users, download_pii',
      severity: 'REQUIRE_APPROVAL',
      description: 'Menahan aksi pembocoran data massal sampai disetujui CISO.',
      enabled: true,
    },
    {
      id: 'rule-03',
      name: 'Pencegahan Hapus Database & Modifikasi Skema',
      pattern: 'DROP TABLE, TRUNCATE, DELETE FROM users, ALTER TABLE',
      severity: 'BLOCK',
      description: 'Mencegah perintah SQL destruktif yang dapat melenyapkan rekaman.',
      enabled: true,
    },
    {
      id: 'rule-04',
      name: 'Eskalasi Hak Akses & Manipulasi Role',
      pattern: 'grant_admin, elevate_privileges, sudo, create_superuser',
      severity: 'REQUIRE_APPROVAL',
      description: 'Menahan setiap upaya pemberian hak istimewa baru ke agen lain.',
      enabled: true,
    },
  ]);

  const [testPayload, setTestPayload] = useState('rm -rf /var/data');
  const [testResult, setTestResult] = useState<any>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleToggleRule = (id: string) => {
    setRules(rules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  };

  const handleTestSimulation = () => {
    const p = testPayload.toLowerCase();
    const matched = rules.find((r) =>
      r.enabled && r.pattern.toLowerCase().split(',').some((kw) => p.includes(kw.trim()))
    );

    if (matched) {
      setTestResult({
        decision: matched.severity,
        ruleName: matched.name,
        reason: `[INTERCEPTED] Payload memicu pola aturan: '${matched.pattern}'`,
      });
    } else {
      setTestResult({
        decision: 'ALLOW',
        ruleName: 'None',
        reason: 'Payload aman dan tidak melanggar aturan guardrail runtime.',
      });
    }
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar />

      <main className="flex-1 p-8 max-w-6xl mx-auto overflow-y-auto space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-rose-400 uppercase tracking-wider mb-2">
            <ShieldAlert className="w-4 h-4" />
            <span>Destructive Action Blocker</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Runtime Guardrails &amp; Interceptor</h1>
          <p className="text-xs text-slate-400 mt-1">
            Definisikan pola aksi terlarang, pencegahan injeksi perintah shell, dan kunci data eksfiltrasi sebelum dieksekusi oleh AI Agent.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Aturan Guardrail berhasil diperbarui pada Runtime Gateway Core!</span>
          </div>
        )}

        {/* Live Guardrail Tester */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 glass-panel shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>Simulasi Evaluasi Payload Interceptor</span>
          </div>

          <div className="flex gap-3 text-xs">
            <input
              type="text"
              value={testPayload}
              onChange={(e) => setTestPayload(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-cyan-500"
              placeholder="Masukkan string payload perintah untuk diuji..."
            />
            <button
              onClick={handleTestSimulation}
              className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl flex items-center gap-2 glow-cyan transition-all"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Uji Intersepsi</span>
            </button>
          </div>

          {testResult && (
            <div
              className={`p-4 rounded-xl border text-xs font-mono flex items-center justify-between ${
                testResult.decision === 'BLOCK'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  : testResult.decision === 'REQUIRE_APPROVAL'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              }`}
            >
              <div>
                <strong className="text-sm font-bold uppercase">[{testResult.decision}]</strong>{' '}
                <span>{testResult.reason}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                Rule: {testResult.ruleName}
              </span>
            </div>
          )}
        </div>

        {/* Rules Table */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 glass-panel overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-800/60 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="font-bold text-white">Daftar Kebijakan Runtime Guardrail Aktif</span>
            <span className="font-mono text-slate-400 text-[11px]">NIST AI Risk Management Framework</span>
          </div>

          <div className="divide-y divide-slate-800">
            {rules.map((rule) => (
              <div key={rule.id} className="p-5 flex items-center justify-between gap-4 hover:bg-slate-800/20">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-sm text-white">{rule.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                        rule.severity === 'BLOCK'
                          ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                          : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {rule.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{rule.description}</p>
                  <div className="font-mono text-[11px] text-cyan-300 bg-slate-950 px-2.5 py-1 rounded inline-block border border-slate-800">
                    Pola Terdeteksi: {rule.pattern}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleRule(rule.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all border ${
                      rule.enabled
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                        : 'bg-slate-800 text-slate-500 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {rule.enabled ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 glow-cyan transition-all shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>Terapkan Aturan Guardrail</span>
          </button>
        </div>
      </main>
    </div>
  );
}
