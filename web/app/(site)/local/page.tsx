import { AppEmpty } from "@/components/feedback/app-empty";
import { PageTemplate } from "@/components/layout/page-template";

export default function LocalPage() {
  return (
    <div className="bg-background text-foreground">
      <PageTemplate
        title="Local government"
        description="Pilot city or county coverage (e.g. Legistar) with honest gaps messaging — Segment 9."
      >
        <AppEmpty
          title="Stub route"
          description="Local pilot APIs are not wired yet."
        />
      </PageTemplate>
    </div>
  );
}
