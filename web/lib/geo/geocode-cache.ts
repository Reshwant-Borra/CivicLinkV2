import { and, eq, gt } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { geocodeCache } from "@/lib/db/schema";
import { parseCachedJurisdictionPayload } from "@/lib/geo/jurisdiction-serialization";
import type { JurisdictionContext } from "@/lib/geo/types";

const CACHE_HIT_WARNING = "Served from server geocode cache.";

/** Min 60s; max 30 days. Invalid env falls back to 24h. */
export function geoCacheTtlSeconds(): number {
  const raw = process.env.GEO_CACHE_TTL_SECONDS?.trim();
  const fallback = 86_400;
  if (!raw) return fallback;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(Math.max(n, 60), 86_400 * 30);
}

function withCacheHitWarning(ctx: JurisdictionContext): JurisdictionContext {
  if (ctx.warnings.some((w) => w.includes("geocode cache"))) {
    return ctx;
  }
  return { ...ctx, warnings: [...ctx.warnings, CACHE_HIT_WARNING] };
}

export async function getCachedJurisdiction(
  cacheKey: string
): Promise<JurisdictionContext | null> {
  const db = getDb();
  if (!db) return null;

  try {
    const rows = await db
      .select()
      .from(geocodeCache)
      .where(
        and(
          eq(geocodeCache.cacheKey, cacheKey),
          gt(geocodeCache.expiresAt, new Date())
        )
      )
      .limit(1);

    const row = rows[0];
    if (!row) return null;

    const parsed = parseCachedJurisdictionPayload(row.payload);
    if (!parsed) return null;

    return withCacheHitWarning(parsed);
  } catch {
    return null;
  }
}

export async function upsertGeocodeCache(
  cacheKey: string,
  payload: JurisdictionContext,
  ttlSeconds: number
): Promise<void> {
  const db = getDb();
  if (!db) return;

  const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

  try {
    await db
      .insert(geocodeCache)
      .values({
        cacheKey,
        expiresAt,
        payload,
        payloadVersion: 1,
      })
      .onConflictDoUpdate({
        target: geocodeCache.cacheKey,
        set: {
          expiresAt,
          payload,
          payloadVersion: 1,
        },
      });
  } catch {
    // Non-fatal: resolution already succeeded
  }
}
