use serde_json::json;
use tracing::{error, info};

pub struct AlertDispatcher {
    client: reqwest::Client,
}

impl AlertDispatcher {
    pub fn new() -> Self {
        Self {
            client: reqwest::Client::builder()
                .timeout(std::time::Duration::from_secs(5))
                .build()
                .unwrap_or_default(),
        }
    }

    pub async fn dispatch_approval_alert(
        &self,
        target_webhook: Option<&str>,
        approval_id: &str,
        agent_id: &str,
        agent_name: &str,
        action: &str,
        target_system: &str,
        reason: &str,
        context: &serde_json::Value,
    ) {
        let payload = json!({
            "event": "AI_AGENT_APPROVAL_REQUIRED",
            "approval_id": approval_id,
            "agent_id": agent_id,
            "agent_name": agent_name,
            "action": action,
            "target_system": target_system,
            "reason": reason,
            "context": context,
            "timestamp": chrono::Utc::now().to_rfc3339()
        });

        // 1. Send to dynamic webhook if provided in request
        if let Some(webhook_url) = target_webhook {
            let client = self.client.clone();
            let url = webhook_url.to_string();
            let body = payload.clone();
            tokio::spawn(async move {
                match client.post(&url).json(&body).send().await {
                    Ok(resp) => info!("Alert webhook berhasil dikirim ke {}: status {}", url, resp.status()),
                    Err(e) => error!("Gagal kirim alert webhook ke {}: {}", url, e),
                }
            });
        }

        // 2. Telegram Alert (if TELEGRAM_BOT_TOKEN & TELEGRAM_CHAT_ID are set in env)
        if let (Ok(token), Ok(chat_id)) = (std::env::var("TELEGRAM_BOT_TOKEN"), std::env::var("TELEGRAM_CHAT_ID")) {
            let tg_msg = format!(
                "🚨 *CTARTech-AIControlPlane: SECURITY ALERT*\n\n\
                • *Approval ID:* `{}`\n\
                • *Agent:* {} (`{}`)\n\
                • *Action:* `{}` on `{}`\n\
                • *Reason:* {}\n\n\
                ⚠️ *Status:* Menunggu persetujuan manusia via Control Plane Dashboard.",
                approval_id, agent_name, agent_id, action, target_system, reason
            );

            let tg_url = format!("https://api.telegram.org/bot{}/sendMessage", token);
            let tg_body = json!({
                "chat_id": chat_id,
                "text": tg_msg,
                "parse_mode": "Markdown"
            });

            let client = self.client.clone();
            tokio::spawn(async move {
                match client.post(&tg_url).json(&tg_body).send().await {
                    Ok(_) => info!("Telegram security alert berhasil terkirim ke chat {}", chat_id),
                    Err(e) => error!("Gagal kirim Telegram alert: {}", e),
                }
            });
        }

        // 3. WhatsApp Gateway (if WHATSAPP_API_URL & WHATSAPP_TOKEN & WHATSAPP_TARGET set in env)
        if let (Ok(wa_url), Ok(wa_token), Ok(wa_target)) = (
            std::env::var("WHATSAPP_API_URL"),
            std::env::var("WHATSAPP_TOKEN"),
            std::env::var("WHATSAPP_TARGET"),
        ) {
            let wa_msg = format!(
                "🚨 *AI AGENT APPROVAL REQUIRED*\n\n\
                Agent: {}\nAksi: {}\nAlasan: {}\nTiket ID: {}\n\n\
                Harap tinjau di CTARTech-AIControlPlane Dashboard.",
                agent_name, action, reason, approval_id
            );

            let client = self.client.clone();
            let wa_body = json!({
                "target": wa_target,
                "message": wa_msg
            });

            tokio::spawn(async move {
                match client
                    .post(&wa_url)
                    .header("Authorization", wa_token)
                    .json(&wa_body)
                    .send()
                    .await
                {
                    Ok(_) => info!("WhatsApp alert berhasil dikirim ke {}", wa_target),
                    Err(e) => error!("Gagal kirim WhatsApp alert: {}", e),
                }
            });
        }
    }
}
