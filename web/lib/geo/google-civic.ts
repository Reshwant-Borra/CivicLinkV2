import { fetchWithTimeout } from "./http";

export type GoogleCivicResult = {
  divisions: Record<string, { name: string }>;
};

/** representativeInfoByAddress — optional cross-check vs Census (server key only). */
export async function fetchGoogleCivicRepresentatives(
  addressLine: string,
  apiKey: string
): Promise<GoogleCivicResult | null> {
  const u = new URL(
    "https://www.googleapis.com/civicinfo/v2/representativeInfoByAddress"
  );
  u.searchParams.set("address", addressLine);
  u.searchParams.set("key", apiKey);

  const res = await fetchWithTimeout(u.toString(), {
    headers: { Accept: "application/json" },
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Google Civic HTTP ${res.status}`);
  }
  const json = (await res.json()) as {
    divisions?: Record<string, { name: string }>;
  };
  if (!json.divisions || typeof json.divisions !== "object") return null;
  return { divisions: json.divisions };
}

/** True if any OCD division includes /state:{st} matching census STUSPS (case-insensitive). */
export function googleCivicStateAligned(
  divisions: Record<string, { name: string }>,
  censusStusps?: string
): boolean {
  if (!censusStusps) return false;
  const want = censusStusps.trim().toLowerCase();
  return Object.keys(divisions).some((ocd) => {
    const m = /\/state:([a-z]{2})(\/|$)/i.exec(ocd);
    return m !== null && m[1].toLowerCase() === want;
  });
}
