# Sprint 0 PoC: hardware-bound DPoP session tokens

The goal of the Sprint 0 proof-of-concept is to answer one question end to end:

> Can we mint a DPoP proof in the browser (Chrome WebCrypto, non-extractable
> P-256 key) and verify it in Node, such that a stolen token string is inert
> without the user's device?

## Flow

1. **Browser (keygen)** — generate a non-extractable ECDSA P-256 key pair via
   `crypto.subtle.generateKey`. The private key never leaves the browser.
2. **Browser (mint)** — build a DPoP proof JWT (RFC 9449): `{ jti, htm, htu,
   iat, cnf.jkt }` signed with the private key. Attach it as the `DPoP` header.
3. **Node (verify)** — verify the proof: signature over `htm | htu`, `iat`
   freshness, `jti` uniqueness (replay cache), and `cnf.jkt` matches the key
   bound at token issuance.

## Files

| File        | Purpose                                            | Status |
| ----------- | -------------------------------------------------- | ------ |
| `keygen.ts` | WebCrypto keygen + DPoP proof minting (browser)    | TODO   |
| `verify.ts` | Node verifier: parse + verify the DPoP proof       | TODO   |
| `poc.test.ts` | Smoke test wiring the two sides together          | TODO   |

## Quick start

```bash
pnpm install
pnpm test
```

## TODO checklist

- [ ] `keygen.ts`: implement `generateKeyPair()` + `mintDpopProof()` using
      `@ironclad/sdk-web` primitives.
- [ ] `verify.ts`: implement RFC 9449 §4 verification using
      `@ironclad/gateway` verifier stubs.
- [ ] `poc.test.ts`: browser-keygen → mint → Node-verify round trip.
- [ ] Demonstrate that a proof minted for one `htm`/`htu` is rejected for
      another (method/URI binding).
- [ ] Demonstrate replay rejection: same `jti` presented twice.
- [ ] Demonstrate that a signature from a *different* key is rejected
      (`cnf.jkt` mismatch).
