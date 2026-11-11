/**
 * Verify a Device Bound Session Credential (W3C DBSC draft).
 *
 * DBSC provides per-session, hardware-bound credentials issued by Chrome/Edge
 * to the browser, enabling sender-constrained sessions without user gestures.
 *
 * TODO:
 * - parse the DBSC assertion / credential bound to the session
 * - verify the credential's signature over the session and origin
 * - check the credential is bound to the same origin as the request
 * - extract and return the bound public key (for `cnf.jkt` binding)
 */
export function verifyDbscProof(_credential: unknown): Promise<{ jkt: string }> {
  // TODO(verifier): implement W3C DBSC assertion verification.
  throw new Error("verifyDbscProof: not implemented yet");
}
