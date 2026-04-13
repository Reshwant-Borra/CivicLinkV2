import { fetchWithTimeout } from "./http";

const CIVIC_UA = "CivicLink/0.1 (civic dashboard; +https://github.com)";

export const CENSUS_DEFAULT_BASE = "https://geocoding.census.gov/geocoder";

type CensusAddressMatch = {
  matchedAddress?: string;
  coordinates?: { x?: number; y?: number };
  geographies?: Record<string, unknown>;
};

function trimBase(base: string): string {
  return base.replace(/\/$/, "");
}

/** Census geographies/onelineaddress — returns first address match or null. */
export async function censusGeographiesOneline(
  baseUrl: string,
  oneLine: string,
  benchmark: string,
  vintage: string
): Promise<CensusAddressMatch | null> {
  const u = new URL(`${trimBase(baseUrl)}/geographies/onelineaddress`);
  u.searchParams.set("address", oneLine);
  u.searchParams.set("benchmark", benchmark);
  u.searchParams.set("vintage", vintage);
  u.searchParams.set("format", "json");

  const res = await fetchWithTimeout(u.toString(), {
    headers: { Accept: "application/json", "User-Agent": CIVIC_UA },
  });
  if (!res.ok) {
    throw new Error(`Census geocoder HTTP ${res.status}`);
  }
  const json = (await res.json()) as {
    result?: { addressMatches?: CensusAddressMatch[] };
  };
  const matches = json.result?.addressMatches;
  if (!Array.isArray(matches) || matches.length === 0) return null;
  for (const m of matches) {
    if (
      m?.geographies &&
      typeof m.geographies === "object" &&
      Object.keys(m.geographies).length > 0
    ) {
      return m;
    }
  }
  return null;
}

/** Census geographies/coordinates — geography stack at lng/lat. */
export async function censusGeographiesCoordinates(
  baseUrl: string,
  lng: number,
  lat: number,
  benchmark: string,
  vintage: string
): Promise<CensusAddressMatch | null> {
  const u = new URL(`${trimBase(baseUrl)}/geographies/coordinates`);
  u.searchParams.set("x", String(lng));
  u.searchParams.set("y", String(lat));
  u.searchParams.set("benchmark", benchmark);
  u.searchParams.set("vintage", vintage);
  u.searchParams.set("format", "json");

  const res = await fetchWithTimeout(u.toString(), {
    headers: { Accept: "application/json", "User-Agent": CIVIC_UA },
  });
  if (!res.ok) {
    throw new Error(`Census geocoder HTTP ${res.status}`);
  }
  const json = (await res.json()) as {
    result?: { geographies?: Record<string, unknown> };
  };
  const geographies = json.result?.geographies;
  if (!geographies || typeof geographies !== "object") return null;
  return {
    coordinates: { x: lng, y: lat },
    geographies,
  };
}
