import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";

import { AppError } from "@/components/feedback/app-error";
import { PageTemplate } from "@/components/layout/page-template";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  billTypeLabel,
  congressGovUrl,
  deriveBillStatus,
  getBill,
  getBillActions,
  getBillSummaries,
  parseBillId,
  type BillAction,
  type BillDetail,
  type BillSummaryText,
} from "@/lib/federal/congress-gov";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ billId: string }>;
}): Promise<Metadata> {
  const { billId } = await params;
  const parsed = parseBillId(billId);
  if (!parsed) return { title: "Bill not found" };

  try {
    const bill = await getBill(parsed.congress, parsed.type, parsed.number);
    if (!bill) return { title: "Bill not found" };
    return {
      title: `${billTypeLabel(bill.type)} ${bill.number} — ${bill.congress}th Congress`,
      description: bill.title,
    };
  } catch {
    return { title: "Federal Bill" };
  }
}

// ---------------------------------------------------------------------------
// Status helpers (mirrors bill-card)
// ---------------------------------------------------------------------------

function statusClasses(
  status: ReturnType<typeof deriveBillStatus>
): string {
  switch (status) {
    case "signed":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200";
    case "passed":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200";
    case "in-committee":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200";
    case "failed":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

function statusLabel(status: ReturnType<typeof deriveBillStatus>): string {
  const map: Record<typeof status, string> = {
    signed: "Signed into Law",
    passed: "Passed",
    "in-committee": "In Committee",
    failed: "Failed / Vetoed",
    introduced: "Introduced",
    unknown: "Active",
  };
  return map[status];
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/** Strip HTML tags from CRS summary text. Congress.gov may include <p> etc. */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s{2,}/g, " ").trim();
}

// ---------------------------------------------------------------------------
// Sub-sections
// ---------------------------------------------------------------------------

function BillHeader({
  bill,
  status,
}: {
  bill: BillDetail;
  status: ReturnType<typeof deriveBillStatus>;
}) {
  return (
    <div className="space-y-3">
      {/* Bill ID + status */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-sm font-medium text-muted-foreground">
          {billTypeLabel(bill.type)} {bill.number} · {bill.congress}th Congress
        </span>
        <Badge variant="outline" className={`text-xs ${statusClasses(status)}`}>
          {statusLabel(status)}
        </Badge>
        {bill.originChamber && (
          <Badge variant="outline" className="text-xs text-muted-foreground">
            {bill.originChamber}
          </Badge>
        )}
      </div>

      {/* Full title */}
      <h1 className="text-xl font-semibold leading-snug text-foreground sm:text-2xl">
        {bill.title}
      </h1>

      {/* Metadata row */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
        {bill.introducedDate && (
          <span>Introduced {formatDate(bill.introducedDate)}</span>
        )}
        {bill.policyArea?.name && (
          <span>
            Policy area:{" "}
            <span className="text-foreground">{bill.policyArea.name}</span>
          </span>
        )}
      </div>
    </div>
  );
}

function SponsorsSection({ bill }: { bill: BillDetail }) {
  const sponsors = bill.sponsors ?? [];
  if (sponsors.length === 0) return null;

  return (
    <section aria-labelledby="sponsors-heading" className="space-y-3">
      <h2
        id="sponsors-heading"
        className="text-base font-semibold text-foreground"
      >
        {sponsors.length === 1 ? "Sponsor" : "Sponsors"}
      </h2>
      <ul className="space-y-1">
        {sponsors.map((s) => (
          <li
            key={s.bioguideId}
            className="flex flex-wrap items-center gap-2 text-sm"
          >
            <span className="font-medium text-foreground">{s.fullName}</span>
            {(s.party || s.state) && (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                {[s.party, s.state].filter(Boolean).join("-")}
              </Badge>
            )}
            {s.isByRequest === "Y" && (
              <span className="text-xs text-muted-foreground">(by request)</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function SummarySection({ summaries }: { summaries: BillSummaryText[] }) {
  if (summaries.length === 0) {
    return (
      <section aria-labelledby="summary-heading" className="space-y-3">
        <h2
          id="summary-heading"
          className="text-base font-semibold text-foreground"
        >
          Summary
        </h2>
        <p className="text-sm text-muted-foreground">
          No CRS summary available yet. View the full bill text on{" "}
          <a
            href="https://www.congress.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            Congress.gov
          </a>
          .
        </p>
      </section>
    );
  }

  // Use the most recent summary
  const latest = summaries[summaries.length - 1];
  const text = stripHtml(latest.text);

  return (
    <section aria-labelledby="summary-heading" className="space-y-3">
      <div className="flex items-baseline justify-between gap-4">
        <h2
          id="summary-heading"
          className="text-base font-semibold text-foreground"
        >
          Summary
        </h2>
        <span className="text-xs text-muted-foreground">
          {latest.actionDesc} · {formatDate(latest.actionDate)}
        </span>
      </div>
      <p className="max-w-prose text-sm leading-relaxed text-foreground/90">
        {text}
      </p>
    </section>
  );
}

function ActionsTimeline({ actions }: { actions: BillAction[] }) {
  if (actions.length === 0) return null;

  // Show in chronological order (oldest first)
  const sorted = [...actions].reverse();

  return (
    <section aria-labelledby="actions-heading" className="space-y-3">
      <h2
        id="actions-heading"
        className="text-base font-semibold text-foreground"
      >
        Legislative History
      </h2>
      <ol className="space-y-0" aria-label="Bill actions timeline">
        {sorted.map((action, i) => (
          <li
            key={i}
            className="flex gap-4 border-l-2 border-border pl-4 pb-4 last:pb-0"
          >
            <time
              dateTime={action.actionDate}
              className="w-28 shrink-0 font-mono text-xs text-muted-foreground pt-0.5"
            >
              {formatDate(action.actionDate)}
            </time>
            <div className="space-y-0.5">
              <p className="text-sm text-foreground">{action.text}</p>
              {action.type && (
                <p className="text-xs text-muted-foreground">{action.type}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function BillDetailPage({
  params,
}: {
  params: Promise<{ billId: string }>;
}) {
  const { billId } = await params;
  const parsed = parseBillId(billId);

  if (!parsed) notFound();

  let bill: BillDetail | null = null;
  let actions: BillAction[] = [];
  let summaries: BillSummaryText[] = [];
  let fetchError = false;

  try {
    [bill, actions, summaries] = await Promise.all([
      getBill(parsed.congress, parsed.type, parsed.number),
      getBillActions(parsed.congress, parsed.type, parsed.number),
      getBillSummaries(parsed.congress, parsed.type, parsed.number),
    ]);
  } catch {
    fetchError = true;
  }

  if (!fetchError && !bill) notFound();

  const officialUrl = congressGovUrl(parsed.congress, parsed.type, parsed.number);
  const status = deriveBillStatus(bill?.latestAction);

  return (
    <div className="bg-background text-foreground">
      <PageTemplate
        title={
          bill
            ? `${billTypeLabel(bill.type)} ${bill.number}`
            : "Federal Bill"
        }
        description=""
      >
        <div className="space-y-8">
          {/* Back link */}
          <div>
            <Button asChild variant="ghost" size="sm" className="-ml-2">
              <Link href="/federal">← Back to Federal</Link>
            </Button>
          </div>

          {fetchError && (
            <AppError
              title="Could not load this bill"
              description="Congress.gov may be temporarily unavailable. Try again shortly."
              action={
                <Button asChild variant="outline" size="sm">
                  <Link href={`/federal/${billId}`}>Retry</Link>
                </Button>
              }
            />
          )}

          {bill && (
            <>
              <BillHeader bill={bill} status={status} />

              <div className="border-t border-border" />

              <SponsorsSection bill={bill} />

              <SummarySection summaries={summaries} />

              <ActionsTimeline actions={actions} />

              {/* External link */}
              <div className="border-t border-border pt-4">
                <a
                  href={officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  View on Congress.gov
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
                <p className="mt-1 text-xs text-muted-foreground">
                  CivicLink is independent software — not a government agency.
                  Always verify with official sources.
                </p>
              </div>
            </>
          )}
        </div>
      </PageTemplate>
    </div>
  );
}
