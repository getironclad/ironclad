/**
 * Shared JWT / DPoP / token-binding types for Ironclad.
 *
 * These types describe the wire format of sender-constrained session tokens
 * (RFC 9449 DPoP, W3C DBSC, and mTLS per RFC 8705).
 */

/** A single key/value header member of a DPoP proof JWT. */
export interface DpopHeader {
  /** JWT type. MUST be `dpop+jwt` for DPoP proofs (RFC 9449 §4.1). */
  typ: "dpop+jwt";
  /** Proof-of-possession key algorithm, e.g. `ES256`. */
  alg: string;
  /** JWT ID header for the proof key binding (`jwk`). */
  jwk?: Record<string, unknown>;
}

/**
 * A DPoP proof JWT (RFC 9449 §4.2).
 * The proof binds an HTTP request (method + URI) to a proof-of-possession key.
 */
export interface DpopProof {
  /** Unique proof identifier, used for replay detection. */
  jti: string;
  /** HTTP method of the request, e.g. `POST`. */
  htm: string;
  /** HTTP URI of the request, e.g. `https://api.example.com/token`. */
  htu: string;
  /** Issued-at time (UNIX seconds). */
  iat: number;
  /**
   * Confirmation claim binding the proof to a public key.
   * For Ironclad this is the JWK thumbprint of the proof key (RFC 7638).
   */
  cnf?: { jkt: string };
}

/**
 * Confirmation-method claim (`cnf`) carried on a token (RFC 7800 / RFC 8705).
 * The refresh token is bound to a hardware key via `jkt`.
 */
export interface TokenBinding {
  /** JWK SHA-256 thumbprint (RFC 7638) of the bound hardware public key. */
  jkt: string;
  /** Optional attestation blob describing the key's security hardware. */
  attestation?: string;
  /** Attestation format identifier when `attestation` is present. */
  attestationFormat?: AttestationFormat;
}

/**
 * Attestation formats supported by the Ironclad hardware-bound key model.
 */
export type AttestationFormat =
  | "tpm" // TPM 2.0 (PCR quote / AIK certificate)
  | "apple-se" // Apple Secure Enclave
  | "android" // Android StrongBox / Play Integrity
  | "dbsc"; // Device Bound Session Credentials (Chrome/Edge)

/** A decoded JWT header, typed for DPoP. */
export interface JwtHeader {
  alg: string;
  typ?: string;
}

/** A decoded JWT claims set. */
export interface JwtClaims {
  iss?: string;
  sub?: string;
  aud?: string | string[];
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  cnf?: { jkt?: string };
}
