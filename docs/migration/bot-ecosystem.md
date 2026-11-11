# Migration guide: bot / VPS ecosystem

This guide covers migrating bots, CI systems, and headless VPS workloads —
clients that cannot use the browser SDK's WebCrypto path — to
sender-constrained session tokens.

## Who is this for?

- Long-running daemons and bots that call the API with service credentials.
- VPS-hosted agents that currently store refresh tokens on disk.
- Integration partners using the public API.

## Why it matters

With SPEC-001, refresh tokens are bound to a hardware key. A plain text file
with a refresh token on a VPS is now a liability: the token is unusable
without the bound key, and we give you a **90-day window**
(`LEGACY_BEARER_FALLBACK_DAYS`) to upgrade before unbound tokens are rejected.

## Migration options

### Option A — HSM / TPM adapter (recommended for high-value bots)

Put the proof-of-possession key in hardware available to the bot:

- Cloud HSM (e.g. AWS KMS, GCP KMS, Azure Key Vault) with a signing key.
- Local TPM 2.0 on the VPS host.

The bot signs DPoP proofs with the HSM key and presents the public-key
thumbprint (`cnf.jkt`) at token issuance.

**TODO:** a reference adapter for at least one HSM provider in
`@ironclad/gateway` (see `src/verifier/` and `src/attestation/tpm.ts`).

### Option B — Software key on the VPS (fallback)

Generate a non-extractable-*style* software key on the VPS and protect it with
filesystem permissions and at-rest encryption. Weaker than an HSM but still
binds tokens to the specific host.

**TODO:** document recommended key storage (secret manager vs. encrypted
file).

## Timeline

| Day        | Action |
| ---------- | ------ |
| **0**      | Rollout begins; new tokens bound, legacy bearer fallback `true`. |
| **30**     | All first-party bots migrated to Option A/B. |
| **60**     | Remaining partners notified; dashboard reports unbound-token usage. |
| **90**     | Feature flag flips to `false`; unbound tokens rejected. |

## Runbook

- Monitor the "unbound token usage" dashboard during the window.
- If a critical integration is not migrated by day ~80, reach out and coordinate
  a targeted extension before the flag flip.
- After flip, any `401` from unbound tokens points the client to this guide.
