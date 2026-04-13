import { integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

/** Server-side geocode resolution cache (Segment 3.9). Payload is validated on read. */
export const geocodeCache = pgTable("geocode_cache", {
  cacheKey: text("cache_key").primaryKey(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  payload: jsonb("payload").notNull(),
  payloadVersion: integer("payload_version").notNull().default(1),
});
