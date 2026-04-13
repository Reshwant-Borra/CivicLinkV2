import { createHmac, timingSafeEqual } from "node:crypto";

import {
  type JurisdictionEnvelopeV1,
  jurisdictionEnvelopeSchema,
  stripForPersistence,
} from "./jurisdiction-serialization";
import type { JurisdictionContext } from "./types";

export const JURISDICTION_COOKIE_NAME = "civiclink_jurisdiction";

/** ~4KB browser limit — skip Set-Cookie if larger after signing. */
export const JURISDICTION_COOKIE_MAX_BYTES = 3800;

const COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 180; // 180 days

function sign(payloadB64Url: string, secret: string): string {
  return createHmac("sha256", secret)
    .update(payloadB64Url, "utf8")
    .digest("base64url");
}

function safeEqualSig(a: string, b: string): boolean {
  const ba = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

export function encodeSignedJurisdictionCookie(
  envelope: JurisdictionEnvelopeV1,
  secret: string
): string | null {
  const json = JSON.stringify(envelope);
  const payload = Buffer.from(json, "utf8").toString("base64url");
  const sig = sign(payload, secret);
  const token = `${payload}.${sig}`;
  if (Buffer.byteLength(token, "utf8") > JURISDICTION_COOKIE_MAX_BYTES) {
    return null;
  }
  return token;
}

export function decodeSignedJurisdictionCookie(
  token: string,
  secret: string
): JurisdictionEnvelopeV1 | null {
  const i = token.lastIndexOf(".");
  if (i <= 0) return null;
  const payload = token.slice(0, i);
  const sig = token.slice(i + 1);
  if (!payload || !sig) return null;
  const expected = sign(payload, secret);
  if (!safeEqualSig(sig, expected)) return null;
  let json: string;
  try {
    json = Buffer.from(payload, "base64url").toString("utf8");
  } catch {
    return null;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return null;
  }
  const r = jurisdictionEnvelopeSchema.safeParse(parsed);
  return r.success ? r.data : null;
}

export function buildEnvelopeFromResolution(
  context: JurisdictionContext
): JurisdictionEnvelopeV1 {
  return {
    schemaVersion: 1,
    resolvedAt: new Date().toISOString(),
    context: stripForPersistence(context),
  };
}

type CookieJar = {
  get: (name: string) => { value: string } | undefined;
};

export function readJurisdictionEnvelopeFromCookieStore(
  jar: CookieJar,
  secret: string | undefined
): JurisdictionEnvelopeV1 | null {
  if (!secret?.trim()) return null;
  const raw = jar.get(JURISDICTION_COOKIE_NAME)?.value;
  if (!raw) return null;
  return decodeSignedJurisdictionCookie(raw, secret);
}

export function jurisdictionCookieOptions(): {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax";
  path: string;
  maxAge: number;
} {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SEC,
  };
}
