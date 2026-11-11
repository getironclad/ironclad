import { describe, expect, it } from "vitest";
import { KeyManager, base64url, jwkThumbprint } from "./key-manager.js";

const hasWebCrypto =
  typeof globalThis.crypto !== "undefined" && typeof globalThis.crypto.subtle !== "undefined";

describe("KeyManager", () => {
  describe.skipIf(!hasWebCrypto)("with WebCrypto available", () => {
    it("generates a non-extractable P-256 key pair", async () => {
      const km = new KeyManager();
      const pair = await km.generateKeyPair();

      expect(pair.publicKey).toBeDefined();
      expect(pair.privateKey).toBeDefined();
      expect(pair.privateKey.extractable).toBe(false);
      expect(pair.privateKey.algorithm.name).toBe("ECDSA");
    });

    it("signs data and produces a base64url signature", async () => {
      const km = new KeyManager();
      await km.generateKeyPair();
      const signature = await km.sign("hello ironclad");

      expect(signature).toMatch(/^[A-Za-z0-9_-]+$/);
      expect(signature.length).toBeGreaterThan(0);
    });
  });

  describe.skipIf(hasWebCrypto)("without WebCrypto", () => {
    it("is skipped when crypto.subtle is unavailable", () => {
      expect(true).toBe(true);
    });
  });

  it("base64url encodes without padding", () => {
    expect(base64url(new Uint8Array([0xfb, 0xff, 0xef]))).toBe("-__v");
  });

  it("computes a deterministic RFC 7638 thumbprint", async () => {
    const jwk = {
      kty: "EC",
      crv: "P-256",
      x: "usWxHK2PmfnHKwXPS54m0kTcGJ90UiglWiGahtagnf8",
      y: "IBOL-C3BttVivg-lSreASjpkttcsz-1rb7btKLv8EX4",
    };

    const a = await jwkThumbprint(jwk);
    const b = await jwkThumbprint(jwk);

    expect(a).toMatch(/^[A-Za-z0-9_-]{43}$/); // SHA-256 -> 32 bytes -> 43 base64url chars
    expect(b).toBe(a);
  });
});
