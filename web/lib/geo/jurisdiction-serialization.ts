import { z } from "zod";

import type { JurisdictionContext } from "./types";

/** Stored civic context schema version (bump when shape changes). */
export const JURISDICTION_SCHEMA_VERSION = 1 as const;

const coordinatesSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

const geographyRefSchema = z.object({
  name: z.string(),
  geoid: z.string().optional(),
  basename: z.string().optional(),
});

const stateSchema = z
  .object({
    stusps: z.string().optional(),
    name: z.string().optional(),
    geoid: z.string().optional(),
  })
  .nullable();

/** Google Civic division map omitted from the cookie (size + PII-adjacent). */
const googleCivicPersistedSchema = z
  .object({
    enabled: z.boolean(),
    stateAligned: z.boolean().optional(),
  })
  .nullable();

/** Full-resolution googleCivic for DB cache parse (optional `divisions`). */
const googleCivicCachedSchema = z.union([
  z.null(),
  z
    .object({
      enabled: z.boolean(),
      stateAligned: z.boolean().optional(),
      divisions: z
        .record(z.string(), z.object({ name: z.string() }).passthrough())
        .optional(),
    })
    .passthrough(),
]);

export const jurisdictionContextPersistedSchema = z.object({
  input: z.object({
    zip5: z.string(),
    zipPlus4: z.string().optional(),
    street: z.string().optional(),
  }),
  coordinates: coordinatesSchema.nullable(),
  placeName: z.string().optional(),
  statePostal: z.string().optional(),
  state: stateSchema,
  congressionalDistrict: geographyRefSchema.nullable(),
  stateLegislativeUpper: geographyRefSchema.nullable(),
  stateLegislativeLower: geographyRefSchema.nullable(),
  census: z
    .object({
      matchedAddress: z.string().optional(),
      benchmark: z.string(),
      vintage: z.string(),
    })
    .nullable(),
  googleCivic: googleCivicPersistedSchema,
  sources: z.object({
    zipCentroid: z.enum(["geonames", "nominatim", "none"]),
    census: z.boolean(),
    googleCivic: z.boolean(),
  }),
  warnings: z.array(z.string()),
});

export type JurisdictionContextPersisted = z.infer<
  typeof jurisdictionContextPersistedSchema
>;

/** Payload shape stored in `geocode_cache.payload` (includes optional Civic divisions). */
export const jurisdictionContextCachedSchema =
  jurisdictionContextPersistedSchema.omit({ googleCivic: true }).extend({
    googleCivic: googleCivicCachedSchema,
  });

export const jurisdictionEnvelopeSchema = z.object({
  schemaVersion: z.literal(JURISDICTION_SCHEMA_VERSION),
  resolvedAt: z.string(),
  context: jurisdictionContextPersistedSchema,
});

export type JurisdictionEnvelopeV1 = z.infer<typeof jurisdictionEnvelopeSchema>;

/** Narrow API type for persistence (drops large `divisions` payloads). */
export function stripForPersistence(
  ctx: JurisdictionContext
): JurisdictionContextPersisted {
  return {
    ...ctx,
    state: ctx.state ?? null,
    googleCivic: ctx.googleCivic
      ? {
          enabled: ctx.googleCivic.enabled,
          stateAligned: ctx.googleCivic.stateAligned,
        }
      : null,
  };
}

export function parseJurisdictionEnvelope(
  raw: unknown
): JurisdictionEnvelopeV1 | null {
  const r = jurisdictionEnvelopeSchema.safeParse(raw);
  return r.success ? r.data : null;
}

/** Parse a row from `geocode_cache`; returns null if schema drift or corruption. */
export function parseCachedJurisdictionPayload(
  raw: unknown
): JurisdictionContext | null {
  const r = jurisdictionContextCachedSchema.safeParse(raw);
  if (!r.success) return null;
  const d = r.data;
  return {
    ...d,
    state: d.state ?? null,
  };
}

/** Human-readable label for header chip (no street line to reduce sensitivity). */
export function formatLocationChipLabel(
  ctx: JurisdictionContextPersisted
): string {
  const zip = ctx.input.zip5;
  const place = [ctx.placeName, ctx.statePostal].filter(Boolean).join(", ");
  return place ? `${place} · ${zip}` : `ZIP ${zip}`;
}
