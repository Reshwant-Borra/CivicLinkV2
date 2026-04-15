"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Scale,
  CalendarDays,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Clock,
  ArrowRight,
} from "lucide-react";

// ─── Data ──────────────────────────────────────────────────

type BillCard = {
  id: string;
  number: string;
  title: string;
  category: string;
  categoryColor: string;
  summary: string;
  nextStep: string;
  whyMatters: string;
  href: string;
};

const BILLS: BillCard[] = [
  {
    id: "sb247",
    number: "SB-247",
    title: "Metropolitan Transit Funding Act",
    category: "Transit",
    categoryColor: "#D39B38",
    summary:
      "Allocates $240M toward bus rapid transit corridors and rail upgrades in metro Atlanta.",
    nextStep: "Senate vote this week",
    whyMatters:
      "New express bus service for Forsyth County commuters as early as mid-2026.",
    href: "/federal",
  },
  {
    id: "hb102",
    number: "HB-102",
    title: "Education Infrastructure Grant",
    category: "Education",
    categoryColor: "#3F6E9A",
    summary:
      "Provides $85M in state grants for school building renovations across Georgia.",
    nextStep: "Committee review · Oct 15",
    whyMatters:
      "Three Forsyth County schools appear on the current renovation eligibility list.",
    href: "/federal",
  },
  {
    id: "hb118",
    number: "HB-118",
    title: "Affordable Housing Zoning Act",
    category: "Housing",
    categoryColor: "#5582AD",
    summary:
      "Enables higher-density residential zoning near major transit stops.",
    nextStep: "First reading · Nov 1",
    whyMatters:
      "Could increase affordable housing options close to planned transit lines.",
    href: "/federal",
  },
  {
    id: "hb205",
    number: "HB-205",
    title: "Clean Water Infrastructure Act",
    category: "Community",
    categoryColor: "#5F8B68",
    summary:
      "Funds $60M in water system upgrades across rural and suburban Georgia.",
    nextStep: "Governor's desk · pending",
    whyMatters:
      "Forsyth County water systems are eligible for a grant in this cycle.",
    href: "/federal",
  },
];

type EventCard = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: string;
  typeColor: string;
  relevance: string;
  href: string;
};

const EVENTS: EventCard[] = [
  {
    id: "ev-schoolboard",
    title: "School Board Meeting",
    date: "Mon, Oct 7",
    time: "6:00 PM",
    location: "Forsyth Co. Admin Building",
    type: "School board",
    typeColor: "#3F6E9A",
    relevance:
      "Budget review and public comment on 2026–2027 curriculum open to all residents.",
    href: "/events",
  },
  {
    id: "ev-townhall",
    title: "Community Town Hall",
    date: "Wed, Oct 9",
    time: "7:00 PM",
    location: "N. Forsyth Recreation Center",
    type: "Town hall",
    typeColor: "#D39B38",
    relevance:
      "Open Q&A with county commissioners on transit, zoning, and November ballot measures.",
    href: "/events",
  },
  {
    id: "ev-sb247",
    title: "SB-247 Public Comment",
    date: "Fri, Oct 11",
    time: "4:00 PM",
    location: "Online · Zoom",
    type: "Public comment",
    typeColor: "#5582AD",
    relevance:
      "Share your voice on the transit funding bill — written or oral comments accepted.",
    href: "/events",
  },
  {
    id: "ev-volunteer",
    title: "Civic Volunteer Day",
    date: "Sat, Oct 12",
    time: "9:00 AM",
    location: "Big Creek Greenway",
    type: "Local volunteer",
    typeColor: "#5F8B68",
    relevance:
      "Community trail cleanup organized by Forsyth County parks department.",
    href: "/events",
  },
];

// ─── Context bridge ────────────────────────────────────────
// Visual connector from the hero section to the discovery
// rails. Creates an anchor point and sets "this week" context
// so the eye doesn't fall through the transition.

function ContextBridge() {
  return (
    <div
      className="flex items-center justify-between gap-4 rounded-2xl px-4 py-3.5"
      style={{
        background:
          "linear-gradient(135deg, rgba(91,124,153,0.06) 0%, rgba(214,167,94,0.03) 100%)",
        border: "1px solid rgba(91,124,153,0.12)",
      }}
    >
      {/* Live indicator + heading */}
      <div className="flex items-center gap-3 min-w-0">
        <span
          className="w-2 h-2 rounded-full shrink-0 animate-pulse"
          style={{
            background: "#3F6E9A",
            boxShadow: "0 0 0 4px rgba(91,124,153,0.14)",
          }}
          aria-hidden
        />
        <div className="min-w-0">
          <p
            className="text-[14px] font-semibold leading-tight"
            style={{ color: "#1D2430" }}
          >
            What&apos;s happening now
          </p>
          <p className="text-[11px] mt-0.5" style={{ color: "#8E99A8" }}>
            Forsyth County, GA &middot; Oct 7 – 12
          </p>
        </div>
      </div>

      {/* Count chips — hidden on very small screens */}
      <div className="hidden sm:flex items-center gap-2 shrink-0">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap"
          style={{
            background: "rgba(91,124,153,0.09)",
            color: "#3F6E9A",
            border: "1px solid rgba(91,124,153,0.18)",
          }}
        >
          <Scale className="w-2.5 h-2.5" aria-hidden />
          4 bills
        </span>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap"
          style={{
            background: "rgba(139,158,140,0.09)",
            color: "#5F8B68",
            border: "1px solid rgba(139,158,140,0.18)",
          }}
        >
          <CalendarDays className="w-2.5 h-2.5" aria-hidden />
          4 events
        </span>
      </div>
    </div>
  );
}

// ─── Bill card ─────────────────────────────────────────────

function BillDiscoveryCard({ bill }: { bill: BillCard }) {
  return (
    <Link
      href={bill.href}
      className="group relative shrink-0 flex flex-col gap-3.5 rounded-2xl overflow-hidden p-4 pl-5 outline-none focus-visible:ring-2 focus-visible:ring-[#3F6E9A]/40 cursor-pointer transition-all duration-200 border border-[#E8E1D7] bg-white shadow-[0_2px_10px_rgba(63,110,154,0.06)] hover:shadow-[0_8px_28px_rgba(63,110,154,0.12)] hover:border-[#C9BFB2]"
      style={{
        minWidth: 264,
        maxWidth: 284,
        minHeight: 198,
        scrollSnapAlign: "start",
      }}
    >
      {/* Left category accent bar — clipped to card border-radius */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ background: bill.categoryColor }}
        aria-hidden
      />

      {/* Header row */}
      <div className="flex items-start gap-3">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
          style={{
            background: `${bill.categoryColor}12`,
            border: `1px solid ${bill.categoryColor}25`,
          }}
        >
          <Scale
            className="w-4 h-4"
            style={{ color: bill.categoryColor }}
            aria-hidden
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span
              className="text-[10px] font-bold tracking-wide"
              style={{ color: bill.categoryColor }}
            >
              {bill.number}
            </span>
            <span
              className="inline-block rounded-full px-1.5 py-px text-[9px] font-semibold"
              style={{
                background: `${bill.categoryColor}10`,
                color: bill.categoryColor,
                border: `1px solid ${bill.categoryColor}20`,
              }}
            >
              {bill.category}
            </span>
          </div>
          <h3
            className="text-[13px] font-semibold leading-snug transition-colors duration-200 group-hover:text-black"
            style={{ color: "#1D2430" }}
          >
            {bill.title}
          </h3>
        </div>
      </div>

      {/* Summary */}
      <p
        className="text-[12px] leading-relaxed line-clamp-2"
        style={{ color: "#7A8594" }}
      >
        {bill.summary}
      </p>

      {/* Why it matters */}
      <div
        className="rounded-xl px-3 py-2"
        style={{
          background: `${bill.categoryColor}07`,
          border: `1px solid ${bill.categoryColor}18`,
        }}
      >
        <p className="text-[11px] leading-snug" style={{ color: "#7A8594" }}>
          <span
            className="font-semibold"
            style={{ color: bill.categoryColor }}
          >
            Why it matters:{" "}
          </span>
          {bill.whyMatters}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-1.5">
          <Clock
            className="w-3 h-3 shrink-0"
            style={{ color: "#8E99A8" }}
            aria-hidden
          />
          <span
            className="text-[11px] font-medium"
            style={{ color: "#8E99A8" }}
          >
            {bill.nextStep}
          </span>
        </div>
        <ChevronRight
          className="w-3.5 h-3.5 transition-all duration-200 group-hover:translate-x-0.5"
          style={{ color: "#C9BFB2" }}
          aria-hidden
        />
      </div>
    </Link>
  );
}

// ─── Event card ────────────────────────────────────────────

function EventDiscoveryCard({ event }: { event: EventCard }) {
  return (
    <Link
      href={event.href}
      className="group relative shrink-0 flex flex-col gap-3 rounded-2xl overflow-hidden p-4 pl-5 outline-none focus-visible:ring-2 focus-visible:ring-[#3F6E9A]/40 cursor-pointer transition-all duration-200 border border-[#E8E1D7] bg-white shadow-[0_2px_10px_rgba(63,110,154,0.06)] hover:shadow-[0_8px_28px_rgba(63,110,154,0.12)] hover:border-[#C9BFB2]"
      style={{
        minWidth: 252,
        maxWidth: 272,
        minHeight: 172,
        scrollSnapAlign: "start",
      }}
    >
      {/* Left event-type accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ background: event.typeColor }}
        aria-hidden
      />

      {/* Type badge + date row */}
      <div className="flex items-start justify-between gap-2">
        <span
          className="inline-block rounded-full px-2.5 py-1 text-[10px] font-semibold shrink-0"
          style={{
            background: `${event.typeColor}10`,
            color: event.typeColor,
            border: `1px solid ${event.typeColor}20`,
          }}
        >
          {event.type}
        </span>

        {/* Date given visual weight via a tinted pill */}
        <div
          className="rounded-lg px-2 py-1 text-right shrink-0"
          style={{
            background: `${event.typeColor}09`,
            border: `1px solid ${event.typeColor}20`,
          }}
        >
          <p
            className="text-[11px] font-bold leading-tight"
            style={{ color: event.typeColor }}
          >
            {event.date}
          </p>
          <p className="text-[10px]" style={{ color: "#8E99A8" }}>
            {event.time}
          </p>
        </div>
      </div>

      {/* Title */}
      <h3
        className="text-[13px] font-semibold leading-snug transition-colors duration-200 group-hover:text-black"
        style={{ color: "#1D2430" }}
      >
        {event.title}
      </h3>

      {/* Location */}
      <div className="flex items-center gap-1.5">
        <MapPin
          className="w-3 h-3 shrink-0"
          style={{ color: "#8E99A8" }}
          aria-hidden
        />
        <span className="text-[11px] truncate" style={{ color: "#7A8594" }}>
          {event.location}
        </span>
      </div>

      {/* Civic relevance */}
      <p
        className="text-[12px] leading-relaxed line-clamp-2 mt-auto"
        style={{ color: "#7A8594" }}
      >
        {event.relevance}
      </p>

      {/* Footer */}
      <div className="flex items-center gap-2">
        <CalendarDays
          className="w-3 h-3 shrink-0"
          style={{ color: "#C9BFB2" }}
          aria-hidden
        />
        <span className="text-[11px] flex-1" style={{ color: "#8E99A8" }}>
          Add to calendar
        </span>
        <ChevronRight
          className="w-3.5 h-3.5 transition-all duration-200 group-hover:translate-x-0.5"
          style={{ color: "#C9BFB2" }}
          aria-hidden
        />
      </div>
    </Link>
  );
}

function getScrollBehavior(): ScrollBehavior {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return "auto";
  }

  return "smooth";
}

// ─── Horizontal rail ───────────────────────────────────────

function Rail({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  const railRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const rail = railRef.current;
    if (!rail) {
      return;
    }
    const maxScrollLeft = rail.scrollWidth - rail.clientWidth;
    const epsilon = 2;
    setCanScrollLeft(rail.scrollLeft > epsilon);
    setCanScrollRight(
      maxScrollLeft > epsilon && rail.scrollLeft < maxScrollLeft - epsilon
    );
  }, []);

  useLayoutEffect(() => {
    const idRaf = requestAnimationFrame(() => updateScrollState());
    return () => cancelAnimationFrame(idRaf);
  }, [updateScrollState]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) {
      return;
    }
    updateScrollState();
    rail.addEventListener("scroll", updateScrollState, { passive: true });
    const resizeObserver = new ResizeObserver(() => updateScrollState());
    resizeObserver.observe(rail);
    return () => {
      rail.removeEventListener("scroll", updateScrollState);
      resizeObserver.disconnect();
    };
  }, [updateScrollState]);

  const scrollRail = (direction: "left" | "right") => {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    const distance = Math.max(rail.clientWidth * 0.78, 296);

    rail.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: getScrollBehavior(),
    });
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => scrollRail("left")}
        disabled={!canScrollLeft}
        aria-label={`Scroll ${label} left`}
        className="absolute left-0 top-1/2 z-20 hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#E8E1D7] bg-[rgba(255,255,255,0.95)] text-[#3F6E9A] shadow-[0_10px_24px_rgba(63,110,154,0.12)] backdrop-blur-sm transition-all duration-200 hover:-translate-x-[55%] hover:shadow-[0_14px_32px_rgba(63,110,154,0.16)] motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-[0.28] sm:flex"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
      </button>
      <div
        id={id}
        ref={railRef}
        className="flex scroll-smooth gap-4 overflow-x-auto px-9 pb-2 pt-1 motion-reduce:scroll-auto sm:px-11"
        style={{
          scrollbarWidth: "none",
          scrollSnapType: "x mandatory",
        }}
      >
        {children}
      </div>
      <div
        className="absolute left-0 top-0 bottom-2 w-16 pointer-events-none transition-opacity duration-200"
        style={{
          opacity: canScrollLeft ? 1 : 0,
          background:
            "linear-gradient(to right, #FFFFFF 22%, rgba(255,255,255,0.76) 58%, transparent 100%)",
        }}
        aria-hidden
      />
      {/* Right-edge fade — wider gradient creates a stronger scroll
          affordance; partial next-card peek invites horizontal scroll */}
      <div
        className="absolute right-0 top-0 bottom-2 w-24 pointer-events-none transition-opacity duration-200"
        style={{
          opacity: canScrollRight ? 1 : 0,
          background:
            "linear-gradient(to left, #FFFFFF 15%, rgba(255,255,255,0.75) 55%, transparent 100%)",
        }}
        aria-hidden
      />
      <button
        type="button"
        onClick={() => scrollRail("right")}
        disabled={!canScrollRight}
        aria-label={`Scroll ${label} right`}
        className="absolute right-0 top-1/2 z-20 hidden h-11 w-11 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#E8E1D7] bg-[rgba(255,255,255,0.95)] text-[#3F6E9A] shadow-[0_10px_24px_rgba(63,110,154,0.12)] backdrop-blur-sm transition-all duration-200 hover:translate-x-[55%] hover:shadow-[0_14px_32px_rgba(63,110,154,0.16)] motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-[0.28] sm:flex"
      >
        <ChevronRight className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}

// ─── Section label row ─────────────────────────────────────

function SectionHeader({
  eyebrow,
  subtitle,
  href,
}: {
  eyebrow: string;
  subtitle: string;
  href: string;
}) {
  return (
    <div className="flex items-end justify-between mb-3.5">
      <div>
        <p
          className="text-[10px] font-bold uppercase tracking-widest mb-1"
          style={{ color: "#8E99A8" }}
        >
          {eyebrow}
        </p>
        <p
          className="text-[13px] font-semibold leading-tight"
          style={{ color: "#1D2430" }}
        >
          {subtitle}
        </p>
      </div>
      <Link
        href={href}
        className="flex items-center gap-1 text-[11px] font-semibold transition-opacity duration-200 hover:opacity-60 group shrink-0 pb-px"
        style={{ color: "#3F6E9A" }}
      >
        See all
        <ArrowRight
          className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden
        />
      </Link>
    </div>
  );
}

// ─── Main exported section ─────────────────────────────────

export function CivicDiscoverySection() {
  return (
    <section aria-label="Civic discovery" className="space-y-6">
      {/* Context bridge: anchors the section visually and
          bridges the transition from the hero above */}
      <ContextBridge />

      {/* ── Bills to Watch ── */}
      <div>
        <SectionHeader
          eyebrow="Bills to watch"
          subtitle="Legislation that may affect Forsyth County"
          href="/federal"
        />
        <Rail id="bills-rail" label="bills to watch">
          {BILLS.map((bill) => (
            <BillDiscoveryCard key={bill.id} bill={bill} />
          ))}
        </Rail>
      </div>

      {/* ── Events Near You ── */}
      <div>
        <SectionHeader
          eyebrow="Events near you"
          subtitle="This week in Forsyth County"
          href="/events"
        />
        <Rail id="events-rail" label="events near you">
          {EVENTS.map((event) => (
            <EventDiscoveryCard key={event.id} event={event} />
          ))}
        </Rail>
      </div>
    </section>
  );
}
