# 🛡️ ITCowboy Guard - Python Client SDK

Client SDK resmi untuk menghubungkan AI Agent dengan **CTARTech-AIControlPlane Runtime Security Gateway**.

## 🚀 Instalasi
```bash
pip install -e sdk/
```
Atau jika dipublish:
```bash
pip install itcowboy-guard
```

## 💡 Contoh Penggunaan Cepat

```python
from itcowboy_guard import AgentGuard

# 1. Inisialisasi Guard dengan License Key Organisasi
guard = AgentGuard(
    license_key="ITCG-ENTERPRISE-eyJ...",
    gateway_url="http://127.0.0.1:8000"
)

# 2. Registrasi Agen (Satu kali di awal)
guard.register_agent(
    agent_id="finance_bot_01",
    name="Finance Payment Bot",
    owner="Finance Division",
    max_limit=500000.0, # Batas wewenang otomatis
    description="Agent untuk eksekusi refund dan pembayaran vendor"
)

# 3. Intersepsi Sebelum Eksekusi Aksi Berisiko
decision = guard.evaluate(
    agent_id="finance_bot_01",
    action="execute_payment",
    target_system="bank_payment_api",
    context={
        "amount": 750000.0,
        "recipient": "PT Vendor Sukses",
        "invoice_id": "INV-2026-001"
    },
    acting_for_user_id="user_budi_spv"
)

# 4. Tangani Hasil Keputusan
if decision["status"] == "ALLOW":
    print("✅ Aksi disetujui! Lanjutkan eksekusi ke bank_payment_api.")
elif decision["status"] == "REQUIRE_APPROVAL":
    print(f"⚠️ Aksi ditahan! {decision['reason']}")
    print(f"ID Tiket Persetujuan: {decision['approval_id']}")
    print("Notifikasi instan telah dikirimkan ke Telegram / WhatsApp admin.")
else:
    print(f"❌ Aksi diblokir total: {decision['reason']}")
```

## 🔒 Proteksi Fail-Safe
Jika server Control Plane tidak dapat dihubungi atau mengalami gangguan jaringan, SDK secara default memblokir aksi berisiko demi menjaga keamanan data enterprise.
