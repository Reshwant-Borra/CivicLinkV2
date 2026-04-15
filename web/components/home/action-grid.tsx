import Link from "next/link";
import {
  MapPin,
  FileText,
  Clock,
  CalendarDays,
  Scale,
  Navigation,
  ArrowUpRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type ActionCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  /** "default" | "wide" — wide cards span 2 columns */
  size?: "default" | "wide";
  accentColor: string;
  tag?: string;
  compact?: boolean;
};

function ActionCard({
  title,
  description,
  icon: Icon,
  href,
  size = "default",
  accentColor,
  tag,
  compact = false,
}: ActionCardProps) {
  const isWide = size === "wide" && !compact;

  return (
    <Link
      href={href}
      className={cn(
        "group relative overflow-hidden cursor-pointer",
        compact ? "rounded-[1.3rem] min-h-[9.35rem]" : "rounded-2xl",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F6E9A]/40",
        "transition-all duration-200",
        "bg-white border border-[#E8E1D7] shadow-[0_2px_8px_rgba(29,36,48,0.05)]",
        "hover:border-[#C9BFB2] hover:shadow-[0_8px_24px_rgba(63,110,154,0.12)]",
        isWide ? "col-span-2" : "col-span-1"
      )}
    >
      {/* Soft accent tint on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
        style={{
          background: `radial-gradient(ellipse at top left, ${accentColor}09 0%, transparent 60%)`,
        }}
        aria-hidden
      />

      <div
        className={cn(
          "relative z-10 flex",
          compact ? "min-h-[8.75rem] flex-col gap-2.5 p-3" : "gap-4 p-4",
          isWide ? "items-center" : "flex-col"
        )}
      >
        {/* Icon */}
        <div
          className={cn(
            "flex items-center justify-center shrink-0 rounded-xl transition-transform duration-200 group-hover:scale-105",
            compact ? "h-9 w-9" : "h-10 w-10"
          )}
          style={{
            background: `${accentColor}10`,
            border: `1px solid ${accentColor}20`,
          }}
        >
          <Icon
            className={compact ? "h-[18px] w-[18px]" : "w-5 h-5"}
            style={{ color: accentColor }}
            aria-hidden
          />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={cn(
                "font-semibold leading-tight transition-colors duration-200 group-hover:text-black",
                compact ? "text-[13px]" : "text-[14px]"
              )}
              style={{ color: "#1D2430" }}
            >
              {title}
            </h3>
            <ArrowUpRight
              className="w-3.5 h-3.5 shrink-0 mt-0.5 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              style={{ color: "#C9BFB2" }}
              aria-hidden
            />
          </div>
          <p
            className={cn(
              "mt-1 leading-snug",
              compact ? "line-clamp-2 text-[10.5px]" : "text-[12px]"
            )}
            style={{ color: "#7A8594" }}
          >
            {description}
          </p>
          {tag && (
            <span
              className={cn(
                "inline-block rounded-full px-2 py-0.5 font-semibold tracking-wide",
                compact ? "mt-1.5 text-[9px]" : "mt-2 text-[10px]"
              )}
              style={{
                background: `${accentColor}10`,
                color: accentColor,
                border: `1px solid ${accentColor}20`,
              }}
            >
              {tag}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

const cards: ActionCardProps[] = [
  {
    title: "Find My Polling Place",
    description:
      "Locate your nearest voting site with hours, directions, and accessibility info.",
    icon: MapPin,
    href: "/voting",
    size: "wide",
    accentColor: "#3F6E9A",
    tag: "Election Nov 5",
  },
  {
    title: "View My Ballot",
    description: "See every race and measure on your upcoming ballot.",
    icon: FileText,
    href: "/voting",
    accentColor: "#5582AD",
  },
  {
    title: "Upcoming Deadlines",
    description: "Key registration, early voting, and civic action dates.",
    icon: Clock,
    href: "/voting",
    accentColor: "#D39B38",
    tag: "Oct 7 next",
  },
  {
    title: "Local Events",
    description:
      "Town halls, school board meetings, and civic gatherings near you.",
    icon: CalendarDays,
    href: "/events",
    accentColor: "#5F8B68",
  },
  {
    title: "Bill Spotlight",
    description: "Follow legislation that may affect your community directly.",
    icon: Scale,
    href: "/federal",
    size: "wide",
    accentColor: "#D39B38",
    tag: "SB-247 active",
  },
  {
    title: "Your District",
    description: "Explore your reps, boundaries, and who votes on what.",
    icon: Navigation,
    href: "/local",
    accentColor: "#3F6E9A",
  },
];

type ActionGridProps = {
  variant?: "default" | "compact";
};

export function ActionGrid({ variant = "default" }: ActionGridProps) {
  const compact = variant === "compact";

  return (
    <section
      aria-labelledby="action-grid-heading"
      className={cn(
        compact &&
          "w-full rounded-[1.8rem] border border-[#E8E1D7] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(246,243,237,0.92)_100%)] p-4 shadow-[0_10px_28px_rgba(63,110,154,0.09)]"
      )}
    >
      <div className={compact ? "mb-3 space-y-1" : "mb-3"}>
        <h2
          id="action-grid-heading"
          className="text-[11px] font-semibold uppercase tracking-widest"
          style={{ color: "#8E99A8" }}
        >
          Quick actions
        </h2>
        {compact ? (
          <p
            className="text-[11px] leading-relaxed"
            style={{ color: "#7A8594" }}
          >
            Mid-page civic shortcuts beside your snapshot.
          </p>
        ) : null}
      </div>
      <div
        className={cn(
          "grid gap-3",
          compact ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2 lg:grid-cols-3"
        )}
      >
        {cards.map((card) => (
          <ActionCard key={card.title} {...card} compact={compact} />
        ))}
      </div>
    </section>
  );
}
