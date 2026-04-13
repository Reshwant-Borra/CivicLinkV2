import { describe, expect, it } from "vitest";

import { normalizeUsZip, validateUsLocationInput } from "./us-postal";

describe("normalizeUsZip", () => {
  it("accepts 5-digit ZIP", () => {
    expect(normalizeUsZip("90210")).toEqual({ zip5: "90210" });
  });

  it("trims whitespace", () => {
    expect(normalizeUsZip("  90210  ")).toEqual({ zip5: "90210" });
  });

  it("accepts ZIP+4", () => {
    expect(normalizeUsZip("90210-1234")).toEqual({
      zip5: "90210",
      zipPlus4: "1234",
    });
  });

  it("rejects invalid patterns", () => {
    expect(normalizeUsZip("")).toBeNull();
    expect(normalizeUsZip("9021")).toBeNull();
    expect(normalizeUsZip("902101")).toBeNull();
    expect(normalizeUsZip("ABCDE")).toBeNull();
    expect(normalizeUsZip("90210-12")).toBeNull();
  });
});

describe("validateUsLocationInput", () => {
  it("requires zip string", () => {
    const r = validateUsLocationInput({});
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/zip/i);
  });

  it("accepts zip only", () => {
    const r = validateUsLocationInput({ zip: "20500" });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.zip5).toBe("20500");
  });

  it("accepts optional street", () => {
    const r = validateUsLocationInput({
      zip: "20500",
      street: "  1600 Pennsylvania Ave NW  ",
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.street).toBe("1600 Pennsylvania Ave NW");
  });

  it("rejects street that is too long", () => {
    const r = validateUsLocationInput({
      zip: "20500",
      street: "x".repeat(201),
    });
    expect(r.ok).toBe(false);
  });

  it("treats blank street as omitted", () => {
    const r = validateUsLocationInput({ zip: "20500", street: "   " });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.street).toBeUndefined();
  });
});
