pub fn render_dashboard_html() -> &'static str {
    r#"<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CTARTech-AIControlPlane | ITCowboy Guard</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-dark: #090d16;
            --bg-card: #0f172a;
            --bg-card-hover: #1e293b;
            --border: #1e293b;
            --border-highlight: #334155;
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
            --accent-cyan: #06b6d4;
            --accent-orange: #f97316;
            --accent-green: #10b981;
            --accent-red: #ef4444;
            --accent-yellow: #f59e0b;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            background-color: var(--bg-dark);
            color: var(--text-main);
            font-family: 'Plus Jakarta Sans', sans-serif;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        /* Top Navigation */
        .navbar {
            height: 68px;
            background: rgba(15, 23, 42, 0.85);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid var(--border);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 2rem;
            position: sticky;
            top: 0;
            z-index: 50;
        }
        .nav-brand {
            display: flex;
            align-items: center;
            gap: 0.85rem;
        }
        .logo-shield {
            width: 38px;
            height: 38px;
            background: linear-gradient(135deg, #06b6d4, #3b82f6);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.25rem;
            font-weight: 800;
            color: white;
            box-shadow: 0 0 20px rgba(6, 182, 212, 0.35);
        }
        .brand-title {
            font-size: 1.1rem;
            font-weight: 700;
            letter-spacing: -0.02em;
        }
        .brand-subtitle {
            font-size: 0.75rem;
            color: var(--accent-cyan);
            font-family: 'JetBrains Mono', monospace;
            font-weight: 600;
        }
        .nav-pills {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        .pill {
            padding: 0.35rem 0.85rem;
            border-radius: 9999px;
            font-size: 0.78rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 0.4rem;
        }
        .pill-active {
            background: rgba(16, 185, 129, 0.15);
            color: var(--accent-green);
            border: 1px solid rgba(16, 185, 129, 0.3);
        }
        .pill-tier {
            background: rgba(249, 115, 22, 0.15);
            color: var(--accent-orange);
            border: 1px solid rgba(249, 115, 22, 0.3);
            font-family: 'JetBrains Mono', monospace;
        }
        .pulse-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--accent-green);
            box-shadow: 0 0 8px var(--accent-green);
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0% { transform: scale(0.95); opacity: 0.8; }
            50% { transform: scale(1.3); opacity: 1; }
            100% { transform: scale(0.95); opacity: 0.8; }
        }
        /* Main Layout */
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 2rem;
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }
        /* Stats Grid */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 1.25rem;
        }
        .stat-card {
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 14px;
            padding: 1.35rem;
            position: relative;
            overflow: hidden;
            transition: all 0.2s ease;
        }
        .stat-card:hover {
            border-color: var(--border-highlight);
            transform: translateY(-2px);
        }
        .stat-label {
            font-size: 0.82rem;
            color: var(--text-muted);
            font-weight: 500;
            margin-bottom: 0.5rem;
        }
        .stat-val {
            font-size: 2rem;
            font-weight: 800;
            letter-spacing: -0.03em;
            font-family: 'JetBrains Mono', monospace;
        }
        .color-blue { color: #38bdf8; }
        .color-green { color: var(--accent-green); }
        .color-yellow { color: var(--accent-yellow); }
        .color-red { color: var(--accent-red); }
        .color-purple { color: #c084fc; }

        /* Sections */
        .section-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1rem;
        }
        .section-title {
            font-size: 1.15rem;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .badge-count {
            background: rgba(245, 158, 11, 0.2);
            color: var(--accent-yellow);
            padding: 0.2rem 0.6rem;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 700;
        }
        .card {
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 14px;
            overflow: hidden;
        }
        /* Table Styles */
        table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
            font-size: 0.85rem;
        }
        th {
            background: rgba(30, 41, 59, 0.6);
            padding: 0.85rem 1.25rem;
            font-weight: 600;
            color: var(--text-muted);
            text-transform: uppercase;
            font-size: 0.72rem;
            letter-spacing: 0.05em;
            border-bottom: 1px solid var(--border);
        }
        td {
            padding: 1rem 1.25rem;
            border-bottom: 1px solid var(--border);
            vertical-align: middle;
        }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: rgba(30, 41, 59, 0.35); }
        .mono {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.8rem;
        }
        /* Status Badges */
        .status-badge {
            display: inline-block;
            padding: 0.25rem 0.65rem;
            border-radius: 6px;
            font-size: 0.72rem;
            font-weight: 700;
            font-family: 'JetBrains Mono', monospace;
        }
        .status-ALLOW { background: rgba(16, 185, 129, 0.15); color: var(--accent-green); border: 1px solid rgba(16, 185, 129, 0.3); }
        .status-REQUIRE_APPROVAL { background: rgba(245, 158, 11, 0.15); color: var(--accent-yellow); border: 1px solid rgba(245, 158, 11, 0.3); }
        .status-BLOCK { background: rgba(239, 68, 68, 0.15); color: var(--accent-red); border: 1px solid rgba(239, 68, 68, 0.3); }
        .status-ACTIVE { background: rgba(6, 182, 212, 0.15); color: var(--accent-cyan); border: 1px solid rgba(6, 182, 212, 0.3); }
        .status-SUSPENDED { background: rgba(239, 68, 68, 0.15); color: var(--accent-red); border: 1px solid rgba(239, 68, 68, 0.3); }

        /* Action Buttons */
        .btn {
            padding: 0.4rem 0.85rem;
            border-radius: 6px;
            font-size: 0.78rem;
            font-weight: 600;
            cursor: pointer;
            border: none;
            transition: all 0.15s ease;
        }
        .btn-approve {
            background: var(--accent-green);
            color: #042f2e;
        }
        .btn-approve:hover { background: #059669; }
        .btn-reject {
            background: rgba(239, 68, 68, 0.2);
            color: var(--accent-red);
            border: 1px solid rgba(239, 68, 68, 0.4);
        }
        .btn-reject:hover { background: rgba(239, 68, 68, 0.3); }
        .btn-toggle {
            background: rgba(255, 255, 255, 0.08);
            color: var(--text-main);
            border: 1px solid var(--border);
        }
        .btn-toggle:hover { background: rgba(255, 255, 255, 0.15); }
        .empty-placeholder {
            padding: 2.5rem;
            text-align: center;
            color: var(--text-muted);
            font-size: 0.9rem;
        }
        /* Footer */
        footer {
            margin-top: auto;
            border-top: 1px solid var(--border);
            padding: 1.5rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.8rem;
            color: var(--text-muted);
        }
    </style>
</head>
<body>
    <!-- Top Navigation -->
    <nav class="navbar">
        <div class="nav-brand">
            <div class="logo-shield">🛡️</div>
            <div>
                <div class="brand-title">CTARTech-AIControlPlane</div>
                <div class="brand-subtitle">ITCOWBOY GUARD // RUST RUNTIME SECURITY GATEWAY</div>
            </div>
        </div>
        <div class="nav-pills">
            <div class="pill pill-active">
                <div class="pulse-dot"></div>
                GATEWAY ACTIVE (PORT 8000)
            </div>
            <div class="pill pill-tier" id="licenseBadge">
                TIER: ENTERPRISE
            </div>
        </div>
    </nav>

    <!-- Main Container -->
    <div class="container">
        <!-- Stats Grid -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-label">Total Action Evaluated</div>
                <div class="stat-val color-blue" id="statEvaluations">0</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Allowed (Safe Autonomous)</div>
                <div class="stat-val color-green" id="statAllowed">0</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Pending Approval (Held)</div>
                <div class="stat-val color-yellow" id="statPending">0</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Blocked (Policy Violation)</div>
                <div class="stat-val color-red" id="statBlocked">0</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Active Agents Registry</div>
                <div class="stat-val color-purple" id="statAgents">0</div>
            </div>
        </div>

        <!-- Section 1: Pending Human-in-the-Loop Approvals -->
        <div>
            <div class="section-header">
                <div class="section-title">
                    <span>⚠️ Human-in-the-Loop Action Queue</span>
                    <span class="badge-count" id="pendingCountBadge">0 Pending</span>
                </div>
            </div>
            <div class="card">
                <table>
                    <thead>
                        <tr>
                            <th>Approval ID</th>
                            <th>Agent ID / Name</th>
                            <th>Action Target</th>
                            <th>Context Details</th>
                            <th>Risk Trigger Reason</th>
                            <th>Decision Action</th>
                        </tr>
                    </thead>
                    <tbody id="pendingTableBody">
                        <tr><td colspan="6" class="empty-placeholder">Tidak ada aksi agen yang sedang tertahan. Sistem berjalan aman!</td></tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Section 2: Real-Time Audit Trail -->
        <div>
            <div class="section-header">
                <div class="section-title">
                    <span>📜 Real-Time Audit Trail & Observability</span>
                </div>
            </div>
            <div class="card">
                <table>
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Audit ID</th>
                            <th>Agent ID</th>
                            <th>Action</th>
                            <th>Target System</th>
                            <th>Decision</th>
                            <th>Reason / Policy Evaluated</th>
                        </tr>
                    </thead>
                    <tbody id="auditTableBody">
                        <tr><td colspan="7" class="empty-placeholder">Memuat data audit trail...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Section 3: Registered AI Agents -->
        <div>
            <div class="section-header">
                <div class="section-title">
                    <span>🤖 Central AI Agent Registry & Kill-Switch</span>
                </div>
            </div>
            <div class="card">
                <table>
                    <thead>
                        <tr>
                            <th>Agent ID</th>
                            <th>Name</th>
                            <th>Owner</th>
                            <th>Max Auto Limit</th>
                            <th>Status</th>
                            <th>Emergency Kill-Switch</th>
                        </tr>
                    </thead>
                    <tbody id="agentsTableBody">
                        <tr><td colspan="6" class="empty-placeholder">Memuat daftar agen...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer>
        <div>CTARTech-AIControlPlane &bull; Public License: GNU AGPLv3 &bull; Powered by Rust & Axum</div>
        <div>Zero-Trust Identity, Authority, and Runtime Accountability for AI Agents</div>
    </footer>

    <!-- Real-time Polling & Actions Script -->
    <script>
        async function fetchStats() {
            try {
                const res = await fetch('/api/v1/stats');
                if (!res.ok) return;
                const data = await res.json();
                document.getElementById('statEvaluations').innerText = data.total_evaluations.toLocaleString();
                document.getElementById('statAllowed').innerText = data.total_allowed.toLocaleString();
                document.getElementById('statPending').innerText = data.total_pending.toLocaleString();
                document.getElementById('statBlocked').innerText = data.total_blocked.toLocaleString();
                document.getElementById('statAgents').innerText = data.total_agents.toLocaleString();
                document.getElementById('licenseBadge').innerText = 'TIER: ' + data.license_tier;
                document.getElementById('pendingCountBadge').innerText = data.total_pending + ' Pending';
            } catch (e) {
                console.error(e);
            }
        }

        async function fetchPending() {
            try {
                const res = await fetch('/api/v1/approval/pending');
                if (!res.ok) return;
                const items = await res.json();
                const tbody = document.getElementById('pendingTableBody');
                if (items.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="6" class="empty-placeholder">Tidak ada aksi agen yang sedang tertahan. Sistem berjalan aman!</td></tr>';
                    return;
                }
                tbody.innerHTML = items.map(it => `
                    <tr>
                        <td class="mono" style="color:var(--accent-yellow); font-weight:600;">${it.approval_id}</td>
                        <td><strong>${it.agent_name}</strong><br><span class="mono" style="color:var(--text-muted);font-size:0.75rem;">${it.agent_id}</span></td>
                        <td><span class="mono">${it.action}</span><br><span style="color:var(--text-muted);font-size:0.75rem;">System: ${it.target_system}</span></td>
                        <td class="mono" style="font-size:0.75rem; max-width:260px; overflow:hidden; text-overflow:ellipsis;">${JSON.stringify(it.context)}</td>
                        <td style="color:#fcd34d; font-size:0.8rem;">${it.reason}</td>
                        <td>
                            <div style="display:flex; gap:0.5rem;">
                                <button class="btn btn-approve" onclick="resolveApproval('${it.approval_id}', 'APPROVE')">Approve</button>
                                <button class="btn btn-reject" onclick="resolveApproval('${it.approval_id}', 'REJECT')">Reject</button>
                            </div>
                        </td>
                    </tr>
                `).join('');
            } catch (e) {
                console.error(e);
            }
        }

        async function fetchAuditLogs() {
            try {
                const res = await fetch('/api/v1/audit/logs');
                if (!res.ok) return;
                const logs = await res.json();
                const tbody = document.getElementById('auditTableBody');
                if (logs.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="7" class="empty-placeholder">Belum ada aktivitas audit log.</td></tr>';
                    return;
                }
                tbody.innerHTML = logs.slice(-15).reverse().map(l => {
                    const timeStr = new Date(l.timestamp).toLocaleTimeString();
                    return `
                        <tr>
                            <td class="mono" style="color:var(--text-muted);">${timeStr}</td>
                            <td class="mono" style="font-weight:600;">${l.audit_id}</td>
                            <td class="mono">${l.agent_id}</td>
                            <td class="mono">${l.action}</td>
                            <td>${l.target_system}</td>
                            <td><span class="status-badge status-${l.decision}">${l.decision}</span></td>
                            <td style="color:var(--text-muted); font-size:0.8rem;">${l.reason}</td>
                        </tr>
                    `;
                }).join('');
            } catch (e) {
                console.error(e);
            }
        }

        async function fetchAgents() {
            try {
                const res = await fetch('/api/v1/agents');
                if (!res.ok) return;
                const agents = await res.json();
                const tbody = document.getElementById('agentsTableBody');
                tbody.innerHTML = agents.map(a => `
                    <tr>
                        <td class="mono" style="font-weight:600;">${a.agent_id}</td>
                        <td>${a.name}</td>
                        <td>${a.owner}</td>
                        <td class="mono">Rp ${a.max_limit.toLocaleString()}</td>
                        <td><span class="status-badge status-${a.status}">${a.status}</span></td>
                        <td>
                            <button class="btn btn-toggle" onclick="toggleAgentStatus('${a.agent_id}', '${a.status}')">
                                ${a.status === 'ACTIVE' ? '🛑 Kill (Suspend)' : '✅ Restore'}
                            </button>
                        </td>
                    </tr>
                `).join('');
            } catch (e) {
                console.error(e);
            }
        }

        async function resolveApproval(approvalId, decision) {
            const approver = prompt("Masukkan nama/ID Anda sebagai Approver:", "CISO_Admin");
            if (!approver) return;
            const res = await fetch('/api/v1/guard/resolve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    approval_id: approvalId,
                    decision: decision,
                    approver: approver,
                    note: 'Resolved via Web Dashboard'
                })
            });
            if (res.ok) {
                refreshAll();
            } else {
                alert('Gagal memproses persetujuan!');
            }
        }

        async function toggleAgentStatus(agentId, currentStatus) {
            const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
            if (!confirm(`Ubah status wewenang agen ${agentId} menjadi ${nextStatus}?`)) return;
            const res = await fetch(`/api/v1/agents/${agentId}/status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: nextStatus })
            });
            if (res.ok) {
                refreshAll();
            }
        }

        function refreshAll() {
            fetchStats();
            fetchPending();
            fetchAuditLogs();
            fetchAgents();
        }

        // Initial Load & Auto Refresh interval
        refreshAll();
        setInterval(refreshAll, 3000);
    </script>
</body>
</html>"#
}
