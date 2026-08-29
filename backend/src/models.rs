use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LicenseClaims {
    pub iss: String,
    pub org: String,
    pub tier: String,
    pub quota: i64,
    pub iat: i64,
    pub exp: i64,
    #[serde(default)]
    pub features: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Agent {
    pub agent_id: String,
    pub org: String,
    pub name: String,
    pub owner: String,
    pub max_limit: f64,
    pub status: String, // "ACTIVE", "SUSPENDED", "RETIRED"
    pub description: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuditLog {
    pub audit_id: String,
    pub timestamp: DateTime<Utc>,
    pub agent_id: String,
    pub org: String,
    pub action: String,
    pub target_system: String,
    pub decision: String, // "ALLOW", "BLOCK", "REQUIRE_APPROVAL"
    pub reason: String,
    pub context: serde_json::Value,
    pub acting_for_user_id: Option<String>,
    pub session_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PendingApproval {
    pub approval_id: String,
    pub audit_id: String,
    pub agent_id: String,
    pub agent_name: String,
    pub action: String,
    pub target_system: String,
    pub reason: String,
    pub context: serde_json::Value,
    pub status: String, // "PENDING", "APPROVED", "REJECTED"
    pub created_at: DateTime<Utc>,
    pub resolved_by: Option<String>,
    pub resolved_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Deserialize)]
pub struct EvaluateRequest {
    pub agent_id: String,
    pub action: String,
    pub target_system: String,
    #[serde(default)]
    pub context: serde_json::Value,
    pub acting_for_user_id: Option<String>,
    pub session_id: Option<String>,
    pub webhook_url: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct EvaluateResponse {
    pub status: String, // "ALLOW", "REQUIRE_APPROVAL", "BLOCK"
    pub decision: String,
    pub reason: String,
    pub audit_id: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub approval_id: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct RegisterAgentRequest {
    pub agent_id: String,
    pub name: String,
    pub owner: String,
    #[serde(default = "default_max_limit")]
    pub max_limit: f64,
    #[serde(default)]
    pub description: String,
}

fn default_max_limit() -> f64 {
    200000.0
}

#[derive(Debug, Deserialize)]
pub struct ResolveApprovalRequest {
    pub approval_id: String,
    pub decision: String, // "APPROVE" or "REJECT"
    pub approver: String,
    pub note: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct SystemStats {
    pub total_evaluations: usize,
    pub total_allowed: usize,
    pub total_blocked: usize,
    pub total_require_approval: usize,
    pub total_pending: usize,
    pub total_agents: usize,
    pub quota_used: usize,
    pub quota_limit: i64,
    pub license_tier: String,
    pub org_name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DynamicPolicyRule {
    pub field: String,      // e.g. "action", "target_system", "context.amount", "context.recipient", "context.command"
    pub operator: String,   // "EQUALS", "NOT_EQUALS", "CONTAINS", "GREATER_THAN", "LESS_THAN", "IN"
    pub value: serde_json::Value,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DynamicPolicy {
    pub id: String,
    pub name: String,
    pub description: String,
    pub enabled: bool,
    pub priority: i32,
    pub match_type: String, // "ALL" (AND) or "ANY" (OR)
    pub rules: Vec<DynamicPolicyRule>,
    pub decision: String,   // "ALLOW", "REQUIRE_APPROVAL", "BLOCK"
    pub reason: String,
    pub created_at: DateTime<Utc>,
}

