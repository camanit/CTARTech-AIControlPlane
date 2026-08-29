# 🛡️ CTARTech-AIControlPlane (ITCowboy Guard)
> **Runtime Security, Task-Bound Authority, and Human-in-the-Loop Governance for Enterprise AI Agents.**  
> *Inspired by the security architecture of CTARTech-ZentyCore.*  
> **Public License:** GNU Affero General Public License v3 ([AGPL-3.0](LICENSE))

---

## 🎯 The Philosophy: From Access to Authority
Enterprise security was built around the assumption that **"Humans use software"**. Today, autonomous AI Agents are becoming **"Non-human workers with authority"**—capable of querying databases, invoking APIs, updating business records, and transferring funds without prior human approval.

Traditional IAM asks: *"What can this user see?"*  
**CTARTech-AIControlPlane** answers: *"What is this agent authorized to cause to happen, under what context, and who is accountable?"*

```text
Traditional Access Equation:
Identity + Authentication + Permission = Access

Agentic Governance Equation (CTARTech-AIControlPlane):
Identity + Context + Authority + Policy + Runtime Verification = Action
```

---

## 🏗️ 3-Tier Architecture

```
+-----------------------------------------------------------------------------------+
|               OFFLINE LICENSE ISSUER (tools/license-issuer/)                      |
|  - Air-gapped / Local Only (Ignored from Git)                                     |
|  - Ed25519 Asymmetric Private Key -> Issues cryptographically signed licenses     |
+-----------------------------------------------------------------------------------+
                                         | (Exports ONLY public_key.pem)
                                         v
+-----------------------------------------------------------------------------------+
|               RUST CORE RUNTIME GATEWAY (backend/ - Axum 0.7)                     |
|  - High Performance (>50,000 req/sec) & Sub-millisecond latency                   |
|  - Public-Key Zero-Leakage License Verifier                                       |
|  - Policy Engine & Task-Bound Authority Matrix (ALLOW / REQUIRE_APPROVAL / BLOCK) |
|  - Real-Time Audit Trail & Decision Reconstruction                                |
|  - Multi-Channel Alerts (Webhook, Telegram Bot, WhatsApp Gateway, Email)         |
|  - Built-in Dark-Mode Enterprise SaaS Dashboard UI (http://127.0.0.1:8000)        |
+-----------------------------------------------------------------------------------+
                                         ^
                                         | Intercepts before executing actions
+-----------------------------------------------------------------------------------+
|               CLIENT DEVELOPER SDK (sdk/itcowboy_guard/ - Python)                 |
|  - 1-Line Drop-in Middleware for LangChain, CrewAI, AutoGen, or Custom Agents     |
|  - Fail-Safe Protection (auto-blocks destructive operations if gateway is down)   |
+-----------------------------------------------------------------------------------+
```

---

## ⚡ Quick Start Guide

### 1. Prasyarat
- **Rust** `1.75+` (disarankan `rustc 1.97+`)
- **Python** `3.8+`

---

### 2. Terbitkan Lisensi Klien (Offline - Mesin Lokal)
Generator lisensi berada di direktori lokal dan **tidak dipublish ke Git**:
```bash
# 1. Buat pasangan kunci kriptografi (Ed25519) jika belum ada
python tools/license-issuer/keygen.py

# 2. Terbitkan lisensi untuk klien enterprise
python tools/license-issuer/generate_license.py --org "PT Maju AI" --tier "ENTERPRISE" --quota 1000000 --days 365
```

---

### 3. Jalankan Rust Control Plane Gateway
```bash
cd backend
cargo run --release
```
Server akan aktif di:
- **🌐 Web Dashboard UI:** [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **🚀 Gateway Interception API:** `http://127.0.0.1:8000/api/v1/guard/evaluate`
- **❤️ Health Endpoint:** [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

---

## 📦 Multi-Language SDKs & Middleware

Protect your AI Agent workflows & backend APIs in 3 lines of code:

### 🦀 Rust SDK (`sdks/rust-sdk/`)
```rust
use agentguard_sdk::{AgentGuardClient, EvaluateActionRequest};

let client = AgentGuardClient::new("http://localhost:8000", "itcg_live_key");
let is_allowed = client.verify_action_quick(
    "agent_finance_01", 
    "execute_payment", 
    "bank_api", 
    serde_json::json!({"amount": 150000})
).await;
```

### 🟩 Node.js / Express & LangChain Middleware (`sdks/node-middleware/`)
```typescript
import { AgentGuardClient } from '@ctartech/ai-controlplane-middleware';

const guard = new AgentGuardClient({ controlPlaneUrl: 'http://localhost:8000', apiKey: 'itcg_live_key' });
app.use('/api/agents/action', guard.expressMiddleware({ 
    action: 'execute_trade', 
    targetSystem: 'Trading_Core' 
}));
```

### 🐍 Python / FastAPI & LangChain SDK (`sdks/python-sdk/`)
```python
from itcowboy_guard import AgentGuard

guard = AgentGuard(
    license_key="ITCG-ENTERPRISE-eyJhbGciOiJFZDI1NTE5...", 
    gateway_url="http://localhost:8000"
)

decision = guard.evaluate(
    agent_id="finance_bot_01",
    action="execute_payment",
    target_system="bank_core_api",
    context={"amount": 750000.0, "recipient": "PT Vendor X"}
)
```

### 🐹 Go / Gin Middleware (`sdks/go-sdk/`)
```go
import "github.com/ctartech/ai-controlplane/sdks/go-sdk"

client := agentguard.NewClient("http://localhost:8000", "itcg_live_key")
router.Use(client.StandardHTTPMiddleware("execute_action", "backend_service", handler))
```

---

### 4. Pasang & Gunakan Python SDK pada AI Agent

Install SDK:
```bash
pip install -e sdk/
```

Sisipkan pengaman di dalam fungsi agen AI kamu:
```python
from itcowboy_guard import AgentGuard

# Inisialisasi Guard dengan License Key Klien
guard = AgentGuard(
    license_key="ITCG-ENTERPRISE-eyJhbGci...",
    gateway_url="http://127.0.0.1:8000"
)

# Evaluasi sebelum agen AI melakukan aksi ke sistem target
decision = guard.evaluate(
    agent_id="finance_bot_01",
    action="execute_payment",
    target_system="bank_core_api",
    context={
        "amount": 750000.0,
        "recipient": "PT Vendor X"
    },
    acting_for_user_id="karyawan_budi"
)

if decision["status"] == "ALLOW":
    # Lanjutkan eksekusi fungsi asli
    print("✅ Aksi aman! Melanjutkan pembayaran...")
elif decision["status"] == "REQUIRE_APPROVAL":
    # Aksi ditahan, notifikasi instan terkirim ke Telegram/Dashboard
    print(f"⚠️ Aksi ditahan: {decision['reason']}")
    print(f"Approval ID: {decision['approval_id']}")
else:
    # Aksi ilegal atau berbahaya
    print(f"❌ Aksi diblokir oleh Control Plane: {decision['reason']}")
```

---

### 5. Jalankan Simulasi Lengkap
Jalankan script demonstrasi otomatis:
```bash
python examples/demo_agent_simulation.py
```
Lalu buka [http://127.0.0.1:8000](http://127.0.0.1:8000) di browsermu untuk melihat rekaman audit log real-time dan menyetujui aksi agen yang tertahan!

---

## 📜 Lisensi & Kontribusi
Proyek ini dilisensikan di bawah **GNU Affero General Public License v3 (AGPL-3.0)**. Lihat file [LICENSE](LICENSE) untuk detail lengkap.
Dibuat dengan dedikasi untuk tata kelola AI enterprise yang aman, terpercaya, dan bertanggung jawab.

---

## ☕ Dukungan, Donasi & Kontak Komunitas

Dukung riset dan pengembangan berkelanjutan kedaulatan tata kelola AI nasional ini:

- 🏦 **Allo Bank (No. Rekening):** `0812 6000 6666`
- 💬 **WhatsApp Community & Support:** [+62 812-6000-6666](https://wa.me/6281260006666) (`0812 6000 6666`)
- 🌐 **WebPay Gateway:** [https://webpay.ctar.tech](https://webpay.ctar.tech)

