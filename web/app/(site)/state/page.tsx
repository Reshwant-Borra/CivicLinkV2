import type { Metadata } from "next";

import { BlankWhiteScreen } from "@/components/blank-white-screen";

export const metadata: Metadata = {
  title: "CivicLink",
  description: "CivicLink",
};

export default function StatePage() {
  return <BlankWhiteScreen />;
}
