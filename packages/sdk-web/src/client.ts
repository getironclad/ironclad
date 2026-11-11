import { CLAIM_NAMES, HEADER_NAMES } from "@ironclad/shared";
import type { KeyManager } from "./key-manager.js";
import { mintDpopProof } from "./proof.js";

/** Configuration for the Ironclad API client. */
export interface ClientOptions {
  /** Base URL of the Ironclad-protected API, e.g. `https://api.example.com`. */
  baseUrl: string;
  /** Key manager holding the hardware-bound signing key. */
  keyManager: KeyManager;
  /**
   * Paths that require a DPoP proof (must mirror the gateway's
   * `sensitiveOperations`). Defaults to sensitive operations only.
   */
  sensitiveOperations?: string[];
}

/** A minimal fetch wrapper that auto-attaches a DPoP proof header. */
export interface IroncladClient {
  request(path: string, init?: RequestInit): Promise<Response>;
}

/**
 * Create an API client that automatically attaches a DPoP proof header to
 * sensitive requests.
 *
 * TODO:
 * - implement `request()` to mint a proof for sensitive paths and set
 *   `DPoP: <proof>` alongside `Authorization`
 * - retry with a fresh proof on 401 (jti reuse / clock skew)
 * - surface attestation blobs (see spec-002) on the proof header
 * - support DBSC credentials when `isDbscAvailable()`
 */
export function createClient(options: ClientOptions): IroncladClient {
  void mintDpopProof; // placeholder reference; remove once request() is wired up
  void CLAIM_NAMES;
  void HEADER_NAMES;
  return {
    async request(path: string, init: RequestInit = {}): Promise<Response> {
      // TODO(client): attach DPoP proof + Authorization header here.
      void options;
      void path;
      return fetch(`${options.baseUrl}${path}`, init);
    },
  };
}
