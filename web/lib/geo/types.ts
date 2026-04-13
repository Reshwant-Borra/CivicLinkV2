export type Coordinates = { lat: number; lng: number };

export type GeographyRef = {
  name: string;
  geoid?: string;
  basename?: string;
};

/**
 * Full-resolution jurisdiction from `resolveUsLocation` (API + UI preview).
 * For persisted cookie shape and schema version, see `jurisdiction-serialization.ts`.
 */
export type JurisdictionContext = {
  input: {
    zip5: string;
    zipPlus4?: string;
    street?: string;
  };
  coordinates: Coordinates | null;
  placeName?: string;
  /** USPS-style state abbreviation when known */
  statePostal?: string;
  state?: { stusps?: string; name?: string; geoid?: string } | null;
  congressionalDistrict: GeographyRef | null;
  stateLegislativeUpper: GeographyRef | null;
  stateLegislativeLower: GeographyRef | null;
  census: {
    matchedAddress?: string;
    benchmark: string;
    vintage: string;
  } | null;
  googleCivic: {
    enabled: boolean;
    divisions?: Record<string, { name: string }>;
    /** True when at least one OCD division overlaps inferred state */
    stateAligned?: boolean;
  } | null;
  sources: {
    zipCentroid: "geonames" | "nominatim" | "none";
    census: boolean;
    googleCivic: boolean;
  };
  warnings: string[];
};
