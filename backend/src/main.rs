mod alerts;
mod dashboard;
mod guard;
mod handlers;
mod license;
mod models;
mod state;

use axum::{
    routing::{get, post},
    Router,
};
use license::LicenseVerifier;
use state::AppState;
use std::net::SocketAddr;
use std::path::Path;
use tower_http::cors::{Any, CorsLayer};
use tracing::info;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // 1. Initialize Logging & Tracing
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "ctartech_controlplane_gateway=info,tower_http=info".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    // 2. Load Public Key for Ed25519 License Verification (Zero-Leakage)
    let key_paths = [
        "keys/public_key.pem",
        "backend/keys/public_key.pem",
        "app/core/keys/public_key.pem",
        "backend/app/core/keys/public_key.pem",
        "../backend/app/core/keys/public_key.pem",
    ];

    let mut verifier = None;
    for path in &key_paths {
        if Path::new(path).exists() {
            match LicenseVerifier::from_pem_file(path) {
                Ok(v) => {
                    info!("Kunci publik Ed25519 berhasil dimuat dari: {}", path);
                    verifier = Some(v);
                    break;
                }
                Err(e) => {
                    eprintln!("Peringatan membaca kunci di {}: {}", path, e);
                }
            }
        }
    }

    let verifier = match verifier {
        Some(v) => v,
        None => {
            eprintln!("❌ FATAL: public_key.pem tidak ditemukan!");
            eprintln!("Jalankan 'python tools/license-issuer/keygen.py' terlebih dahulu!");
            std::process::exit(1);
        }
    };

    // 3. Initialize App State
    let app_state = AppState::new(verifier);

    // 4. Configure CORS
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    // 5. Construct Axum Router
    let app = Router::new()
        // Dashboard & Status
        .route("/", get(handlers::dashboard_handler))
        .route("/health", get(handlers::health_handler))
        .route("/api/v1/stats", get(handlers::get_stats_handler))
        // Runtime Security & Guardrail Interception
        .route("/api/v1/guard/evaluate", post(handlers::evaluate_handler))
        .route("/api/v1/guard/resolve", post(handlers::resolve_approval_handler))
        .route("/api/v1/approval/pending", get(handlers::list_pending_approvals_handler))
        // Central Agent Registry & Emergency Kill-Switch
        .route("/api/v1/agents", get(handlers::list_agents_handler))
        .route("/api/v1/agents/register", post(handlers::register_agent_handler))
        .route("/api/v1/agents/:agent_id/status", post(handlers::update_agent_status_handler))
        // Dynamic Declarative Policy Engine (JSON / OPA format)
        .route("/api/v1/policies", get(handlers::list_policies_handler).post(handlers::create_policy_handler))
        .route("/api/v1/policies/:id/toggle", post(handlers::toggle_policy_handler))
        .route("/api/v1/policies/:id", axum::routing::delete(handlers::delete_policy_handler))
        // Observability & Audit Trail
        .route("/api/v1/audit/logs", get(handlers::list_audit_logs_handler))
        .layer(cors)
        .with_state(app_state);

    // 6. Start Server Listener
    let port = std::env::var("PORT").unwrap_or_else(|_| "8000".to_string()).parse::<u16>().unwrap_or(8000);
    let addr = SocketAddr::from(([0, 0, 0, 0], port));

    let border = "=".repeat(70);
    println!("\n{}", border);
    println!("🛡️  CTARTech-AIControlPlane (ITCowboy Guard)");
    println!("⚡ High-Performance Runtime Security & Governance Gateway (RUST Axum)");
    println!("📜 Public License: GNU Affero General Public License v3 (AGPLv3)");
    println!("{}", border);
    println!("🌐 Dashboard UI   : http://127.0.0.1:{}", port);
    println!("🚀 Gateway API   : http://127.0.0.1:{}/api/v1/guard/evaluate", port);
    println!("❤️  Health Check  : http://127.0.0.1:{}/health", port);
    println!("{}\n", border);

    let listener = tokio::net::TcpListener::bind(addr).await?;
    info!("Control Plane Gateway aktif mendengarkan di http://{}", addr);
    axum::serve(listener, app).await?;

    Ok(())
}
