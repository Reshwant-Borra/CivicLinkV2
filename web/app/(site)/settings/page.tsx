import { AppEmpty } from "@/components/feedback/app-empty";
import { PageTemplate } from "@/components/layout/page-template";

export default function SettingsPage() {
  return (
    <div className="bg-background text-foreground">
      <PageTemplate
        title="Settings"
        description="Saved location, notifications, and account preferences — Segment 10."
      >
        <AppEmpty
          title="Stub route"
          description="Authentication and preferences are not wired yet."
        />
      </PageTemplate>
    </div>
  );
}
