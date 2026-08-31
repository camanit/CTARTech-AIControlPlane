'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import AuthGuard from '@/components/AuthGuard';
import { 
  ShieldCheck, 
  Layers, 
  Flame, 
  Lock, 
  Eye, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  Play, 
  RefreshCw, 
  Globe2, 
  Server, 
  Cpu, 
  Sliders,
  Radio,
  Ban,
  Activity
} from 'lucide-react';

export default function WAFPage() {
  const [activeLayer, setActiveLayer] = useState<'layer7' | 'layer4' | 'layer3'>('layer7');

  // Layer 7 Configuration & Sandbox State
  const [rateLimitRps, setRateLimitRps] = useState(100);
  const [enableSqlSanitizer, setEnableSqlSanitizer] = useState(true);
  const [enableXssSanitizer, setEnableXssSanitizer] = useState(true);
  const [enableBolaFilter, setEnableBolaFilter] = useState(true);

  // Live Payload Inspector Sandbox
  const [testPayload, setTestPayload] = useState(
    '{"agent_id": "agent_finance_01", "query": "SELECT * FROM users WHERE id=1 OR 1=1; <script>alert(1)</script>"}'
  );
  const [inspectResult, setInspectResult] = useState<{
    status: 'CLEAN' | 'BLOCKED_ATTACK';
    threats_detected: string[];
    sanitized_output: string;
  } | null>(null);

  const handleInspectPayload = () => {
    const threats: string[] = [];
    let sanitized = testPayload;

    // Detect SQLi
    if (/(UNION\s+SELECT|OR\s+1=1|DROP\s+TABLE|--|;|EXEC\s*\()/i.test(testPayload)) {
      threats.push('SQL Injection (SQLi Pattern Detected)');
      sanitized = sanitized.replace(/(UNION\s+SELECT|OR\s+1=1|DROP\s+TABLE|--|;|EXEC\s*\()/gi, '[REDACTED_SQLI]');
    }

    // Detect XSS
    if (/(<script[\s\S]*?>[\s\S]*?<\/script>|onerror=|onload=|javascript:)/i.test(testPayload)) {
      threats.push('Cross-Site Scripting (XSS Injected Payload)');
      sanitized = sanitized.replace(/(<script[\s\S]*?>[\s\S]*?<\/script>|onerror=|onload=|javascript:)/gi, '[REDACTED_XSS]');
    }

    setInspectResult({
      status: threats.length > 0 ? 'BLOCKED_ATTACK' : 'CLEAN',
      threats_detected: threats,
      sanitized_output: sanitized
    });
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
                <Flame className="w-4 h-4 text-cyan-400" />
                <span>Edge &amp; Gateway Defense Layer</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                Web Application Firewall (WAF) &amp; Multi-Layer Defense
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                Perisai keamanan bertingkat (OSI Layer 3, 4, dan 7) untuk menyaring ancaman Anti-DDoS, brute force, eksploitasi BOLA, serta sanitasi payload berbahaya sebelum membebani server inti.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                <span>Edge WAF: SHIELDING</span>
              </span>
            </div>
          </div>

          {/* Layer Selector Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div 
              onClick={() => setActiveLayer('layer7')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                activeLayer === 'layer7' 
                  ? 'bg-cyan-950/30 border-cyan-500/60 shadow-lg shadow-cyan-500/10' 
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-cyan-400">OSI Layer 7</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                  ACTIVE
                </span>
              </div>
              <div className="font-bold text-white text-sm">Application &amp; Logic Defense</div>
              <div className="text-[11px] text-slate-400 mt-1">Anti-SQLi, XSS Sanitization, BOLA Filter &amp; Sliding Window Rate Limiting.</div>
            </div>

            <div 
              onClick={() => setActiveLayer('layer4')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                activeLayer === 'layer4' 
                  ? 'bg-cyan-950/30 border-cyan-500/60 shadow-lg shadow-cyan-500/10' 
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-cyan-400">OSI Layer 4</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                  ACTIVE
                </span>
              </div>
              <div className="font-bold text-white text-sm">Transport &amp; Connection Shield</div>
              <div className="text-[11px] text-slate-400 mt-1">SYN Cookies &amp; Tokio Connection Pool Exhaustion Protection.</div>
            </div>

            <div 
              onClick={() => setActiveLayer('layer3')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                activeLayer === 'layer3' 
                  ? 'bg-cyan-950/30 border-cyan-500/60 shadow-lg shadow-cyan-500/10' 
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-cyan-400">OSI Layer 3</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                  ACTIVE
                </span>
              </div>
              <div className="font-bold text-white text-sm">Network &amp; IP Access Lists</div>
              <div className="text-[11px] text-slate-400 mt-1">IP Spoofing defense &amp; Geographic Network ACL scrubbing.</div>
            </div>
          </div>

          {/* Layer 7 Deep Configuration & Interactive Inspector */}
          {activeLayer === 'layer7' && (
            <div className="space-y-6">
              {/* Configuration Toggles */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 glass-panel">
                <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>Layer 7 WAF Security Controls &amp; Rate Limiting</span>
                </h2>

                <div className="grid md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">Anti-DDoS Sliding Window Rate Limiter</div>
                      <div className="text-slate-400 text-[11px] mt-0.5">Batas maksimum request per IP / Tenant ID</div>
                    </div>
                    <select
                      value={rateLimitRps}
                      onChange={(e) => setRateLimitRps(Number(e.target.value))}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-cyan-400 font-mono font-bold"
                    >
                      <option value={50}>50 Req / Detik</option>
                      <option value={100}>100 Req / Detik</option>
                      <option value={500}>500 Req / Detik</option>
                      <option value={1000}>1.000 Req / Detik</option>
                    </select>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">Deep Payload Sanitization (Anti-SQLi &amp; XSS)</div>
                      <div className="text-slate-400 text-[11px] mt-0.5">Filter pola injeksi otomatis sebelum commit ke database</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enableSqlSanitizer}
                        onChange={(e) => setEnableSqlSanitizer(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Interactive Live WAF Inspector Sandbox */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 glass-panel">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Eye className="w-4 h-4 text-cyan-400" />
                      <span>Live WAF Payload Threat Inspector (Sandbox)</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Uji coba respons gateway WAF terhadap payload yang dicurigai menyusupkan SQL Injection atau XSS script.
                    </p>
                  </div>

                  <button
                    onClick={handleInspectPayload}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 glow-cyan transition-all shrink-0"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Inspeksi Payload WAF</span>
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono text-slate-400 mb-1.5 block">
                      Inbound Raw Payload Input:
                    </label>
                    <textarea
                      value={testPayload}
                      onChange={(e) => setTestPayload(e.target.value)}
                      rows={4}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-cyan-400 mb-1.5 block">
                      WAF Decision &amp; Scrubbed Output:
                    </label>
                    <div className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono h-[86px] overflow-y-auto leading-relaxed">
                      {inspectResult ? (
                        inspectResult.status === 'BLOCKED_ATTACK' ? (
                          <div className="text-rose-400 space-y-1">
                            <div className="font-bold flex items-center gap-1.5 text-rose-300">
                              <Ban className="w-3.5 h-3.5" />
                              <span>THREAT INTERCEPTED &amp; SCRUBBED:</span>
                            </div>
                            <div className="text-[11px] text-slate-300">{inspectResult.sanitized_output}</div>
                          </div>
                        ) : (
                          <div className="text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Payload bersih &bull; Lolos Evaluasi WAF (PASS)</span>
                          </div>
                        )
                      ) : (
                        <span className="text-slate-500">Klik &quot;Inspeksi Payload WAF&quot; untuk menguji...</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Layer 4 & Layer 3 Info Displays */}
          {activeLayer === 'layer4' && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 glass-panel space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                <span>Layer 4 Transport Protection (SYN Cookies &amp; Connection Pooling)</span>
              </h2>
              <p className="text-xs text-slate-400">
                Gateway dibangun di atas Rust async runtime (**Tokio 1.38 + Hyper**). Mendukung perlindungan mitigasi TCP exhaustion dan connection pooling limit 10.000 concurrent sockets.
              </p>
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs text-cyan-300 space-y-1">
                <div>TCP SYN Backlog Capacity: 65,535 Connections</div>
                <div>Connection Timeout: 5000ms</div>
                <div>Keep-Alive Idle: 30s</div>
                <div>Status: ACTIVE_GUARDED</div>
              </div>
            </div>
          )}

          {activeLayer === 'layer3' && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 glass-panel space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-cyan-400" />
                <span>Layer 3 Network ACL &amp; Reverse Proxy Filtering</span>
              </h2>
              <p className="text-xs text-slate-400">
                Penyaringan paket IP berbahaya, mitigasi ICMP flood, dan integrasi whitelist IP / VPC korporasi.
              </p>
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs text-emerald-300 space-y-1">
                <div>Network Scrubbing Rule: Default Drop Spoofed Headers</div>
                <div>Reverse Proxy Header Validation: Strict X-Forwarded-For &amp; CF-Connecting-IP</div>
                <div>Status: ENFORCED</div>
              </div>
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
