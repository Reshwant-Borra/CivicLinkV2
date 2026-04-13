import { NextResponse } from "next/server";

import {
  buildEnvelopeFromResolution,
  encodeSignedJurisdictionCookie,
  jurisdictionCookieOptions,
  JURISDICTION_COOKIE_NAME,
} from "@/lib/geo/jurisdiction-cookie";
import {
  geoCacheTtlSeconds,
  getCachedJurisdiction,
  upsertGeocodeCache,
} from "@/lib/geo/geocode-cache";
import { geocodeCacheKey } from "@/lib/geo/geocode-cache-key";
import { resolveUsLocation } from "@/lib/geo/resolve-location";
import { validateUsLocationInput } from "@/lib/geo/us-postal";

export const runtime = "nodejs";

/**
 * POST /api/geo/resolve
 * Body: { zip: string, street?: string }
 * Server-only: GeoNames, Nominatim, Census, optional Google Civic — no keys in the browser.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Request body must be JSON" },
      { status: 400 }
    );
  }

  const validated = validateUsLocationInput(body);
  if (!validated.ok) {
    return NextResponse.json(
      { ok: false, error: validated.error },
      { status: 400 }
    );
  }

  try {
    const cacheKey = geocodeCacheKey(validated.value);
    const ttl = geoCacheTtlSeconds();

    let jurisdiction = await getCachedJurisdiction(cacheKey);
    const cache: "hit" | "miss" = jurisdiction ? "hit" : "miss";

    if (!jurisdiction) {
      jurisdiction = await resolveUsLocation(validated.value, {
        GEONAMES_USERNAME: process.env.GEONAMES_USERNAME,
        NOMINATIM_USER_AGENT: process.env.NOMINATIM_USER_AGENT,
        CENSUS_GEOCODER_BASE_URL: process.env.CENSUS_GEOCODER_BASE_URL,
        GOOGLE_CIVIC_API_KEY: process.env.GOOGLE_CIVIC_API_KEY,
      });
      await upsertGeocodeCache(cacheKey, jurisdiction, ttl);
    }

    const secret = process.env.JURISDICTION_COOKIE_SECRET?.trim();

    if (secret) {
      const envelope = buildEnvelopeFromResolution(jurisdiction);
      const token = encodeSignedJurisdictionCookie(envelope, secret);
      if (token) {
        const response = NextResponse.json({
          ok: true as const,
          jurisdiction,
          persisted: true,
          cache,
        });
        response.cookies.set(
          JURISDICTION_COOKIE_NAME,
          token,
          jurisdictionCookieOptions()
        );
        return response;
      }
      jurisdiction.warnings.push(
        "Saved location cookie skipped (payload too large). Clear districts or shorten input."
      );
    } else {
      jurisdiction.warnings.push(
        "Set JURISDICTION_COOKIE_SECRET in .env.local to remember this location across visits."
      );
    }

    return NextResponse.json({
      ok: true,
      jurisdiction,
      persisted: false,
      cache,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Geocoding service unavailable" },
      { status: 502 }
    );
  }
}
