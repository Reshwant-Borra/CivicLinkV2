import type { Metadata } from "next";
import Link from "next/link";

import { PageTemplate } from "@/components/layout/page-template";

export const metadata: Metadata = {
  title: "About our data",
  description:
    "How CivicLink sources civic data, neutrality, and limits — with pointers to primary sources and project research.",
};

function SourceTable({
  caption,
  rows,
}: {
  caption: string;
  rows: { domain: string; sources: string; notes?: string }[];
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-sm">
      <table className="w-full min-w-[32rem] text-left text-sm">
        <caption className="border-b border-border px-4 py-3 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {caption}
        </caption>
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th
              scope="col"
              className="px-4 py-2 font-mono text-xs font-semibold text-foreground"
            >
              Area
            </th>
            <th
              scope="col"
              className="px-4 py-2 font-mono text-xs font-semibold text-foreground"
            >
              Planned or cited sources
            </th>
            <th
              scope="col"
              className="px-4 py-2 font-mono text-xs font-semibold text-foreground"
            >
              Notes
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row) => (
            <tr key={row.domain} className="bg-background">
              <th
                scope="row"
                className="whitespace-nowrap px-4 py-3 font-medium text-foreground"
              >
                {row.domain}
              </th>
              <td className="px-4 py-3 text-muted-foreground">{row.sources}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {row.notes ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AboutDataPage() {
  return (
    <div className="bg-background text-foreground">
      <PageTemplate
        title="About our data"
        description="CivicLink aggregates public and licensed civic datasets with clear attribution. We are independent software—not a government agency. Always confirm critical information (especially voting and election dates) with your state or local election office."
      >
        <div className="space-y-12">
          <section aria-labelledby="neutrality-heading" className="space-y-4">
            <h2
              id="neutrality-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Neutrality and limits
            </h2>
            <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-muted-foreground">
              <li>
                We present{" "}
                <strong className="font-medium text-foreground">
                  facts and links to primary sources
                </strong>
                , not political recommendations.
              </li>
              <li>
                Coverage{" "}
                <strong className="font-medium text-foreground">
                  varies by place and data source
                </strong>
                ; empty or partial results are normal where APIs or official
                feeds do not cover a jurisdiction.
              </li>
              <li>
                <strong className="font-medium text-foreground">
                  Voting and polling-place tools
                </strong>{" "}
                are informational only. They are not official election mail,
                ballot text, or legal advice.
              </li>
            </ul>
          </section>

          <section aria-labelledby="sources-heading" className="space-y-4">
            <h2
              id="sources-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Planned data sources (roadmap)
            </h2>
            <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
              The table below reflects the{" "}
              <strong className="font-medium text-foreground">
                integration direction
              </strong>{" "}
              from the legislative research PDF and repository docs (
              <span className="font-mono text-foreground">AGENTS.md</span>
              ). Vendor limits and schemas change; verify against live
              documentation before shipping integrations.
            </p>
            <SourceTable
              caption="Domains and representative sources"
              rows={[
                {
                  domain: "Federal legislation",
                  sources:
                    "Congress.gov API, GovInfo API & bulk, LegiScan API, ProPublica bulk; optional BillTrack50 (paid).",
                  notes:
                    "Official metadata + text layering; rate limits apply.",
                },
                {
                  domain: "State legislation",
                  sources:
                    "OpenStates API, LegiScan API, state open-data portals.",
                  notes: "Prioritize large states first in early milestones.",
                },
                {
                  domain: "Local government",
                  sources:
                    "Legistar / Granicus APIs, city open data, Council Data Project; scrapers only with clear unofficial labels.",
                  notes:
                    "Highest fragmentation; pilot cities before broad claims.",
                },
                {
                  domain: "Civic events",
                  sources:
                    "Eventbrite API, Meetup API, VolunteerMatch, All For Good.",
                  notes:
                    "Deduping and civic relevance filters in later milestones.",
                },
                {
                  domain: "Voting information",
                  sources:
                    "Google Civic Information API, Vote Smart; links to state SOS / Vote.org.",
                  notes: "Disclaimers and freshness badges in product.",
                },
                {
                  domain: "Geolocation / districts",
                  sources:
                    "US Census Geocoder, GeoNames or ZIP tables, optional Google Civic cross-check.",
                  notes:
                    "Handle PO boxes and rural edge cases explicitly in UX.",
                },
                {
                  domain: "Optional trust context",
                  sources:
                    "Google Fact Check Tools API, Wikipedia / Wikidata; Media Cloud / GDELT later.",
                  notes: "Never replace primary-source links.",
                },
              ]}
            />
          </section>

          <section aria-labelledby="research-heading" className="space-y-4">
            <h2
              id="research-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Research document
            </h2>
            <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
              Authoritative{" "}
              <strong className="font-medium text-foreground">
                vendor tables, citations, and bibliography
              </strong>{" "}
              for this roadmap live in the repository file{" "}
              <span className="font-mono text-foreground">
                Federal Legislation _ Federal Government Actions (1).pdf
              </span>{" "}
              (repository root). If the PDF and in-app copy disagree on a
              factual API claim,{" "}
              <strong className="font-medium text-foreground">
                the PDF wins
              </strong>{" "}
              until the docs are reconciled.
            </p>
            <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
              Environment variable names and return-shape notes for integrations
              are documented in{" "}
              <span className="font-mono text-foreground">
                web/.env.example
              </span>
              .
            </p>
          </section>

          <section aria-labelledby="geo-edge-heading" className="space-y-4">
            <h2
              id="geo-edge-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Location resolution & edge cases
            </h2>
            <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
              ZIP-only and street-augmented geocoding can fail or disagree
              across Census, GeoNames/Nominatim, and optional Google Civic.{" "}
              <strong className="font-medium text-foreground">
                PO boxes, redistricting, and split districts
              </strong>{" "}
              are normal sources of ambiguity — always confirm voting and
              representation with official state or local sources.
            </p>
            <p className="max-w-prose text-sm text-muted-foreground">
              Operators: see repository file{" "}
              <span className="font-mono text-foreground">
                docs/geo-edge-cases.md
              </span>{" "}
              for persistence, cookies, and logging notes.
            </p>
          </section>

          <section aria-labelledby="freshness-heading" className="space-y-4">
            <h2
              id="freshness-heading"
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              Freshness and attribution
            </h2>
            <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
              Live features will show{" "}
              <strong className="font-medium text-foreground">
                source, license hints, and fetch time
              </strong>{" "}
              where applicable (for example LegiScan CC-BY). Stale or failed
              syncs should surface as{" "}
              <strong className="font-medium text-foreground">
                recoverable errors
              </strong>{" "}
              with a path back to the official source, not as silent blanks.
            </p>
            <p className="text-sm text-muted-foreground">
              <Link
                href="/"
                className="font-medium text-primary underline-offset-4 hover:underline focus-visible:rounded-md focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Back to home
              </Link>
            </p>
          </section>
        </div>
      </PageTemplate>
    </div>
  );
}
