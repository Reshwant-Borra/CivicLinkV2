/**
 * Congress.gov API v3 client (server-only — key never reaches the browser).
 *
 * Authoritative source: Federal Legislation _ Federal Government Actions (1).pdf
 * Docs: https://api.congress.gov/
 * Rate limit: 1,000 req/hr on the free tier.
 *
 * All fetch calls use `next: { revalidate }` so Next.js caches responses
 * at the data layer; no separate Redis layer needed for Phase 1.
 */

import { fetchWithTimeout } from "@/lib/geo/http";

const BASE_URL = "https://api.congress.gov/v3";
const CIVIC_UA = "CivicLink/0.1 (civic dashboard)";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type BillType =
  | "hr"
  | "s"
  | "hjres"
  | "sjres"
  | "hconres"
  | "sconres"
  | "hres"
  | "sres";

export interface BillSponsor {
  bioguideId: string;
  fullName: string;
  party: string;
  state: string;
  district?: number;
  isByRequest?: string;
}

export interface LatestAction {
  actionDate: string;
  text: string;
}

/** Minimal bill shape returned by list / search endpoints. */
export interface BillSummary {
  congress: number;
  type: string;
  number: string;
  title: string;
  introducedDate: string;
  latestAction?: LatestAction;
  sponsors?: BillSponsor[];
  policyArea?: { name: string };
  updateDate?: string;
  url: string;
}

/** Full bill shape returned by the single-bill endpoint. */
export interface BillDetail extends BillSummary {
  constitutionalAuthorityStatementText?: string;
  cboCostEstimates?: {
    description: string;
    pubDate: string;
    title: string;
    url: string;
  }[];
  committees?: { count: number; url: string };
  relatedBills?: { count: number; url: string };
  subjects?: { count: number; url: string };
  notes?: string;
  originChamber?: string;
  originChamberCode?: string;
  updateDateIncludingText?: string;
}

export interface BillAction {
  actionDate: string;
  text: string;
  type: string;
  actionCode?: string;
  sourceSystem?: { code: number; name: string };
  committees?: { name: string; systemCode: string; url: string }[];
}

export interface BillSummaryText {
  text: string;
  actionDate: string;
  actionDesc: string;
  updateDate: string;
  versionCode: string;
}

export interface SearchResult {
  bills: BillSummary[];
  pagination: {
    count: number;
    next: string | null;
    prev: string | null;
    offset: number;
    limit: number;
  };
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function getApiKey(): string {
  const key = process.env.CONGRESS_GOV_API_KEY?.trim();
  if (!key) throw new Error("CONGRESS_GOV_API_KEY is not configured");
  return key;
}

function buildUrl(
  path: string,
  params: Record<string, string | number | undefined>
): string {
  const u = new URL(`${BASE_URL}${path}`);
  u.searchParams.set("api_key", getApiKey());
  u.searchParams.set("format", "json");
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined) u.searchParams.set(k, String(v));
  }
  return u.toString();
}

async function apiFetch<T>(url: string, revalidate = 300): Promise<T> {
  const res = await fetchWithTimeout(url, {
    headers: { Accept: "application/json", "User-Agent": CIVIC_UA },
    next: { revalidate },
  });
  if (!res.ok) {
    throw new Error(`Congress.gov API ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Full-text bill search via q JSON query.
 * Returns paginated list of matching bills.
 */
export async function searchBills(
  query: string,
  offset = 0,
  limit = 20
): Promise<SearchResult> {
  const url = buildUrl("/bill", {
    q: JSON.stringify({ query }),
    offset,
    limit,
    sort: "updateDate+desc",
  });

  const json = await apiFetch<{
    bills?: BillSummary[];
    pagination?: { count?: number; next?: string; prev?: string };
  }>(url, 180); // 3-min cache for search

  return {
    bills: json.bills ?? [],
    pagination: {
      count: json.pagination?.count ?? 0,
      next: json.pagination?.next ?? null,
      prev: json.pagination?.prev ?? null,
      offset,
      limit,
    },
  };
}

/**
 * List recent bills across all congresses, newest first.
 * No query filter — shows the full firehose.
 */
export async function listRecentBills(
  offset = 0,
  limit = 20,
  congress?: number
): Promise<SearchResult> {
  const params: Record<string, string | number | undefined> = {
    offset,
    limit,
    sort: "updateDate+desc",
  };
  if (congress !== undefined) params.congress = congress;

  const url = buildUrl("/bill", params);

  const json = await apiFetch<{
    bills?: BillSummary[];
    pagination?: { count?: number; next?: string; prev?: string };
  }>(url, 300); // 5-min cache

  return {
    bills: json.bills ?? [],
    pagination: {
      count: json.pagination?.count ?? 0,
      next: json.pagination?.next ?? null,
      prev: json.pagination?.prev ?? null,
      offset,
      limit,
    },
  };
}

/**
 * Single bill detail.  Returns null on 404.
 */
export async function getBill(
  congress: number,
  type: string,
  number: string
): Promise<BillDetail | null> {
  const url = buildUrl(
    `/bill/${congress}/${type.toLowerCase()}/${number}`,
    {}
  );

  const res = await fetchWithTimeout(url, {
    headers: { Accept: "application/json", "User-Agent": CIVIC_UA },
    next: { revalidate: 600 },
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Congress.gov API ${res.status}`);

  const json = (await res.json()) as { bill?: BillDetail };
  return json.bill ?? null;
}

/** Bill actions list (timeline), most recent first from the API. */
export async function getBillActions(
  congress: number,
  type: string,
  number: string
): Promise<BillAction[]> {
  const url = buildUrl(
    `/bill/${congress}/${type.toLowerCase()}/${number}/actions`,
    { limit: 50 }
  );
  const res = await fetchWithTimeout(url, {
    headers: { Accept: "application/json", "User-Agent": CIVIC_UA },
    next: { revalidate: 600 },
  });
  if (!res.ok) return [];
  const json = (await res.json()) as { actions?: BillAction[] };
  return json.actions ?? [];
}

/** Bill summaries (plain-English descriptions added by CRS). */
export async function getBillSummaries(
  congress: number,
  type: string,
  number: string
): Promise<BillSummaryText[]> {
  const url = buildUrl(
    `/bill/${congress}/${type.toLowerCase()}/${number}/summaries`,
    {}
  );
  const res = await fetchWithTimeout(url, {
    headers: { Accept: "application/json", "User-Agent": CIVIC_UA },
    next: { revalidate: 600 },
  });
  if (!res.ok) return [];
  const json = (await res.json()) as { summaries?: BillSummaryText[] };
  return json.summaries ?? [];
}

// ---------------------------------------------------------------------------
// Bill ID utilities  (format: "119-hr-1234")
// ---------------------------------------------------------------------------

/**
 * Parse a URL-safe bill ID string into its component parts.
 * Returns null if the format is invalid.
 */
export function parseBillId(
  id: string
): { congress: number; type: string; number: string } | null {
  const parts = id.split("-");
  if (parts.length < 3) return null;
  const congress = parseInt(parts[0], 10);
  if (isNaN(congress)) return null;
  const type = parts[1];
  const number = parts.slice(2).join("-");
  if (!type || !number) return null;
  return { congress, type, number };
}

/** Build a URL-safe bill ID from its parts. */
export function buildBillId(
  congress: number,
  type: string,
  number: string
): string {
  return `${congress}-${type.toLowerCase()}-${number}`;
}

/** Human-readable label for a bill type code. */
export function billTypeLabel(type: string): string {
  const map: Record<string, string> = {
    hr: "H.R.",
    s: "S.",
    hjres: "H.J.Res.",
    sjres: "S.J.Res.",
    hconres: "H.Con.Res.",
    sconres: "S.Con.Res.",
    hres: "H.Res.",
    sres: "S.Res.",
  };
  return map[type.toLowerCase()] ?? type.toUpperCase();
}

/** Canonical Congress.gov permalink for a bill. */
export function congressGovUrl(
  congress: number,
  type: string,
  number: string
): string {
  const pathMap: Record<string, string> = {
    hr: "house-bill",
    s: "senate-bill",
    hjres: "house-joint-resolution",
    sjres: "senate-joint-resolution",
    hconres: "house-concurrent-resolution",
    sconres: "senate-concurrent-resolution",
    hres: "house-resolution",
    sres: "senate-resolution",
  };
  const typePath = pathMap[type.toLowerCase()] ?? type.toLowerCase();
  return `https://www.congress.gov/bill/${congress}th-congress/${typePath}/${number}`;
}

/** Derive a simple status string from the latest action text. */
export function deriveBillStatus(
  latestAction?: LatestAction
): "introduced" | "in-committee" | "passed" | "signed" | "failed" | "unknown" {
  if (!latestAction) return "unknown";
  const text = latestAction.text.toLowerCase();
  if (text.includes("became public law") || text.includes("signed by president"))
    return "signed";
  if (text.includes("passed") || text.includes("agreed to"))
    return "passed";
  if (text.includes("failed") || text.includes("defeated") || text.includes("vetoed"))
    return "failed";
  if (
    text.includes("referred to") ||
    text.includes("committee") ||
    text.includes("hearing")
  )
    return "in-committee";
  if (text.includes("introduced")) return "introduced";
  return "unknown";
}
