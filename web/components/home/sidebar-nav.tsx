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
  { href: "/local", label: "My Area", icon: MapPin },
  { href: "/about-data", label: "Learn", icon: BookOpen },
] as const;

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden lg:flex w-[216px] xl:w-[232px] flex-col shrink-0 py-5 px-3 gap-0"
      style={{ borderRight: "1px solid #E8E1D7", background: "#FAF7F2" }}
    >
      {/* Logo */}
      <div className="px-3 mb-7">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg, #3F6E9A 0%, #2F5B84 100%)",
              boxShadow: "0 4px 12px rgba(79,109,138,0.28)",
            }}
          >
            <Landmark className="w-4 h-4 text-white" aria-hidden />
          </div>
          <span
            className="font-mono font-bold text-[15px] tracking-tight"
            style={{ color: "#1D2430" }}
          >
            CivicLink
          </span>
        </div>
      </div>

      {/* Location chip */}
      <div className="px-3 mb-5">
        <div
          className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 cursor-pointer transition-colors duration-200 hover:bg-[#EDF4FA] hover:border-[#3F6E9A]/20"
          style={{
            background: "#FFFFFF",
            border: "1px solid #E8E1D7",
          }}
        >
          <MapPin
            className="w-3.5 h-3.5 shrink-0"
            style={{ color: "#3F6E9A" }}
            aria-hidden
          />
          <span
            className="text-xs font-medium truncate"
            style={{ color: "#1D2430" }}
          >
            Forsyth County, GA
          </span>
          <ChevronRight
            className="w-3 h-3 ml-auto shrink-0"
            style={{ color: "#7A8594" }}
            aria-hidden
          />
        </div>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 space-y-0.5" aria-label="Primary">
        <p
          className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: "#7A8594" }}
        >
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
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#3F6E9A]/40 border",
                active
                  ? "bg-[#EDF4FA] text-[#3F6E9A] border-[#3F6E9A]/30 font-semibold shadow-[0_1px_12px_rgba(63,110,154,0.12)]"
                  : "text-[#556070] border-transparent hover:bg-[#F6F3ED] hover:text-[#1D2430]"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0",
                  active ? "text-[#3F6E9A]" : "text-[#8E99A8] group-hover:text-[#556070]"
                )}
                aria-hidden
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div
        className="mt-4 pt-4 space-y-0.5"
        style={{ borderTop: "1px solid #E8E1D7" }}
      >
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#3F6E9A]/40 border",
            pathname === "/settings"
              ? "bg-[#EDF4FA] text-[#3F6E9A] border-[#3F6E9A]/30 font-semibold shadow-[0_1px_12px_rgba(63,110,154,0.12)]"
              : "text-[#556070] border-transparent hover:bg-[#F6F3ED] hover:text-[#1D2430]"
          )}
        >
          <Settings
            className={cn(
              "w-4 h-4 shrink-0",
              pathname === "/settings" ? "text-[#3F6E9A]" : "text-[#7A8594]"
            )}
            aria-hidden
          />
          Settings
        </Link>

        {/* Avatar row */}
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-colors duration-200 hover:bg-[#EDF4FA] mt-1">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
            style={{
              background: "linear-gradient(135deg, #3F6E9A 0%, #D39B38 100%)",
            }}
          >
            JD
          </div>
          <div className="min-w-0">
            <p
              className="text-[12px] font-semibold truncate leading-tight"
              style={{ color: "#1D2430" }}
            >
              Jane Doe
            </p>
            <p className="text-[11px] truncate leading-tight" style={{ color: "#556070" }}>
              Registered voter
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
