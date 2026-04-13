import type { Coordinates, GeographyRef } from "./types";

type CensusGeoRow = Record<string, string | undefined>;

function firstRow(
  geographies: Record<string, unknown>,
  keyPredicate: (key: string) => boolean
): CensusGeoRow | null {
  for (const [key, val] of Object.entries(geographies)) {
    if (!keyPredicate(key)) continue;
    if (!Array.isArray(val) || val.length === 0) continue;
    const row = val[0];
    if (row && typeof row === "object") return row as CensusGeoRow;
  }
  return null;
}

function rowToRef(row: CensusGeoRow | null): GeographyRef | null {
  if (!row) return null;
  const name = row.NAME ?? row.BASENAME ?? row.NAMELSAD;
  if (!name) return null;
  return {
    name,
    geoid: row.GEOID,
    basename: row.BASENAME,
  };
}

/** Census uses x = longitude, y = latitude. */
export function extractDistrictBundleFromCensus(match: {
  coordinates?: { x?: number; y?: number };
  geographies?: Record<string, unknown>;
}): {
  coordinates: Coordinates | null;
  state: { stusps?: string; name?: string; geoid?: string } | null;
  congressional: GeographyRef | null;
  stateLegUpper: GeographyRef | null;
  stateLegLower: GeographyRef | null;
} {
  const coords =
    match.coordinates &&
    typeof match.coordinates.x === "number" &&
    typeof match.coordinates.y === "number"
      ? { lng: match.coordinates.x, lat: match.coordinates.y }
      : null;
  const geo = match.geographies ?? {};
  const stateRow = firstRow(geo, (k) => /^states$/i.test(k));
  const state = stateRow
    ? {
        stusps: stateRow.STUSPS,
        name: stateRow.NAME,
        geoid: stateRow.GEOID,
      }
    : null;
  const congressional = rowToRef(
    firstRow(
      geo,
      (k) => /Congressional Districts/i.test(k) && !/State Legislative/i.test(k)
    )
  );
  const stateLegUpper = rowToRef(
    firstRow(geo, (k) => /Legislative Districts - Upper/i.test(k))
  );
  const stateLegLower = rowToRef(
    firstRow(geo, (k) => /Legislative Districts - Lower/i.test(k))
  );
  return {
    coordinates: coords,
    state,
    congressional,
    stateLegUpper,
    stateLegLower,
  };
}
