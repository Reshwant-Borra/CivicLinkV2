import type { Metadata } from "next";

import { SidebarNav } from "@/components/home/sidebar-nav";
import { HomeHeader } from "@/components/home/home-header";
import { HeroSection } from "@/components/home/hero-section";
import { ActionGrid } from "@/components/home/action-grid";
import { CivicSnapshotRail } from "@/components/home/civic-snapshot-rail";
import { ImportantDatesTimeline } from "@/components/home/important-dates-timeline";
import { BillSpotlightCard } from "@/components/home/bill-spotlight-card";
import { CivicDiscoverySection } from "@/components/home/civic-discovery-section";

export const metadata: Metadata = {
  title: "CivicLink — Your local civic assistant",
  description:
    "Stay ahead of elections, deadlines, bills, and local events in your area. Neutral civic intelligence from official sources.",
};

export default function HomePage() {
  return (
    /*
     * Full-screen soft-paper canvas — warm, airy, editorial.
     * The glass shell sits elevated above the #F7F5F2 background.
     */
    <div
      className="min-h-screen w-full relative overflow-x-hidden"
      style={{ background: "#F7F5F2" }}
    >
      {/* ── Atmospheric background glows ── */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        aria-hidden
      >
        {/* Upper-left dusty blue bloom */}
        <div
          className="absolute rounded-full"
          style={{
            top: "-8%",
            left: "12%",
            width: 700,
            height: 700,
            background:
              "radial-gradient(circle, rgba(91,124,153,0.10) 0%, rgba(91,124,153,0.03) 55%, transparent 75%)",
            filter: "blur(8px)",
          }}
        />
        {/* Lower-right warm amber bloom */}
        <div
          className="absolute rounded-full"
          style={{
            bottom: "-6%",
            right: "4%",
            width: 580,
            height: 580,
            background:
              "radial-gradient(circle, rgba(214,167,94,0.08) 0%, rgba(214,167,94,0.02) 55%, transparent 75%)",
            filter: "blur(8px)",
          }}
        />
      </div>

      {/* ── Main glass app shell ── */}
      <div className="relative z-10 min-h-screen flex flex-col p-2.5 lg:p-3.5 xl:p-4">
        <div
          className="flex flex-1 overflow-hidden"
          style={{
            borderRadius: 32,
            border: "1px solid rgba(0,0,0,0.06)",
            background: "#FFFFFF",
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04), 0 0 0 1px rgba(255,255,255,0.90)",
            minHeight: "calc(100vh - 2 * 1rem)",
          }}
        >
          {/* Sidebar */}
          <SidebarNav />

          {/* Main panel */}
          <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
            {/* Top header */}
            <HomeHeader />

            {/* Content row */}
            <div className="flex flex-1 min-h-0 overflow-hidden">
              {/* Scrollable main content */}
              <main
                id="main-content"
                tabIndex={-1}
                className="flex-1 overflow-y-auto focus:outline-none"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(0,0,0,0.08) transparent",
                }}
              >
                <div className="px-5 py-6 lg:px-7 lg:py-7 space-y-7 max-w-[860px]">
                  {/* Hero */}
                  <HeroSection />

                  {/* Civic discovery zone: context strip + horizontal rail */}
                  <CivicDiscoverySection />

                  {/* Divider */}
                  <div
                    className="h-px"
                    style={{
                      background:
                        "linear-gradient(to right, transparent, #E7E5E4 20%, #E7E5E4 80%, transparent)",
                    }}
                    aria-hidden
                  />

                  {/* Action grid */}
                  <ActionGrid />

                  {/* Lower modules */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 pb-6">
                    <ImportantDatesTimeline />
                    <BillSpotlightCard />
                  </div>
                </div>
              </main>

              {/* Right contextual rail */}
              <CivicSnapshotRail />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
