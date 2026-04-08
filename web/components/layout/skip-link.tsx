export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only absolute top-4 left-4 z-50 rounded-md border border-border bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-md focus:not-sr-only focus:px-4 focus:py-2 focus:ring-3 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
    >
      Skip to main content
    </a>
  );
}
