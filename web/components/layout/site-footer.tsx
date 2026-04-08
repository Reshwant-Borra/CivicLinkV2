import Link from "next/link";

import { primaryNav } from "./nav-config";

export function SiteFooter() {
  return (
    <footer
      className="mt-auto border-t border-border bg-muted/40"
      role="contentinfo"
    >
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between md:gap-12">
          <div className="max-w-md space-y-2">
            <p className="font-mono text-sm font-semibold text-foreground">
              CivicLink
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Neutral civic dashboard — legislation, voting, events, and local
              participation. Data from official and licensed sources with clear
              attribution.
            </p>
          </div>
          <nav aria-label="Footer" className="min-w-0 shrink-0">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Sections
            </p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
              {primaryNav.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="cursor-pointer text-sm font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:rounded-md focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-muted/40"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-8 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} CivicLink. Not an official government
            site.
          </p>
          <Link
            href="/about-data"
            className="text-xs font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:rounded-md focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-muted/40"
          >
            About data & sources
          </Link>
        </div>
      </div>
    </footer>
  );
}
