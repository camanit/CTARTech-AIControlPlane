use crate::models::{Agent, DynamicPolicy, DynamicPolicyRule, EvaluateRequest};

pub struct PolicyEngine;

pub enum PolicyDecision {
    Allow { reason: String },
    RequireApproval { reason: String },
    Block { reason: String },
}

impl PolicyEngine {
    pub fn evaluate(
        agent: &Agent,
        req: &EvaluateRequest,
        dynamic_policies: &[DynamicPolicy],
    ) -> PolicyDecision {
        // 1. Check Agent Status
        if agent.status != "ACTIVE" {
            return PolicyDecision::Block {
                reason: format!(
                    "Agent '{}' sedang dalam status {} (Non-aktif / Kill-Switch)",
                    agent.agent_id, agent.status
                ),
            };
        }

        // 2. Evaluate Dynamic Declarative Policies (JSON / OPA format)
        for policy in dynamic_policies {
            if !policy.enabled {
                continue;
            }

            let mut match_results = Vec::new();
            for rule in &policy.rules {
                match_results.push(Self::check_rule(rule, req));
            }

            let is_matched = if policy.match_type == "ALL" {
                !match_results.is_empty() && match_results.iter().all(|&m| m)
            } else {
                match_results.iter().any(|&m| m)
            };

            if is_matched {
                return match policy.decision.to_uppercase().as_str() {
                    "BLOCK" => PolicyDecision::Block {
                        reason: format!("[OPA Rule: {}] {}", policy.name, policy.reason),
                    },
                    "REQUIRE_APPROVAL" => PolicyDecision::RequireApproval {
                        reason: format!("[OPA Rule: {}] {}", policy.name, policy.reason),
                    },
                    _ => PolicyDecision::Allow {
                        reason: format!("[OPA Rule: {}] {}", policy.name, policy.reason),
                    },
                };
            }
        }

        let action_lower = req.action.to_lowercase();

        // 3. Fallback: Destructive & Highly Sensitive Operations Check
        let destructive_actions = [
            "delete_records",
            "delete_database",
            "drop_table",
            "export_database",
            "export_customer_data",
            "modify_core_config",
            "shutdown_system",
            "transfer_ownership",
            "wipe_data",
        ];

        for &dest in &destructive_actions {
            if action_lower == dest {
                return PolicyDecision::RequireApproval {
                    reason: format!(
                        "Aksi destruktif/sensitif '{}' diklasifikasikan sebagai HIGH RISK. Wajib persetujuan manusia.",
                        req.action
                    ),
                };
            }
        }

        // 4. Fallback: Financial & Authority Threshold Check
        let financial_actions = [
            "execute_payment",
            "execute_refund",
            "transfer_funds",
            "approve_invoice",
            "create_purchase_order",
        ];

        for &fin in &financial_actions {
            if action_lower == fin {
                let amount = req
                    .context
                    .get("amount")
                    .and_then(|v| v.as_f64())
                    .unwrap_or(0.0);

                if amount > agent.max_limit {
                    return PolicyDecision::RequireApproval {
                        reason: format!(
                            "Nilai transaksi ({:.2}) melampaui batas aman wewenang agent ({:.2}). Memerlukan persetujuan CISO/Manajer.",
                            amount, agent.max_limit
                        ),
                    };
                } else {
                    return PolicyDecision::Allow {
                        reason: format!(
                            "Nilai transaksi ({:.2}) berada dalam batas aman wewenang otomatis agent ({:.2}).",
                            amount, agent.max_limit
                        ),
                    };
                }
            }
        }

        // 5. Fallback: Suspicious prompt/command heuristics
        if let Some(command) = req.context.get("command").and_then(|v| v.as_str()) {
            let cmd_lower = command.to_lowercase();
            if cmd_lower.contains("rm -rf")
                || cmd_lower.contains("drop database")
                || cmd_lower.contains("format c:")
                || cmd_lower.contains("/etc/shadow")
            {
                return PolicyDecision::Block {
                    reason: format!(
                        "Terdeteksi perintah sistem yang sangat berbahaya dalam payload: '{}'",
                        command
                    ),
                };
            }
        }

        // 6. Default Safe Operation
        PolicyDecision::Allow {
            reason: "Aksi berada dalam parameter wewenang dan kebijakan operasional normal.".to_string(),
        }
    }

    fn check_rule(rule: &DynamicPolicyRule, req: &EvaluateRequest) -> bool {
        let field_val = match rule.field.as_str() {
            "action" => Some(serde_json::Value::String(req.action.clone())),
            "target_system" => Some(serde_json::Value::String(req.target_system.clone())),
            "agent_id" => Some(serde_json::Value::String(req.agent_id.clone())),
            s if s.starts_with("context.") => {
                let key = &s[8..];
                req.context.get(key).cloned()
            }
            _ => None,
        };

        let field_val = match field_val {
            Some(v) => v,
            None => return false,
        };

        match rule.operator.as_str() {
            "EQUALS" => field_val == rule.value,
            "NOT_EQUALS" => field_val != rule.value,
            "CONTAINS" => match (&field_val, &rule.value) {
                (serde_json::Value::String(s), serde_json::Value::String(substr)) => {
                    s.to_lowercase().contains(&substr.to_lowercase())
                }
                _ => false,
            },
            "GREATER_THAN" => match (&field_val, &rule.value) {
                (serde_json::Value::Number(n1), serde_json::Value::Number(n2)) => {
                    n1.as_f64().unwrap_or(0.0) > n2.as_f64().unwrap_or(0.0)
                }
                _ => false,
            },
            "LESS_THAN" => match (&field_val, &rule.value) {
                (serde_json::Value::Number(n1), serde_json::Value::Number(n2)) => {
                    n1.as_f64().unwrap_or(0.0) < n2.as_f64().unwrap_or(0.0)
                }
                _ => false,
            },
            "IN" => match &rule.value {
                serde_json::Value::Array(arr) => arr.contains(&field_val),
                _ => false,
            },
            _ => false,
        }
    }
}
