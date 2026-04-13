import { AppEmpty } from "@/components/feedback/app-empty";
import { PageTemplate } from "@/components/layout/page-template";
import { ClearLocationButton } from "@/components/location/clear-location-button";
import { LocationForm } from "@/components/location/location-form";

export default function SettingsPage() {
  return (
    <div className="bg-background text-foreground">
      <PageTemplate
        title="Settings"
        description="Location preview (Segment 3): resolve ZIP to districts on the server. Saved profile, auth, and notifications arrive in Segment 10."
      >
        <div className="flex max-w-xl flex-col gap-4">
          <LocationForm />
          <ClearLocationButton />
        </div>
        <AppEmpty
          title="More settings (coming)"
          description="Authentication and saved preferences are not wired yet."
        />
      </PageTemplate>
    </div>
  );
}
