/**
 * Shared protocol constants for Ironclad: header names, claim names, and TTLs.
 */

/** HTTP header names. */
export const HEADER_NAMES = {
  /** Standard HTTP Authorization header (RFC 7235). */
  Authorization: "authorization",
  /** DPoP proof header (RFC 9449). */
  DPoP: "dpop",
  /** Attestation header (Ironclad extension for hardware attestation blobs). */
  Attestation: "x-ironclad-attestation",
  /** Client certificate header (terminating proxies, mTLS per RFC 8705). */
  ClientCert: "x-ironclad-client-cert",
  /** Trace / correlation header. */
  RequestId: "x-ironclad-request-id",
} as const;

/** JWT claim names. */
export const CLAIM_NAMES = {
  /** Confirmation claim (RFC 7800). */
  cnf: "cnf",
  /** Confirmation key thumbprint (`cnf.jkt`). */
  jkt: "jkt",
  /** JWT ID (replay prevention). */
  jti: "jti",
  /** HTTP method (DPoP, RFC 9449). */
  htm: "htm",
  /** HTTP URI (DPoP, RFC 9449). */
  htu: "htu",
  /** Issued-at. */
  iat: "iat",
  /** Expiry. */
  exp: "exp",
  /** Subject. */
  sub: "sub",
} as const;

/**
 * Access token lifetime. Access tokens are short-lived Bearer tokens;
 * a stolen access token is thus inert within ~5 minutes.
 */
export const ACCESS_TOKEN_TTL_MS = 300_000; // 5 minutes

/**
 * DPoP proof `jti` replay-window. Proofs are single-use: the same `jti`
 * presented again within this window is rejected as a replay.
 */
export const REPLAY_WINDOW_MS = 300_000; // 5 minutes

/**
 * Legacy bearer fallback window. During migration, tokens not yet bound to a
 * hardware key are accepted as plain Bearer for this many days, behind a flag.
 */
export const LEGACY_BEARER_FALLBACK_DAYS = 90;
