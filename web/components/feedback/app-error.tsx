import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

import { cn } from "@/lib/utils";

export type AppErrorProps = {
  title?: string;
  description?: string;
  /** Retry button or other recovery actions. */
  action?: ReactNode;
  className?: string;
};

/** Inline error surface with calm, high-trust copy for civic data flows. */
export function AppError({
  title = "Something went wrong",
  description = "We could not load this content. You can try again, or check back later.",
  action,
  className,
}: AppErrorProps) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-xl border border-destructive/25 bg-destructive/5 px-6 py-8 shadow-sm",
        className
      )}
    >
      <div className="flex gap-4 text-left">
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive"
          aria-hidden
        >
          <AlertTriangle className="size-5" />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-base font-semibold text-foreground">{title}</p>
          {description ? (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
          {action ? (
            <div className="flex flex-wrap gap-3 pt-2">{action}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
