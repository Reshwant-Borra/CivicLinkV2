import { fetchWithTimeout } from "./http";

export type GeoNamesPostalHit = {
  lat: number;
  lng: number;
  placeName: string;
  statePostal: string;
  adminName1: string;
};

/** GeoNames postal search for US ZIP → centroid + locality (free tier requires username). */
export async function lookupUsZipGeoNames(
  zip5: string,
  username: string
): Promise<GeoNamesPostalHit | null> {
  const url = new URL("https://secure.geonames.org/postalCodeSearchJSON");
  url.searchParams.set("postalcode", zip5);
  url.searchParams.set("country", "US");
  url.searchParams.set("maxRows", "5");
  url.searchParams.set("username", username);

  const res = await fetchWithTimeout(url.toString(), {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`GeoNames HTTP ${res.status}`);
  }
  const data = (await res.json()) as {
    postalCodes?: Array<{
      lat?: string;
      lng?: string;
      placeName?: string;
      adminName1?: string;
      adminCode1?: string;
    }>;
  };
  const codes = data.postalCodes;
  if (!Array.isArray(codes) || codes.length === 0) return null;
  const top = codes[0];
  const lat = Number(top.lat);
  const lng = Number(top.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return {
    lat,
    lng,
    placeName: String(top.placeName ?? ""),
    statePostal: String(top.adminCode1 ?? ""),
    adminName1: String(top.adminName1 ?? ""),
  };
}
