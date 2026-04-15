"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MapPin,
  FileText,
  Clock,
  CalendarDays,
  Scale,
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  Landmark,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { SidebarNav } from "./sidebar-nav";
import { HomeHeader } from "./home-header";
import { CivicCalendarRail } from "./civic-calendar-rail";

// ─── Tab types ────────────────────────────────────────────────────────────────

type Tab = "today" | "vote" | "bills" | "events" | "my-area";

const TABS: { id: Tab; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "vote", label: "Vote" },
  { id: "bills", label: "Bills" },
  { id: "events", label: "Events" },
  { id: "my-area", label: "My Area" },
];

// ─── Shared sub-components ────────────────────────────────────────────────────

/** Small stat card — top row */
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  color: string;
}) {
  return (
    <div
      className="flex flex-col gap-3 rounded-2xl p-4 border transition-shadow duration-200 hover:shadow-[0_6px_20px_rgba(63,110,154,0.10)]"
      style={{
        background: `${color}08`,
        borderColor: `${color}28`,
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}
    >
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
        style={{
          background: `${color}16`,
          border: `1px solid ${color}28`,
        }}
      >
        <Icon className="w-[15px] h-[15px]" style={{ color }} aria-hidden />
      </div>
      <div>
        <p
          className="text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: "#7A8594" }}
        >
          {label}
        </p>
        <p
          className="text-[23px] font-bold leading-none mt-1 tracking-tight"
          style={{ color: "#1D2430" }}
        >
          {value}
        </p>
        {sub && (
          <p className="text-[11px] mt-0.5 font-medium" style={{ color: "#7A8594" }}>
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

/** Compact priority card — stacked in a side column */
function PriorityCard({
  title,
  sub,
  color,
  icon: Icon,
  href,
}: {
  title: string;
  sub: string;
  color: string;
  icon: React.ElementType;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded-xl p-3.5 border border-[#E8E1D7] bg-white cursor-pointer transition-all duration-200 hover:border-[#C9BFB2] hover:shadow-[0_6px_22px_rgba(63,110,154,0.11)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F6E9A]/30"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
    >
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: `${color}10`, border: `1px solid ${color}22` }}
      >
        <Icon className="w-4 h-4" style={{ color }} aria-hidden />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="text-[13px] font-semibold leading-snug transition-colors duration-200 group-hover:text-black"
          style={{ color: "#1D2430" }}
        >
          {title}
        </p>
        <p className="text-[11px] mt-0.5 leading-snug" style={{ color: "#556070" }}>
          {sub}
        </p>
      </div>
      <ChevronRight
        className="w-4 h-4 shrink-0 mt-0.5 transition-all duration-200 group-hover:translate-x-0.5"
        style={{ color: "#D8CFC2" }}
        aria-hidden
      />
    </Link>
  );
}

// ─── Today tab ────────────────────────────────────────────────────────────────

/** Large featured civic issue card */
function FeaturedCivicCard() {
  return (
    <Link
      href="/federal"
      className="group relative flex flex-col gap-4 rounded-2xl p-5 border border-[#D8CFC2] bg-white overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-[0_10px_32px_rgba(63,110,154,0.14)] hover:border-[#C9BFB2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F6E9A]/30 h-full"
      style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
    >
      {/* Subtle top accent stripe */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl"
        style={{ background: "linear-gradient(90deg, #3F6E9A 0%, #5582AD 100%)" }}
        aria-hidden
      />

      {/* Hover tint */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top left, rgba(63,110,154,0.04) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      {/* Badges row */}
      <div className="relative z-10 flex items-center gap-2 flex-wrap mt-1">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold"
          style={{
            background: "#EDF4FA",
            color: "#3F6E9A",
            border: "1px solid rgba(63,110,154,0.22)",
          }}
        >
          <Scale className="w-3 h-3" aria-hidden />
          Transit · SB-247
        </span>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold"
          style={{
            background: "#FCF5E8",
            color: "#9A7328",
            border: "1px solid rgba(211,155,56,0.25)",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: "#D39B38" }}
            aria-hidden
          />
          Vote expected soon
        </span>
      </div>

      {/* Headline + description */}
      <div className="relative z-10">
        <h2
          className="text-[17px] font-bold leading-snug tracking-tight"
          style={{ color: "#1D2430" }}
        >
          Transit Funding Bill Advances
        </h2>
        <p className="text-[13px] leading-relaxed mt-1.5" style={{ color: "#556070" }}>
          Could improve bus routes and reduce commute times in Forsyth County.
          Senate vote expected this week — the outcome affects tens of thousands
          of local commuters.
        </p>
      </div>

      {/* Why it matters tinted box */}
      <div
        className="relative z-10 rounded-xl px-3.5 py-3"
        style={{
          background: "#EDF4FA",
          border: "1px solid rgba(63,110,154,0.16)",
        }}
      >
        <p className="text-[12px] leading-snug" style={{ color: "#556070" }}>
          <span className="font-semibold" style={{ color: "#3F6E9A" }}>
            Why it matters:{" "}
          </span>
          New express bus routes would reach Forsyth County commuters as early
          as mid-2026, saving 30+ minutes per trip.
        </p>
      </div>

      {/* CTA row */}
      <div className="relative z-10 flex items-center gap-2 mt-auto">
        <span
          className="flex items-center gap-1.5 text-[12px] font-semibold transition-colors duration-200 group-hover:text-[#2F5B84]"
          style={{ color: "#3F6E9A" }}
        >
          Read plain-language summary
          <ArrowRight
            className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden
          />
        </span>
      </div>
    </Link>
  );
}

/** 2×2 actionable priorities card grid */
function TodaysPriorities() {
  const items = [
    {
      title: "Find My Polling Place",
      description: "Nearest site · hours · accessibility info",
      icon: MapPin,
      href: "/voting",
      color: "#3F6E9A",
      tag: "Election Nov 5",
    },
    {
      title: "Review My Ballot",
      description: "All races and measures for your precinct",
      icon: FileText,
      href: "/voting",
      color: "#5582AD",
    },
    {
      title: "Registration Deadline",
      description: "Oct 7 · 14 days to register or update",
      icon: Clock,
      href: "/voting",
      color: "#D39B38",
      tag: "Urgent",
    },
    {
      title: "Local Events This Week",
      description: "3 civic events in Forsyth County",
      icon: CalendarDays,
      href: "/events",
      color: "#5F8B68",
    },
  ];

  return (
    <section aria-labelledby="priorities-heading">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: "#7A8594" }}
          >
            Today&apos;s priorities
          </p>
          <h2
            id="priorities-heading"
            className="text-[14px] font-semibold mt-0.5"
            style={{ color: "#1D2430" }}
          >
            Your most important civic actions
          </h2>
        </div>
        <Link
          href="/voting"
          className="flex items-center gap-1 text-[11px] font-semibold transition-opacity duration-200 hover:opacity-60 cursor-pointer group shrink-0"
          style={{ color: "#3F6E9A" }}
        >
          See all
          <ArrowRight
            className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="group relative flex flex-col gap-3 rounded-2xl p-4 border border-[#E8E1D7] bg-white cursor-pointer transition-all duration-200 hover:border-[#C9BFB2] hover:shadow-[0_8px_26px_rgba(63,110,154,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F6E9A]/30 overflow-hidden"
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
          >
            {/* Hover tint */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at top left, ${item.color}07 0%, transparent 60%)`,
              }}
              aria-hidden
            />

            <div className="relative z-10 flex items-start justify-between gap-2">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: `${item.color}14`,
                  border: `1px solid ${item.color}28`,
                }}
              >
                <item.icon
                  className="w-[17px] h-[17px]"
                  style={{ color: item.color }}
                  aria-hidden
                />
              </div>
              <ArrowUpRight
                className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                style={{ color: "#7A8594" }}
                aria-hidden
              />
            </div>

            <div className="relative z-10">
              <h3
                className="text-[13px] font-semibold leading-snug"
                style={{ color: "#1D2430" }}
              >
                {item.title}
              </h3>
              <p className="text-[11.5px] mt-0.5 leading-snug" style={{ color: "#7A8594" }}>
                {item.description}
              </p>
              {item.tag && (
                <span
                  className="inline-block mt-2 rounded-full px-2.5 py-0.5 text-[9.5px] font-semibold tracking-wide"
                  style={{
                    background: `${item.color}12`,
                    color: item.color,
                    border: `1px solid ${item.color}28`,
                  }}
                >
                  {item.tag}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

const TODAY_GREETING = "Good evening, Jane.";
const TODAY_HEADLINE = "Here's what matters in your area today.";

function TodayContent() {
  const [greetingTyped, setGreetingTyped] = useState("");
  const [headlineTyped, setHeadlineTyped] = useState("");

  useEffect(() => {
    let cancelled = false;
    const charMs = 42;
    const pauseBetweenMs = 320;

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        setTimeout(resolve, ms);
      });

    const run = async () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        setGreetingTyped(TODAY_GREETING);
        setHeadlineTyped(TODAY_HEADLINE);
        return;
      }

      for (let i = 1; i <= TODAY_GREETING.length; i++) {
        if (cancelled) return;
        setGreetingTyped(TODAY_GREETING.slice(0, i));
        await sleep(charMs);
      }
      await sleep(pauseBetweenMs);
      for (let i = 1; i <= TODAY_HEADLINE.length; i++) {
        if (cancelled) return;
        setHeadlineTyped(TODAY_HEADLINE.slice(0, i));
        await sleep(charMs);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-5 pb-4">
      {/* Greeting */}
      <div className="pt-1">
        <p className="text-[13px] font-medium" style={{ color: "#7A8594" }}>
          <span className="sr-only">{TODAY_GREETING}</span>
          <span aria-hidden="true">{greetingTyped}</span>
        </p>
        <h1
          className="text-[22px] font-bold leading-snug tracking-[-0.025em] mt-0.5"
          style={{ color: "#1D2430" }}
        >
          <span className="sr-only">{TODAY_HEADLINE}</span>
          <span aria-hidden="true">{headlineTyped}</span>
        </h1>
        <p className="text-[12.5px] mt-1.5" style={{ color: "#7A8594" }}>
          Forsyth County, GA · Updated just now ·{" "}
          <Link
            href="/about-data"
            className="underline underline-offset-2 transition-opacity hover:opacity-70"
            style={{ color: "#8E99A8" }}
          >
            About our data
          </Link>
        </p>
      </div>

      {/* Summary stats — 4 equal small cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={CalendarDays}
          label="Next election"
          value="12"
          sub="days · Nov 5"
          color="#3F6E9A"
        />
        <StatCard
          icon={Clock}
          label="Reg. deadline"
          value="Oct 7"
          sub="14 days left"
          color="#D39B38"
        />
        <StatCard
          icon={Scale}
          label="New bills"
          value="4"
          sub="this session"
          color="#5582AD"
        />
        <StatCard
          icon={CalendarDays}
          label="Events"
          value="3"
          sub="this week"
          color="#5F8B68"
        />
      </div>

      {/* Featured + Priority stack */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ minHeight: "220px" }}>
        {/* Featured card — 2/3 width */}
        <div className="col-span-2">
          <FeaturedCivicCard />
        </div>

        {/* Priority cards — 1/3 width, stacked */}
        <div className="flex flex-col gap-3">
          <PriorityCard
            title="School Board Meeting Tonight"
            sub="Forsyth Co. Admin · 6:00 PM"
            color="#D39B38"
            icon={AlertCircle}
            href="/events"
          />
          <PriorityCard
            title="Senate Vote Expected"
            sub="SB-247 Transit Funding Bill"
            color="#3F6E9A"
            icon={Landmark}
            href="/federal"
          />
          <PriorityCard
            title="Registration Closes Oct 7"
            sub="14 days to register or update"
            color="#5F8B68"
            icon={CheckCircle2}
            href="/voting"
          />
        </div>
      </div>

      {/* Section divider */}
      <div className="h-px" style={{ background: "#E8E1D7" }} aria-hidden />

      {/* Today's Priorities */}
      <TodaysPriorities />
    </div>
  );
}

// ─── Vote tab ─────────────────────────────────────────────────────────────────

function VoteContent() {
  return (
    <div className="space-y-5 pb-4">
      <div className="pt-1">
        <p
          className="text-[11px] font-semibold uppercase tracking-widest"
          style={{ color: "#7A8594" }}
        >
          Vote
        </p>
        <h1
          className="text-[20px] font-bold leading-snug tracking-[-0.02em] mt-0.5"
          style={{ color: "#1D2430" }}
        >
          Your voting information
        </h1>
        <p className="text-[13px] mt-1" style={{ color: "#556070" }}>
          Everything you need for the November 5 General Election.
        </p>
      </div>

      {/* Election countdown + quick actions */}
      <div
        className="rounded-2xl p-5 flex flex-col sm:flex-row items-start gap-6"
        style={{
          background: "#EDF4FA",
          border: "1px solid rgba(63,110,154,0.18)",
          boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
        }}
      >
        <div className="shrink-0">
          <p
            className="text-[11px] font-semibold uppercase tracking-widest"
            style={{ color: "#3F6E9A" }}
          >
            General Election
          </p>
          <p
            className="text-[44px] font-bold leading-none mt-1"
            style={{ color: "#1D2430" }}
          >
            12{" "}
            <span className="text-[20px] font-medium" style={{ color: "#3F6E9A" }}>
              days
            </span>
          </p>
          <p className="text-[13px] mt-1" style={{ color: "#556070" }}>
            November 5, 2026
          </p>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-3">
          {[
            { label: "Find Polling Place", icon: MapPin, href: "/voting", color: "#3F6E9A" },
            { label: "View My Ballot", icon: FileText, href: "/voting", color: "#5582AD" },
            { label: "Registration Deadline", icon: Clock, href: "/voting", color: "#D39B38" },
            { label: "Early Voting Dates", icon: CalendarDays, href: "/voting", color: "#5F8B68" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group flex items-center gap-2.5 rounded-xl px-3 py-2.5 border border-[#E8E1D7] bg-white cursor-pointer transition-all duration-200 hover:border-[#D8CFC2] hover:shadow-[0_4px_18px_rgba(63,110,154,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F6E9A]/40"
            >
              <item.icon
                className="w-4 h-4 shrink-0"
                style={{ color: item.color }}
                aria-hidden
              />
              <span
                className="text-[12px] font-medium transition-colors duration-200 group-hover:text-black"
                style={{ color: "#1D2430" }}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Status + ballot preview */}
      <div className="grid grid-cols-3 gap-4">
        <div
          className="rounded-2xl p-4"
          style={{
            background: "#F2F7F1",
            border: "1px solid rgba(111,154,116,0.22)",
            boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
          }}
        >
          <CheckCircle2 className="w-5 h-5 mb-2" style={{ color: "#5F8B68" }} aria-hidden />
          <p className="text-[13px] font-semibold" style={{ color: "#1D2430" }}>
            Registered to vote
          </p>
          <p className="text-[11px] mt-1" style={{ color: "#556070" }}>
            Forsyth County, GA · Active
          </p>
        </div>

        <div
          className="col-span-2 rounded-2xl p-4 border border-[#E8E1D7] bg-white"
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
        >
          <p
            className="text-[12px] font-semibold mb-1.5"
            style={{ color: "#1D2430" }}
          >
            Your precinct sample ballot
          </p>
          <p className="text-[12px] leading-relaxed" style={{ color: "#556070" }}>
            Preview candidates and measures on your November 5 ballot. Log in
            to personalize with your exact precinct.
          </p>
          <Link
            href="/voting"
            className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold transition-opacity hover:opacity-70 cursor-pointer group"
            style={{ color: "#3F6E9A" }}
          >
            View ballot preview{" "}
            <ArrowRight
              className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Bills tab ────────────────────────────────────────────────────────────────

const BILLS = [
  {
    id: "SB-247",
    title: "Metropolitan Transit Funding Act",
    category: "Transit",
    color: "#D39B38",
    summary:
      "Allocates $240M toward bus rapid transit corridors and rail upgrades in metro Atlanta.",
    status: "Senate vote this week",
    local: "Express bus for Forsyth commuters by mid-2026.",
  },
  {
    id: "HB-102",
    title: "Education Infrastructure Grant",
    category: "Education",
    color: "#3F6E9A",
    summary:
      "Provides $85M in state grants for school building renovations across Georgia.",
    status: "Committee · Oct 15",
    local: "Three Forsyth County schools on the eligibility list.",
  },
  {
    id: "HB-118",
    title: "Affordable Housing Zoning Act",
    category: "Housing",
    color: "#5582AD",
    summary:
      "Enables higher-density residential zoning near major transit stops.",
    status: "First reading · Nov 1",
    local: "Could increase affordable housing near planned transit lines.",
  },
];

function BillsContent() {
  return (
    <div className="space-y-5 pb-4">
      <div className="pt-1">
        <p
          className="text-[11px] font-semibold uppercase tracking-widest"
          style={{ color: "#7A8594" }}
        >
          Bills
        </p>
        <h1
          className="text-[20px] font-bold leading-snug tracking-[-0.02em] mt-0.5"
          style={{ color: "#1D2430" }}
        >
          Legislation affecting your area
        </h1>
        <p className="text-[13px] mt-1" style={{ color: "#556070" }}>
          Plain-language summaries of bills relevant to Forsyth County, GA.
        </p>
      </div>

      <div className="space-y-3">
        {BILLS.map((bill) => (
          <Link
            key={bill.id}
            href="/federal"
            className="group flex gap-4 rounded-2xl p-4 border border-[#E8E1D7] bg-white cursor-pointer transition-all duration-200 hover:border-[#C9BFB2] hover:shadow-[0_8px_26px_rgba(63,110,154,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F6E9A]/30 relative overflow-hidden"
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
          >
            {/* Left accent bar */}
            <div
              className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl"
              style={{ background: bill.color }}
              aria-hidden
            />

            <div className="pl-2 flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="text-[10px] font-bold tracking-wide"
                      style={{ color: bill.color }}
                    >
                      {bill.id}
                    </span>
                    <span
                      className="rounded-full px-2 py-0.5 text-[9px] font-semibold"
                      style={{
                        background: `${bill.color}10`,
                        color: bill.color,
                        border: `1px solid ${bill.color}22`,
                      }}
                    >
                      {bill.category}
                    </span>
                  </div>
                  <h3
                    className="text-[14px] font-semibold leading-snug"
                    style={{ color: "#1D2430" }}
                  >
                    {bill.title}
                  </h3>
                  <p
                    className="text-[12px] mt-1.5 leading-relaxed"
                    style={{ color: "#556070" }}
                  >
                    {bill.summary}
                  </p>
                </div>
                <ChevronRight
                  className="w-4 h-4 shrink-0 mt-1 transition-transform duration-200 group-hover:translate-x-0.5"
                  style={{ color: "#D8CFC2" }}
                  aria-hidden
                />
              </div>

              <div className="mt-2.5 flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3" style={{ color: "#7A8594" }} aria-hidden />
                  <span className="text-[11px]" style={{ color: "#7A8594" }}>
                    {bill.status}
                  </span>
                </div>
                <div
                  className="flex-1 min-w-0 rounded-lg px-2.5 py-1.5"
                  style={{
                    background: `${bill.color}09`,
                    border: `1px solid ${bill.color}22`,
                  }}
                >
                  <p className="text-[11px] truncate" style={{ color: "#556070" }}>
                    <span
                      className="font-semibold"
                      style={{ color: bill.color }}
                    >
                      Local impact:{" "}
                    </span>
                    {bill.local}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Link
        href="/federal"
        className="flex items-center justify-center gap-2 w-full rounded-2xl py-3 border border-[#E8E1D7] text-[12px] font-semibold cursor-pointer transition-all duration-200 hover:bg-[#EDF4FA] hover:border-[#3F6E9A]/25 hover:text-[#3F6E9A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F6E9A]/30"
        style={{ color: "#7A8594" }}
      >
        View all bills
        <ArrowRight className="w-3.5 h-3.5" aria-hidden />
      </Link>
    </div>
  );
}

// ─── Events tab ───────────────────────────────────────────────────────────────

const EVENTS = [
  {
    title: "School Board Meeting",
    date: "Today",
    time: "6:00 PM",
    location: "Forsyth Co. Admin Building",
    type: "School board",
    color: "#3F6E9A",
    relevance:
      "Budget review and public comment period open to all residents.",
  },
  {
    title: "Community Town Hall",
    date: "Wed, Apr 16",
    time: "7:00 PM",
    location: "N. Forsyth Recreation Center",
    type: "Town hall",
    color: "#D39B38",
    relevance:
      "Open Q&A with county commissioners on transit, zoning, and ballot measures.",
  },
  {
    title: "SB-247 Public Comment",
    date: "Fri, Apr 18",
    time: "4:00 PM",
    location: "Online · Zoom",
    type: "Public comment",
    color: "#5582AD",
    relevance:
      "Share your voice on the transit funding bill. Written or oral comments accepted.",
  },
  {
    title: "Civic Volunteer Day",
    date: "Sat, Apr 19",
    time: "9:00 AM",
    location: "Big Creek Greenway",
    type: "Local volunteer",
    color: "#5F8B68",
    relevance:
      "Community trail cleanup organized by Forsyth County parks department.",
  },
];

function EventsContent() {
  return (
    <div className="space-y-5 pb-4">
      <div className="pt-1">
        <p
          className="text-[11px] font-semibold uppercase tracking-widest"
          style={{ color: "#7A8594" }}
        >
          Events
        </p>
        <h1
          className="text-[20px] font-bold leading-snug tracking-[-0.02em] mt-0.5"
          style={{ color: "#1D2430" }}
        >
          Events near you this week
        </h1>
        <p className="text-[13px] mt-1" style={{ color: "#556070" }}>
          Forsyth County, GA · April 14–20
        </p>
      </div>

      <div className="space-y-3">
        {EVENTS.map((ev) => (
          <Link
            key={ev.title}
            href="/events"
            className="group flex items-start gap-4 rounded-2xl p-4 border border-[#E8E1D7] bg-white cursor-pointer transition-all duration-200 hover:border-[#C9BFB2] hover:shadow-[0_8px_26px_rgba(63,110,154,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F6E9A]/30"
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
          >
            {/* Date block */}
            <div
              className="shrink-0 rounded-xl px-3 py-2.5 text-center min-w-[64px]"
              style={{
                background: `${ev.color}11`,
                border: `1px solid ${ev.color}28`,
              }}
            >
              <p
                className="text-[10px] font-bold tracking-wide"
                style={{ color: ev.color }}
              >
                {ev.date.split(",")[0].toUpperCase()}
              </p>
              <p className="text-[11px] font-medium mt-0.5" style={{ color: "#556070" }}>
                {ev.time}
              </p>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span
                    className="inline-block rounded-full px-2 py-0.5 text-[9px] font-semibold mb-1.5"
                    style={{
                      background: `${ev.color}10`,
                      color: ev.color,
                      border: `1px solid ${ev.color}22`,
                    }}
                  >
                    {ev.type}
                  </span>
                  <h3
                    className="text-[14px] font-semibold leading-snug"
                    style={{ color: "#1D2430" }}
                  >
                    {ev.title}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3 h-3 shrink-0" style={{ color: "#7A8594" }} aria-hidden />
                    <span className="text-[11px]" style={{ color: "#556070" }}>
                      {ev.location}
                    </span>
                  </div>
                </div>
                <ChevronRight
                  className="w-4 h-4 shrink-0 mt-0.5 transition-transform duration-200 group-hover:translate-x-0.5"
                  style={{ color: "#D8CFC2" }}
                  aria-hidden
                />
              </div>
              <p
                className="text-[12px] mt-2 leading-relaxed"
                style={{ color: "#556070" }}
              >
                {ev.relevance}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── My Area tab ──────────────────────────────────────────────────────────────

function MyAreaContent() {
  const reps = [
    {
      name: "Brian Strickland",
      role: "State Senator",
      district: "District 5",
      initials: "BS",
    },
    {
      name: "Todd Jones",
      role: "State Representative",
      district: "District 24",
      initials: "TJ",
    },
    {
      name: "Drew Ferguson",
      role: "U.S. Representative",
      district: "GA-3",
      initials: "DF",
    },
  ];

  return (
    <div className="space-y-5 pb-4">
      <div className="pt-1">
        <p
          className="text-[11px] font-semibold uppercase tracking-widest"
          style={{ color: "#7A8594" }}
        >
          My Area
        </p>
        <h1
          className="text-[20px] font-bold leading-snug tracking-[-0.02em] mt-0.5"
          style={{ color: "#1D2430" }}
        >
          Forsyth County, GA
        </h1>
        <p className="text-[13px] mt-1" style={{ color: "#556070" }}>
          Your civic context — district, representatives, and local issues.
        </p>
      </div>

      {/* Location context cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "County", value: "Forsyth County", sub: "Cumming, GA" },
          { label: "State District", value: "House Dist. 24", sub: "Senate Dist. 5" },
          { label: "U.S. District", value: "GA-3", sub: "6th Circuit" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl p-4 border border-[#E8E1D7] bg-white"
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
          >
            <p
              className="text-[10px] font-semibold uppercase tracking-widest mb-2"
              style={{ color: "#7A8594" }}
            >
              {item.label}
            </p>
            <p className="text-[15px] font-bold" style={{ color: "#1D2430" }}>
              {item.value}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: "#556070" }}>
              {item.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Representatives */}
      <div>
        <p
          className="text-[11px] font-semibold uppercase tracking-widest mb-3"
          style={{ color: "#7A8594" }}
        >
          Your representatives
        </p>
        <div className="space-y-2">
          {reps.map((rep) => (
            <div
              key={rep.name}
              className="flex items-center gap-3 rounded-xl p-3.5 border border-[#E8E1D7] bg-white"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold text-white shrink-0"
                style={{
                  background: "linear-gradient(135deg, #3F6E9A 0%, #2F5B84 100%)",
                }}
              >
                {rep.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold" style={{ color: "#1D2430" }}>
                  {rep.name}
                </p>
                <p className="text-[11px]" style={{ color: "#556070" }}>
                  {rep.role} · {rep.district}
                </p>
              </div>
              <ChevronRight
                className="w-4 h-4 shrink-0"
                style={{ color: "#D8CFC2" }}
                aria-hidden
              />
            </div>
          ))}
        </div>
      </div>

      {/* Local issues */}
      <div>
        <p
          className="text-[11px] font-semibold uppercase tracking-widest mb-3"
          style={{ color: "#7A8594" }}
        >
          Local issue watch
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Transit expansion", color: "#D39B38", bg: "#FCF5E8", sub: "SB-247 vote imminent" },
            { label: "School budget 2026", color: "#3F6E9A", bg: "#EDF4FA", sub: "Board meets tonight" },
          ].map((issue) => (
            <div
              key={issue.label}
              className="rounded-xl p-3.5 border"
              style={{
                background: issue.bg,
                borderColor: `${issue.color}28`,
                boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
              }}
            >
              <p className="text-[13px] font-semibold" style={{ color: "#1D2430" }}>
                {issue.label}
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: "#556070" }}>
                {issue.sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function HomeDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("today");

  return (
    <div
      className="min-h-screen w-full flex items-start justify-center relative overflow-hidden"
      style={{ background: "#F6F3ED", padding: "12px" }}
    >
      {/* Atmospheric bloom — upper left civic blue */}
      <div
        className="pointer-events-none fixed top-0 left-0 w-[600px] h-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(63,110,154,0.10) 0%, transparent 70%)",
          transform: "translate(-30%, -30%)",
          filter: "blur(70px)",
        }}
        aria-hidden
      />
      {/* Atmospheric bloom — lower right gold */}
      <div
        className="pointer-events-none fixed bottom-0 right-0 w-[500px] h-[500px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(211,155,56,0.08) 0%, transparent 70%)",
          transform: "translate(30%, 30%)",
          filter: "blur(70px)",
        }}
        aria-hidden
      />

      {/* ── App Shell ── */}
      <div
        className="relative z-10 w-full flex rounded-[24px] overflow-hidden"
        style={{
          background: "#FFFFFF",
          boxShadow:
            "0 24px 64px rgba(29,36,48,0.10), 0 8px 24px rgba(63,110,154,0.07), inset 0 1px 0 rgba(255,255,255,0.92)",
          maxWidth: "1440px",
          height: "calc(100vh - 24px)",
          maxHeight: "960px",
          border: "1px solid rgba(232,225,215,0.85)",
        }}
      >
        {/* Left sidebar */}
        <SidebarNav />

        {/* Right panel: header + tabs + content */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Top utility bar */}
          <HomeHeader />

          {/* Tab strip */}
          <div
            className="flex items-end gap-0 px-5 shrink-0 bg-[linear-gradient(180deg,#FAF7F2_0%,transparent_100%)]"
            style={{ borderBottom: "1px solid #E8E1D7", paddingTop: "8px" }}
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative px-4 py-2.5 text-[13px] rounded-t-lg transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F6E9A]/30 whitespace-nowrap",
                  activeTab === tab.id
                    ? "font-semibold bg-[#EDF4FA]/90 text-[#1D2430] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]"
                    : "font-medium text-[#7A8594] hover:text-[#1D2430] hover:bg-[#F6F3ED]/80"
                )}
                style={{
                  color: activeTab === tab.id ? "#1D2430" : undefined,
                }}
                aria-current={activeTab === tab.id ? "page" : undefined}
              >
                {tab.label}
                {/* Active underline */}
                {activeTab === tab.id && (
                  <span
                    className="absolute bottom-0 left-1 right-1 h-[3px] rounded-t-full"
                    style={{
                      background: "linear-gradient(90deg, #3F6E9A 0%, #D39B38 100%)",
                      boxShadow: "0 0 12px rgba(63,110,154,0.35)",
                    }}
                    aria-hidden
                  />
                )}
              </button>
            ))}
          </div>

          {/* Content row: main canvas + right rail */}
          <div className="flex flex-1 min-h-0 overflow-hidden">
            {/* Scrollable main area */}
            <main
              className="flex-1 overflow-y-auto px-5 pt-5"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(0,0,0,0.06) transparent",
              }}
            >
              {activeTab === "today" && <TodayContent />}
              {activeTab === "vote" && <VoteContent />}
              {activeTab === "bills" && <BillsContent />}
              {activeTab === "events" && <EventsContent />}
              {activeTab === "my-area" && <MyAreaContent />}
            </main>

            {/* Right civic calendar rail */}
            <CivicCalendarRail />
          </div>
        </div>
      </div>
    </div>
  );
}
