# 🟩 @ctartech/ai-controlplane-middleware
### Official Node.js, Express & LangChain Middleware for AI Agents

Middleware resmi untuk mengamankan tindakan otonom Agen AI berbasis JavaScript/TypeScript (Express, Next.js, LangChain.js) sebelum mengeksekusi aksi kritis pada infrastruktur produksi.

---

## 🚀 Instalasi
```bash
npm install ./sdks/node-middleware
# atau via package manager:
npm install @ctartech/ai-controlplane-middleware
```

---

## 💻 Contoh Penggunaan

### 1. Express.js Route Guard Middleware
```typescript
import express from 'express';
import { AgentGuardClient } from '@ctartech/ai-controlplane-middleware';

const app = express();
app.use(express.json());

const guard = new AgentGuardClient({
  controlPlaneUrl: 'http://localhost:8000',
  apiKey: 'itcg_live_api_key',
  failSafe: true // Otomatis blokir jika gateway offline
});

app.post(
  '/api/payments/disburse',
  guard.expressMiddleware({
    action: 'execute_disbursement',
    targetSystem: 'Bank_Core_Service'
  }),
  (req, res) => {
    // Hanya dieksekusi jika wewenang ALLOW
    res.json({ status: 'SUCCESS', message: 'Disbursement processed' });
  }
);

app.listen(3001, () => console.log('Server protected on port 3001'));
```

### 2. LangChain / LLM Tool Wrapper
```typescript
import { AgentGuardClient } from '@ctartech/ai-controlplane-middleware';

const guard = new AgentGuardClient({
  controlPlaneUrl: 'http://localhost:8000'
});

// Bungkus tool berbahaya agar tidak dapat dieksekusi secara liar oleh LLM
const executeRefund = guard.wrapTool(
  'process_refund',
  'Stripe_Billing',
  async ({ orderId, amount }) => {
    return await stripe.refunds.create({ order: orderId, amount });
  }
);
```
