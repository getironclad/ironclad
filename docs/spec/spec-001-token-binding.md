# SPEC-001: Sender-constrained session tokens (token binding)

- **Status:** Draft
- **Owner:** Ironclad contributors
- **Last updated:** 2026-11-11

## Goal

Render **stolen token strings inert**. A session token that is exfiltrated from
a user's device must be useless to an attacker who does not also possess the
user's hardware key. We achieve this by *binding* refresh tokens to a hardware
key and requiring cryptographic proof of possession for sensitive operations.

## Non-goals (v1)

- Defense against a fully compromised device (the attacker can always mint
  proofs from a compromised origin).
- Perfect privacy: no anonymous credentials, no key escrow (see
  spec-003).
- Support for non-web (native CLI) clients beyond the migration path in
  docs/migration/bot-ecosystem.md.

## Scope

- Web clients (browser SDK: Chrome/Edge/Firefox/Safari) and the server-side
  gateway middleware.
- Refresh token issuance, rotation, and redemption.
- Sensitive operations as defined in SPEC-001 §"Sensitive operations".

## Terminology

| Term        | Meaning |
| ----------- | ------- |
| **DPoP**    | Demonstrating Proof of Possession, [RFC 9449](https://www.rfc-editor.org/rfc/rfc9449.html). Binds an HTTP request to a proof-of-possession key via a signed `DPoP` header. |
| **DBSC**    | Device Bound Session Credentials, [W3C draft](https://wicg.github.io/dbsc/). Per-session, device-bound credentials minted by the browser, enabling sender-constrained sessions. |
| **mTLS**    | Mutual TLS, [RFC 8705](https://www.rfc-editor.org/rfc/rfc8705.html). Client-certificate binding of OAuth tokens. |
| **cnf.jkt** | JWT confirmation claim carrying the RFC 7638 JWK SHA-256 thumbprint of the bound public key. |
| **PoP key** | The proof-of-possession key pair held in the user's hardware. |

## Token model

Two token tiers with different lifetimes and proof requirements:

| Token        | Lifetime           | Bound?                                   | Proof required?          |
| ------------ | ------------------ | ---------------------------------------- | ------------------------ |
| **Refresh token** | Long-lived (rotation on use) | **Yes** — bound to a hardware key via `cnf.jkt` | Yes, on every redemption |
| **Access token**  | **5 minutes** (`ACCESS_TOKEN_TTL_MS = 300_000`) | No — plain `Bearer` | No, except sensitive ops |

### Refresh token

- Issued at the end of the interactive login flow, after the client has
  generated a non-extractable P-256 key pair (`@ironclad/sdk-web`).
- Carries a `cnf` confirmation claim:

  ```json
  {
    "cnf": {
      "jkt": "<base64url SHA-256 thumbprint of the bound public key>"
    }
  }
  ```

- The private key never leaves the device and is **non-extractable**
  (`extractable: false` in WebCrypto).
- Redeeming the refresh token requires a valid DPoP proof whose `cnf.jkt`
  matches the token's `cnf.jkt`. A mismatch is a
  `BindingMismatchError`.

### Access token

- **Short-lived Bearer token (5 minutes).** Because the window is short, a
  stolen access token is inert almost immediately. We deliberately accept
  bearer semantics for the short window to keep non-sensitive API calls cheap.
- No proof required on ordinary reads; a DPoP proof is required only on
  sensitive operations (see docs/adr/002-sensitive-only-proof.md).

### `cnf.jkt` claim structure

- Key type: **ECDSA P-256** (`{"kty":"EC","crv":"P-256"}`) for broad WebCrypto
  support and hardware (TPM/SE/StrongBox) compatibility.
- Value: RFC 7638 JWK SHA-256 thumbprint, base64url-encoded (43 chars,
  unpadded).
- Optional `attestation` blob attached alongside `jkt` on the *proof* (not the
  token) to prove hardware residency (formats in spec-002):

  ```json
  { "cnf": { "jkt": "<thumbprint>", "attestation": "<blob>", "attestationFormat": "tpm" } }
  ```

## Proof requirements

### DPoP proof (RFC 9449 §4) — sensitive operations only

A DPoP proof is required on:

- token issuance / refresh (`POST /token`, `POST /refresh`)
- privileged, irreversible, or financial operations (e.g. transfers, admin)

The proof must carry:

| Claim | Value |
| ----- | ----- |
| `jti` | unique, per-request random identifier |
| `htm` | HTTP method of the request |
| `htu` | HTTP URI of the request |
| `iat` | issued-at (UNIX seconds), within the replay window |
| `cnf.jkt` | thumbprint of the proof key, matching the token binding |

### Replay window

- A given `jti` may only be seen **once within `REPLAY_WINDOW_MS = 300_000`
  (5 min)**. Replays are rejected with a `ReplayError`.
- `iat` must not be in the future (beyond a small clock-skew allowance) and
  must not be older than the replay window.

### Non-sensitive requests

Ordinary API calls ride on the short-lived Bearer access token with no proof,
keeping request overhead low and DBSC/DPoP churn minimal. See
docs/adr/002-sensitive-only-proof.md.

## Legacy bearer fallback

During migration, tokens that are **not yet bound** to a hardware key are
accepted as plain Bearer for `LEGACY_BEARER_FALLBACK_DAYS = 90` days, behind a
feature flag. See docs/adr/003-legacy-fallback.md and
docs/migration/bot-ecosystem.md.

## Security considerations

- **Threat: token theft.** A stolen refresh token string cannot be redeemed
  without the device key (`cnf.jkt` mismatch). A stolen access token is usable
  for at most ~5 minutes.
- **Threat: replay.** `jti` uniqueness within the replay window plus access
  token short expiry bounds replay.
- **Threat: key theft.** Non-extractable keys cannot be exported from the
  device; attestation (spec-002) raises the bar for software-only keys.
- **Threat: phished *active* session.** DPoP binds the proof to `htm`/`htu`,
  so a proof minted for one endpoint cannot be replayed against another.
- **Clock skew:** proofs with future `iat` are rejected; we allow a small
  skew constant and rely on NTP on gateways.

## Open questions

- **Go vs TypeScript** for the gateway verifier core: TS keeps a single
  language across SDK + middleware; Go may be preferable for performance at
  scale. Pending benchmarks.
- **DBSC spec churn:** the W3C DBSC draft is evolving (naming, API shape,
  origin trials). We keep DBSC behind an adapter and prefer DPoP until it
  stabilizes.
- **Attestation trust anchors:** per-vendor roots (TPM AIK, Apple App Attest,
  Play Integrity) need a policy registry.
- **Revocation on device loss** and recovery UX (spec-003).
