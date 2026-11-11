import type { NextFunction, Request, RequestHandler, Response } from "express";
import { verifyDpopProof } from "./verifier/dpop.js";
import { resolveConfig, type GatewayConfig } from "./config.js";
import { InMemoryReplayCache, type ReplayCache } from "./replay/cache.js";
import { InvalidProofError } from "@ironclad/shared";

/**
 * Sender-constrained authentication middleware.
 *
 * Pipeline (per sensitive operation):
 *
 * 1. Require a DPoP proof header on requests to `config.sensitiveOperations`.
 * 2. Verify the proof per RFC 9449 §4:
 *    - signature over (htm | htu) of the actual request
 *    - `htm` / `htu` match the request method and URI
 *    - `iat` is fresh (not in the future, not older than the replay window)
 *    - `jti` is unique within the replay window (replay cache)
 * 3. Check `cnf.jkt` against the key bound at token issuance.
 * 4. Bind the verified subject to the request context.
 *
 * TODO: verify proof signature — see src/verifier/dpop.ts.
 * TODO: resolve the token's `cnf.jkt` from the bound key store.
 * TODO: check `jti` against the replay cache (currently in-memory only).
 * TODO: bind the subject to `req` context for downstream handlers.
 * TODO: enforce the legacy bearer fallback path (docs/adr/003-legacy-fallback.md).
 */
export function dpopAuth(
  overrides: Partial<GatewayConfig> = {},
): RequestHandler {
  const config = resolveConfig(overrides);
  const replayCache: ReplayCache = new InMemoryReplayCache(config.replayWindowMs);

  return (req: Request, res: Response, next: NextFunction) => {
    const isSensitive = config.sensitiveOperations.some(
      (op) => req.path === op || req.path.startsWith(`${op}/`),
    );

    if (!isSensitive) {
      // Non-sensitive requests ride on the short-lived Bearer access token.
      next();
      return;
    }

    const proof = req.header("dpop");
    if (!proof) {
      const err = new InvalidProofError("Missing DPoP proof on sensitive operation");
      res.status(err.status).json({ error: err.code, message: err.message });
      return;
    }

    // TODO: implement the full verification pipeline described above.
    // For now this is a placeholder that accepts any syntactically present proof.
    void verifyDpopProof(proof, { htm: req.method, htu: req.originalUrl });

    // TODO: reject replays by checking `jti` against the replay cache.
    void replayCache;

    // TODO: bind the verified subject (and its bound key thumbprint) to `req`.

    next();
  };
}

export default dpopAuth;
