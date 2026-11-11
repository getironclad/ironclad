# ADR-002: Require DPoP proof only on sensitive operations (not every API call)

- **Status:** Accepted
- **Date:** 2026-11-11

## Context

RFC 9449 DPoP can be applied to *every* request, but that multiplies proof
minting/verification costs, complicates client caching, and risks breaking
third-party integrations that cannot mint proofs. The marginal security gain
of proving possession on every request is small because access tokens are
short-lived (ADR-001).

## Decision

The gateway requires a DPoP proof **only on a configurable list of sensitive
operations** (`GatewayConfig.sensitiveOperations`, default: token issuance,
refresh, transfers, and admin paths). All other requests authenticate with the
plain 5-minute Bearer access token. See `packages/gateway/src/config.ts`.

"Sensitive" is defined as operations that:

- mint or rotate long-lived credentials (refresh tokens), or
- move value or change security posture irreversibly (transfers, admin).

## Consequences

**Positive**

- Hot path stays cheap: proof minting/verification only on rare operations.
- Easier third-party integration (ordinary API calls need no DPoP).
- Fits the threat model: the credentials that *matter* when stolen are
  exactly the ones that demand proof.

**Negative**

- The gateway must correctly classify operations; misclassification could
  leave a sensitive endpoint unprotected. Mitigated by an explicit,
  deny-by-default allowlist review process and tests.

## Alternatives

1. **Proof on every request.** Rejected for cost and integration friction
   (see above).
2. **Require proof only for refresh, nothing else.** Too narrow — misses
   irreversible financial/admin operations.
