import { AppEmpty } from "@/components/feedback/app-empty";
import { PageTemplate } from "@/components/layout/page-template";

export default function EventsPage() {
  return (
    <div className="bg-background text-foreground">
      <PageTemplate
        title="Civic events"
        description="Town halls, forums, and volunteer opportunities near you — Eventbrite, Meetup, and VolunteerMatch in Segment 8."
      >
        <AppEmpty
          title="Stub route"
          description="Event aggregation is not wired yet."
        />
      </PageTemplate>
    </div>
  );
}
