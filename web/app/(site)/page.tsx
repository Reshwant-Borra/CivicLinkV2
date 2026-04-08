import Link from "next/link";

import { AppEmpty } from "@/components/feedback/app-empty";
import { AppError } from "@/components/feedback/app-error";
import { AppLoading } from "@/components/feedback/app-loading";
import { PageTemplate } from "@/components/layout/page-template";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="bg-background text-foreground">
      <PageTemplate
        title="CivicLink"
        description="Neutral civic dashboard for federal and state legislation, voting information, civic events, and optional local pilot coverage. Visual system follows design-system/MASTER.md — trustworthy, accessible, primary-source forward."
        cta={
          <>
            <Button asChild>
              <Link href="/federal">Federal</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/voting">Voting</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/api/health">API health</Link>
            </Button>
          </>
        }
      >
        <section aria-labelledby="shared-states-heading" className="space-y-6">
          <h2
            id="shared-states-heading"
            className="text-lg font-semibold text-foreground"
          >
            Shared UI states (Segment 2.7)
          </h2>
          <p className="max-w-prose text-sm text-muted-foreground">
            Empty, loading, and error patterns ship as reusable components for
            upcoming data routes.
          </p>
          <div className="grid gap-6 lg:grid-cols-3">
            <AppEmpty
              title="No bills yet"
              description="When search returns nothing, use this pattern with a clear next step."
              action={
                <Button asChild variant="outline" size="sm">
                  <Link href="/federal">Go to Federal</Link>
                </Button>
              }
            />
            <AppLoading
              label="Loading legislation…"
              className="min-h-[200px]"
            />
            <AppError
              title="Could not reach the source"
              description="Try again shortly. CivicLink never substitutes unofficial rumor for official data."
              action={<Button size="sm">Retry</Button>}
            />
          </div>
        </section>
      </PageTemplate>
    </div>
  );
}
