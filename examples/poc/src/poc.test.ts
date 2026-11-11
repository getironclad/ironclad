import { describe, expect, it } from "vitest";
import { ACCESS_TOKEN_TTL_MS } from "@ironclad/shared";

// Sprint 0 smoke test: the PoC builds on the shared constants and types.
describe("poc", () => {
  it("pulls shared constants from @ironclad/shared", () => {
    expect(ACCESS_TOKEN_TTL_MS).toBe(300_000);
  });

  it("has placeholders for the keygen and verify modules (TBD)", () => {
    // TODO: once keygen.ts / verify.ts exist, exercise the round trip here.
    expect(true).toBe(true);
  });
});
