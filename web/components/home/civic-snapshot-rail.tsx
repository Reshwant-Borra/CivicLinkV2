import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  Circle,
  ArrowRight,
  AlertCircle,
  Landmark,
  Clock,
} from "lucide-react";

type StepItem = {
  done: boolean;
  label: string;
};

const nextSteps: StepItem[] = [
  { done: true, label: "Check voter registration" },
  { done: false, label: "Find my polling place" },
  { done: false, label: "Review my ballot" },
  { done: false, label: "Set a reminder for Nov 5" },
];

export function CivicSnapshotRail() {
  return (
    <aside
      className="hidden xl:flex w-[272px] flex-col shrink-0 overflow-y-auto"
      style={{
        borderLeft: "1px solid #E8E1D7",
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(0,0,0,0.06) transparent",
      }}
      aria-label="Your civic snapshot"
    >
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2
            className="text-[11px] font-semibold uppercase tracking-widest"
            style={{ color: "#8E99A8" }}
          >
            Your civic snapshot
          </h2>
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{
              background: "#3F6E9A",
              boxShadow: "0 0 6px rgba(91,124,153,0.45)",
            }}
            aria-hidden
          />
        </div>

        {/* Election countdown */}
        <div
          className="rounded-2xl p-3.5"
          style={{
            background:
              "linear-gradient(135deg, rgba(91,124,153,0.08) 0%, rgba(91,124,153,0.02) 100%)",
            border: "1px solid rgba(91,124,153,0.16)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <CalendarDays
              className="w-4 h-4 shrink-0"
              style={{ color: "#3F6E9A" }}
              aria-hidden
            />
            <span
              className="text-[12px] font-semibold"
              style={{ color: "#1D2430" }}
            >
              Next election
            </span>
          </div>
          <p
            className="text-[22px] font-bold leading-none mb-1"
            style={{ color: "#1D2430" }}
          >
            12{" "}
            <span
              className="text-[14px] font-medium"
              style={{ color: "#3F6E9A" }}
            >
              days
            </span>
          </p>
          <p className="text-[11px]" style={{ color: "#7A8594" }}>
            General Election — Nov 5, 2026
          </p>
          <Link
            href="/voting"
            className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold transition-opacity duration-200 hover:opacity-60 cursor-pointer group w-fit"
            style={{ color: "#3F6E9A" }}
          >
            Voting details
            <ArrowRight
              className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </div>

        {/* Registration status */}
        <div
          className="rounded-2xl p-3.5"
          style={{
            background:
              "linear-gradient(135deg, rgba(139,158,140,0.09) 0%, rgba(139,158,140,0.02) 100%)",
            border: "1px solid rgba(139,158,140,0.20)",
          }}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2
              className="w-4 h-4 shrink-0"
              style={{ color: "#5F8B68" }}
              aria-hidden
            />
            <span
              className="text-[12px] font-semibold"
              style={{ color: "#1D2430" }}
            >
              Registered to vote
            </span>
          </div>
          <p
            className="text-[11px] mt-1.5 leading-snug"
            style={{ color: "#7A8594" }}
          >
            Forsyth County, GA · Active status
          </p>
        </div>

        {/* Registration deadline warning */}
        <div
          className="rounded-2xl p-3.5"
          style={{
            background:
              "linear-gradient(135deg, rgba(214,167,94,0.09) 0%, rgba(214,167,94,0.02) 100%)",
            border: "1px solid rgba(214,167,94,0.25)",
          }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <Clock
              className="w-4 h-4 shrink-0"
              style={{ color: "#D39B38" }}
              aria-hidden
            />
            <span
              className="text-[12px] font-semibold"
              style={{ color: "#1D2430" }}
            >
              Registration deadline
            </span>
          </div>
          <p
            className="text-[20px] font-bold leading-none"
            style={{ color: "#1D2430" }}
          >
            Oct 7
          </p>
          <p className="text-[11px] mt-0.5" style={{ color: "#7A8594" }}>
            14 days to register or update
          </p>
        </div>

        {/* Your next steps */}
        <div>
          <h3
            className="text-[11px] font-semibold uppercase tracking-widest mb-2.5"
            style={{ color: "#8E99A8" }}
          >
            Your next steps
          </h3>
          <ul className="space-y-2" role="list">
            {nextSteps.map((step) => (
              <li
                key={step.label}
                className="flex items-center gap-2.5 cursor-default"
              >
                {step.done ? (
                  <CheckCircle2
                    className="w-4 h-4 shrink-0"
                    style={{ color: "#5F8B68" }}
                    aria-hidden
                  />
                ) : (
                  <Circle
                    className="w-4 h-4 shrink-0"
                    style={{ color: "#C9BFB2" }}
                    aria-hidden
                  />
                )}
                <span
                  className="text-[12px]"
                  style={{
                    color: step.done ? "#8E99A8" : "#1D2430",
                    textDecoration: step.done ? "line-through" : "none",
                  }}
                >
                  {step.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Divider */}
        <div
          className="h-px"
          style={{ background: "#E8E1D7" }}
          aria-hidden
        />

        {/* Local issue watch */}
        <div>
          <h3
            className="text-[11px] font-semibold uppercase tracking-widest mb-2.5"
            style={{ color: "#8E99A8" }}
          >
            Local issue watch
          </h3>
          <div className="space-y-2">
            <div
              className="rounded-xl p-3 cursor-pointer transition-colors duration-200 hover:bg-[#F6F3ED]"
              style={{
                border: "1px solid #E8E1D7",
                background: "#FFFFFF",
              }}
            >
              <div className="flex items-start gap-2">
                <Landmark
                  className="w-3.5 h-3.5 mt-0.5 shrink-0"
                  style={{ color: "#3F6E9A" }}
                  aria-hidden
                />
                <div className="min-w-0">
                  <p
                    className="text-[12px] font-semibold leading-snug"
                    style={{ color: "#1D2430" }}
                  >
                    SB-247: Transit Funding
                  </p>
                  <p
                    className="text-[10.5px] mt-0.5 leading-snug"
                    style={{ color: "#7A8594" }}
                  >
                    Senate vote expected this week
                  </p>
                </div>
              </div>
            </div>

            <div
              className="rounded-xl p-3 cursor-pointer transition-colors duration-200 hover:bg-[#F6F3ED]"
              style={{
                border: "1px solid #E8E1D7",
                background: "#FFFFFF",
              }}
            >
              <div className="flex items-start gap-2">
                <AlertCircle
                  className="w-3.5 h-3.5 mt-0.5 shrink-0"
                  style={{ color: "#D39B38" }}
                  aria-hidden
                />
                <div className="min-w-0">
                  <p
                    className="text-[12px] font-semibold leading-snug"
                    style={{ color: "#1D2430" }}
                  >
                    School Board Meeting
                  </p>
                  <p
                    className="text-[10.5px] mt-0.5 leading-snug"
                    style={{ color: "#7A8594" }}
                  >
                    Tonight · Forsyth Co. Admin, 6 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* This week */}
        <div>
          <h3
            className="text-[11px] font-semibold uppercase tracking-widest mb-2.5"
            style={{ color: "#8E99A8" }}
          >
            This week
          </h3>
          <div className="space-y-1.5">
            {[
              { date: "Mon", event: "School Board Meeting", color: "#D39B38" },
              {
                date: "Wed",
                event: "Community Town Hall",
                color: "#5F8B68",
              },
              { date: "Fri", event: "SB-247 Senate vote", color: "#3F6E9A" },
            ].map(({ date, event, color }) => (
              <div key={event} className="flex items-center gap-2.5">
                <span
                  className="text-[10px] font-bold w-8 text-right shrink-0"
                  style={{ color }}
                >
                  {date}
                </span>
                <div
                  className="w-px h-3 shrink-0"
                  style={{ background: `${color}40` }}
                  aria-hidden
                />
                <span
                  className="text-[12px] truncate"
                  style={{ color: "#7A8594" }}
                >
                  {event}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
