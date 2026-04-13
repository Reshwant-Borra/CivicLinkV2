import type { NextRequest } from "next/server";

import {
  listRecentBills,
  searchBills,
} from "@/lib/federal/congress-gov";

export const runtime = "nodejs";

/**
 * GET /api/federal/search
 * Query params: q (search text), offset (default 0), limit (default 20, max 20)
 *
 * Returns SearchResult JSON.  All Congress.gov API keys stay server-side.
 */
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const q = sp.get("q")?.trim() ?? "";
  const offset = Math.max(0, parseInt(sp.get("offset") ?? "0", 10) || 0);
  const limit = Math.min(20, Math.max(1, parseInt(sp.get("limit") ?? "20", 10) || 20));

  try {
    const result = q
      ? await searchBills(q, offset, limit)
      : await listRecentBills(offset, limit);
    return Response.json(result);
  } catch (err) {
    console.error("[api/federal/search]", err);
    return Response.json(
      { error: "Could not reach Congress.gov. Try again shortly." },
      { status: 502 }
    );
  }
}
