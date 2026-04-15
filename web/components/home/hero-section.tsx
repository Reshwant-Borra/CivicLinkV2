import Link from "next/link";
import { MapPin, FileText, Clock, CalendarDays, ArrowRight } from "lucide-react";

import { CivicPulseVisualizer } from "./civic-pulse-visualizer";

function FloatingInsightCard({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`absolute z-10 flex items-center gap-2 rounded-xl px-3 py-2 pointer-events-none ${className}`}
      style={{
        background: "rgba(255,255,255,0.94)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(231,229,228,0.80)",
        boxShadow:
          "0 4px 16px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

const primaryCtas = [
  {
    href: "/voting",
    label: "Find my polling place",
    icon: MapPin,
    primary: true,
  },
  { href: "/voting", label: "View my ballot", icon: FileText, primary: false },
  {
    href: "/voting",
    label: "See deadlines",
    icon: Clock,
    primary: false,
  },
  {
    href: "/events",
    label: "Local events",
    icon: CalendarDays,
    primary: false,
  },
] as const;

export function HeroSection() {
  return (
    <section
      className="flex flex-col xl:flex-row gap-6 xl:gap-4 min-h-0"
      aria-labelledby="hero-heading"
    >
      {/* LEFT: Greeting + CTAs */}
      <div className="flex flex-col justify-center gap-5 xl:flex-1 xl:max-w-[420px] xl:pr-6">
        {/* Eyebrow */}
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-widest"
            style={{
              background: "rgba(91,124,153,0.09)",
              border: "1px solid rgba(91,124,153,0.20)",
              color: "#3F6E9A",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "#3F6E9A" }}
              aria-hidden
            />
            Forsyth County, GA
          </span>
        </div>

        {/* Greeting */}
        <div className="space-y-2">
          <p
            className="text-sm font-medium tracking-wide"
            style={{ color: "#7A8594" }}
          >
            Good evening.
          </p>
          <h1
            id="hero-heading"
            className="text-3xl xl:text-[2.25rem] font-bold leading-[1.15] tracking-[-0.02em]"
            style={{ color: "#1D2430" }}
          >
            Here&apos;s what matters
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #3F6E9A 0%, #D39B38 100%)",
              }}
            >
              in your area today.
            </span>
          </h1>
          <p
            className="text-[14px] leading-relaxed max-w-sm"
            style={{ color: "#7A8594" }}
          >
            Stay ahead of local elections, deadlines, and policy changes — all
            from official sources.
          </p>
        </div>

        {/* CTA grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {primaryCtas.map(({ href, label, icon: Icon, primary }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-[13px] font-semibold transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F6E9A]/40 group"
              style={
                primary
                  ? {
                      background:
                        "linear-gradient(135deg, #3F6E9A 0%, #2F5B84 100%)",
                      boxShadow:
                        "0 4px 16px rgba(91,124,153,0.28), 0 1px 4px rgba(91,124,153,0.18)",
                      color: "white",
                    }
                  : {
                      background: "#F6F3ED",
                      border: "1px solid #E8E1D7",
                      color: "#7A8594",
                    }
              }
            >
              <Icon
                className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110"
                aria-hidden
              />
              <span className="leading-tight">{label}</span>
              {primary && (
                <ArrowRight
                  className="w-3.5 h-3.5 ml-auto opacity-60 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden
                />
              )}
            </Link>
          ))}
        </div>

        {/* Trust note */}
        <p className="text-[11px] leading-snug" style={{ color: "#8E99A8" }}>
          Data from official government sources — no opinion, no agenda.{" "}
          <Link
            href="/about-data"
            className="underline underline-offset-2 transition-opacity duration-200 hover:opacity-60"
            style={{ color: "#7A8594" }}
          >
            About our data
          </Link>
        </p>
      </div>

      {/* RIGHT: Civic Pulse Visualizer + floating cards */}
      <div className="relative flex-1 min-h-[340px] xl:min-h-0">
        {/* Floating insight card: election countdown */}
        <FloatingInsightCard className="top-3 left-2 xl:-left-4 civic-float-b">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: "#3F6E9A" }}
            aria-hidden
          />
          <span
            className="text-[12px] font-semibold"
            style={{ color: "#1D2430" }}
          >
            Election in{" "}
            <span style={{ color: "#3F6E9A" }}>12 days</span>
          </span>
        </FloatingInsightCard>

        {/* Floating insight card: deadline */}
        <FloatingInsightCard className="top-16 right-1 xl:-right-2 civic-float-c">
          <Clock
            className="w-3.5 h-3.5 shrink-0"
            style={{ color: "#D39B38" }}
            aria-hidden
          />
          <span
            className="text-[12px] font-semibold"
            style={{ color: "#1D2430" }}
          >
            Reg. closes{" "}
            <span style={{ color: "#D39B38" }}>Oct 7</span>
          </span>
        </FloatingInsightCard>

        {/* Floating insight card: bill alert */}
        <FloatingInsightCard
          className="bottom-10 left-2 xl:left-0 civic-float-b"
          style={{ animationDelay: "1.2s" } as React.CSSProperties}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: "#3F6E9A", opacity: 0.65 }}
            aria-hidden
          />
          <span
            className="text-[12px] font-semibold"
            style={{ color: "#1D2430" }}
          >
            New bill may affect{" "}
            <span style={{ color: "#3F6E9A" }}>transit funding</span>
          </span>
        </FloatingInsightCard>

        {/* Visualizer */}
        <CivicPulseVisualizer />
      </div>
    </section>
  );
}
