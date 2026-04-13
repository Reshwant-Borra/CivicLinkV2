import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeaderWrapper } from "@/components/layout/site-header-wrapper";
import { SkipLink } from "@/components/layout/skip-link";

export default function SiteLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <SkipLink />
      <SiteHeaderWrapper />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex flex-1 flex-col scroll-mt-20 focus:outline-none sm:scroll-mt-24"
      >
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
