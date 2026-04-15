import Link from "next/link";
import { Clock, MapPin, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

// April 2026: April 1 = Wednesday → Sunday-start grid
// Su Mo Tu We Th Fr Sa
//             1  2  3  4
//  5  6  7  8  9 10 11
// 12 13 14 15 16 17 18   ← 14 = today
// 19 20 21 22 23 24 25
// 26 27 28 29 30

const CALENDAR_WEEKS: (number | null)[][] = [
  [null, null, null, 1, 2, 3, 4],
  [5, 6, 7, 8, 9, 10, 11],
  [12, 13, 14, 15, 16, 17, 18],
  [19, 20, 21, 22, 23, 24, 25],
  [26, 27, 28, 29, 30, null, null],
];

type DayMark = "today" | "deadline" | "event" | "vote";

const DAY_MARKS: Record<number, DayMark> = {
  14: "today",
  16: "deadline",
  22: "event",
  28: "vote",
};

const MARK_STYLES: Record<DayMark, { bg: string; text: string; shadow?: string }> = {
  today: {
    bg: "#3F6E9A",
    text: "#FFFFFF",
    shadow: "0 2px 8px rgba(79,109,138,0.40)",
  },
  deadline: { bg: "#FCF5E8", text: "#9A7328" },
  event: { bg: "#F2F7F1", text: "#4A6848" },
  vote: { bg: "#EDF4FA", text: "#2F5B84" },
};

const UPCOMING = [
  {
    label: "School Board Meeting",
    date: "Today · 6:00 PM",
    location: "Forsyth Co. Admin",
    color: "#3F6E9A",
  },
  {
    label: "Voter Reg. Deadline",
    date: "Wed, Apr 16",
    location: "forsythco.gov",
    color: "#D39B38",
  },
  {
    label: "Community Town Hall",
    date: "Wed, Apr 22 · 7 PM",
    location: "N. Forsyth Rec Center",
    color: "#5F8B68",
  },
  {
    label: "SB-247 Senate Vote",
    date: "Mon, Apr 28",
    location: "Georgia General Assembly",
    color: "#3F6E9A",
  },
];

const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function CivicCalendarRail() {
  return (
    <aside
      className="hidden xl:flex w-[272px] flex-col shrink-0 overflow-y-auto"
      style={{
        borderLeft: "1px solid #E8E1D7",
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(0,0,0,0.06) transparent",
      }}
      aria-label="Civic calendar"
    >
      <div className="p-4 space-y-4">
        {/* Rail header */}
        <div className="flex items-center justify-between">
          <h2
            className="text-[11px] font-semibold uppercase tracking-widest"
            style={{ color: "#7A8594" }}
          >
            Civic calendar
          </h2>
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              className="w-6 h-6 flex items-center justify-center rounded-lg transition-colors duration-200 cursor-pointer hover:bg-[#EDF4FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F6E9A]/40"
              aria-label="Previous month"
            >
              <ChevronLeft
                className="w-3.5 h-3.5"
                style={{ color: "#7A8594" }}
                aria-hidden
              />
            </button>
            <button
              type="button"
              className="w-6 h-6 flex items-center justify-center rounded-lg transition-colors duration-200 cursor-pointer hover:bg-[#EDF4FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F6E9A]/40"
              aria-label="Next month"
            >
              <ChevronRight
                className="w-3.5 h-3.5"
                style={{ color: "#7A8594" }}
                aria-hidden
              />
            </button>
          </div>
        </div>

        {/* Month label */}
        <p
          className="text-[14px] font-semibold -mt-1"
          style={{ color: "#1D2430" }}
        >
          April 2026
        </p>

        {/* Calendar grid */}
        <div>
          {/* Day-of-week labels */}
          <div className="grid grid-cols-7 mb-1">
            {DAY_LABELS.map((d) => (
              <div
                key={d}
                className="text-center text-[10px] font-semibold py-1"
                style={{ color: "#7A8594" }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Week rows */}
          {CALENDAR_WEEKS.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7">
              {week.map((day, di) => {
                if (!day) return <div key={di} className="h-7" />;
                const mark = DAY_MARKS[day];
                const style = mark ? MARK_STYLES[mark] : null;

                return (
                  <div key={di} className="flex items-center justify-center py-0.5">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] select-none cursor-default"
                      style={{
                        background: style?.bg ?? "transparent",
                        color: style?.text ?? "#556070",
                        boxShadow: style?.shadow,
                        fontWeight: mark === "today" ? 700 : 500,
                      }}
                    >
                      {day}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Legend */}
          <div className="mt-3 flex flex-wrap gap-3">
            {[
              { color: "#D39B38", label: "Deadline" },
              { color: "#5F8B68", label: "Event" },
              { color: "#3F6E9A", label: "Vote" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: item.color }}
                  aria-hidden
                />
                <span className="text-[10px]" style={{ color: "#7A8594" }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px" style={{ background: "#E8E1D7" }} aria-hidden />

        {/* Upcoming timeline */}
        <div>
          <h3
            className="text-[11px] font-semibold uppercase tracking-widest mb-3"
            style={{ color: "#7A8594" }}
          >
            Upcoming
          </h3>

          {/* Timeline track + items */}
          <div className="relative" style={{ paddingLeft: "18px" }}>
            {/* Vertical track */}
            <div
              className="absolute left-1.5 top-2 bottom-2 w-px"
              style={{
                background:
                  "linear-gradient(to bottom, #E8E1D7 0%, rgba(232,225,215,0) 100%)",
              }}
              aria-hidden
            />

            <div className="space-y-2.5">
              {UPCOMING.map((item, i) => (
                <div key={i} className="relative">
                  {/* Timeline dot */}
                  <div
                    className="absolute w-2.5 h-2.5 rounded-full border-2 border-white"
                    style={{
                      left: "-17px",
                      top: "11px",
                      background: item.color,
                      boxShadow: `0 0 0 2px ${item.color}28`,
                    }}
                    aria-hidden
                  />

                  {/* Card */}
                  <div
                    className="rounded-xl px-3 py-2.5 border border-[#E8E1D7] bg-white cursor-pointer transition-all duration-200 hover:border-[#C9BFB2] hover:shadow-[0_4px_16px_rgba(63,110,154,0.10)]"
                  >
                    <p
                      className="text-[12px] font-semibold leading-snug"
                      style={{ color: "#1D2430" }}
                    >
                      {item.label}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Clock
                        className="w-3 h-3 shrink-0"
                        style={{ color: "#7A8594" }}
                        aria-hidden
                      />
                      <span
                        className="text-[10.5px]"
                        style={{ color: "#556070" }}
                      >
                        {item.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <MapPin
                        className="w-3 h-3 shrink-0"
                        style={{ color: "#7A8594" }}
                        aria-hidden
                      />
                      <span
                        className="text-[10.5px] truncate"
                        style={{ color: "#7A8594" }}
                      >
                        {item.location}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* View full calendar */}
        <Link
          href="/events"
          className="flex items-center gap-1.5 text-[11px] font-semibold transition-opacity duration-200 hover:opacity-60 cursor-pointer group w-fit"
          style={{ color: "#3F6E9A" }}
        >
          View full calendar
          <ArrowRight
            className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
      </div>
    </aside>
  );
}
