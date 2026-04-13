import { describe, expect, it } from "vitest";

import { googleCivicStateAligned } from "./google-civic";

describe("googleCivicStateAligned", () => {
  it("matches state segment in OCD id", () => {
    const ok = googleCivicStateAligned(
      {
        "ocd-division/country:us/state:dc": { name: "Washington, DC" },
      },
      "DC"
    );
    expect(ok).toBe(true);
  });

  it("returns false when census state missing", () => {
    expect(googleCivicStateAligned({}, undefined)).toBe(false);
  });
});
