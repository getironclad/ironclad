# ADR-001: Bind refresh tokens to a hardware key; keep access tokens as short-lived Bearer

- **Status:** Accepted
- **Date:** 2026-11-11

## Context

Session tokens are routinely stolen via XSS, logs, browser sync, and
infiltration of upstream services. A long-lived refresh token that is a plain
`Bearer` credential is a permanent backdoor once exfiltrated. We want a stolen
token *string* to be inert without also possessing the user's device.

## Decision

- **Refresh tokens are bound** to a hardware-resident key via a `cnf.jkt`
  JWK thumbprint (RFC 7638) and require a DPoP proof (RFC 9449) with a matching
  `jkt` on every redemption.
- **Access tokens stay as plain short-lived Bearer** tokens with a **5-minute
  TTL** (`ACCESS_TOKEN_TTL_MS`). They are deliberately *not* bound, because
  their short lifetime already renders theft inert, and skipping per-request
  proofs keeps ordinary API traffic cheap.
- The proof-of-possession key is **non-extractable** in WebCrypto and, where
  available, hardware-attested (see spec-002).

## Consequences

**Positive**

- Stolen refresh tokens are useless without the device key.
- Stolen access tokens are useful for at most ~5 minutes.
- Low overhead on the hot path (no proof on ordinary reads).
- Works with today's browser WebCrypto (no server-side key storage).

**Negative**

- Device loss requires re-binding (recovery flow, spec-003).
- Token issuance and sensitive ops now require proof verification latency.
- DPoP adds implementation complexity vs plain Bearer.

## Alternatives

1. **Bind access tokens too (full DPoP everywhere).** Stronger, but higher
   per-request overhead and more client churn; rejected for v1.
2. **mTLS only.** Requires client certificates in the browser, which the web
   platform does not expose; rejected for web clients (available as an
   option for non-web clients).
3. **DBSC-only.** Attractive long-term (W3C draft), but not stable or
   universally available yet; adopted later behind an adapter.
