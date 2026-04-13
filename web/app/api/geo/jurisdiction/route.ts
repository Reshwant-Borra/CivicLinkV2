import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { JURISDICTION_COOKIE_NAME } from "@/lib/geo/jurisdiction-cookie";

export const runtime = "nodejs";

/** DELETE — clear persisted jurisdiction cookie (Segment 3.6). */
export async function DELETE() {
  const jar = await cookies();
  jar.delete(JURISDICTION_COOKIE_NAME);
  return NextResponse.json({ ok: true });
}
