"use client";

import { useState } from "react";
import { MapPin, Search, Bell, ChevronDown, X } from "lucide-react";

export function HomeHeader() {
  const [searchValue, setSearchValue] = useState("");
  const [hasNotifs] = useState(true);

  return (
    <header
      className="flex items-center gap-3 px-5 py-3.5 shrink-0"
      style={{ borderBottom: "1px solid #E8E1D7" }}
    >
      {/* Location chip */}
      <button
        type="button"
        className="hidden md:flex items-center gap-2 rounded-full px-3 py-1.5 transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F6E9A]/40 shrink-0 hover:bg-[#EDF4FA]"
        style={{
          background: "#FFFFFF",
          border: "1px solid #E8E1D7",
        }}
        aria-label="Change location"
      >
        <MapPin
          className="w-3.5 h-3.5 shrink-0"
          style={{ color: "#3F6E9A" }}
          aria-hidden
        />
        <span
          className="text-[12.5px] font-medium whitespace-nowrap"
          style={{ color: "#1D2430" }}
        >
          Forsyth County, GA
        </span>
        <ChevronDown
          className="w-3 h-3 shrink-0"
          style={{ color: "#556070" }}
          aria-hidden
        />
      </button>

      {/* Divider */}
      <div
        className="hidden md:block w-px h-4 shrink-0"
        style={{ background: "#E8E1D7" }}
        aria-hidden
      />

      {/* Search */}
      <div className="flex-1 relative min-w-0">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
          style={{ color: "#556070" }}
          aria-hidden
        />
        <input
          type="search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search bills, events, candidates…"
          aria-label="Search civic content"
          className="w-full h-9 pl-9 pr-9 rounded-xl text-[13px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#3F6E9A]/25 focus:border-[#3F6E9A]/35 placeholder:text-[#8E99A8]"
          style={{
            background: "#F6F3ED",
            border: "1px solid #E8E1D7",
            color: "#1D2430",
          }}
        />
        {searchValue && (
          <button
            type="button"
            onClick={() => setSearchValue("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors cursor-pointer hover:opacity-60"
            style={{ color: "#556070" }}
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
          className="relative w-8 h-8 rounded-xl flex items-center justify-center transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F6E9A]/40 hover:bg-[#EDF4FA]"
          style={{
            background: "#FFFFFF",
            border: "1px solid #E8E1D7",
          }}
          aria-label={hasNotifs ? "3 new notifications" : "Notifications"}
        >
          <Bell className="w-4 h-4" style={{ color: "#556070" }} aria-hidden />
          {hasNotifs && (
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{
                background: "#D39B38",
                boxShadow: "0 0 5px rgba(214,167,94,0.55)",
              }}
              aria-hidden
            />
          )}
        </button>

        {/* Avatar */}
        <button
          type="button"
          className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-bold text-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F6E9A]/40"
          style={{
            background: "linear-gradient(135deg, #3F6E9A 0%, #D39B38 100%)",
            boxShadow: "0 2px 8px rgba(79,109,138,0.22)",
          }}
          aria-label="Account menu"
        >
          JD
        </button>
      </div>
    </header>
  );
}
