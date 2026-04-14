import Link from "next/link";
import { ArrowRight } from "lucide-react";

type TimelineEvent = {
  date: string;
  label: string;
  description: string;
  color: string;
  glowColor: string;
  isPast?: boolean;
  isToday?: boolean;
};

const events: TimelineEvent[] = [
  {
    date: "Sep 23",
    label: "Voter reg. opens",
    description: "Online and in-person registration available",
    color: "#34D399",
    glowColor: "rgba(52,211,153,0.6)",
    isPast: true,
  },
  {
    date: "Oct 7",
    label: "Registration deadline",
    description: "Last day to register or update info",
    color: "#FBBF24",
    glowColor: "rgba(251,191,36,0.65)",
  },
  {
    date: "Oct 15",
    label: "Early voting begins",
    description: "In-person early voting at select locations",
    color: "#60A5FA",
    glowColor: "rgba(96,165,250,0.6)",
  },
  {
    date: "Oct 31",
    label: "Town hall meeting",
    description: "Forsyth Co. Admin Building · 6 PM",
    color: "#818CF8",
    glowColor: "rgba(129,140,248,0.6)",
  },
  {
    date: "Nov 5",
    label: "Election Day",
    description: "Polls open 7 AM – 7 PM",
    color: "#F87171",
    glowColor: "rgba(248,113,113,0.65)",
  },
];

export function ImportantDatesTimeline() {
  return (
    <section
      className="rounded-2xl border border-white/[0.08] p-5"
      style={{
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
        backdropFilter: "blur(8px)",
      }}
      aria-labelledby="timeline-heading"
    >
      <div className="flex items-center justify-between mb-4">
        <h2
          id="timeline-heading"
          className="text-[13px] font-semibold text-[#D0DDEF]"
        >
          Important dates
        </h2>
        <Link
          href="/voting"
          className="flex items-center gap-1 text-[11px] font-semibold text-[#4B6080] hover:text-[#60A5FA] transition-colors duration-200 cursor-pointer group"
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
              "linear-gradient(to bottom, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 100%)",
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
                borderColor: ev.isPast ? "rgba(255,255,255,0.15)" : ev.color,
                backgroundColor: ev.isPast
                  ? "rgba(255,255,255,0.05)"
                  : `${ev.color}22`,
                boxShadow: ev.isPast
                  ? "none"
                  : `0 0 10px ${ev.glowColor}, 0 0 4px ${ev.glowColor}`,
              }}
              aria-hidden
            >
              {ev.isPast && (
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span
                  className="text-[11px] font-bold tabular-nums"
                  style={{ color: ev.isPast ? "#3D5070" : ev.color }}
                >
                  {ev.date}
                </span>
                <span
                  className={`text-[13px] font-semibold leading-tight ${ev.isPast ? "text-[#3D5070]" : "text-[#D0DDEF]"}`}
                >
                  {ev.label}
                </span>
              </div>
              <p
                className={`text-[11px] leading-snug mt-0.5 ${ev.isPast ? "text-[#2D3E56]" : "text-[#5A7094]"}`}
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
