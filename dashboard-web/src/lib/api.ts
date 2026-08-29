export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface SystemStats {
  total_evaluations: number;
  total_allowed: number;
  total_blocked: number;
  total_require_approval: number;
  total_pending: number;
  total_agents: number;
  quota_used: number;
  quota_limit: number;
  license_tier: string;
  org_name: string;
}

export interface AgentRecord {
  agent_id: string;
  name: string;
  owner: string;
  max_limit: number;
  status: 'ACTIVE' | 'SUSPENDED' | 'RETIRED';
  description: string;
  created_at: string;
}

export interface AuditLogItem {
  audit_id: string;
  timestamp: string;
  agent_id: string;
  org: string;
  action: string;
  target_system: string;
  decision: 'ALLOW' | 'REQUIRE_APPROVAL' | 'BLOCK' | string;
  reason: string;
  context: any;
  acting_for_user_id?: string;
  session_id?: string;
}

export interface PendingApprovalItem {
  approval_id: string;
  audit_id: string;
  agent_id: string;
  agent_name: string;
  action: string;
  target_system: string;
  reason: string;
  context: any;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at: string;
}

export interface NotificationSettings {
  whatsapp: {
    enabled: boolean;
    apiUrl: string;
    apiKey: string;
    targetNumber: string;
  };
  sms: {
    enabled: boolean;
    apiUrl: string;
    apiKey: string;
    senderId: string;
  };
  email: {
    enabled: boolean;
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPass: string;
    adminEmail: string;
  };
}

export interface TenantData {
  id: string;
  name: string;
  adminEmail: string;
  tier: 'Starter' | 'Professional' | 'Enterprise' | 'Government';
  quota: number;
  quotaUsed: number;
  status: 'ACTIVE' | 'SUSPENDED';
  licenseKey: string;
  registeredAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  quota: string;
  description: string;
  popular?: boolean;
  features: string[];
}

// 1. Fetch Stats from Rust Gateway
export async function getStats(): Promise<SystemStats> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/stats`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      total_evaluations: 1240,
      total_allowed: 1180,
      total_blocked: 12,
      total_require_approval: 48,
      total_pending: 2,
      total_agents: 4,
      quota_used: 1240,
      quota_limit: 1000000,
      license_tier: 'ENTERPRISE',
      org_name: 'PT CTARTech Global',
    };
  }
}

// 2. Fetch Audit Logs
export async function getAuditLogs(): Promise<AuditLogItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/audit/logs`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return [];
  }
}

// 3. Fetch Pending Approvals
export async function getPendingApprovals(): Promise<PendingApprovalItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/approval/pending`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return [];
  }
}

// 4. Resolve Human Approval
export async function resolveApproval(approvalId: string, decision: 'APPROVE' | 'REJECT', approver: string, note: string) {
  const res = await fetch(`${API_BASE_URL}/api/v1/guard/resolve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      approval_id: approvalId,
      decision,
      approver,
      note,
    }),
  });
  if (!res.ok) throw new Error('Gagal memproses persetujuan.');
  return await res.json();
}

// 5. Fetch Agents
export async function getAgents(): Promise<AgentRecord[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/agents`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return [];
  }
}

// 6. Register New Agent
export async function registerAgent(agent: { agent_id: string; name: string; owner: string; max_limit: number; description: string }) {
  const res = await fetch(`${API_BASE_URL}/api/v1/agents/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(agent),
  });
  if (!res.ok) throw new Error('Gagal mendaftarkan agen.');
  return await res.json();
}

// 7. Toggle Agent Status (Kill-Switch)
export async function toggleAgentStatus(agentId: string, status: string) {
  const res = await fetch(`${API_BASE_URL}/api/v1/agents/${agentId}/status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Gagal mengubah status wewenang agen.');
  return await res.json();
}

// Local Storage Helper for Notification Settings (WhatsApp, SMS, Email)
export function getStoredNotificationSettings(): NotificationSettings {
  if (typeof window === 'undefined') {
    return {
      whatsapp: { enabled: true, apiUrl: 'https://kaowhat.com/api/v1/send', apiKey: 'kw_key_co2eivrwAhH4gjzU28nutBf1lWO3LXG7A0vrLiYL', targetNumber: '082129745115' },
      sms: { enabled: false, apiUrl: 'https://sms-gateway.example.com/api/send', apiKey: '', senderId: 'CTARTECH' },
      email: { enabled: true, smtpHost: 'smtp.gmail.com', smtpPort: 587, smtpUser: 'admin@ctar.tech', smtpPass: '••••••••', adminEmail: 'ciso@ctar.tech' },
    };
  }
  const stored = localStorage.getItem('itcg_notif_settings');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) {}
  }
  return {
    whatsapp: { enabled: true, apiUrl: 'https://kaowhat.com/api/v1/send', apiKey: 'kw_key_co2eivrwAhH4gjzU28nutBf1lWO3LXG7A0vrLiYL', targetNumber: '082129745115' },
    sms: { enabled: false, apiUrl: 'https://sms-gateway.example.com/api/send', apiKey: '', senderId: 'CTARTECH' },
    email: { enabled: true, smtpHost: 'smtp.gmail.com', smtpPort: 587, smtpUser: 'admin@ctar.tech', smtpPass: '••••••••', adminEmail: 'ciso@ctar.tech' },
  };
}

export function saveStoredNotificationSettings(settings: NotificationSettings) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('itcg_notif_settings', JSON.stringify(settings));
  }
}
