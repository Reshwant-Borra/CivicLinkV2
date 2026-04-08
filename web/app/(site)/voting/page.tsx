import { AppEmpty } from "@/components/feedback/app-empty";
import { PageTemplate } from "@/components/layout/page-template";

export default function VotingPage() {
  return (
    <div className="bg-background text-foreground">
      <PageTemplate
        title="Voting information"
        description="Polling places, contests, and deadlines from Google Civic Info and Vote Smart — implemented in Segment 7. All live content will include freshness and official-source disclaimers."
      >
        <AppEmpty
          title="Stub route"
          description="Voter tools are not wired yet."
        />
      </PageTemplate>
    </div>
  );
}
