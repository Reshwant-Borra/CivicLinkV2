import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { AppEmpty } from "@/components/feedback/app-empty";
import { AppError } from "@/components/feedback/app-error";
import { AppLoading } from "@/components/feedback/app-loading";
import { BillCard } from "@/components/federal/bill-card";
import { BillSearchForm } from "@/components/federal/bill-search-form";
import { PageTemplate } from "@/components/layout/page-template";
import { Button } from "@/components/ui/button";
import {
  listRecentBills,
  searchBills,
  type SearchResult,
} from "@/lib/federal/congress-gov";

export const metadata: Metadata = {
  title: "Federal Legislation",
  description:
    "Browse and search U.S. federal bills from Congress.gov — titles, sponsors, status, and actions.",
};

const PAGE_SIZE = 20;

// ---------------------------------------------------------------------------
// Data fetching
// ---------------------------------------------------------------------------

async function fetchBills(
  q: string,
  offset: number
): Promise<{ result: SearchResult | null; error: string | null }> {
  try {
    const result = q
      ? await searchBills(q, offset, PAGE_SIZE)
      : await listRecentBills(offset, PAGE_SIZE);
    return { result, error: null };
  } catch {
    return { result: null, error: "Could not reach Congress.gov" };
  }
}

// ---------------------------------------------------------------------------
// Bill list (async server component — streams inside Suspense)
// ---------------------------------------------------------------------------

async function BillList({ q, offset }: { q: string; offset: number }) {
  const { result, error } = await fetchBills(q, offset);

  if (error) {
    return (
      <AppError
        title="Could not load bills"
        description="Congress.gov may be temporarily unavailable. Try again shortly."
        action={
          <Button asChild variant="outline" size="sm">
            <Link
              href={q ? `/federal?q=${encodeURIComponent(q)}` : "/federal"}
            >
              Retry
            </Link>
          </Button>
        }
      />
    );
  }

  if (!result || result.bills.length === 0) {
    return (
      <AppEmpty
        title={q ? `No bills found for "${q}"` : "No bills available"}
        description={
          q
            ? "Try a different keyword or browse recent bills."
            : "Congress.gov returned no results. Try searching by keyword."
        }
        action={
          q ? (
            <Button asChild variant="outline" size="sm">
              <Link href="/federal">Clear search</Link>
            </Button>
          ) : undefined
        }
      />
    );
  }

  const { bills, pagination } = result;
  const prevOffset = offset - PAGE_SIZE;
  const nextOffset = offset + PAGE_SIZE;
  const hasPrev = offset > 0;
  const hasNext = nextOffset < pagination.count;
  const baseHref = q
    ? `/federal?q=${encodeURIComponent(q)}`
    : "/federal";

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Showing {(offset + 1).toLocaleString()}–
        {Math.min(offset + bills.length, pagination.count).toLocaleString()} of{" "}
        {pagination.count.toLocaleString()} bills
        {q && (
          <>
            {" "}
            for <span className="font-medium text-foreground">&ldquo;{q}&rdquo;</span>
          </>
        )}
      </p>

      <ul className="space-y-3" role="list" aria-label="Federal bills">
        {bills.map((bill) => (
          <li key={`${bill.congress}-${bill.type}-${bill.number}`}>
            <BillCard bill={bill} />
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between pt-2">
        <Button asChild variant="outline" size="sm" disabled={!hasPrev}>
          {hasPrev ? (
            <Link
              href={`${baseHref}&offset=${prevOffset}`}
              aria-label="Previous page"
            >
              ← Previous
            </Link>
          ) : (
            <span aria-disabled="true">← Previous</span>
          )}
        </Button>

        <span className="text-xs text-muted-foreground">
          Page {Math.floor(offset / PAGE_SIZE) + 1} of{" "}
          {Math.ceil(pagination.count / PAGE_SIZE).toLocaleString()}
        </span>

        <Button asChild variant="outline" size="sm" disabled={!hasNext}>
          {hasNext ? (
            <Link
              href={`${baseHref}&offset=${nextOffset}`}
              aria-label="Next page"
            >
              Next →
            </Link>
          ) : (
            <span aria-disabled="true">Next →</span>
          )}
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function FederalPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; offset?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const offset = Math.max(0, parseInt(sp.offset ?? "0", 10) || 0);

  return (
    <div className="bg-background text-foreground">
      <PageTemplate
        title="Federal Legislation"
        description="U.S. federal bills from Congress.gov — official source. Search by keyword, or browse recent activity across all congresses."
      >
        <div className="space-y-6">
          <Suspense fallback={null}>
            <BillSearchForm defaultValue={q} />
          </Suspense>

          <Suspense
            key={`${q}-${offset}`}
            fallback={
              <AppLoading
                label="Loading bills from Congress.gov…"
                className="min-h-[300px]"
              />
            }
          >
            <BillList q={q} offset={offset} />
          </Suspense>

          <p className="text-xs text-muted-foreground">
            Data from{" "}
            <a
              href="https://api.congress.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Congress.gov API
            </a>{" "}
            (Library of Congress). CivicLink is independent software — not a
            government agency. Always verify with official sources.
          </p>
        </div>
      </PageTemplate>
    </div>
  );
}
