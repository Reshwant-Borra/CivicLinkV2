import Link from "next/link";
import { ArrowRight } from "lucide-react";

type TimelineEvent = {
  date: string;
  label: string;
  description: string;
  color: string;
  isPast?: boolean;
};

const events: TimelineEvent[] = [
  {
    date: "Sep 23",
    label: "Voter reg. opens",
    description: "Online and in-person registration available",
    color: "#5F8B68",
    isPast: true,
  },
  {
    date: "Oct 7",
    label: "Registration deadline",
    description: "Last day to register or update info",
    color: "#D39B38",
  },
  {
    date: "Oct 15",
    label: "Early voting begins",
    description: "In-person early voting at select locations",
    color: "#3F6E9A",
  },
  {
    date: "Oct 31",
    label: "Town hall meeting",
    description: "Forsyth Co. Admin Building · 6 PM",
    color: "#5582AD",
  },
  {
    date: "Nov 5",
    label: "Election Day",
    description: "Polls open 7 AM – 7 PM",
    color: "#D39B38",
  },
];

export function ImportantDatesTimeline() {
  return (
    <section
      className="rounded-2xl p-5"
      style={{
        background: "#FFFFFF",
        border: "1px solid #E8E1D7",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}
      aria-labelledby="timeline-heading"
    >
      <div className="flex items-center justify-between mb-4">
        <h2
          id="timeline-heading"
          className="text-[13px] font-semibold"
          style={{ color: "#1D2430" }}
        >
          Important dates
        </h2>
        <Link
          href="/voting"
          className="flex items-center gap-1 text-[11px] font-semibold transition-opacity duration-200 hover:opacity-60 cursor-pointer group"
          style={{ color: "#3F6E9A" }}
        >
          See all
          <ArrowRight
            className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
      </div>

      {/* Timeline */}
      <ol className="relative" style={{ paddingLeft: "24px" }}>
        {/* Vertical track */}
        <div
          className="absolute left-2 top-2 bottom-2 w-px"
          style={{
            background:
              "linear-gradient(to bottom, #E8E1D7 0%, rgba(232,225,215,0.22) 100%)",
          }}
          aria-hidden
        />

        {events.map((ev, i) => (
          <li
            key={ev.label}
            className={`relative flex gap-4 ${i < events.length - 1 ? "pb-4" : ""}`}
          >
            {/* Timeline dot */}
            <div
              className="absolute -left-[22px] top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
              style={{
                borderColor: ev.isPast ? "#E8E1D7" : ev.color,
                backgroundColor: ev.isPast ? "#F6F3ED" : `${ev.color}14`,
                boxShadow: ev.isPast
                  ? "none"
                  : `0 0 8px ${ev.color}38`,
              }}
              aria-hidden
            >
              {ev.isPast && (
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "#C9BFB2" }}
                />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span
                  className="text-[11px] font-bold tabular-nums"
                  style={{ color: ev.isPast ? "#C9BFB2" : ev.color }}
                >
                  {ev.date}
                </span>
                <span
                  className="text-[13px] font-semibold leading-tight"
                  style={{ color: ev.isPast ? "#8E99A8" : "#1D2430" }}
                >
                  {ev.label}
                </span>
              </div>
              <p
                className="text-[11px] leading-snug mt-0.5"
                style={{ color: ev.isPast ? "#C9BFB2" : "#7A8594" }}
              >
                {ev.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
