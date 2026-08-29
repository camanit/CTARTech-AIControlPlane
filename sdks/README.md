# 🛡️ Panduan Lengkap Multi-Language SDKs & Middleware
### CTARTech-AIControlPlane (Runtime Authority & Zero Trust Guard for AI Agents)

Dokumen ini menjelaskan **prinsip kerja, arsitektur pencegatan (interception), cara instalasi, dan contoh penggunaan** dari seluruh SDK resmi CTARTech-AIControlPlane.

---

## 🧠 Bagaimana Cara Kerja SDK?

SDK bekerja sebagai **Runtime Authority Interceptor (Gerbang Pengaman Wewenang)** yang disisipkan tepat di antara **Otak Agen AI (LLM / Agent Framework)** dan **Sistem Eksekusi (Database / API Perbankan / Server OS)**.

```
+-------------------------------------------------------------------------+
|                          AI AGENT RUNTIME                               |
|   (LangChain / CrewAI / AutoGen / Express / FastAPI / Rust / Go)        |
+-------------------------------------------------------------------------+
                                     |
                                     | [1] Ingin jalankan aksi / Tool Call
                                     v
+-------------------------------------------------------------------------+
|                  CTARTech-AIControlPlane Client SDK                     |
|  - Mengambil metadata: Agent ID, Action, Target System, Context, Amount |
|  - Mencegat payload sebelum menyentuh infrastruktur target              |
+-------------------------------------------------------------------------+
                                     |
                                     | [2] POST /api/v1/guard/evaluate
                                     v
+-------------------------------------------------------------------------+
|              CORE CONTROL PLANE GATEWAY (Rust Axum :8000)               |
|                                                                         |
|  1. Verifikasi Lisensi Klien (Ed25519 Cryptographic Proof)              |
|  2. Pemeriksaan Emergency Kill-Switch Agen                              |
|  3. Evaluasi Plafon Finansial (Auto-Approve vs Limit Wewenang)          |
|  4. Intersepsi Perintah Destruktif (Shell rm -rf, SQL Drop, PII Dump)   |
|  5. Pencatatan Immutable Audit Trail (SHA-256 Hash Chain)               |
+-------------------------------------------------------------------------+
                                     |
               +---------------------+---------------------+
               | [3A] ALLOW          | [3B] REQUIRE_APP    | [3C] BLOCK
               v                     v                     v
+--------------------+ +--------------------+ +--------------------+
|  EKSEKUSI AMAN     | | AKSI DITAHAN (HOLD)| | SEKETIKA DITOLAK   |
|  Fungsi dijalankan | | Notifikasi WA/Email| | Lempar Exception & |
|  ke sistem target. | | terkirim ke CISO   | | hentikan runtime   |
+--------------------+ +--------------------+ +--------------------+
```

### 🔒 Mode Proteksi Fail-Safe (Zero Trust Default)
Jika Core Gateway atau jaringan server sedang down/mati:
- SDK **secara otomatis memblokir (BLOCK)** setiap aksi kritis yang berisiko tinggi.
- Mencegah terjadinya eksekusi liar tanpa wewenang saat sistem pengawas offline.

---

## 📦 Pilihan SDK Berdasarkan Bahasa Pemrograman

| Bahasa / Framework | Folder Lokasi | Kasus Penggunaan Utama |
|---|---|---|
| 🐍 **Python** | [`sdks/python-sdk/`](python-sdk/) | LangChain, CrewAI, AutoGen, LlamaIndex, FastAPI, Django |
| 🟩 **Node.js / TypeScript** | [`sdks/node-middleware/`](node-middleware/) | Express.js, NestJS, LangChain.js, Next.js Server Actions |
| 🦀 **Rust** | [`sdks/rust-sdk/`](rust-sdk/) | Axum, Actix-web, High-throughput Agent Microservices |
| 🐹 **Go** | [`sdks/go-sdk/`](go-sdk/) | Gin, Fiber, Cloud-native autonomous microservices |

---

## 1. 🐍 Python SDK (`itcowboy_guard`)

### Instalasi
```bash
# Dari root repositori:
pip install -e sdks/python-sdk/
```

### Penggunaan Dasar
```python
from itcowboy_guard import AgentGuard

# Inisialisasi Guard dengan URL Control Plane Gateway
guard = AgentGuard(
    license_key="ITCG-ENTERPRISE-eyJhbGciOiJFZDI1...",
    gateway_url="http://localhost:8000"
)

# Evaluasi sebelum fungsi dijalankan
decision = guard.evaluate(
    agent_id="agent_finance_01",
    action="execute_payment",
    target_system="Core_Banking_API",
    context={"amount": 150000, "recipient_account": "992011488"}
)

if decision["status"] == "ALLOW":
    # Jalankan aksi asli
    transfer_money(150000, "992011488")
elif decision["status"] == "REQUIRE_APPROVAL":
    print(f"⚠️ Aksi ditahan! Menunggu persetujuan CISO. Tiket: {decision['approval_id']}")
else:
    print(f"❌ Aksi diblokir oleh Control Plane: {decision['reason']}")
```

### Penggunaan Decorator pada LangChain / Tool LLM
```python
@guard.protect_tool(action="database_query", target_system="Customer_DB")
def query_customer(sql_query: str):
    return db.execute(sql_query)
```

---

## 2. 🟩 Node.js & TypeScript Middleware

### Instalasi
```bash
npm install ./sdks/node-middleware
# atau pasang package:
npm install @ctartech/ai-controlplane-middleware
```

### Penggunaan pada Express.js
```typescript
import express from 'express';
import { AgentGuardClient } from '@ctartech/ai-controlplane-middleware';

const app = express();
app.use(express.json());

const guard = new AgentGuardClient({
  controlPlaneUrl: 'http://localhost:8000',
  apiKey: 'itcg_live_api_key',
  failSafe: true // Default: amankan jika gateway offline
});

// Lindungi endpoint aksi AI Agent dengan middleware otomatis
app.post(
  '/api/agents/execute-trade',
  guard.expressMiddleware({
    action: 'execute_trade',
    targetSystem: 'Stock_Exchange_API'
  }),
  (req, res) => {
    // Hanya dieksekusi jika status wewenang ALLOW
    res.json({ success: true, message: 'Trade executed successfully' });
  }
);

app.listen(4000);
```

---

## 3. 🦀 Rust SDK (`agentguard-sdk`)

### Instalasi di `Cargo.toml`
```toml
[dependencies]
agentguard-sdk = { path = "../sdks/rust-sdk" }
tokio = { version = "1", features = ["full"] }
serde_json = "1.0"
```

### Penggunaan
```rust
use agentguard_sdk::{AgentGuardClient, EvaluateActionRequest};

#[tokio::main]
async fn main() {
    let client = AgentGuardClient::new("http://localhost:8000", "itcg_live_key");

    // Quick verification helper (True jika diizinkan, False jika ditahan/diblokir)
    let is_safe = client.verify_action_quick(
        "agent_finance_01",
        "execute_payment",
        "Bank_API",
        serde_json::json!({ "amount": 250000 })
    ).await;

    if is_safe {
        println!("✅ Aksi diizinkan! Memproses transaksi...");
    } else {
        println!("🛡️ Aksi ditahan atau diblokir oleh AI Control Plane.");
    }
}
```

---

## 4. 🐹 Go SDK (`agentguard`)

### Instalasi
```bash
go get github.com/ctartech/ai-controlplane/sdks/go-sdk
```

### Penggunaan
```go
package main

import (
	"fmt"
	"github.com/ctartech/ai-controlplane/sdks/go-sdk"
)

func main() {
	client := agentguard.NewClient("http://localhost:8000", "itcg_live_key")

	req := agentguard.EvaluateActionRequest{
		AgentID:      "agent_finance_01",
		Action:       "execute_disbursement",
		TargetSystem: "Treasury_API",
		Context: map[string]interface{}{
			"amount": 750000,
		},
	}

	res, err := client.EvaluateAction(req)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}

	fmt.Printf("Keputusan Wewenang: %s (Alasan: %s)\n", res.Decision, res.Reason)
}
```

---

## 🌟 Respon Wewenang Tri-State (Tiga Tingkat)

1. **`ALLOW`**:
   - Aksi agen berada di bawah plafon finansial.
   - Tidak ada pola berbahaya atau destruktif.
   - Status agen aktif (tidak terkena Kill-Switch).
2. **`REQUIRE_APPROVAL`**:
   - Aksi agen sah namun melampaui limit otonom (misal transaksi > Rp 500.000).
   - Aksi ditahan (HOLD) dan tiket `appr_...` terbit.
   - Notifikasi darurat dikirimkan secara paralel ke **WhatsApp CISO, Email Admin, dan Web Dashboard Approval Queue**.
3. **`BLOCK`**:
   - Aksi ilegal (contoh: injeksi shell `rm -rf`, ekspor basis data CRM massal).
   - Atau status agen sedang dimatikan darurat (**Emergency Kill-Switch Triggered**).
   - Permintaan seketika diputus dan dicatat ke Audit Trail sebagai insiden keamanan.
