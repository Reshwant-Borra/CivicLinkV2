import type { ReactNode } from "react";

export default function SiteLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <div className="min-h-screen bg-white">{children}</div>;
}
