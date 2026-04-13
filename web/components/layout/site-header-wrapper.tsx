import { cookies } from "next/headers";

import { readJurisdictionEnvelopeFromCookieStore } from "@/lib/geo/jurisdiction-cookie";
import { formatLocationChipLabel } from "@/lib/geo/jurisdiction-serialization";

import { SiteHeader } from "./site-header";

export async function SiteHeaderWrapper() {
  const jar = await cookies();
  const secret = process.env.JURISDICTION_COOKIE_SECRET?.trim();
  const envelope = readJurisdictionEnvelopeFromCookieStore(jar, secret);
  const locationChip = envelope
    ? {
        label: formatLocationChipLabel(envelope.context),
        href: "/settings#saved-location",
      }
    : null;

  return <SiteHeader locationChip={locationChip} />;
}
