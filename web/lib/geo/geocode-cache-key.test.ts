import { describe, expect, it } from "vitest";

import { geocodeCacheKey } from "./geocode-cache-key";

describe("geocodeCacheKey", () => {
  it("is stable for the same normalized fields", () => {
    const a = geocodeCacheKey({
      zip5: "90210",
      zipPlus4: "1234",
      street: "Main St",
    });
    const b = geocodeCacheKey({
      zip5: "90210",
      zipPlus4: "1234",
      street: "Main St",
    });
    expect(a).toBe(b);
    expect(a).toMatch(/^[a-f0-9]{64}$/);
  });

  it("treats missing optional fields like explicit null", () => {
    const minimal = geocodeCacheKey({ zip5: "90210" });
    const explicit = geocodeCacheKey({
      zip5: "90210",
      zipPlus4: undefined,
      street: undefined,
    });
    expect(minimal).toBe(explicit);
  });

  it("changes when street differs", () => {
    const one = geocodeCacheKey({ zip5: "90210", street: "Oak Ave" });
    const two = geocodeCacheKey({ zip5: "90210", street: "Elm St" });
    expect(one).not.toBe(two);
  });
});
