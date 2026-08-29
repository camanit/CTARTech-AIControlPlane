use reqwest::Client;
use serde::{Deserialize, Serialize};
use thiserror::Error;

#[derive(Error, Debug)]
pub enum GuardError {
    #[error("HTTP transport failure: {0}")]
    HttpError(#[from] reqwest::Error),
    #[error("Gateway API rejected with status: {0}")]
    ApiError(String),
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct EvaluateActionRequest {
    pub agent_id: String,
    pub action: String,
    pub target_system: String,
    pub context: serde_json::Value,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub acting_for_user_id: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub session_id: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct EvaluateActionResponse {
    pub decision: String, // ALLOW, REQUIRE_APPROVAL, BLOCK
    pub audit_id: String,
    #[serde(default)]
    pub approval_id: Option<String>,
    pub reason: String,
}

#[derive(Clone)]
pub struct AgentGuardClient {
    client: Client,
    base_url: String,
    api_key: String,
}

impl AgentGuardClient {
    /// Inisialisasi klien SDK baru mengarah ke AIControlPlane Runtime Gateway
    pub fn new(base_url: &str, api_key: &str) -> Self {
        Self {
            client: Client::new(),
            base_url: base_url.trim_end_matches('/').to_string(),
            api_key: api_key.to_string(),
        }
    }

    /// Evaluasi wewenang aksi AI Agent secara real-time
    pub async fn evaluate_action(&self, req: &EvaluateActionRequest) -> Result<EvaluateActionResponse, GuardError> {
        let endpoint = format!("{}/api/v1/guard/evaluate", self.base_url);

        let res = self.client
            .post(&endpoint)
            .header("Authorization", format!("Bearer {}", self.api_key))
            .header("Content-Type", "application/json")
            .json(req)
            .send()
            .await?;

        if res.status().is_success() {
            let result: EvaluateActionResponse = res.json().await?;
            Ok(result)
        } else {
            let status = res.status();
            let body = res.text().await.unwrap_or_default();
            Err(GuardError::ApiError(format!("Status {}: {}", status, body)))
        }
    }

    /// Helper cepat: Mengembalikan true jika aksi agen diizinkan (ALLOW), false jika tertahan atau diblokir
    pub async fn verify_action_quick(
        &self,
        agent_id: &str,
        action: &str,
        target_system: &str,
        context: serde_json::Value
    ) -> bool {
        let req = EvaluateActionRequest {
            agent_id: agent_id.to_string(),
            action: action.to_string(),
            target_system: target_system.to_string(),
            context,
            acting_for_user_id: None,
            session_id: None,
        };

        match self.evaluate_action(&req).await {
            Ok(res) => res.decision == "ALLOW",
            Err(_) => false, // Fail-Safe default to BLOCK
        }
    }
}
