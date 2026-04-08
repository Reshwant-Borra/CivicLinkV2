import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

import { cn } from "@/lib/utils";

export type AppEmptyProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
};

/** Neutral empty state for lists and feature placeholders. */
export function AppEmpty({
  title,
  description,
  icon,
  action,
  className,
}: AppEmptyProps) {
  return (
    <div
      role="status"
      className={cn(
        "rounded-xl border border-dashed border-border bg-card/50 px-6 py-10 text-center shadow-sm",
        className
      )}
    >
      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {icon ?? <Inbox className="size-6" aria-hidden />}
      </div>
      <p className="text-base font-semibold text-foreground">{title}</p>
      {description ? (
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
      {action ? (
        <div className="mt-6 flex justify-center gap-3">{action}</div>
      ) : null}
    </div>
  );
}
