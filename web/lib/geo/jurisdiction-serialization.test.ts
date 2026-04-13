import { describe, expect, it } from "vitest";

import {
  formatLocationChipLabel,
  JURISDICTION_SCHEMA_VERSION,
  jurisdictionEnvelopeSchema,
  parseCachedJurisdictionPayload,
  stripForPersistence,
} from "./jurisdiction-serialization";
import type { JurisdictionContext } from "./types";

const sampleContext: JurisdictionContext = {
  input: { zip5: "20500", street: "1600 Pennsylvania Ave NW" },
  coordinates: { lat: 38.89, lng: -77.03 },
  placeName: "Washington",
  statePostal: "DC",
  state: { stusps: "DC", name: "District of Columbia", geoid: "11" },
  congressionalDistrict: {
    name: "District of Columbia At Large",
    geoid: "980",
  },
  stateLegislativeUpper: null,
  stateLegislativeLower: null,
  census: {
    matchedAddress: "…",
    benchmark: "Public_AR_Current",
    vintage: "Current_Current",
  },
  googleCivic: {
    enabled: true,
    divisions: { "ocd-division/country:us/state:dc": { name: "DC" } },
    stateAligned: true,
  },
  sources: {
    zipCentroid: "geonames",
    census: true,
    googleCivic: true,
  },
  warnings: [],
};

describe("parseCachedJurisdictionPayload", () => {
  it("accepts full-resolution context including Civic divisions", () => {
    const parsed = parseCachedJurisdictionPayload(sampleContext);
    expect(parsed).not.toBeNull();
    expect(parsed?.googleCivic?.divisions).toBeDefined();
    expect(
      parsed?.googleCivic?.divisions?.["ocd-division/country:us/state:dc"]?.name
    ).toBe("DC");
  });

  it("returns null on invalid payload", () => {
    expect(
      parseCachedJurisdictionPayload({ not: "a jurisdiction" })
    ).toBeNull();
  });
});

describe("stripForPersistence", () => {
  it("drops google Civic divisions map", () => {
    const p = stripForPersistence(sampleContext);
    expect(p.googleCivic).toEqual({ enabled: true, stateAligned: true });
    expect(JSON.stringify(p.googleCivic)).not.toContain("ocd-division");
  });
});

describe("jurisdictionEnvelopeSchema", () => {
  it("round-trips a v1 envelope", () => {
    const env = {
      schemaVersion: JURISDICTION_SCHEMA_VERSION,
      resolvedAt: new Date().toISOString(),
      context: stripForPersistence(sampleContext),
    };
    const r = jurisdictionEnvelopeSchema.safeParse(env);
    expect(r.success).toBe(true);
  });
});

describe("formatLocationChipLabel", () => {
  it("prefers place + state + zip", () => {
    expect(formatLocationChipLabel(stripForPersistence(sampleContext))).toMatch(
      /Washington/
    );
    expect(formatLocationChipLabel(stripForPersistence(sampleContext))).toMatch(
      /20500/
    );
  });
});
