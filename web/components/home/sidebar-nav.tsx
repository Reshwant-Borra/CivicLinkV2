"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Scale,
  Calendar,
  MapPin,
  Settings,
  Landmark,
  CheckSquare,
  BookOpen,
  ChevronRight,
} from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/voting", label: "Vote", icon: CheckSquare },
  { href: "/federal", label: "Bills", icon: Scale },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/state", label: "State", icon: BookOpen },
  { href: "/local", label: "Local", icon: MapPin },
] as const;

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-[216px] xl:w-[232px] flex-col shrink-0 border-r border-white/[0.06] py-5 px-3 gap-0">
      {/* Logo */}
      <div className="px-3 mb-7">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.55)]"
            style={{
              background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
            }}
          >
            <Landmark className="w-4 h-4 text-white" aria-hidden />
          </div>
          <span className="font-mono font-bold text-white text-[15px] tracking-tight">
            CivicLink
          </span>
        </div>
      </div>

      {/* Location chip */}
      <div className="px-3 mb-5">
        <div className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 bg-white/[0.05] border border-white/[0.07] cursor-pointer hover:bg-white/[0.08] transition-colors duration-200">
          <MapPin
            className="w-3.5 h-3.5 text-[#60A5FA] shrink-0"
            aria-hidden
          />
          <span className="text-xs font-medium text-[#B0C4E8] truncate">
            Forsyth County, GA
          </span>
          <ChevronRight
            className="w-3 h-3 text-[#4B6080] ml-auto shrink-0"
            aria-hidden
          />
        </div>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 space-y-0.5" aria-label="Primary">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#3D5070]">
          Navigate
        </p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/70",
                active
                  ? "bg-[#2563EB]/[0.18] text-white border border-[#2563EB]/[0.28] shadow-[0_0_14px_rgba(37,99,235,0.12)]"
                  : "text-[#6B80A8] hover:bg-white/[0.06] hover:text-[#A8C0E0] border border-transparent"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0",
                  active ? "text-[#60A5FA]" : "text-[#4B6080]"
                )}
                aria-hidden
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-0.5">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/70 border border-transparent",
            pathname === "/settings"
              ? "bg-[#2563EB]/[0.18] text-white border-[#2563EB]/[0.28]"
              : "text-[#6B80A8] hover:bg-white/[0.06] hover:text-[#A8C0E0]"
          )}
        >
          <Settings
            className={cn(
              "w-4 h-4 shrink-0",
              pathname === "/settings" ? "text-[#60A5FA]" : "text-[#4B6080]"
            )}
            aria-hidden
          />
          Settings
        </Link>

        {/* Avatar row */}
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer hover:bg-white/[0.06] transition-colors duration-200 mt-1">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
            style={{
              background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
            }}
          >
            JD
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-[#D0DDEF] truncate leading-tight">
              Jane Doe
            </p>
            <p className="text-[11px] text-[#4B6080] truncate leading-tight">
              Registered voter
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
