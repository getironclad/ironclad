# SPEC-002: Attestation formats (DRAFT / TODO)

- **Status:** Draft (stub)
- **Last updated:** 2026-11-11

This document will define the attestation formats Ironclad accepts as evidence
that a bound key lives in hardware, and the policy rules for trusting them.

The `AttestationFormat` union is: `"tpm" | "apple-se" | "android" | "dbsc"`.

## TPM 2.0 (`tpm`)

TODO:

- AIK (attestation identity key) certificate chain verification.
- PCR quote verification over the application key.
- Nonce freshness to prevent replay of quotes.

## Apple Secure Enclave (`apple-se`)

TODO:

- App Attest / Secure Enclave attestation object verification.
- Assertion verification over the challenge nonce.

## Android (`android`)

TODO:

- StrongBox / TEE-backed key attestation certificate verification.
- Play Integrity verdict verification.

## DBSC (`dbsc`)

TODO:

- Device-bound session credential assertion verification (W3C draft).

## Policy

TODO: define which attestation formats are *required* vs *optional* for which
token tiers, and the fallback posture when attestation is unavailable.
