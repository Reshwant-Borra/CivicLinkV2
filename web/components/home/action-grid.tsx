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
  glowColor: string;
  tag?: string;
};

function ActionCard({
  title,
  description,
  icon: Icon,
  href,
  size = "default",
  accentColor,
  glowColor,
  tag,
}: ActionCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative rounded-2xl border border-white/[0.08] overflow-hidden cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/60",
        "transition-all duration-220",
        "hover:border-white/[0.16] hover:shadow-[0_8px_40px_rgba(0,0,0,0.45)]",
        size === "wide" ? "col-span-2" : "col-span-1"
      )}
      style={{
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.065) 0%, rgba(255,255,255,0.025) 100%)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Subtle accent glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
        style={{
          background: `radial-gradient(ellipse at top left, ${glowColor} 0%, transparent 65%)`,
        }}
        aria-hidden
      />

      <div
        className={cn(
          "relative z-10 flex gap-4 p-4",
          size === "wide" ? "items-center" : "flex-col"
        )}
      >
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
          style={{
            background: `${accentColor}1A`,
            border: `1px solid ${accentColor}30`,
            boxShadow: `0 0 12px ${glowColor}`,
          }}
        >
          <Icon
            className="w-5 h-5"
            style={{ color: accentColor }}
            aria-hidden
          />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[14px] font-semibold text-[#E8F0FF] leading-tight group-hover:text-white transition-colors duration-200">
              {title}
            </h3>
            <ArrowUpRight
              className="w-3.5 h-3.5 text-[#3D5070] group-hover:text-[#8496B8] shrink-0 mt-0.5 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden
            />
          </div>
          <p className="text-[12px] text-[#5A7094] leading-snug mt-1 group-hover:text-[#7A90B4] transition-colors duration-200">
            {description}
          </p>
          {tag && (
            <span
              className="inline-block mt-2 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide"
              style={{
                background: `${accentColor}18`,
                color: accentColor,
                border: `1px solid ${accentColor}28`,
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
    accentColor: "#3B82F6",
    glowColor: "rgba(59,130,246,0.15)",
    tag: "Election Nov 5",
  },
  {
    title: "View My Ballot",
    description: "See every race and measure on your upcoming ballot.",
    icon: FileText,
    href: "/voting",
    accentColor: "#818CF8",
    glowColor: "rgba(129,140,248,0.14)",
  },
  {
    title: "Upcoming Deadlines",
    description: "Key registration, early voting, and civic action dates.",
    icon: Clock,
    href: "/voting",
    accentColor: "#FBBF24",
    glowColor: "rgba(251,191,36,0.12)",
    tag: "Oct 7 next",
  },
  {
    title: "Local Events",
    description:
      "Town halls, school board meetings, and civic gatherings near you.",
    icon: CalendarDays,
    href: "/events",
    accentColor: "#34D399",
    glowColor: "rgba(52,211,153,0.12)",
  },
  {
    title: "Bill Spotlight",
    description:
      "Follow legislation that may affect your community directly.",
    icon: Scale,
    href: "/federal",
    size: "wide",
    accentColor: "#A78BFA",
    glowColor: "rgba(167,139,250,0.14)",
    tag: "SB-247 active",
  },
  {
    title: "Your District",
    description: "Explore your reps, boundaries, and who votes on what.",
    icon: Navigation,
    href: "/local",
    accentColor: "#22D3EE",
    glowColor: "rgba(34,211,238,0.12)",
  },
];

export function ActionGrid() {
  return (
    <section aria-labelledby="action-grid-heading">
      <h2
        id="action-grid-heading"
        className="text-[11px] font-semibold uppercase tracking-widest text-[#3D5070] mb-3"
      >
        Quick actions
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {cards.map((card) => (
          <ActionCard key={card.title} {...card} />
        ))}
      </div>
    </section>
  );
}
