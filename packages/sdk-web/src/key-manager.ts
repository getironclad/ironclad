/**
 * Hardware-bound key management for the browser using WebCrypto.
 *
 * The generated key pair is non-extractable (`extractable: false`) so the
 * private key material can never be exported out of the browser, making a
 * stolen token string inert without the user's device.
 */

/** A WebCrypto ECDSA P-256 key pair used for DPoP proofs. */
export interface IroncladKeyPair {
  publicKey: CryptoKey;
  privateKey: CryptoKey;
}

/** Base64url-encode raw bytes without padding. */
export function base64url(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) {
    binary += String.fromCharCode(b);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Manages a hardware-bound ECDSA P-256 key pair.
 */
export class KeyManager {
  private keyPair: IroncladKeyPair | null = null;

  /**
   * Generate a new non-extractable ECDSA P-256 key pair.
   * The private key is `extractable: false` and usable for signing only.
   */
  async generateKeyPair(): Promise<IroncladKeyPair> {
    if (typeof globalThis.crypto === "undefined" || !globalThis.crypto.subtle) {
      throw new Error("WebCrypto (crypto.subtle) is not available in this environment");
    }

    this.keyPair = (await crypto.subtle.generateKey(
      { name: "ECDSA", namedCurve: "P-256" },
      /* extractable */ false,
      ["sign"],
    )) as CryptoKeyPair as IroncladKeyPair;

    return this.keyPair;
  }

  /**
   * Sign arbitrary data with the private key (ECDSA over SHA-256).
   * Returns the DER-encoded signature as a base64url string.
   */
  async sign(data: string | Uint8Array): Promise<string> {
    if (!this.keyPair) {
      throw new Error("No key pair generated; call generateKeyPair() first");
    }

    // Copy into an ArrayBuffer-backed view so it satisfies BufferSource
    // under TypeScript 7's strict typed-array typing.
    const source =
      typeof data === "string" ? new TextEncoder().encode(data) : data;
    const payload = new Uint8Array(source);
    const signature = await crypto.subtle.sign(
      { name: "ECDSA", hash: "SHA-256" },
      this.keyPair.privateKey,
      payload,
    );
    return base64url(new Uint8Array(signature));
  }
}

/**
 * Compute the RFC 7638 JWK thumbprint (`cnf.jkt`) of a public JWK.
 *
 * The thumbprint is the base64url-encoded SHA-256 digest of the canonical
 * (lexicographically sorted, whitespace-free) JSON of the required members.
 *
 * TODO: this is implemented and works for the required EC members
 * (`crv`, `kty`, `x`, `y`). Extend to other key types as needed.
 */
export async function jwkThumbprint(jwk: JsonWebKey): Promise<string> {
  const required = ["crv", "kty", "x", "y"];
  const canonical = `{${required
    .filter((member) => jwk[member as keyof JsonWebKey] !== undefined)
    .sort()
    .map((member) => `${JSON.stringify(member)}:${JSON.stringify(jwk[member as keyof JsonWebKey])}`)
    .join(",")}}`;

  const digest = await crypto.subtle.digest(
    "SHA-256",
    new Uint8Array(new TextEncoder().encode(canonical)),
  );
  return base64url(new Uint8Array(digest));
}
