import Link from "next/link";
import { Scale, ArrowRight, Users, Car, DollarSign } from "lucide-react";

const impactAreas = [
  { label: "Transit", icon: Car, color: "#D39B38" },
  { label: "Community", icon: Users, color: "#5F8B68" },
  { label: "Cost of Living", icon: DollarSign, color: "#D39B38" },
];

export function BillSpotlightCard() {
  return (
    <section
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(91,124,153,0.18)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}
      aria-labelledby="bill-spotlight-heading"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: "rgba(91,124,153,0.10)",
            border: "1px solid rgba(91,124,153,0.20)",
          }}
        >
          <Scale
            className="w-4 h-4"
            style={{ color: "#3F6E9A" }}
            aria-hidden
          />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[10px] font-bold tracking-widest uppercase rounded-full px-2 py-0.5"
              style={{
                background: "rgba(91,124,153,0.09)",
                color: "#3F6E9A",
                border: "1px solid rgba(91,124,153,0.18)",
              }}
            >
              Bill Spotlight
            </span>
            <span
              className="text-[10px] font-mono"
              style={{ color: "#8E99A8" }}
            >
              SB-247
            </span>
          </div>
          <h2
            id="bill-spotlight-heading"
            className="text-[14px] font-semibold leading-snug mt-1"
            style={{ color: "#1D2430" }}
          >
            Metropolitan Transit Funding Act
          </h2>
        </div>
      </div>

      {/* Plain language summary */}
      <div>
        <p
          className="text-[12px] leading-relaxed"
          style={{ color: "#7A8594" }}
        >
          <span className="font-medium" style={{ color: "#1D2430" }}>
            What it does:
          </span>{" "}
          Allocates $240M in state funding toward expanding bus rapid transit
          corridors, updating aging rail infrastructure, and reducing average
          commute times in metro Atlanta by an estimated 18%.
        </p>
        <p
          className="text-[12px] leading-relaxed mt-2"
          style={{ color: "#7A8594" }}
        >
          <span className="font-medium" style={{ color: "#1D2430" }}>
            Why it matters:
          </span>{" "}
          If passed, Forsyth County residents could see new express bus service
          by mid-2026 and lower transit costs for daily commuters.
        </p>
      </div>

      {/* Impact chips */}
      <div>
        <p
          className="text-[10px] font-semibold uppercase tracking-widest mb-2"
          style={{ color: "#8E99A8" }}
        >
          Affected areas
        </p>
        <div className="flex flex-wrap gap-2">
          {impactAreas.map(({ label, icon: Icon, color }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
              style={{
                background: `${color}10`,
                color,
                border: `1px solid ${color}22`,
              }}
            >
              <Icon className="w-3 h-3 shrink-0" aria-hidden />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Status bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span
            className="text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: "#8E99A8" }}
          >
            Legislative progress
          </span>
          <span
            className="text-[10px] font-bold"
            style={{ color: "#3F6E9A" }}
          >
            Senate vote pending
          </span>
        </div>
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ background: "#F6F3ED" }}
          role="progressbar"
          aria-valuenow={65}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Legislative progress: 65%"
        >
          <div
            className="h-full rounded-full"
            style={{
              width: "65%",
              background: "linear-gradient(90deg, #3F6E9A 0%, #D39B38 100%)",
            }}
          />
        </div>
        <div className="flex justify-between mt-1">
          {["Introduced", "Committee", "Floor vote", "Governor"].map(
            (step, i) => (
              <span
                key={step}
                className="text-[9px] font-medium"
                style={{ color: i < 3 ? "#3F6E9A" : "#C9BFB2" }}
              >
                {step}
              </span>
            )
          )}
        </div>
      </div>

      {/* CTA */}
      <Link
        href="/federal"
        className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F6E9A]/40 group w-fit hover:bg-[#3F6E9A]/[0.14]"
        style={{
          background: "rgba(91,124,153,0.09)",
          border: "1px solid rgba(91,124,153,0.20)",
          color: "#3F6E9A",
        }}
      >
        Read full bill text
        <ArrowRight
          className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden
        />
      </Link>
    </section>
  );
}
