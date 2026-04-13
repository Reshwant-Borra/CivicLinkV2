import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  billTypeLabel,
  buildBillId,
  deriveBillStatus,
  type BillSummary,
} from "@/lib/federal/congress-gov";

// ---------------------------------------------------------------------------
// Status badge
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
  switch (status) {
    case "signed":
      return "Signed";
    case "passed":
      return "Passed";
    case "in-committee":
      return "In Committee";
    case "failed":
      return "Failed";
    case "introduced":
      return "Introduced";
    default:
      return "Active";
  }
}

function billTypeBadgeClasses(type: string): string {
  const t = type.toLowerCase();
  if (t === "hr") return "bg-primary/10 text-primary border-primary/20";
  if (t === "s") return "bg-secondary/10 text-secondary border-secondary/20";
  return "bg-muted text-muted-foreground border-border";
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface BillCardProps {
  bill: BillSummary;
}

export function BillCard({ bill }: BillCardProps) {
  const billId = buildBillId(bill.congress, bill.type, bill.number);
  const status = deriveBillStatus(bill.latestAction);
  const typeLabel = billTypeLabel(bill.type);
  const primarySponsor = bill.sponsors?.[0];

  return (
    <Link
      href={`/federal/${billId}`}
      className="block rounded-lg border border-border bg-card p-4 transition-colors duration-150 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {/* Top row: bill number + badges */}
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Badge
          variant="outline"
          className={`font-mono text-xs ${billTypeBadgeClasses(bill.type)}`}
        >
          {typeLabel} {bill.number}
        </Badge>
        <span className="font-mono text-xs text-muted-foreground">
          {bill.congress}th Congress
        </span>
        <Badge
          variant="outline"
          className={`ml-auto text-xs ${statusClasses(status)}`}
        >
          {statusLabel(status)}
        </Badge>
      </div>

      {/* Title */}
      <p className="mb-2 line-clamp-2 text-sm font-semibold leading-snug text-foreground">
        {bill.title}
      </p>

      {/* Sponsor + date row */}
      <div className="mb-2 flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
        {primarySponsor && (
          <span>
            {primarySponsor.fullName}
            {primarySponsor.party && primarySponsor.state
              ? ` (${primarySponsor.party}-${primarySponsor.state})`
              : ""}
          </span>
        )}
        {bill.introducedDate && (
          <span>Introduced {formatDate(bill.introducedDate)}</span>
        )}
      </div>

      {/* Latest action */}
      {bill.latestAction && (
        <p className="line-clamp-1 text-xs text-muted-foreground">
          <span className="font-medium text-foreground/70">
            {formatDate(bill.latestAction.actionDate)}:
          </span>{" "}
          {bill.latestAction.text}
        </p>
      )}

      {/* Policy area */}
      {bill.policyArea?.name && (
        <div className="mt-2">
          <Badge variant="outline" className="text-xs text-muted-foreground">
            {bill.policyArea.name}
          </Badge>
        </div>
      )}
    </Link>
  );
}
