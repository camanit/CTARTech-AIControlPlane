use crate::models::LicenseClaims;
use base64::engine::general_purpose::URL_SAFE_NO_PAD;
use base64::Engine;
use chrono::Utc;
use ed25519_dalek::{Signature, Verifier, VerifyingKey};
use std::fs;
use std::path::Path;

pub struct LicenseVerifier {
    verifying_key: VerifyingKey,
}

impl LicenseVerifier {
    pub fn from_pem_file<P: AsRef<Path>>(path: P) -> Result<Self, String> {
        let pem_str = fs::read_to_string(path.as_ref())
            .map_err(|e| format!("Gagal membaca public_key.pem: {}", e))?;
        Self::from_pem_str(&pem_str)
    }

    pub fn from_pem_str(pem_str: &str) -> Result<Self, String> {
        // Strip PEM headers and whitespace
        let cleaned: String = pem_str
            .lines()
            .filter(|line| !line.starts_with("-----"))
            .collect::<Vec<&str>>()
            .join("");

        let der_bytes = base64::engine::general_purpose::STANDARD
            .decode(&cleaned)
            .map_err(|e| format!("Gagal decode Base64 DER public key: {}", e))?;

        // Ed25519 SubjectPublicKeyInfo is 44 bytes: 12 bytes header + 32 bytes raw key
        let raw_key_bytes: &[u8] = if der_bytes.len() == 44 {
            &der_bytes[12..44]
        } else if der_bytes.len() == 32 {
            &der_bytes[..]
        } else {
            return Err(format!(
                "Format Ed25519 public key tidak terduga (panjang: {} bytes)",
                der_bytes.len()
            ));
        };

        let key_array: [u8; 32] = raw_key_bytes
            .try_into()
            .map_err(|_| "Gagal konversi ke 32-byte array")?;

        let verifying_key = VerifyingKey::from_bytes(&key_array)
            .map_err(|e| format!("VerifyingKey Ed25519 invalid: {}", e))?;

        Ok(Self { verifying_key })
    }

    pub fn verify_token(&self, token: &str) -> Result<LicenseClaims, String> {
        let token = token.trim();
        if !token.starts_with("ITCG-") {
            return Err("Format lisensi salah (harus diawali 'ITCG-')".into());
        }

        let parts: Vec<&str> = token.splitn(3, '-').collect();
        if parts.len() < 3 {
            return Err("Format token lisensi rusak".into());
        }

        let body = parts[2];
        let segments: Vec<&str> = body.split('.').collect();
        if segments.len() != 3 {
            return Err("Token lisensi harus memiliki 3 segmen JWT".into());
        }

        let (header_b64, payload_b64, signature_b64) = (segments[0], segments[1], segments[2]);

        // Decode signature
        let sig_bytes = URL_SAFE_NO_PAD
            .decode(signature_b64)
            .map_err(|e| format!("Gagal decode signature base64: {}", e))?;

        if sig_bytes.len() != 64 {
            return Err(format!("Panjang signature salah ({} bytes, harus 64)", sig_bytes.len()));
        }

        let sig_array: [u8; 64] = sig_bytes
            .as_slice()
            .try_into()
            .map_err(|_| "Gagal konversi signature")?;
        let signature = Signature::from_bytes(&sig_array);

        // Verify cryptographic signature against (header.payload)
        let signing_input = format!("{}.{}", header_b64, payload_b64);
        self.verifying_key
            .verify(signing_input.as_bytes(), &signature)
            .map_err(|e| format!("Tanda tangan kriptografis lisensi TIDAK VALID: {}", e))?;

        // Decode payload
        let payload_bytes = URL_SAFE_NO_PAD
            .decode(payload_b64)
            .map_err(|e| format!("Gagal decode payload base64: {}", e))?;

        let claims: LicenseClaims = serde_json::from_slice(&payload_bytes)
            .map_err(|e| format!("Format JSON payload lisensi salah: {}", e))?;

        // Check expiration
        let now = Utc::now().timestamp();
        if now > claims.exp {
            return Err(format!(
                "Lisensi telah KEDALUWARSA pada timestamp {} (sekarang: {})",
                claims.exp, now
            ));
        }

        Ok(claims)
    }
}
