# 🦀 agentguard-sdk
### Official Rust SDK for CTARTech-AIControlPlane

Client library asinkron berkecepatan tinggi (*sub-millisecond overhead*) untuk microservices Rust yang mengeksekusi aksi wewenang agen AI.

---

## 🚀 Instalasi di `Cargo.toml`
```toml
[dependencies]
agentguard-sdk = { path = "../sdks/rust-sdk" }
tokio = { version = "1", features = ["full"] }
serde_json = "1.0"
```

---

## 💻 Contoh Penggunaan
```rust
use agentguard_sdk::{AgentGuardClient, EvaluateActionRequest};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let guard = AgentGuardClient::new("http://localhost:8000", "itcg_live_key");

    // 1. Evaluasi Lengkap
    let req = EvaluateActionRequest {
        agent_id: "agent_finance_01".to_string(),
        action: "execute_payment".to_string(),
        target_system: "Core_Banking".to_string(),
        context: serde_json::json!({ "amount": 150000 }),
        acting_for_user_id: Some("user_budi".to_string()),
        session_id: None,
    };

    let result = guard.evaluate_action(&req).await?;
    println!("Decision: {} (Reason: {})", result.decision, result.reason);

    // 2. Helper Cepat (Boolean)
    let is_allowed = guard.verify_action_quick(
        "agent_finance_01",
        "execute_payment",
        "Core_Banking",
        serde_json::json!({ "amount": 150000 })
    ).await;

    if is_allowed {
        println!("Aksi sah dan aman untuk dieksekusi!");
    }

    Ok(())
}
```
