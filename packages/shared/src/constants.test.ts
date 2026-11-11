import { describe, expect, it } from "vitest";
import {
  ACCESS_TOKEN_TTL_MS,
  CLAIM_NAMES,
  HEADER_NAMES,
  LEGACY_BEARER_FALLBACK_DAYS,
  REPLAY_WINDOW_MS,
} from "./constants.js";

describe("constants", () => {
  it("defines the core HTTP header names", () => {
    expect(HEADER_NAMES.Authorization).toBe("authorization");
    expect(HEADER_NAMES.DPoP).toBe("dpop");
    expect(HEADER_NAMES.Attestation).toBe("x-ironclad-attestation");
  });

  it("defines the claim names", () => {
    expect(CLAIM_NAMES.jkt).toBe("jkt");
    expect(CLAIM_NAMES.jti).toBe("jti");
    expect(CLAIM_NAMES.htm).toBe("htm");
    expect(CLAIM_NAMES.htu).toBe("htu");
  });

  it("keeps the access token TTL at 5 minutes", () => {
    expect(ACCESS_TOKEN_TTL_MS).toBe(300_000);
  });

  it("keeps the replay window aligned with the access token TTL", () => {
    expect(REPLAY_WINDOW_MS).toBe(ACCESS_TOKEN_TTL_MS);
  });

  it("uses a 90-day legacy bearer fallback", () => {
    expect(LEGACY_BEARER_FALLBACK_DAYS).toBe(90);
  });
});
