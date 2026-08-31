"""
CTARTech-AIControlPlane: Python Developer SDK
Provides runtime interception and task-bounded authority evaluation for AI Agents.
"""

from typing import Any, Dict, Optional
import httpx


class AgentGuard:
    """
    Klien pengaman runtime security untuk AI Agent enterprise.
    Menyisipkan verifikasi otoritas dan audit trail sebelum aksi dieksekusi.
    """

    def __init__(
        self,
        license_key: str,
        gateway_url: str = "http://127.0.0.1:8000",
        timeout: float = 4.0,
        fail_safe_block: bool = True
    ):
        """
        :param license_key: Token lisensi organisasi (ITCG-...)
        :param gateway_url: URL server Rust Control Plane Gateway
        :param timeout: Batas waktu tunggu evaluasi (detik)
        :param fail_safe_block: Jika True, blokir aksi jika gateway offline demi keamanan enterprise
        """
        self.license_key = license_key.strip()
        self.gateway_url = gateway_url.rstrip("/")
        self.timeout = timeout
        self.fail_safe_block = fail_safe_block

    def evaluate(
        self,
        agent_id: str,
        action: str,
        target_system: str,
        context: Dict[str, Any],
        acting_for_user_id: Optional[str] = None,
        session_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Mengirimkan evaluasi wewenang aksi agen AI secara real-time ke Rust Control Plane.
        
        Returns format:
        {
            "status": "ALLOW" | "REQUIRE_APPROVAL" | "BLOCK",
            "decision": "...",
            "reason": "...",
            "audit_id": "...",
            "approval_id": "..." (jika REQUIRE_APPROVAL)
        }
        """
        endpoint = f"{self.gateway_url}/api/v1/guard/evaluate"
        headers = {
            "Authorization": f"Bearer {self.license_key}",
            "Content-Type": "application/json",
            "User-Agent": "ITCowboyGuard-PythonSDK/1.0.0"
        }
        payload = {
            "agent_id": agent_id,
            "action": action,
            "target_system": target_system,
            "context": context,
            "acting_for_user_id": acting_for_user_id,
            "session_id": session_id
        }

        try:
            with httpx.Client(timeout=self.timeout) as client:
                response = client.post(endpoint, json=payload, headers=headers)
                if response.status_code == 200:
                    return response.json()
                elif response.status_code in [401, 402, 403]:
                    # Lisensi tidak valid, kuota habis, atau wewenang ditolak
                    err_detail = response.json().get("detail", response.text)
                    return {
                        "status": "BLOCK",
                        "agent_id": agent_id,
                        "action": action,
                        "reason": f"Security Gateway Rejection: {err_detail}",
                        "audit_id": "aud_auth_error"
                    }
                else:
                    response.raise_for_status()
                    return response.json()

        except Exception as e:
            if self.fail_safe_block:
                return {
                    "status": "BLOCK",
                    "agent_id": agent_id,
                    "action": action,
                    "reason": f"Fail-safe Mode Triggered: Control Plane unreachable ({str(e)})",
                    "audit_id": "aud_fail_safe_lock"
                }
            else:
                return {
                    "status": "ALLOW",
                    "agent_id": agent_id,
                    "action": action,
                    "reason": f"Fail-open fallback: Gateway error ({str(e)})",
                    "audit_id": "aud_fail_open_warning"
                }

    def register_agent(
        self,
        agent_id: str,
        name: str,
        owner: str,
        max_limit: float = 100000.0,
        description: str = ""
    ) -> Dict[str, Any]:
        """Mendaftarkan identitas agen baru ke Central Agent Registry di Control Plane"""
        endpoint = f"{self.gateway_url}/api/v1/agents/register"
        headers = {
            "Authorization": f"Bearer {self.license_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "agent_id": agent_id,
            "name": name,
            "owner": owner,
            "max_limit": max_limit,
            "description": description
        }
        with httpx.Client(timeout=self.timeout) as client:
            response = client.post(endpoint, json=payload, headers=headers)
            response.raise_for_status()
            return response.json()

    def check_health(self) -> Dict[str, Any]:
        """Cek status kesehatan dan konektivitas ke Rust Control Plane"""
        endpoint = f"{self.gateway_url}/health"
        with httpx.Client(timeout=self.timeout) as client:
            response = client.get(endpoint)
            response.raise_for_status()
            return response.json()
