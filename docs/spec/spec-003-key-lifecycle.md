# SPEC-003: Key lifecycle (DRAFT / TODO)

- **Status:** Draft (stub)
- **Last updated:** 2026-11-11

This document will define the full lifecycle of the hardware-bound PoP key.

## Generation

TODO:

- Key generation at first login (non-extractable P-256, `@ironclad/sdk-web`).
- Registration of the public key + attestation with the server.

## Rotation

TODO:

- Re-issue the key pair and re-bind the refresh token (`cnf.jkt` change).
- Backwards compatibility during rotation (two `cnf` entries?).

## Revocation

TODO:

- Revoke a bound key (device lost/stolen) and invalidate its refresh tokens.
- Immediate revocation endpoint + emergency kill switch.

## Recovery

TODO:

- Recovery via **2FA + verified email** when the device is lost.
- No key escrow in v1: recovery always mints a *new* key and re-binds.
- Time-lock / review for high-value recovery.
