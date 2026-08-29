use crate::alerts::AlertDispatcher;
use crate::license::LicenseVerifier;
use crate::models::{Agent, AuditLog, DynamicPolicy, DynamicPolicyRule, LicenseClaims, PendingApproval, SystemStats};
use chrono::Utc;
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;

#[derive(Clone)]
pub struct AppState {
    pub verifier: Arc<LicenseVerifier>,
    pub alerts: Arc<AlertDispatcher>,
    pub agents: Arc<RwLock<HashMap<String, Agent>>>,
    pub audit_logs: Arc<RwLock<Vec<AuditLog>>>,
    pub pending_approvals: Arc<RwLock<HashMap<String, PendingApproval>>>,
    pub quota_tracker: Arc<RwLock<HashMap<String, usize>>>, // org -> used
    pub active_licenses: Arc<RwLock<HashMap<String, LicenseClaims>>>, // org -> claims
    pub policies: Arc<RwLock<Vec<DynamicPolicy>>>, // Dynamic OPA / JSON policies
}

impl AppState {
    pub fn new(verifier: LicenseVerifier) -> Self {
        let initial_policies = vec![
            DynamicPolicy {
                id: "pol_after_hours".to_string(),
                name: "Off-Hours High Value Payment Fence".to_string(),
                description: "Menahan transaksi di luar jam operasional (18:00 - 08:00 WIB) untuk persetujuan manual".to_string(),
                enabled: true,
                priority: 10,
                match_type: "ALL".to_string(),
                rules: vec![
                    DynamicPolicyRule {
                        field: "action".to_string(),
                        operator: "EQUALS".to_string(),
                        value: serde_json::json!("execute_payment"),
                    },
                    DynamicPolicyRule {
                        field: "context.is_after_hours".to_string(),
                        operator: "EQUALS".to_string(),
                        value: serde_json::json!(true),
                    }
                ],
                decision: "REQUIRE_APPROVAL".to_string(),
                reason: "Transaksi finansial otonom di luar jam kerja (Off-Hours) mewajibkan persetujuan CISO/Manajer.".to_string(),
                created_at: Utc::now(),
            },
            DynamicPolicy {
                id: "pol_aml_blacklist".to_string(),
                name: "AML & Fraud Recipient Watchlist Guard".to_string(),
                description: "Memblokir seketika transaksi yang ditujukan ke rekening penipuan atau unverified wallet".to_string(),
                enabled: true,
                priority: 20,
                match_type: "ALL".to_string(),
                rules: vec![
                    DynamicPolicyRule {
                        field: "context.recipient_account".to_string(),
                        operator: "IN".to_string(),
                        value: serde_json::json!(["rek_blacklist_01", "crypto_unverified_addr", "offshore_dummy_acc"]),
                    }
                ],
                decision: "BLOCK".to_string(),
                reason: "Rekening tujuan masuk dalam daftar hitam (Anti Money Laundering / Watchlist Interception).".to_string(),
                created_at: Utc::now(),
            },
            DynamicPolicy {
                id: "pol_crm_leak".to_string(),
                name: "Data Exfiltration & Bulk Export Blocker".to_string(),
                description: "Menahan upaya ekspor data pelanggan massal (PDP/GDPR Compliance)".to_string(),
                enabled: true,
                priority: 30,
                match_type: "ANY".to_string(),
                rules: vec![
                    DynamicPolicyRule {
                        field: "action".to_string(),
                        operator: "CONTAINS".to_string(),
                        value: serde_json::json!("export"),
                    },
                    DynamicPolicyRule {
                        field: "target_system".to_string(),
                        operator: "CONTAINS".to_string(),
                        value: serde_json::json!("CRM"),
                    }
                ],
                decision: "REQUIRE_APPROVAL".to_string(),
                reason: "Aksi pengunduhan data sensitif CRM diklasifikasikan sebagai potensi kebocoran data massal.".to_string(),
                created_at: Utc::now(),
            },
        ];

        let state = Self {
            verifier: Arc::new(verifier),
            alerts: Arc::new(AlertDispatcher::new()),
            agents: Arc::new(RwLock::new(HashMap::new())),
            audit_logs: Arc::new(RwLock::new(Vec::new())),
            pending_approvals: Arc::new(RwLock::new(HashMap::new())),
            quota_tracker: Arc::new(RwLock::new(HashMap::new())),
            active_licenses: Arc::new(RwLock::new(HashMap::new())),
            policies: Arc::new(RwLock::new(initial_policies)),
        };

        // Seed demo agent
        let demo_agent = Agent {
            agent_id: "agent_finance_01".to_string(),
            org: "PT CTARTech Global".to_string(),
            name: "Finance Payment Agent".to_string(),
            owner: "Finance Department".to_string(),
            max_limit: 500000.0,
            status: "ACTIVE".to_string(),
            description: "Default seeded autonomous refund and payment agent".to_string(),
            created_at: Utc::now(),
        };

        let agents_clone = state.agents.clone();
        tokio::spawn(async move {
            agents_clone.write().await.insert(demo_agent.agent_id.clone(), demo_agent);
        });

        state
    }

    pub async fn get_stats(&self) -> SystemStats {
        let logs = self.audit_logs.read().await;
        let pending = self.pending_approvals.read().await;
        let agents = self.agents.read().await;
        let quotas = self.quota_tracker.read().await;
        let licenses = self.active_licenses.read().await;

        let total_evaluations = logs.len();
        let total_allowed = logs.iter().filter(|l| l.decision == "ALLOW").count();
        let total_blocked = logs.iter().filter(|l| l.decision == "BLOCK").count();
        let total_require_approval = logs.iter().filter(|l| l.decision == "REQUIRE_APPROVAL").count();
        let total_pending = pending.values().filter(|p| p.status == "PENDING").count();
        let total_agents = agents.len();

        let (org_name, license_tier, quota_limit, quota_used) = if let Some((org, claim)) = licenses.iter().next() {
            let used = quotas.get(org).copied().unwrap_or(0);
            (claim.org.clone(), claim.tier.clone(), claim.quota, used)
        } else {
            ("CTARTech Community".to_string(), "COMMUNITY".to_string(), 10000, logs.len())
        };

        SystemStats {
            total_evaluations,
            total_allowed,
            total_blocked,
            total_require_approval,
            total_pending,
            total_agents,
            quota_used,
            quota_limit,
            license_tier,
            org_name,
        }
    }
}
