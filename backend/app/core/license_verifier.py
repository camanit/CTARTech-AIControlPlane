"""
CTARTech-AIControlPlane: Public-Key License Verifier (Zero-Leakage)
Verifies signed licenses using ONLY public_key.pem.
Cannot generate new licenses; safe to deploy to cloud/production servers.
"""

import base64
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Any, Tuple
from cryptography.hazmat.primitives.asymmetric import ed25519
from cryptography.hazmat.primitives import serialization


def b64url_decode(data: str) -> bytes:
    # Add padding if needed
    rem = len(data) % 4
    if rem > 0:
        data += "=" * (4 - rem)
    return base64.urlsafe_b64decode(data.encode("utf-8"))


class LicenseVerifier:
    def __init__(self, public_key_path: Path = None):
        if public_key_path is None:
            public_key_path = Path(__file__).resolve().parent / "keys" / "public_key.pem"
        self.public_key_path = public_key_path
        self._public_key = None

    def _load_public_key(self):
        if self._public_key is not None:
            return self._public_key
        if not self.public_key_path.exists():
            raise FileNotFoundError(
                f"Public key tidak ditemukan di {self.public_key_path}. "
                "Jalankan keygen di tools/license-issuer/keygen.py terlebih dahulu!"
            )
        with open(self.public_key_path, "rb") as f:
            self._public_key = serialization.load_pem_public_key(f.read())
        return self._public_key

    def verify_license_token(self, token: str) -> Tuple[bool, str, Dict[str, Any]]:
        """
        Verifikasi struktur, masa aktif, dan integritas signature lisensi.
        Format token: ITCG-<TIER>-<HEADER>.<PAYLOAD>.<SIGNATURE>
        Returns: (is_valid, message, payload_dict)
        """
        if not token or not token.startswith("ITCG-"):
            return False, "Format lisensi tidak valid (harus diawali 'ITCG-')", {}

        parts = token.split("-", 2)
        if len(parts) < 3:
            return False, "Struktur token lisensi rusak.", {}

        token_body = parts[2]
        jwt_parts = token_body.split(".")
        if len(jwt_parts) != 3:
            return False, "Format segmen kriptografis lisensi salah.", {}

        header_b64, payload_b64, signature_b64 = jwt_parts

        try:
            public_key = self._load_public_key()
            signing_input = f"{header_b64}.{payload_b64}".encode("utf-8")
            signature = b64url_decode(signature_b64)

            # Verifikasi cryptographic signature dengan Ed25519 Public Key
            public_key.verify(signature, signing_input)

            # Parse payload
            payload_json = b64url_decode(payload_b64).decode("utf-8")
            payload = json.loads(payload_json)

            # Periksa masa kedaluwarsa (expiry)
            now_ts = int(datetime.now(timezone.utc).timestamp())
            exp_ts = payload.get("exp", 0)
            if now_ts > exp_ts:
                exp_dt = datetime.fromtimestamp(exp_ts, timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
                return False, f"Lisensi telah kedaluwarsa pada {exp_dt}", payload

            return True, "Lisensi terverifikasi valid dan aktif.", payload

        except Exception as e:
            return False, f"Tanda tangan lisensi tidak valid atau telah dimanipulasi ({str(e)})", {}
