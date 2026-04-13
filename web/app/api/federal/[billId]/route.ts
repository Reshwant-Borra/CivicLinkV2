import type { NextRequest } from "next/server";

import {
  getBill,
  getBillActions,
  getBillSummaries,
  parseBillId,
} from "@/lib/federal/congress-gov";

export const runtime = "nodejs";

/**
 * GET /api/federal/[billId]
 * billId format: "{congress}-{type}-{number}"  e.g. "119-hr-1234"
 *
 * Returns { bill, actions, summaries } or 404 / 400 / 502.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ billId: string }> }
) {
  const { billId } = await params;
  const parsed = parseBillId(billId);

  if (!parsed) {
    return Response.json({ error: "Invalid bill ID format" }, { status: 400 });
  }

  try {
    const [bill, actions, summaries] = await Promise.all([
      getBill(parsed.congress, parsed.type, parsed.number),
      getBillActions(parsed.congress, parsed.type, parsed.number),
      getBillSummaries(parsed.congress, parsed.type, parsed.number),
    ]);

    if (!bill) {
      return Response.json({ error: "Bill not found" }, { status: 404 });
    }

    return Response.json({ bill, actions, summaries });
  } catch (err) {
    console.error("[api/federal/[billId]]", err);
    return Response.json(
      { error: "Could not reach Congress.gov. Try again shortly." },
      { status: 502 }
    );
  }
}
