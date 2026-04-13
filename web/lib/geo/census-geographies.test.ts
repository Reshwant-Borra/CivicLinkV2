import { describe, expect, it } from "vitest";

import { extractDistrictBundleFromCensus } from "./census-geographies";

describe("extractDistrictBundleFromCensus", () => {
  it("pulls congressional and state leg layers from a typical match", () => {
    const match = {
      matchedAddress: "1600 Pennsylvania Ave NW, Washington, DC, 20500",
      coordinates: { x: -77.0365, y: 38.8977 },
      geographies: {
        States: [{ GEOID: "11", NAME: "District of Columbia", STUSPS: "DC" }],
        "119th Congressional Districts": [
          { GEOID: "119011", NAME: "Congressional District (at Large)" },
        ],
        "2024 State Legislative Districts - Upper": [
          { GEOID: "11001", NAME: "State Senate District 1" },
        ],
        "2024 State Legislative Districts - Lower": [
          { GEOID: "11002", NAME: "State House District 2" },
        ],
      },
    };
    const out = extractDistrictBundleFromCensus(match);
    expect(out.coordinates).toEqual({ lng: -77.0365, lat: 38.8977 });
    expect(out.state?.stusps).toBe("DC");
    expect(out.congressional?.name).toContain("Congressional");
    expect(out.stateLegUpper?.name).toContain("Senate");
    expect(out.stateLegLower?.name).toContain("House");
  });

  it("returns null coordinates when missing", () => {
    const out = extractDistrictBundleFromCensus({
      geographies: {},
    });
    expect(out.coordinates).toBeNull();
  });
});
