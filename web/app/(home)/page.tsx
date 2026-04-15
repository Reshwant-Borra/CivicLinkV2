import type { Metadata } from "next";

import { HomeDashboard } from "@/components/home/home-dashboard";

export const metadata: Metadata = {
  title: "CivicLink — Your civic assistant",
  description:
    "Know what matters in your area. Find where to vote, view your ballot, understand bills in plain language, and discover local civic events.",
};

export default function HomePage() {
  return <HomeDashboard />;
}
