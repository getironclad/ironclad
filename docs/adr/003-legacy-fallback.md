# ADR-003: 90-day legacy bearer fallback behind a feature flag

- **Status:** Accepted
- **Date:** 2026-11-11

## Context

Existing clients, bots, and VPS workloads issue/use tokens that were not
created with a hardware-bound key. Turning on `cnf.jkt` enforcement
immediately would break every legacy integration. We need a migration window
that keeps the service operational while clients are upgraded.

## Decision

Introduce a **90-day legacy bearer fallback** (`LEGACY_BEARER_FALLBACK_DAYS =
90`), controlled by a feature flag (`GatewayConfig.legacyBearerFallback`,
default `true` during migration):

- Tokens issued **without** a binding (`cnf.jkt` absent) continue to work as
  plain Bearer for up to 90 days from rollout.
- Tokens issued **with** a binding always require proof; they are never
  downgraded.
- After the window, the flag flips to `false` and unbound tokens are rejected
  with a clear error directing clients to re-authenticate.

## Consequences

**Positive**

- Graceful, time-boxed migration for existing users and bot/VPS ecosystems.
- No hard cutover risk at launch.
- New tokens are bound from day one, so security posture improves immediately
  for all *new* sessions.

**Negative**

- Unbound tokens remain exploitable for up to 90 days if stolen. Accepted and
  mitigated by the short access-token TTL and by monitoring for unbound-token
  abuse during the window.
- The flag must be flipped on time; an ops runbook and dashboard alert cover
  this.

## Alternatives

1. **Hard cutover (no fallback).** Cleanest security, but breaks legacy
   clients immediately; rejected.
2. **Indefinite fallback.** No deadline means no migration pressure; rejected.
