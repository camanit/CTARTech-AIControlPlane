use crate::dashboard::render_dashboard_html;
use crate::guard::{PolicyDecision, PolicyEngine};
use crate::models::{
    Agent, AuditLog, EvaluateRequest, EvaluateResponse, PendingApproval, RegisterAgentRequest,
    ResolveApprovalRequest, SystemStats,
};
use crate::state::AppState;
use axum::{
    extract::{Path, State},
    http::{HeaderMap, StatusCode},
    response::{Html, IntoResponse},
    Json,
};
use chrono::Utc;
use serde_json::json;
use uuid::Uuid;

pub async fn dashboard_handler() -> Html<&'static str> {
    Html(render_dashboard_html())
}

pub async fn health_handler() -> impl IntoResponse {
    Json(json!({
        "status": "UP",
        "service": "CTARTech-AIControlPlane-Gateway",
        "engine": "Rust 1.97 / Axum 0.7",
        "license": "GNU AGPLv3",
        "timestamp": Utc::now().to_rfc3339()
    }))
}

pub async fn get_stats_handler(State(state): State<AppState>) -> Json<SystemStats> {
    Json(state.get_stats().await)
}

pub async fn evaluate_handler(
    State(state): State<AppState>,
    headers: HeaderMap,
    Json(req): Json<EvaluateRequest>,
) -> Result<Json<EvaluateResponse>, (StatusCode, Json<serde_json::Value>)> {
    // 1. Verify License Token from Authorization Header
    let mut org_name = "Default Organization".to_string();
    if let Some(auth_val) = headers.get("authorization").and_then(|h| h.to_str().ok()) {
        if let Some(token) = auth_val.strip_prefix("Bearer ") {
            match state.verifier.verify_token(token) {
                Ok(claims) => {
                    org_name = claims.org.clone();
                    // Save active license claim
                    state
                        .active_licenses
                        .write()
                        .await
                        .insert(claims.org.clone(), claims.clone());

                    // Check and increment quota
                    let mut quotas = state.quota_tracker.write().await;
                    let current_used = quotas.entry(claims.org.clone()).or_insert(0);
                    if (*current_used as i64) >= claims.quota {
                        return Err((
                            StatusCode::PAYMENT_REQUIRED,
                            Json(json!({
                                "error": "Quota Exceeded",
                                "detail": format!("Batas kuota bulanan lisensi ({}) telah tercapai. Hubungi administrator.", claims.quota)
                            })),
                        ));
                    }
                    *current_used += 1;
                }
                Err(err_msg) => {
                    return Err((
                        StatusCode::UNAUTHORIZED,
                        Json(json!({
                            "error": "Invalid License",
                            "detail": format!("Verifikasi lisensi gagal: {}", err_msg)
                        })),
                    ));
                }
            }
        }
    }

    // 2. Identify Agent
    let mut agents_guard = state.agents.write().await;
    let agent = match agents_guard.get(&req.agent_id) {
        Some(a) => a.clone(),
        None => {
            // Auto-provision if in development or return error
            let new_agent = Agent {
                agent_id: req.agent_id.clone(),
                org: org_name.clone(),
                name: format!("Agent {}", req.agent_id),
                owner: req.acting_for_user_id.clone().unwrap_or_else(|| "Unknown User".to_string()),
                max_limit: 200000.0,
                status: "ACTIVE".to_string(),
                description: "Auto-registered via runtime call".to_string(),
                created_at: Utc::now(),
            };
            agents_guard.insert(req.agent_id.clone(), new_agent.clone());
            new_agent
        }
    };
    drop(agents_guard);

    // 3. Policy Engine Evaluation (Dynamic OPA / Declarative Rules + Fallback)
    let audit_id = format!("aud_{}", Uuid::new_v4().simple());
    let policies_guard = state.policies.read().await;
    let decision_result = PolicyEngine::evaluate(&agent, &req, &policies_guard);
    drop(policies_guard);

    match decision_result {
        PolicyDecision::Allow { reason } => {
            let log = AuditLog {
                audit_id: audit_id.clone(),
                timestamp: Utc::now(),
                agent_id: req.agent_id,
                org: org_name,
                action: req.action,
                target_system: req.target_system,
                decision: "ALLOW".to_string(),
                reason: reason.clone(),
                context: req.context,
                acting_for_user_id: req.acting_for_user_id,
                session_id: req.session_id,
            };
            state.audit_logs.write().await.push(log);

            Ok(Json(EvaluateResponse {
                status: "ALLOW".to_string(),
                decision: "ALLOW".to_string(),
                reason,
                audit_id,
                approval_id: None,
            }))
        }

        PolicyDecision::RequireApproval { reason } => {
            let approval_id = format!("appr_{}", Uuid::new_v4().simple().to_string()[..8].to_string());

            let pending = PendingApproval {
                approval_id: approval_id.clone(),
                audit_id: audit_id.clone(),
                agent_id: req.agent_id.clone(),
                agent_name: agent.name.clone(),
                action: req.action.clone(),
                target_system: req.target_system.clone(),
                reason: reason.clone(),
                context: req.context.clone(),
                status: "PENDING".to_string(),
                created_at: Utc::now(),
                resolved_by: None,
                resolved_at: None,
            };

            // Insert into pending queue
            state
                .pending_approvals
                .write()
                .await
                .insert(approval_id.clone(), pending);

            // Log the hold
            let log = AuditLog {
                audit_id: audit_id.clone(),
                timestamp: Utc::now(),
                agent_id: req.agent_id.clone(),
                org: org_name,
                action: req.action.clone(),
                target_system: req.target_system.clone(),
                decision: "REQUIRE_APPROVAL".to_string(),
                reason: reason.clone(),
                context: req.context.clone(),
                acting_for_user_id: req.acting_for_user_id,
                session_id: req.session_id,
            };
            state.audit_logs.write().await.push(log);

            // Dispatch instant multi-channel alert
            state
                .alerts
                .dispatch_approval_alert(
                    req.webhook_url.as_deref(),
                    &approval_id,
                    &req.agent_id,
                    &agent.name,
                    &req.action,
                    &req.target_system,
                    &reason,
                    &req.context,
                )
                .await;

            Ok(Json(EvaluateResponse {
                status: "REQUIRE_APPROVAL".to_string(),
                decision: "HOLD".to_string(),
                reason,
                audit_id,
                approval_id: Some(approval_id),
            }))
        }

        PolicyDecision::Block { reason } => {
            let log = AuditLog {
                audit_id: audit_id.clone(),
                timestamp: Utc::now(),
                agent_id: req.agent_id,
                org: org_name,
                action: req.action,
                target_system: req.target_system,
                decision: "BLOCK".to_string(),
                reason: reason.clone(),
                context: req.context,
                acting_for_user_id: req.acting_for_user_id,
                session_id: req.session_id,
            };
            state.audit_logs.write().await.push(log);

            Ok(Json(EvaluateResponse {
                status: "BLOCK".to_string(),
                decision: "BLOCK".to_string(),
                reason,
                audit_id,
                approval_id: None,
            }))
        }
    }
}

pub async fn register_agent_handler(
    State(state): State<AppState>,
    Json(req): Json<RegisterAgentRequest>,
) -> impl IntoResponse {
    let agent = Agent {
        agent_id: req.agent_id.clone(),
        org: "Default Org".to_string(),
        name: req.name,
        owner: req.owner,
        max_limit: req.max_limit,
        status: "ACTIVE".to_string(),
        description: req.description,
        created_at: Utc::now(),
    };

    state.agents.write().await.insert(req.agent_id.clone(), agent);

    Json(json!({
        "message": "Agent berhasil didaftarkan ke Central Agent Registry.",
        "agent_id": req.agent_id,
        "status": "ACTIVE"
    }))
}

pub async fn list_agents_handler(State(state): State<AppState>) -> Json<Vec<Agent>> {
    let agents = state.agents.read().await;
    let list: Vec<Agent> = agents.values().cloned().collect();
    Json(list)
}

pub async fn update_agent_status_handler(
    State(state): State<AppState>,
    Path(agent_id): Path<String>,
    Json(payload): Json<serde_json::Value>,
) -> impl IntoResponse {
    let new_status = payload
        .get("status")
        .and_then(|v| v.as_str())
        .unwrap_or("ACTIVE")
        .to_string();

    let mut agents = state.agents.write().await;
    if let Some(agent) = agents.get_mut(&agent_id) {
        agent.status = new_status.clone();
        Json(json!({
            "message": format!("Status agen '{}' berhasil diubah menjadi '{}'", agent_id, new_status),
            "agent_id": agent_id,
            "status": new_status
        }))
    } else {
        Json(json!({"error": "Agent tidak ditemukan"}))
    }
}

pub async fn list_audit_logs_handler(State(state): State<AppState>) -> Json<Vec<AuditLog>> {
    let logs = state.audit_logs.read().await;
    Json(logs.clone())
}

pub async fn list_pending_approvals_handler(
    State(state): State<AppState>,
) -> Json<Vec<PendingApproval>> {
    let pending = state.pending_approvals.read().await;
    let list: Vec<PendingApproval> = pending
        .values()
        .filter(|p| p.status == "PENDING")
        .cloned()
        .collect();
    Json(list)
}

pub async fn resolve_approval_handler(
    State(state): State<AppState>,
    Json(req): Json<ResolveApprovalRequest>,
) -> Result<Json<serde_json::Value>, (StatusCode, Json<serde_json::Value>)> {
    let mut pending = state.pending_approvals.write().await;
    if let Some(appr) = pending.get_mut(&req.approval_id) {
        let new_status = if req.decision.to_uppercase() == "APPROVE" {
            "APPROVED"
        } else {
            "REJECTED"
        };
        appr.status = new_status.to_string();
        appr.resolved_by = Some(req.approver.clone());
        appr.resolved_at = Some(Utc::now());

        // Update corresponding audit log
        let mut logs = state.audit_logs.write().await;
        if let Some(log) = logs.iter_mut().find(|l| l.audit_id == appr.audit_id) {
            log.decision = if new_status == "APPROVED" {
                "ALLOW (HUMAN APPROVED)".to_string()
            } else {
                "BLOCK (HUMAN REJECTED)".to_string()
            };
            log.reason = format!(
                "Persetujuan manual oleh {}: {}",
                req.approver,
                req.note.unwrap_or_default()
            );
        }

        Ok(Json(json!({
            "message": format!("Aksi '{}' berhasil di-{}", appr.action, new_status),
            "approval_id": req.approval_id,
            "status": new_status,
            "resolved_by": req.approver
        })))
    } else {
        Err((
            StatusCode::NOT_FOUND,
            Json(json!({"error": "Approval ID tidak ditemukan"})),
        ))
    }
}

pub async fn list_policies_handler(
    State(state): State<AppState>,
) -> Json<Vec<crate::models::DynamicPolicy>> {
    let pols = state.policies.read().await;
    Json(pols.clone())
}

pub async fn create_policy_handler(
    State(state): State<AppState>,
    Json(mut new_pol): Json<crate::models::DynamicPolicy>,
) -> impl IntoResponse {
    if new_pol.id.is_empty() {
        new_pol.id = format!("pol_{}", Uuid::new_v4().simple());
    }
    new_pol.created_at = Utc::now();
    state.policies.write().await.push(new_pol.clone());

    (StatusCode::CREATED, Json(new_pol))
}

pub async fn toggle_policy_handler(
    State(state): State<AppState>,
    Path(policy_id): Path<String>,
) -> impl IntoResponse {
    let mut pols = state.policies.write().await;
    if let Some(pol) = pols.iter_mut().find(|p| p.id == policy_id) {
        pol.enabled = !pol.enabled;
        Json(json!({
            "message": format!("Kebijakan '{}' diubah menjadi {}", pol.name, if pol.enabled { "AKTIF" } else { "NON-AKTIF" }),
            "policy_id": pol.id,
            "enabled": pol.enabled
        }))
    } else {
        Json(json!({"error": "Policy tidak ditemukan"}))
    }
}

pub async fn delete_policy_handler(
    State(state): State<AppState>,
    Path(policy_id): Path<String>,
) -> impl IntoResponse {
    let mut pols = state.policies.write().await;
    let initial_len = pols.len();
    pols.retain(|p| p.id != policy_id);
    if pols.len() < initial_len {
        Json(json!({"message": "Policy berhasil dihapus", "policy_id": policy_id}))
    } else {
        Json(json!({"error": "Policy tidak ditemukan"}))
    }
}

