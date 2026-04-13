import { createHash } from "node:crypto";

import type { ValidatedUsLocation } from "./us-postal";

/**
 * Deterministic cache key for validated location input (SHA-256 hex).
 * Version prefix in JSON allows future key taxonomy without collisions.
 */
export function geocodeCacheKey(input: ValidatedUsLocation): string {
  const canonical = {
    v: 1 as const,
    zip5: input.zip5,
    zipPlus4: input.zipPlus4 ?? null,
    street: input.street ?? null,
  };
  const json = JSON.stringify(canonical);
  return createHash("sha256").update(json, "utf8").digest("hex");
}
