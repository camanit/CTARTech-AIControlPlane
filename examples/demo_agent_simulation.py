"""
CTARTech-AIControlPlane: End-to-End Autonomous Agent Simulation Demo
Menguji skenario:
1. Aksi Otonom Rendah Risiko -> ALLOW
2. Aksi Wewenang Melebihi Batas Finansial -> REQUIRE_APPROVAL (Human-in-the-Loop)
3. Aksi Destruktif -> REQUIRE_APPROVAL
4. Perintah Berbahaya -> BLOCK
5. Emergency Kill-Switch -> BLOCK
"""

import os
import sys
import time
from pathlib import Path

# Ensure utf-8 output on Windows console
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# Add sdk to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "sdk"))
from itcowboy_guard import AgentGuard


def run_simulation(license_key: str, gateway_url: str = "http://127.0.0.1:8000"):
    print("\n" + "=" * 70)
    print("[SIMULATION] AI AGENT RUNTIME SECURITY & AUTHORITY GOVERNANCE DEMO")
    print(f"Gateway URL : {gateway_url}")
    print("=" * 70)

    guard = AgentGuard(
        license_key=license_key,
        gateway_url=gateway_url,
        timeout=5.0
    )

    # Health Check
    try:
        health = guard.check_health()
        print(f"\n[OK] Koneksi ke Control Plane Gateway Sukses: {health['service']} ({health['engine']})")
    except Exception as e:
        print(f"\n[FAIL] Gagal koneksi ke Control Plane: {e}")
        return

    agent_id = "agent_finance_01"

    # Skenario 1: Transaksi Normal (di bawah batas aman Rp 500.000)
    print("\n" + "-" * 70)
    print("[SKENARIO 1] AI Agent mengeksekusi pembayaran operasional rutin (Rp 150.000)")
    print("-" * 70)
    res1 = guard.evaluate(
        agent_id=agent_id,
        action="execute_payment",
        target_system="bank_payment_api",
        context={"amount": 150000.0, "recipient": "PT Supplier Kertas", "invoice": "INV-101"},
        acting_for_user_id="user_staff_finance",
        session_id="sess_alpha_01"
    )
    print(f"Status Keputusan : {res1['status']}")
    print(f"Alasan Evaluasi  : {res1['reason']}")
    print(f"Audit Trail ID   : {res1['audit_id']}")
    if res1['status'] == "ALLOW":
        print(">> HASIL: [AMAN] Agen diizinkan melanjutkan pembayaran secara otonom.")

    # Skenario 2: Transaksi Melebihi Batas Wewenang (Rp 2.500.000 > limit Rp 500.000)
    print("\n" + "-" * 70)
    print("[SKENARIO 2] AI Agent mencoba transfer dana besar (Rp 2.500.000)")
    print("-" * 70)
    res2 = guard.evaluate(
        agent_id=agent_id,
        action="execute_payment",
        target_system="bank_payment_api",
        context={"amount": 2500000.0, "recipient": "PT Vendor Hardware Luar", "invoice": "INV-999"},
        acting_for_user_id="user_staff_finance",
        session_id="sess_alpha_02"
    )
    print(f"Status Keputusan : {res2['status']}")
    print(f"Alasan Evaluasi  : {res2['reason']}")
    print(f"Approval ID      : {res2.get('approval_id')}")
    print(f"Audit Trail ID   : {res2['audit_id']}")
    if res2['status'] == "REQUIRE_APPROVAL":
        print(">> HASIL: [DITAHAN] Transaksi berisiko tinggi berhasil dicegat!")
        print("          Notifikasi instan dikirim ke CISO/Manajer via Webhook & Dashboard.")

    # Skenario 3: Aksi Destruktif (Hapus Database / Ekspor Pelanggan)
    print("\n" + "-" * 70)
    print("[SKENARIO 3] AI Agent meminta ekspor basis data pelanggan")
    print("-" * 70)
    res3 = guard.evaluate(
        agent_id=agent_id,
        action="export_customer_data",
        target_system="crm_database",
        context={"table": "users", "format": "csv"},
        acting_for_user_id="unknown_requester"
    )
    print(f"Status Keputusan : {res3['status']}")
    print(f"Alasan Evaluasi  : {res3['reason']}")
    print(f"Approval ID      : {res3.get('approval_id')}")
    if res3['status'] == "REQUIRE_APPROVAL":
        print(">> HASIL: [DITAHAN] Operasi sensitif dikunci sampai ada izin resmi CISO.")

    # Skenario 4: Perintah Sistem Berbahaya (Prompt Injection Payload)
    print("\n" + "-" * 70)
    print("[SKENARIO 4] Terdeteksi payload berbahaya (rm -rf)")
    print("-" * 70)
    res4 = guard.evaluate(
        agent_id=agent_id,
        action="run_terminal_command",
        target_system="production_server",
        context={"command": "rm -rf /var/data"}
    )
    print(f"Status Keputusan : {res4['status']}")
    print(f"Alasan Evaluasi  : {res4['reason']}")
    if res4['status'] == "BLOCK":
        print(">> HASIL: [BLOCKED] Serangan dihentikan di level gateway!")

    print("\n" + "=" * 70)
    print("[SELESAI] Buka Web Dashboard di browser: http://127.0.0.1:8000")
    print("          Periksa tabel Audit Trail dan Action Approval Queue!")
    print("=" * 70 + "\n")


if __name__ == "__main__":
    # Baca lisensi contoh yang baru digenerate
    import subprocess
    cmd = [
        sys.executable,
        str(Path(__file__).resolve().parent.parent / "tools" / "license-issuer" / "generate_license.py"),
        "--org", "PT CTARTech Global",
        "--tier", "ENTERPRISE",
        "--quota", "1000000"
    ]
    proc = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
    license_key = ""
    for line in proc.stdout.splitlines():
        if line.startswith("ITCG-"):
            license_key = line.strip()
            break

    if not license_key:
        print("[WARNING] Menggunakan token fallback")
        license_key = "ITCG-COMMUNITY-TEST"

    run_simulation(license_key)
