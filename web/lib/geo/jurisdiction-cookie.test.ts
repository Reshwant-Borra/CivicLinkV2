import { describe, expect, it } from "vitest";

import {
  buildEnvelopeFromResolution,
  decodeSignedJurisdictionCookie,
  encodeSignedJurisdictionCookie,
} from "./jurisdiction-cookie";
import type { JurisdictionContext } from "./types";

const ctx: JurisdictionContext = {
  input: { zip5: "90210" },
  coordinates: { lat: 34.09, lng: -118.41 },
  placeName: "Beverly Hills",
  statePostal: "CA",
  state: { stusps: "CA", name: "California" },
  congressionalDistrict: { name: "CA-30" },
  stateLegislativeUpper: null,
  stateLegislativeLower: null,
  census: null,
  googleCivic: null,
  sources: { zipCentroid: "none", census: false, googleCivic: false },
  warnings: [],
};

describe("encodeSignedJurisdictionCookie", () => {
  it("round-trips with the same secret", () => {
    const secret = "test-secret-at-least-32-characters-long!!";
    const env = buildEnvelopeFromResolution(ctx);
    const token = encodeSignedJurisdictionCookie(env, secret);
    expect(token).toBeTruthy();
    const decoded = decodeSignedJurisdictionCookie(token!, secret);
    expect(decoded?.context.input.zip5).toBe("90210");
    expect(decoded?.context.placeName).toBe("Beverly Hills");
  });

  it("rejects tampered tokens", () => {
    const secret = "test-secret-at-least-32-characters-long!!";
    const token = encodeSignedJurisdictionCookie(
      buildEnvelopeFromResolution(ctx),
      secret
    )!;
    const tampered = token.slice(0, -4) + "xxxx";
    expect(decodeSignedJurisdictionCookie(tampered, secret)).toBeNull();
  });

  it("rejects wrong secret", () => {
    const token = encodeSignedJurisdictionCookie(
      buildEnvelopeFromResolution(ctx),
      "secret-a-secret-a-secret-a-secret-"
    )!;
    expect(
      decodeSignedJurisdictionCookie(
        token,
        "secret-b-secret-b-secret-b-secret-"
      )
    ).toBeNull();
  });
});
