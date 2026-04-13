"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { AppError } from "@/components/feedback/app-error";
import { AppLoading } from "@/components/feedback/app-loading";
import { Button } from "@/components/ui/button";
import type { JurisdictionContext } from "@/lib/geo/types";

type Props = {
  className?: string;
};

export function LocationForm({ className }: Props) {
  const router = useRouter();
  const [zip, setZip] = useState("");
  const [street, setStreet] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<JurisdictionContext | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/geo/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          zip: zip.trim(),
          street: street.trim() || undefined,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        jurisdiction?: JurisdictionContext;
        persisted?: boolean;
      };
      if (!res.ok || !data.ok) {
        setError(data.error ?? `Request failed (${res.status})`);
        return;
      }
      if (data.jurisdiction) setResult(data.jurisdiction);
      if (data.persisted) {
        router.refresh();
      }
    } catch {
      setError("Network error while resolving location.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div id="saved-location" className={className}>
      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm"
        aria-labelledby="location-form-title"
      >
        <h2
          id="location-form-title"
          className="font-mono text-lg font-semibold text-foreground"
        >
          Set your location
        </h2>
        <p className="text-sm text-muted-foreground">
          US ZIP code (required). Street improves Census matching. Resolution
          runs on the server; API keys are never sent to the browser.
        </p>
        <div className="space-y-2">
          <label
            htmlFor="loc-zip"
            className="block text-sm font-medium text-foreground"
          >
            ZIP code
          </label>
          <input
            id="loc-zip"
            name="zip"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            required
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            className="focus-visible:ring-ring w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-3 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            placeholder="e.g. 20500"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="loc-street"
            className="block text-sm font-medium text-foreground"
          >
            Street (optional)
          </label>
          <input
            id="loc-street"
            name="street"
            type="text"
            autoComplete="street-address"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className="focus-visible:ring-ring w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-3 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            placeholder="e.g. 1600 Pennsylvania Ave NW"
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Resolving…" : "Resolve"}
        </Button>
      </form>

      {loading ? (
        <div className="mt-6">
          <AppLoading label="Resolving jurisdiction…" />
        </div>
      ) : null}

      {error ? (
        <div className="mt-6">
          <AppError title="Could not resolve" description={error} />
        </div>
      ) : null}

      {result ? (
        <div
          className="mt-6 space-y-3 rounded-xl border border-border bg-muted/30 p-6 text-sm"
          role="region"
          aria-label="Resolution result"
        >
          <h3 className="font-mono font-semibold text-foreground">Result</h3>
          <dl className="grid gap-2 text-muted-foreground">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide">
                Coordinates
              </dt>
              <dd className="text-foreground">
                {result.coordinates
                  ? `${result.coordinates.lat.toFixed(4)}, ${result.coordinates.lng.toFixed(4)}`
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide">
                Place / state
              </dt>
              <dd className="text-foreground">
                {[result.placeName, result.statePostal]
                  .filter(Boolean)
                  .join(", ") || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide">
                Congressional
              </dt>
              <dd className="text-foreground">
                {result.congressionalDistrict?.name ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide">
                State leg (upper / lower)
              </dt>
              <dd className="text-foreground">
                {[
                  result.stateLegislativeUpper?.name,
                  result.stateLegislativeLower?.name,
                ]
                  .filter(Boolean)
                  .join(" · ") || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide">
                Sources
              </dt>
              <dd className="text-foreground">
                ZIP centroid: {result.sources.zipCentroid}; Census:{" "}
                {result.sources.census ? "yes" : "no"}; Google Civic:{" "}
                {result.sources.googleCivic ? "yes" : "no"}
              </dd>
            </div>
          </dl>
          {result.warnings.length > 0 ? (
            <ul className="list-inside list-disc text-xs text-amber-800 dark:text-amber-200">
              {result.warnings.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
