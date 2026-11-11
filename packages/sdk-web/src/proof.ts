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

/** Encode bytes as unpadded base64url. */
function base64url(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary)
    .replace(/=+$/, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

/**
 * A random `jti` for replay uniqueness.
 *
 * Prefers `crypto.randomUUID`; falls back to 128 bits of CSPRNG output
 * (`crypto.getRandomValues`, base64url-encoded) so the value is never
 * predictable — it never relies on a non-CSPRNG source.
 */
export function randomJti(): string {
  if (typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return base64url(bytes);
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
