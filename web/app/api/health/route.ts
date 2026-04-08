import { NextResponse } from "next/server";

/**
 * Uptime / deploy probes. Keep dependency-free (no DB until Segment 4).
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "civiclink-web",
    time: new Date().toISOString(),
  });
}
