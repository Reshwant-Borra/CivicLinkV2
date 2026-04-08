import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type PageTemplateProps = {
  title: string;
  description?: string;
  /** Primary call-to-action region (buttons, links). */
  cta?: ReactNode;
  children?: ReactNode;
  className?: string;
};

/**
 * Standard page scaffold: title, optional description, optional primary CTA band, then body.
 */
export function PageTemplate({
  title,
  description,
  cta,
  children,
  className,
}: PageTemplateProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 md:py-10 lg:max-w-5xl lg:px-8",
        className
      )}
    >
      <header className="border-border border-b pb-6 md:pb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-prose text-base leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
        {cta ? (
          <div
            className="mt-6 flex flex-wrap gap-3"
            aria-label="Primary actions"
          >
            {cta}
          </div>
        ) : null}
      </header>
      {children ? <div className="pt-8">{children}</div> : null}
    </div>
  );
}
