import { AppEmpty } from "@/components/feedback/app-empty";
import { PageTemplate } from "@/components/layout/page-template";

export default function StatePage() {
  return (
    <div className="bg-background text-foreground">
      <PageTemplate
        title="State legislation"
        description="OpenStates-first state bills with LegiScan supplement — implemented in Segment 6."
      >
        <AppEmpty
          title="Stub route"
          description="State lists and detail are not wired yet."
        />
      </PageTemplate>
    </div>
  );
}
