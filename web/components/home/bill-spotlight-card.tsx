import Link from "next/link";
import { Scale, ArrowRight, Users, Car, DollarSign } from "lucide-react";

const impactAreas = [
  { label: "Transit", icon: Car, color: "#818CF8" },
  { label: "Community", icon: Users, color: "#34D399" },
  { label: "Cost of Living", icon: DollarSign, color: "#FBBF24" },
];

export function BillSpotlightCard() {
  return (
    <section
      className="rounded-2xl border border-[#818CF8]/[0.22] p-5 flex flex-col gap-4"
      style={{
        background:
          "linear-gradient(145deg, rgba(129,140,248,0.10) 0%, rgba(129,140,248,0.03) 100%)",
        backdropFilter: "blur(8px)",
      }}
      aria-labelledby="bill-spotlight-heading"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: "rgba(129,140,248,0.18)",
            border: "1px solid rgba(129,140,248,0.30)",
          }}
        >
          <Scale
            className="w-4.5 h-4.5"
            style={{ color: "#818CF8" }}
            aria-hidden
          />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[10px] font-bold tracking-widest uppercase rounded-full px-2 py-0.5"
              style={{
                background: "rgba(129,140,248,0.18)",
                color: "#818CF8",
                border: "1px solid rgba(129,140,248,0.28)",
              }}
            >
              Bill Spotlight
            </span>
            <span className="text-[10px] text-[#3D5070] font-mono">
              SB-247
            </span>
          </div>
          <h2
            id="bill-spotlight-heading"
            className="text-[14px] font-semibold text-[#E8F0FF] leading-snug mt-1"
          >
            Metropolitan Transit Funding Act
          </h2>
        </div>
      </div>

      {/* Plain language summary */}
      <div>
        <p className="text-[12px] text-[#6B80A8] leading-relaxed">
          <span className="text-[#A8C0E0] font-medium">What it does:</span>{" "}
          Allocates $240M in state funding toward expanding bus rapid transit
          corridors, updating aging rail infrastructure, and reducing average
          commute times in metro Atlanta by an estimated 18%.
        </p>
        <p className="text-[12px] text-[#6B80A8] leading-relaxed mt-2">
          <span className="text-[#A8C0E0] font-medium">Why it matters:</span>{" "}
          If passed, Forsyth County residents could see new express bus service
          by mid-2026 and lower transit costs for daily commuters.
        </p>
      </div>

      {/* Impact chips */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#3D5070] mb-2">
          Affected areas
        </p>
        <div className="flex flex-wrap gap-2">
          {impactAreas.map(({ label, icon: Icon, color }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
              style={{
                background: `${color}18`,
                color,
                border: `1px solid ${color}28`,
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
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#3D5070]">
            Legislative progress
          </span>
          <span className="text-[10px] font-bold text-[#818CF8]">
            Senate vote pending
          </span>
        </div>
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.07)" }}
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
              background:
                "linear-gradient(90deg, #818CF8 0%, #A78BFA 100%)",
              boxShadow: "0 0 8px rgba(129,140,248,0.5)",
            }}
          />
        </div>
        <div className="flex justify-between mt-1">
          {["Introduced", "Committee", "Floor vote", "Governor"].map(
            (step, i) => (
              <span
                key={step}
                className="text-[9px] font-medium"
                style={{ color: i < 3 ? "#818CF8" : "#3D5070" }}
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
        className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#818CF8]/60 group w-fit"
        style={{
          background:
            "linear-gradient(135deg, rgba(129,140,248,0.22) 0%, rgba(129,140,248,0.10) 100%)",
          border: "1px solid rgba(129,140,248,0.30)",
          color: "#818CF8",
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
