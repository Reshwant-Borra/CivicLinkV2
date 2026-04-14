"use client";

import { useState } from "react";
import { MapPin, Search, Bell, ChevronDown, X } from "lucide-react";

export function HomeHeader() {
  const [searchValue, setSearchValue] = useState("");
  const [hasNotifs] = useState(true);

  return (
    <header className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06] shrink-0">
      {/* Location chip */}
      <button
        type="button"
        className="hidden md:flex items-center gap-2 rounded-full px-3 py-1.5 bg-white/[0.07] border border-white/[0.10] hover:bg-white/[0.11] transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/60 shrink-0"
        aria-label="Change location"
      >
        <MapPin className="w-3.5 h-3.5 text-[#60A5FA] shrink-0" aria-hidden />
        <span className="text-[12.5px] font-medium text-[#C0D4F0] whitespace-nowrap">
          Forsyth County, GA
        </span>
        <ChevronDown
          className="w-3 h-3 text-[#4B6080] shrink-0"
          aria-hidden
        />
      </button>

      {/* Divider */}
      <div
        className="hidden md:block w-px h-4 bg-white/[0.10] shrink-0"
        aria-hidden
      />

      {/* Search */}
      <div className="flex-1 relative min-w-0">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B6080] pointer-events-none"
          aria-hidden
        />
        <input
          type="search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search bills, events, candidates…"
          aria-label="Search civic content"
          className="w-full h-9 pl-9 pr-9 rounded-xl bg-white/[0.05] border border-white/[0.08] text-[13px] text-[#D0DDEF] placeholder:text-[#3D5070] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50 focus:bg-white/[0.07] focus:border-[#2563EB]/40 transition-all duration-200"
        />
        {searchValue && (
          <button
            type="button"
            onClick={() => setSearchValue("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B6080] hover:text-[#A8C0E0] transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" aria-hidden />
          </button>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Notifications */}
        <button
          type="button"
          className="relative w-8 h-8 rounded-xl flex items-center justify-center bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.10] transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/60"
          aria-label={hasNotifs ? "3 new notifications" : "Notifications"}
        >
          <Bell className="w-4 h-4 text-[#8496B8]" aria-hidden />
          {hasNotifs && (
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#2563EB] shadow-[0_0_6px_rgba(37,99,235,0.8)]"
              aria-hidden
            />
          )}
        </button>

        {/* Avatar */}
        <button
          type="button"
          className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-bold text-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/60 shadow-[0_0_12px_rgba(37,99,235,0.3)]"
          style={{
            background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
          }}
          aria-label="Account menu"
        >
          JD
        </button>
      </div>
    </header>
  );
}
