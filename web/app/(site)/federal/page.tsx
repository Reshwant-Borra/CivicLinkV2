import { AppEmpty } from "@/components/feedback/app-empty";
import { PageTemplate } from "@/components/layout/page-template";

export default function FederalPage() {
  return (
    <div className="bg-background text-foreground">
      <PageTemplate
        title="Federal legislation"
        description="Bill metadata, summaries, sponsors, actions, and links to Congress.gov — implemented in Segment 5."
      >
        <AppEmpty
          title="Stub route"
          description="Federal search and detail views are not wired yet."
        />
      </PageTemplate>
    </div>
  );
}
