import type { DpopProof } from "@ironclad/shared";

/** Inputs a DPoP proof is verified against (RFC 9449 §4). */
export interface DpopVerifyOptions {
  /** HTTP method of the request the proof is attached to. */
  htm: string;
  /** HTTP URI of the request the proof is attached to. */
  htu: string;
  /** Optional bound key thumbprint the proof's `cnf.jkt` must match. */
  expectedJkt?: string;
  /**
   * Proof freshness window. `iat` must not be older than this.
   * Defaults to 5 minutes.
   */
  maxAgeMs?: number;
}

/**
 * Verify a DPoP proof JWT (RFC 9449 §4).
 *
 * TODO:
 * - parse and validate the JWT structure (three dot-separated segments)
 * - check the `typ` header is `dpop+jwt` and `alg` is allowed (e.g. ES256)
 * - verify the signature over the ASCII-encoded `htm | htu` (RFC 9449 §4.2)
 * - check `htm` and `htu` match the presented request method and URI
 * - check `iat` freshness: not in the future, and within `maxAgeMs`
 * - check `jti` uniqueness (handled by the replay cache in middleware)
 * - check `cnf.jkt` matches `expectedJkt` when provided
 */
export function verifyDpopProof(
  _proof: string,
  _opts: DpopVerifyOptions,
): Promise<DpopProof> {
  // TODO(verifier): implement RFC 9449 §4 verification.
  throw new Error("verifyDpopProof: not implemented yet");
}
