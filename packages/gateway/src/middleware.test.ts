import { describe, expect, it } from "vitest";
import dpopAuth, { dpopAuth as namedDpopAuth } from "./middleware.js";

describe("dpopAuth middleware", () => {
  it("exports a named and a default middleware factory", () => {
    expect(typeof dpopAuth).toBe("function");
    expect(namedDpopAuth).toBe(dpopAuth);
  });

  it("returns a request handler when invoked", () => {
    const handler = dpopAuth();
    expect(typeof handler).toBe("function");
    expect(handler.length).toBe(3);
  });
});
