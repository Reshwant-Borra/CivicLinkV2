"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Scale, CalendarDays, MapPin, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

type TabId =
  | "foryou"
  | "bills"
  | "events"
  | "voting"
  | "education"
  | "housing"
  | "transit"
  | "community";

const TABS: { id: TabId; label: string }[] = [
  { id: "foryou", label: "For You" },
  { id: "bills", label: "Bills" },
  { id: "events", label: "Events" },
  { id: "voting", label: "Voting" },
  { id: "education", label: "Education" },
  { id: "housing", label: "Housing" },
  { id: "transit", label: "Transit" },
  { id: "community", label: "Community" },
];

type CardKind = "bill" | "event" | "voting";

type Card = {
  id: string;
  kind: CardKind;
  title: string;
  subtitle: string;
  summary: string;
  meta: string;
  accentColor: string;
  tags: string[];
  href: string;
  topics: TabId[];
};

const ALL_CARDS: Card[] = [
  {
    id: "sb247",
    kind: "bill",
    title: "Metropolitan Transit Funding Act",
    subtitle: "SB-247",
    summary:
      "Allocates $240M toward bus rapid transit corridors and rail upgrades, reducing Atlanta metro commutes by ~18%.",
    meta: "Senate vote · This week",
    accentColor: "#8B5CF6",
    tags: ["Transit", "Community"],
    href: "/federal",
    topics: ["foryou", "bills", "transit", "community"],
  },
  {
    id: "hb102",
    kind: "bill",
    title: "Education Infrastructure Grant",
    subtitle: "HB-102",
    summary:
      "Provides $85M in state grants for school building renovations across Georgia's underserved districts.",
    meta: "Committee review · Oct 15",
    accentColor: "#3B82F6",
    tags: ["Education"],
    href: "/federal",
    topics: ["bills", "education"],
  },
  {
    id: "hb118",
    kind: "bill",
    title: "Affordable Housing Zoning Act",
    subtitle: "HB-118",
    summary:
      "Enables higher-density residential zoning within half a mile of major transit stops.",
    meta: "First reading · Nov 1",
    accentColor: "#D6A75E",
    tags: ["Housing", "Community"],
    href: "/federal",
    topics: ["bills", "housing", "community"],
  },
  {
    id: "ev-schoolboard",
    kind: "event",
    title: "School Board Meeting",
    subtitle: "Tonight · Mon, Oct 7",
    summary:
      "Budget review and curriculum planning for 2026–2027. Public comment open to all residents.",
    meta: "6:00 PM · Forsyth Co. Admin",
    accentColor: "#D6A75E",
    tags: ["Local", "Education"],
    href: "/events",
    topics: ["foryou", "events", "education", "community"],
  },
  {
    id: "ev-townhall",
    kind: "event",
    title: "Community Town Hall",
    subtitle: "Wed, Oct 9",
    summary:
      "Open Q&A with Forsyth County commissioners on transit, zoning, and upcoming ballot measures.",
    meta: "7:00 PM · N. Forsyth Rec Center",
    accentColor: "#10B981",
    tags: ["Community", "Local"],
    href: "/events",
    topics: ["foryou", "events", "community"],
  },
  {
    id: "ev-sb247comment",
    kind: "event",
    title: "SB-247 Public Comment",
    subtitle: "Fri, Oct 11",
    summary:
      "Share your voice on the transit funding bill. Written or oral comments accepted from all residents.",
    meta: "4:00 PM · Online (Zoom)",
    accentColor: "#8B5CF6",
    tags: ["Transit", "Bills"],
    href: "/events",
    topics: ["events", "transit", "bills"],
  },
  {
    id: "voting-deadline",
    kind: "voting",
    title: "Voter Registration Deadline",
    subtitle: "Oct 7 · 14 days",
    summary:
      "Last day to register or update your info for the November 5th General Election.",
    meta: "Online or in-person",
    accentColor: "#D6A75E",
    tags: ["Voting"],
    href: "/voting",
    topics: ["foryou", "voting"],
  },
  {
    id: "voting-early",
    kind: "voting",
    title: "Early Voting Opens",
    subtitle: "Oct 15",
    summary:
      "Cast your ballot early at select Forsyth County locations. No excuse required.",
    meta: "Mon–Sat · Multiple sites",
    accentColor: "#5B7C99",
    tags: ["Voting"],
    href: "/voting",
    topics: ["voting"],
  },
];

const KIND_ICONS: Record<CardKind, React.ElementType> = {
  bill: Scale,
  event: CalendarDays,
  voting: MapPin,
};

export function CivicDiscoverySection() {
  const [active, setActive] = useState<TabId>("foryou");
  const railRef = useRef<HTMLDivElement>(null);

  const cards = ALL_CARDS.filter((c) => c.topics.includes(active));

  return (
    <section aria-label="Civic discovery">
      {/* ── Section eyebrow ── */}
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF] mb-2.5">
        Browse by topic
      </p>

      {/* ── Context strip (living room / bedroom pattern) ── */}
      <div
        className="flex gap-0.5 overflow-x-auto mb-4"
        style={{ scrollbarWidth: "none" }}
        role="tablist"
        aria-label="Browse by topic"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => setActive(tab.id)}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-1.5 text-[13px] transition-all duration-200 whitespace-nowrap cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#5B7C99]/40",
              active === tab.id
                ? "bg-[#5B7C99] text-white font-semibold shadow-sm"
                : "text-[#9CA3AF] font-medium hover:text-[#4B5563] hover:bg-black/[0.04]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Discovery rail ── */}
      <div className="relative">
        <div
          ref={railRef}
          className="flex gap-3 overflow-x-auto pb-2"
          style={{
            scrollbarWidth: "none",
            scrollSnapType: "x mandatory",
          }}
          role="tabpanel"
          aria-label={`${active} content`}
        >
          {cards.map((card) => (
            <DiscoveryCard key={card.id} card={card} />
          ))}
          {cards.length === 0 && (
            <p className="text-[13px] text-[#9CA3AF] py-4">
              No items for this topic yet.
            </p>
          )}
        </div>
        {/* Right-edge fade hint — invites horizontal scroll */}
        {cards.length > 2 && (
          <div
            className="absolute right-0 top-0 bottom-2 w-12 pointer-events-none"
            style={{
              background:
                "linear-gradient(to left, #FFFFFF 0%, transparent 100%)",
            }}
            aria-hidden
          />
        )}
      </div>
    </section>
  );
}

function DiscoveryCard({ card }: { card: Card }) {
  const Icon = KIND_ICONS[card.kind];

  return (
    <Link
      href={card.href}
      className="group shrink-0 flex flex-col gap-3 rounded-2xl border border-[#E7E5E4] bg-white p-4 outline-none focus-visible:ring-2 focus-visible:ring-[#5B7C99]/40 cursor-pointer transition-all duration-200 hover:border-[#D1CFC8] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
      style={{
        minWidth: 252,
        maxWidth: 272,
        scrollSnapAlign: "start",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}
    >
      {/* Header row */}
      <div className="flex items-start gap-2.5">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: `${card.accentColor}14`,
            border: `1px solid ${card.accentColor}28`,
          }}
        >
          <Icon
            className="w-4 h-4"
            style={{ color: card.accentColor }}
            aria-hidden
          />
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="text-[11px] font-semibold leading-none mb-0.5"
            style={{ color: card.accentColor }}
          >
            {card.subtitle}
          </p>
          <h3 className="text-[13px] font-semibold text-[#2B2B2B] leading-snug group-hover:text-black transition-colors duration-200">
            {card.title}
          </h3>
        </div>
        <ChevronRight
          className="w-3.5 h-3.5 text-[#D1CFC8] group-hover:text-[#9CA3AF] shrink-0 mt-0.5 transition-all duration-200 group-hover:translate-x-0.5"
          aria-hidden
        />
      </div>

      {/* Summary */}
      <p className="text-[12px] text-[#6B7280] leading-relaxed line-clamp-2">
        {card.summary}
      </p>

      {/* Footer */}
      <div className="flex items-end justify-between gap-2 mt-auto">
        <div className="flex flex-wrap gap-1.5">
          {card.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold"
              style={{
                background: `${card.accentColor}12`,
                color: card.accentColor,
                border: `1px solid ${card.accentColor}22`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        <span className="text-[11px] text-[#9CA3AF] font-medium whitespace-nowrap">
          {card.meta}
        </span>
      </div>
    </Link>
  );
}
