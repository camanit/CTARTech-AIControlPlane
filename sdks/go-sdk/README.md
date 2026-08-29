# 🐹 agentguard (Go SDK)
### Official Go SDK & Middleware for CTARTech-AIControlPlane

SDK resmi dan middleware HTTP/Gin untuk layanan mikro berbasis Golang yang berinteraksi dengan AI Agent.

---

## 🚀 Instalasi
```bash
go get github.com/ctartech/ai-controlplane/sdks/go-sdk
```

---

## 💻 Contoh Penggunaan

### 1. Evaluasi Standar
```go
package main

import (
	"fmt"
	"github.com/ctartech/ai-controlplane/sdks/go-sdk"
)

func main() {
	client := agentguard.NewClient("http://localhost:8000", "itcg_live_key")

	req := agentguard.EvaluateActionRequest{
		AgentID:      "agent_treasury_01",
		Action:       "execute_disbursement",
		TargetSystem: "Payroll_API",
		Context: map[string]interface{}{
			"amount": 250000,
		},
	}

	res, err := client.EvaluateAction(req)
	if err != nil {
		fmt.Printf("Gagal mengevaluasi wewenang: %v\n", err)
		return
	}

	fmt.Printf("Keputusan Wewenang: %s (Alasan: %s)\n", res.Decision, res.Reason)
}
```

### 2. Standard HTTP Server Middleware
```go
http.Handle("/api/agent/payout", client.StandardHTTPMiddleware("execute_payout", "Bank_Core", payoutHandler))
```
