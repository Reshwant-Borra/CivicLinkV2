import type { ReactNode } from "react";
import { SkipLink } from "@/components/layout/skip-link";

/**
 * Minimal layout for the homepage shell.
 * No site header/footer — the homepage builds its own full-screen glass app shell
 * with sidebar + header. The SkipLink is kept for keyboard accessibility.
 */
export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SkipLink />
      {children}
    </>
  );
}
