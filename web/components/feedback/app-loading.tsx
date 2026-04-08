import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

export type AppLoadingProps = {
  label?: string;
  className?: string;
};

/** Accessible loading indicator for pages, panels, and async regions. */
export function AppLoading({ label = "Loading", className }: AppLoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card/60 px-6 py-12 text-center shadow-sm",
        className
      )}
    >
      <Loader2
        className="size-8 animate-spin text-primary motion-reduce:animate-none"
        aria-hidden
      />
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  );
}
