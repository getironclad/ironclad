# Ironclad

**Sender-constrained session tokens: DPoP + DBSC + mTLS middleware and SDKs.**

Ironclad makes stolen token strings inert. Session tokens are bound to a
hardware-resident key on the user's device — via [DPoP (RFC 9449)],
[DBSC (W3C draft)], and [mTLS (RFC 8705)] — so an attacker who exfiltrates a
token cannot use it without also possessing the device. Refresh tokens are
bound to a non-extractable P-256 key (`cnf.jkt`), access tokens stay short-lived
(5-minute) Bearer, and DPoP proofs are demanded only on sensitive operations to
keep the hot path cheap.

> **Status:** Sprint 0 in progress — repo scaffold, protocol specs, and package
> skeletons. See the [roadmap](#roadmap) and [project board](#project-board).

## Repo layout

| Path                  | Description |
| --------------------- | ----------- |
| `packages/shared`     | Shared JWT/DPoP types, constants (TTLs, header/claim names), error hierarchy (`@ironclad/shared`) |
| `packages/gateway`    | Express middleware: DPoP verification pipeline, replay cache, DBSC + mTLS + attestation verifiers (`@ironclad/gateway`) |
| `packages/sdk-web`    | Browser SDK: hardware-bound `KeyManager` (WebCrypto), DPoP proof minting, DBSC detection, fetch client (`@ironclad/sdk-web`) |
| `examples/poc`        | Sprint 0 PoC: browser keygen → DPoP proof → Node verifier |
| `docs/spec`           | Protocol specifications (SPEC-001 token binding, SPEC-002 attestation, SPEC-003 key lifecycle) |
| `docs/adr`            | Architecture decision records (ADR-001…003) |
| `docs/migration`      | Migration guides (bot/VPS ecosystem) |

## Quickstart

```bash
pnpm install
pnpm build
pnpm test
pnpm lint
```

- TODO: publish packages to npm.
- TODO: implement the DPoP verifier (`packages/gateway/src/verifier/dpop.ts`).
- TODO: implement proof minting (`packages/sdk-web/src/proof.ts`).
- TODO: CI badges (lint/test) once the workflow is green on `main`.
- TODO: project board link and release process.

## Documentation

- [Protocol specs](docs/spec/) — `spec-001-token-binding.md`, `spec-002-attestation-formats.md`, `spec-003-key-lifecycle.md`
- [Architecture decision records](docs/adr/) — `001-refresh-token-binding`, `002-sensitive-only-proof`, `003-legacy-fallback`
- [Migration guides](docs/migration/) — bot/VPS ecosystem

## Security

Found a vulnerability? See [SECURITY.md](SECURITY.md) for our disclosure
process. We take reports seriously and commit to a fast, coordinated response.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). **All commits must be signed** and CI
status checks must pass.

## Roadmap

- **Sprint 0 (current):** monorepo scaffold, specs + ADRs, package skeletons, PoC.
- **Sprint 1:** RFC 9449 DPoP verifier + browser proof minting end to end.
- **Sprint 2:** replay cache (Redis), DBSC adapter, attestation verification.
- **Sprint 3:** legacy bearer fallback migration + bot ecosystem adapters.

## Project board

- TODO: link the GitHub project board.

[DPoP (RFC 9449)]: https://www.rfc-editor.org/rfc/rfc9449.html
[DBSC (W3C draft)]: https://wicg.github.io/dbsc/
[mTLS (RFC 8705)]: https://www.rfc-editor.org/rfc/rfc8705.html
