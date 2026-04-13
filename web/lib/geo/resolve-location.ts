import {
  CENSUS_DEFAULT_BASE,
  censusGeographiesCoordinates,
  censusGeographiesOneline,
} from "./census-client";
import { extractDistrictBundleFromCensus } from "./census-geographies";
import {
  fetchGoogleCivicRepresentatives,
  googleCivicStateAligned,
} from "./google-civic";
import { lookupUsZipGeoNames } from "./geonames";
import { lookupUsZipNominatim } from "./nominatim";
import type { JurisdictionContext } from "./types";
import type { ValidatedUsLocation } from "./us-postal";

const BENCHMARK = "Public_AR_Current";
const VINTAGE = "Current_Current";

export type GeoResolverEnv = {
  GEONAMES_USERNAME?: string;
  NOMINATIM_USER_AGENT?: string;
  CENSUS_GEOCODER_BASE_URL?: string;
  GOOGLE_CIVIC_API_KEY?: string;
};

function uniqueLines(lines: string[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const l of lines) {
    const k = l.trim();
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(k);
  }
  return out;
}

/**
 * Resolve ZIP (+ optional street) → coordinates + Census districts, optional Google Civic cross-check.
 * All outbound calls are server-side; do not log raw addresses.
 */
export async function resolveUsLocation(
  input: ValidatedUsLocation,
  env: GeoResolverEnv
): Promise<JurisdictionContext> {
  const warnings: string[] = [];
  const { zip5, zipPlus4, street } = input;
  const base = env.CENSUS_GEOCODER_BASE_URL?.trim() || CENSUS_DEFAULT_BASE;

  let zipCentroid: "geonames" | "nominatim" | "none" = "none";
  let placeName = "";
  let statePostal = "";
  let centroidLat: number | undefined;
  let centroidLng: number | undefined;

  if (env.GEONAMES_USERNAME) {
    try {
      const g = await lookupUsZipGeoNames(zip5, env.GEONAMES_USERNAME);
      if (g) {
        zipCentroid = "geonames";
        placeName = g.placeName;
        statePostal = g.statePostal;
        centroidLat = g.lat;
        centroidLng = g.lng;
      }
    } catch {
      warnings.push("GeoNames lookup failed; trying other strategies.");
    }
  }

  if (zipCentroid === "none" && env.NOMINATIM_USER_AGENT?.trim()) {
    try {
      const n = await lookupUsZipNominatim(
        zip5,
        env.NOMINATIM_USER_AGENT.trim()
      );
      if (n) {
        zipCentroid = "nominatim";
        placeName = n.placeName || placeName;
        statePostal = n.statePostal || statePostal;
        centroidLat = n.lat;
        centroidLng = n.lng;
      }
    } catch {
      warnings.push(
        "Nominatim lookup failed; trying Census address lines only."
      );
    }
  }

  const lines: string[] = [];
  if (street && placeName && statePostal) {
    lines.push(`${street}, ${placeName}, ${statePostal} ${zip5}`);
  }
  if (street && statePostal) {
    lines.push(`${street}, ${statePostal} ${zip5}`);
  }
  if (street) {
    lines.push(`${street}, ${zip5}, United States`);
  }
  if (placeName && statePostal) {
    lines.push(`${placeName}, ${statePostal} ${zip5}`);
  }
  lines.push(`${zip5}, United States`);

  let censusMatch: {
    matchedAddress?: string;
    coordinates?: { x?: number; y?: number };
    geographies?: Record<string, unknown>;
  } | null = null;
  let censusUsedLine: string | null = null;

  for (const line of uniqueLines(lines)) {
    try {
      const m = await censusGeographiesOneline(base, line, BENCHMARK, VINTAGE);
      if (m?.geographies && Object.keys(m.geographies).length > 0) {
        censusMatch = m;
        censusUsedLine = line;
        break;
      }
    } catch {
      warnings.push(
        "Census oneline geocoder returned an error for a candidate address."
      );
    }
  }

  if (
    !censusMatch?.geographies &&
    centroidLat !== undefined &&
    centroidLng !== undefined
  ) {
    try {
      const m = await censusGeographiesCoordinates(
        base,
        centroidLng,
        centroidLat,
        BENCHMARK,
        VINTAGE
      );
      if (m?.geographies && Object.keys(m.geographies).length > 0) {
        censusMatch = m;
        censusUsedLine = null;
        warnings.push(
          "Used Census coordinates lookup (oneline match was not available)."
        );
      }
    } catch {
      warnings.push("Census coordinates geocoder failed.");
    }
  }

  if (zipCentroid === "none" && !censusMatch) {
    warnings.push(
      "Configure GEONAMES_USERNAME and/or NOMINATIM_USER_AGENT for better ZIP-only coverage."
    );
  }

  const bundle = extractDistrictBundleFromCensus(censusMatch ?? {});
  const coordinates =
    bundle.coordinates ??
    (centroidLat !== undefined && centroidLng !== undefined
      ? { lat: centroidLat, lng: centroidLng }
      : null);

  let googleCivic: JurisdictionContext["googleCivic"] = null;
  const civicKey = env.GOOGLE_CIVIC_API_KEY?.trim();
  if (civicKey && censusUsedLine) {
    try {
      const civic = await fetchGoogleCivicRepresentatives(
        censusUsedLine,
        civicKey
      );
      if (civic) {
        const aligned = googleCivicStateAligned(
          civic.divisions,
          bundle.state?.stusps
        );
        googleCivic = {
          enabled: true,
          divisions: civic.divisions,
          stateAligned: aligned,
        };
        if (!aligned && bundle.state?.stusps) {
          warnings.push(
            "Google Civic divisions did not clearly align with Census state; compare sources manually."
          );
        }
      }
    } catch {
      warnings.push("Google Civic representativeInfoByAddress failed.");
      googleCivic = { enabled: true };
    }
  } else if (civicKey && !censusUsedLine) {
    try {
      const fallbackLine =
        street && statePostal && placeName
          ? `${street}, ${placeName}, ${statePostal} ${zip5}`
          : `${zip5}, United States`;
      const civic = await fetchGoogleCivicRepresentatives(
        fallbackLine,
        civicKey
      );
      if (civic) {
        googleCivic = {
          enabled: true,
          divisions: civic.divisions,
          stateAligned: googleCivicStateAligned(
            civic.divisions,
            bundle.state?.stusps
          ),
        };
      }
    } catch {
      warnings.push("Google Civic representativeInfoByAddress failed.");
      googleCivic = { enabled: true };
    }
  }

  return {
    input: { zip5, zipPlus4, street },
    coordinates,
    placeName: placeName || undefined,
    statePostal: statePostal || undefined,
    state: bundle.state,
    congressionalDistrict: bundle.congressional,
    stateLegislativeUpper: bundle.stateLegUpper,
    stateLegislativeLower: bundle.stateLegLower,
    census: censusMatch
      ? {
          matchedAddress: censusMatch.matchedAddress,
          benchmark: BENCHMARK,
          vintage: VINTAGE,
        }
      : null,
    googleCivic,
    sources: {
      zipCentroid,
      census: Boolean(censusMatch?.geographies),
      googleCivic: Boolean(googleCivic?.divisions),
    },
    warnings,
  };
}
