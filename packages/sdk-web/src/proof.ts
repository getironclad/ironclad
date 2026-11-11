import type { DpopProof } from "@ironclad/shared";
import type { KeyManager } from "./key-manager.js";

/** HTTP context a DPoP proof is minted for (RFC 9449 §4.2). */
export interface MintDpopOptions {
  /** HTTP method of the request, e.g. `POST`. */
  htm: string;
  /** HTTP URI of the request, e.g. `https://api.example.com/token`. */
  htu: string;
  /** Optional `iat` override (UNIX seconds). Defaults to now. */
  iat?: number;
}

/** A random UUID-ish `jti` for replay uniqueness. */
export function randomJti(): string {
  return typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Mint a DPoP proof JWT for the given key and HTTP context.
 *
 * The proof shape (three base64url segments):
 *   header:  { typ: "dpop+jwt", alg: "ES256", jwk: <public jwk> }
 *   payload: { jti, htm, htu, iat, cnf: { jkt: <key thumbprint> } }
 *
 * TODO:
 * - export the public key as JWK to fill the `jwk` header
 * - compute `cnf.jkt` via `jwkThumbprint`
 * - build the signing input `ascii(header) || "." || ascii(payload)`
 * - sign with the key (ECDSA P-256 / SHA-256) and assemble the JWT
 */
export async function mintDpopProof(
  _key: KeyManager,
  _opts: MintDpopOptions,
): Promise<string> {
  // TODO(proof): build the DPoP JWT as described above.
  // Placeholder: return a syntactically JWT-shaped string.
  const header = btoa(JSON.stringify({ typ: "dpop+jwt", alg: "ES256" })).replace(/=+$/, "");
  const payload = btoa(
    JSON.stringify({
      jti: randomJti(),
      htm: "GET",
      htu: "https://example.com",
      iat: Math.floor(Date.now() / 1000),
    } satisfies Partial<DpopProof>),
  ).replace(/=+$/, "");
  return `${header}.${payload}.PLACEHOLDER_SIGNATURE`;
}
