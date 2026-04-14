"use client";

import {
  GraduationCap,
  Car,
  Home,
  Users,
  TrendingUp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Node = {
  id: string;
  label: string;
  icon: LucideIcon;
  /** Position in the 480×380 coordinate space */
  cx: number;
  cy: number;
  color: string;
  glowColor: string;
  animClass: string;
};

const NODES: Node[] = [
  {
    id: "education",
    label: "Education",
    icon: GraduationCap,
    cx: 365,
    cy: 42,
    color: "#3B82F6",
    glowColor: "rgba(59,130,246,0.30)",
    animClass: "civic-float-1",
  },
  {
    id: "transit",
    label: "Transit",
    icon: Car,
    cx: 432,
    cy: 168,
    color: "#818CF8",
    glowColor: "rgba(129,140,248,0.28)",
    animClass: "civic-float-2",
  },
  {
    id: "housing",
    label: "Housing",
    icon: Home,
    cx: 368,
    cy: 318,
    color: "#A78BFA",
    glowColor: "rgba(167,139,250,0.28)",
    animClass: "civic-float-3",
  },
  {
    id: "community",
    label: "Community",
    icon: Users,
    cx: 90,
    cy: 294,
    color: "#22D3EE",
    glowColor: "rgba(34,211,238,0.25)",
    animClass: "civic-float-4",
  },
  {
    id: "costliving",
    label: "Cost of Living",
    icon: TrendingUp,
    cx: 58,
    cy: 128,
    color: "#34D399",
    glowColor: "rgba(52,211,153,0.25)",
    animClass: "civic-float-5",
  },
];

/** Width of each satellite node chip (for centering the div on cx/cy) */
const CHIP_W = 110;
const CHIP_H = 44;
/** Central orb radius */
const ORB_R = 52;
const CENTER = { x: 240, y: 190 };

export function CivicPulseVisualizer() {
  return (
    <div
      className="relative w-full select-none"
      style={{ height: 380 }}
      role="img"
      aria-label="Civic Pulse Visualizer: Senate Bill SB-247 and its impact areas — Education, Transit, Housing, Community, and Cost of Living"
    >
      {/* Atmospheric glow behind center */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          left: CENTER.x - 110,
          top: CENTER.y - 110,
          width: 220,
          height: 220,
          background:
            "radial-gradient(circle, rgba(37,99,235,0.22) 0%, rgba(37,99,235,0.08) 50%, transparent 75%)",
          filter: "blur(2px)",
        }}
        aria-hidden
      />

      {/* SVG: connecting lines + orbit ring */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 480 380"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
        style={{ overflow: "visible" }}
      >
        {/* Faint orbit suggestion ring */}
        <ellipse
          cx={CENTER.x}
          cy={CENTER.y}
          rx={168}
          ry={148}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="1"
          strokeDasharray="4 8"
        />

        {/* Lines from center to each node */}
        {NODES.map((n) => (
          <line
            key={n.id}
            x1={CENTER.x}
            y1={CENTER.y}
            x2={n.cx}
            y2={n.cy}
            stroke={n.color}
            strokeWidth="1"
            strokeOpacity="0.28"
            strokeLinecap="round"
          />
        ))}

        {/* Glow dot at node endpoints */}
        {NODES.map((n) => (
          <circle
            key={`dot-${n.id}`}
            cx={n.cx}
            cy={n.cy}
            r="3"
            fill={n.color}
            fillOpacity="0.5"
          />
        ))}
      </svg>

      {/* Central orb */}
      <div
        className="absolute civic-pulse-orb"
        style={{
          left: CENTER.x - ORB_R,
          top: CENTER.y - ORB_R,
          width: ORB_R * 2,
          height: ORB_R * 2,
        }}
        aria-hidden
      >
        {/* Outer glow ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(37,99,235,0.18) 0%, rgba(37,99,235,0.06) 65%, transparent 100%)",
            transform: "scale(1.5)",
          }}
        />
        {/* Glass surface */}
        <div
          className="absolute inset-0 rounded-full border border-white/[0.18] flex flex-col items-center justify-center gap-0.5"
          style={{
            background:
              "linear-gradient(135deg, rgba(37,99,235,0.28) 0%, rgba(29,78,216,0.18) 50%, rgba(14,36,99,0.35) 100%)",
            backdropFilter: "blur(12px)",
            boxShadow:
              "0 0 32px rgba(37,99,235,0.35), 0 0 8px rgba(37,99,235,0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
          }}
        >
          <span className="text-[10px] font-mono font-semibold text-[#60A5FA] tracking-widest uppercase leading-none">
            SB-247
          </span>
          <span className="text-[9px] text-[#6B80A8] leading-none mt-0.5">
            Civic Pulse
          </span>
        </div>
      </div>

      {/* Satellite node chips */}
      {NODES.map((n) => {
        const Icon = n.icon;
        return (
          <div
            key={n.id}
            className={`absolute ${n.animClass}`}
            style={{
              left: n.cx - CHIP_W / 2,
              top: n.cy - CHIP_H / 2,
              width: CHIP_W,
              height: CHIP_H,
            }}
            aria-hidden
          >
            <div
              className="w-full h-full rounded-xl border flex items-center gap-2 px-2.5 cursor-default"
              style={{
                background: `linear-gradient(135deg, ${n.glowColor} 0%, rgba(255,255,255,0.04) 100%)`,
                borderColor: `${n.color}33`,
                backdropFilter: "blur(12px)",
                boxShadow: `0 4px 20px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05), 0 0 16px ${n.glowColor}`,
              }}
            >
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background: `${n.color}22`,
                  border: `1px solid ${n.color}44`,
                }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: n.color }} />
              </div>
              <span
                className="text-[11px] font-semibold leading-tight"
                style={{ color: "rgba(240,244,255,0.90)" }}
              >
                {n.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
