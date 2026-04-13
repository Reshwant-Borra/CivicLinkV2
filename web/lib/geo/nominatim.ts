import { fetchWithTimeout } from "./http";

export type NominatimZipHit = {
  lat: number;
  lng: number;
  placeName: string;
  statePostal: string;
};

/**
 * OpenStreetMap Nominatim (ZIP → centroid). Requires a descriptive User-Agent per policy.
 * https://operations.osmfoundation.org/policies/nominatim/
 */
export async function lookupUsZipNominatim(
  zip5: string,
  userAgent: string
): Promise<NominatimZipHit | null> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("postalcode", zip5);
  url.searchParams.set("countrycodes", "us");
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");
  url.searchParams.set("addressdetails", "1");

  const res = await fetchWithTimeout(url.toString(), {
    headers: {
      Accept: "application/json",
      "User-Agent": userAgent,
    },
  });
  if (!res.ok) {
    throw new Error(`Nominatim HTTP ${res.status}`);
  }
  const data = (await res.json()) as Array<{
    lat?: string;
    lon?: string;
    display_name?: string;
    address?: {
      city?: string;
      town?: string;
      village?: string;
      hamlet?: string;
      county?: string;
      state?: string;
    };
  }>;
  if (!Array.isArray(data) || data.length === 0) return null;
  const hit = data[0];
  const lat = Number(hit.lat);
  const lng = Number(hit.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  const addr = hit.address ?? {};
  const ext = addr as {
    ISO3166_2_lvl4?: string;
    "ISO3166-2-lvl4"?: string;
  };
  const isoRaw = ext.ISO3166_2_lvl4 ?? ext["ISO3166-2-lvl4"];
  const fromIso =
    typeof isoRaw === "string" && isoRaw.toUpperCase().startsWith("US-")
      ? isoRaw.slice(3).toUpperCase()
      : undefined;

  const placeName =
    addr.city ?? addr.town ?? addr.village ?? addr.hamlet ?? addr.county ?? "";
  const statePostal =
    fromIso ?? (addr.state ? usStateNameToPostal(addr.state) : undefined) ?? "";
  return {
    lat,
    lng,
    placeName,
    statePostal,
  };
}

/** Best-effort: Nominatim often returns USPS abbreviation already; keep if 2 letters. */
function usStateNameToPostal(name: string): string | undefined {
  const t = name.trim();
  if (/^[A-Za-z]{2}$/.test(t)) return t.toUpperCase();
  return undefined;
}
