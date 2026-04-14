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
      className={`absolute z-10 flex items-center gap-2 rounded-xl px-3 py-2 border border-white/[0.12] pointer-events-none ${className}`}
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.04) 100%)",
        backdropFilter: "blur(16px)",
        boxShadow:
          "0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.06)",
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
              background: "rgba(37,99,235,0.18)",
              border: "1px solid rgba(37,99,235,0.30)",
              color: "#60A5FA",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse"
              aria-hidden
            />
            Forsyth County, GA
          </span>
        </div>

        {/* Greeting */}
        <div className="space-y-2">
          <p className="text-[#6B80A8] text-sm font-medium tracking-wide">
            Good evening.
          </p>
          <h1
            id="hero-heading"
            className="text-3xl xl:text-[2.25rem] font-bold text-white leading-[1.15] tracking-[-0.02em]"
          >
            Here&apos;s what matters
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #60A5FA 0%, #818CF8 60%, #A78BFA 100%)",
              }}
            >
              in your area today.
            </span>
          </h1>
          <p className="text-[#6B80A8] text-[14px] leading-relaxed max-w-sm">
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
              className="flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-[13px] font-semibold transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/60 group"
              style={
                primary
                  ? {
                      background:
                        "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                      boxShadow:
                        "0 4px 20px rgba(37,99,235,0.4), 0 0 0 1px rgba(255,255,255,0.08)",
                      color: "white",
                    }
                  : {
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.10)",
                      color: "#B0C4E8",
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
        <p className="text-[11px] text-[#3D5070] leading-snug">
          Data from official government sources — no opinion, no agenda.{" "}
          <Link
            href="/about-data"
            className="text-[#4B6080] underline underline-offset-2 hover:text-[#8496B8] transition-colors duration-200"
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
            className="w-2 h-2 rounded-full bg-[#34D399] shadow-[0_0_8px_rgba(52,211,153,0.8)]"
            aria-hidden
          />
          <span className="text-[12px] font-semibold text-white">
            Election in{" "}
            <span className="text-[#34D399]">12 days</span>
          </span>
        </FloatingInsightCard>

        {/* Floating insight card: deadline */}
        <FloatingInsightCard className="top-16 right-1 xl:-right-2 civic-float-c">
          <Clock className="w-3.5 h-3.5 text-[#FBBF24] shrink-0" aria-hidden />
          <span className="text-[12px] font-semibold text-white">
            Reg. closes{" "}
            <span className="text-[#FBBF24]">Oct 7</span>
          </span>
        </FloatingInsightCard>

        {/* Floating insight card: bill alert */}
        <FloatingInsightCard className="bottom-10 left-2 xl:left-0 civic-float-b" style={{ animationDelay: "1.2s" } as React.CSSProperties}>
          <span
            className="w-2 h-2 rounded-full bg-[#818CF8] shadow-[0_0_8px_rgba(129,140,248,0.7)]"
            aria-hidden
          />
          <span className="text-[12px] font-semibold text-[#D0DDEF]">
            New bill may affect{" "}
            <span className="text-[#818CF8]">transit funding</span>
          </span>
        </FloatingInsightCard>

        {/* Visualizer */}
        <CivicPulseVisualizer />
      </div>
    </section>
  );
}
