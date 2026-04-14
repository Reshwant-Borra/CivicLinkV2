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
      className="hidden xl:flex w-[272px] flex-col shrink-0 border-l border-white/[0.06] overflow-y-auto"
      aria-label="Your civic snapshot"
    >
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-[#3D5070]">
            Your civic snapshot
          </h2>
          <span
            className="w-2 h-2 rounded-full bg-[#34D399] shadow-[0_0_6px_rgba(52,211,153,0.7)]"
            aria-hidden
          />
        </div>

        {/* Election countdown */}
        <div
          className="rounded-2xl p-3.5 border border-white/[0.08]"
          style={{
            background:
              "linear-gradient(135deg, rgba(37,99,235,0.18) 0%, rgba(37,99,235,0.08) 100%)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <CalendarDays
              className="w-4 h-4 text-[#60A5FA] shrink-0"
              aria-hidden
            />
            <span className="text-[12px] font-semibold text-[#C0D4F0]">
              Next election
            </span>
          </div>
          <p className="text-[22px] font-bold text-white leading-none mb-1">
            12{" "}
            <span className="text-[14px] font-medium text-[#60A5FA]">days</span>
          </p>
          <p className="text-[11px] text-[#6B80A8]">
            General Election — Nov 5, 2026
          </p>
          <Link
            href="/voting"
            className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-[#60A5FA] hover:text-[#93C5FD] transition-colors duration-200 cursor-pointer group w-fit"
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
          className="rounded-2xl p-3.5 border border-white/[0.08]"
          style={{
            background:
              "linear-gradient(135deg, rgba(52,211,153,0.12) 0%, rgba(52,211,153,0.04) 100%)",
          }}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2
              className="w-4 h-4 text-[#34D399] shrink-0"
              aria-hidden
            />
            <span className="text-[12px] font-semibold text-[#A7F3D0]">
              Registered to vote
            </span>
          </div>
          <p className="text-[11px] text-[#6B80A8] mt-1.5 leading-snug">
            Forsyth County, GA · Active status
          </p>
        </div>

        {/* Registration deadline warning */}
        <div
          className="rounded-2xl p-3.5 border border-[#FBBF24]/[0.22]"
          style={{
            background:
              "linear-gradient(135deg, rgba(251,191,36,0.12) 0%, rgba(251,191,36,0.04) 100%)",
          }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <Clock
              className="w-4 h-4 text-[#FBBF24] shrink-0"
              aria-hidden
            />
            <span className="text-[12px] font-semibold text-[#FDE68A]">
              Registration deadline
            </span>
          </div>
          <p className="text-[20px] font-bold text-white leading-none">
            Oct 7
          </p>
          <p className="text-[11px] text-[#6B80A8] mt-0.5">
            14 days to register or update
          </p>
        </div>

        {/* Your next steps */}
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[#3D5070] mb-2.5">
            Your next steps
          </h3>
          <ul className="space-y-2" role="list">
            {nextSteps.map((step) => (
              <li
                key={step.label}
                className="flex items-center gap-2.5 group cursor-default"
              >
                {step.done ? (
                  <CheckCircle2
                    className="w-4 h-4 text-[#34D399] shrink-0"
                    aria-hidden
                  />
                ) : (
                  <Circle
                    className="w-4 h-4 text-[#3D5070] shrink-0"
                    aria-hidden
                  />
                )}
                <span
                  className={
                    step.done
                      ? "text-[12px] text-[#4B6080] line-through"
                      : "text-[12px] text-[#A8C0E0]"
                  }
                >
                  {step.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/[0.06]" aria-hidden />

        {/* Local issue watch */}
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[#3D5070] mb-2.5">
            Local issue watch
          </h3>
          <div className="space-y-2">
            <div
              className="rounded-xl p-3 border border-white/[0.07] cursor-pointer hover:bg-white/[0.04] transition-colors duration-200"
            >
              <div className="flex items-start gap-2">
                <Landmark
                  className="w-3.5 h-3.5 text-[#818CF8] mt-0.5 shrink-0"
                  aria-hidden
                />
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-[#D0DDEF] leading-snug">
                    SB-247: Transit Funding
                  </p>
                  <p className="text-[10.5px] text-[#4B6080] mt-0.5 leading-snug">
                    Senate vote expected this week
                  </p>
                </div>
              </div>
            </div>

            <div
              className="rounded-xl p-3 border border-white/[0.07] cursor-pointer hover:bg-white/[0.04] transition-colors duration-200"
            >
              <div className="flex items-start gap-2">
                <AlertCircle
                  className="w-3.5 h-3.5 text-[#FBBF24] mt-0.5 shrink-0"
                  aria-hidden
                />
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-[#D0DDEF] leading-snug">
                    School Board Meeting
                  </p>
                  <p className="text-[10.5px] text-[#4B6080] mt-0.5 leading-snug">
                    Tonight · Forsyth Co. Admin, 6 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* This week */}
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[#3D5070] mb-2.5">
            This week
          </h3>
          <div className="space-y-1.5">
            {[
              {
                date: "Mon",
                event: "School Board Meeting",
                color: "#FBBF24",
              },
              {
                date: "Wed",
                event: "Community Town Hall",
                color: "#34D399",
              },
              {
                date: "Fri",
                event: "SB-247 Senate vote",
                color: "#818CF8",
              },
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
                  style={{ background: `${color}50` }}
                  aria-hidden
                />
                <span className="text-[12px] text-[#8496B8] truncate">
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
