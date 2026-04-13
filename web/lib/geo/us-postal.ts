const MAX_STREET_LEN = 200;

export type NormalizedUsZip = {
  zip5: string;
  zipPlus4?: string;
};

/** Returns null if the string is not a valid US ZIP or ZIP+4. */
export function normalizeUsZip(raw: string): NormalizedUsZip | null {
  const t = raw.trim();
  if (!t) return null;
  const m = /^([0-9]{5})(?:-([0-9]{4}))?$/.exec(t);
  if (!m) return null;
  return { zip5: m[1], zipPlus4: m[2] };
}

export type ValidatedUsLocation = {
  zip5: string;
  zipPlus4?: string;
  street?: string;
};

export type UsLocationValidation =
  | { ok: true; value: ValidatedUsLocation }
  | { ok: false; error: string };

/** Validates POST /api/geo/resolve body: US ZIP (+4 optional) and optional street. */
export function validateUsLocationInput(body: unknown): UsLocationValidation {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid JSON body" };
  }
  const rec = body as { zip?: unknown; street?: unknown };
  if (typeof rec.zip !== "string") {
    return { ok: false, error: "zip is required and must be a string" };
  }
  const normalized = normalizeUsZip(rec.zip);
  if (!normalized) {
    return {
      ok: false,
      error: "zip must be a US ZIP or ZIP+4 (e.g. 90210 or 90210-1234)",
    };
  }
  let street: string | undefined;
  if (rec.street !== undefined) {
    if (typeof rec.street !== "string") {
      return { ok: false, error: "street must be a string" };
    }
    const s = rec.street.trim();
    if (s.length > MAX_STREET_LEN) {
      return { ok: false, error: "street is too long" };
    }
    if (s.length > 0) street = s;
  }
  return {
    ok: true,
    value: {
      zip5: normalized.zip5,
      zipPlus4: normalized.zipPlus4,
      street,
    },
  };
}
