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
  /** Chip accent color */
  color: string;
  animClass: string;
};

const NODES: Node[] = [
  {
    id: "education",
    label: "Education",
    icon: GraduationCap,
    cx: 365,
    cy: 42,
    color: "#3F6E9A",
    animClass: "civic-float-1",
  },
  {
    id: "transit",
    label: "Transit",
    icon: Car,
    cx: 432,
    cy: 168,
    color: "#D39B38",
    animClass: "civic-float-2",
  },
  {
    id: "housing",
    label: "Housing",
    icon: Home,
    cx: 368,
    cy: 318,
    color: "#5582AD",
    animClass: "civic-float-3",
  },
  {
    id: "community",
    label: "Community",
    icon: Users,
    cx: 90,
    cy: 294,
    color: "#5F8B68",
    animClass: "civic-float-4",
  },
  {
    id: "costliving",
    label: "Cost of Living",
    icon: TrendingUp,
    cx: 58,
    cy: 128,
    color: "#D39B38",
    animClass: "civic-float-5",
  },
];

const CHIP_W = 110;
const CHIP_H = 44;
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
            "radial-gradient(circle, rgba(91,124,153,0.14) 0%, rgba(91,124,153,0.04) 55%, transparent 75%)",
          filter: "blur(3px)",
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
          stroke="rgba(91,124,153,0.12)"
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

        {/* Connection dot at node endpoints */}
        {NODES.map((n) => (
          <circle
            key={`dot-${n.id}`}
            cx={n.cx}
            cy={n.cy}
            r="3"
            fill={n.color}
            fillOpacity="0.55"
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
              "radial-gradient(circle, rgba(91,124,153,0.12) 0%, rgba(91,124,153,0.03) 65%, transparent 100%)",
            transform: "scale(1.55)",
          }}
        />
        {/* Orb surface — warm glass on light bg */}
        <div
          className="absolute inset-0 rounded-full flex flex-col items-center justify-center gap-0.5"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(247,245,242,0.70) 100%)",
            border: "1px solid rgba(91,124,153,0.22)",
            backdropFilter: "blur(10px)",
            boxShadow:
              "0 8px 24px rgba(91,124,153,0.16), 0 2px 8px rgba(91,124,153,0.10), inset 0 1px 0 rgba(255,255,255,0.90)",
          }}
        >
          <span
            className="text-[10px] font-mono font-semibold tracking-widest uppercase leading-none"
            style={{ color: "#3F6E9A" }}
          >
            SB-247
          </span>
          <span
            className="text-[9px] leading-none mt-0.5"
            style={{ color: "#8E99A8" }}
          >
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
              className="w-full h-full rounded-xl flex items-center gap-2 px-2.5 cursor-default"
              style={{
                background: "rgba(255,255,255,0.90)",
                backdropFilter: "blur(8px)",
                border: `1px solid ${n.color}28`,
                boxShadow: "0 2px 10px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background: `${n.color}14`,
                  border: `1px solid ${n.color}28`,
                }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: n.color }} />
              </div>
              <span
                className="text-[11px] font-semibold leading-tight"
                style={{ color: "#1D2430" }}
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
