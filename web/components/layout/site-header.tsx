"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { MapPin, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { primaryNav } from "./nav-config";

export type SiteHeaderProps = {
  /** Saved jurisdiction (httpOnly cookie); link goes to Settings to change. */
  locationChip?: { label: string; href: string } | null;
};

export function SiteHeader({ locationChip = null }: SiteHeaderProps) {
  const pathname = usePathname();
  const menuId = useId();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className="sticky top-0 z-40 border-b border-border bg-background/95 shadow-sm backdrop-blur-md"
      role="banner"
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            {open ? <X aria-hidden /> : <Menu aria-hidden />}
          </Button>
          <Link
            href="/"
            className="focus-visible:ring-ring truncate font-mono text-base font-semibold tracking-tight text-foreground no-underline outline-none focus-visible:rounded-md focus-visible:ring-3 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            CivicLink
          </Link>
        </div>

        <div className="hidden min-w-0 flex-1 items-center justify-end gap-2 md:flex md:gap-3">
          {locationChip ? (
            <Link
              href={locationChip.href}
              className="focus-visible:ring-ring flex max-w-[10rem] min-w-0 cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-primary no-underline outline-none focus-visible:ring-3 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:max-w-[14rem]"
              title="Change location in Settings"
            >
              <MapPin className="size-4 shrink-0 text-primary" aria-hidden />
              <span className="truncate">{locationChip.label}</span>
            </Link>
          ) : null}
          <nav
            aria-label="Primary"
            className="flex flex-wrap items-center justify-end gap-1 lg:gap-2"
          >
            <ul className="flex flex-wrap items-center justify-end gap-1 lg:gap-2">
              {primaryNav.map(({ href, label }) => {
                const active =
                  href === "/"
                    ? pathname === "/"
                    : pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "cursor-pointer rounded-md px-2.5 py-2 text-sm font-medium no-underline outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        active
                          ? "bg-secondary text-secondary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      <div
        id={menuId}
        hidden={!open}
        className={cn(
          "border-border border-t bg-background md:hidden",
          !open && "hidden"
        )}
      >
        <nav
          aria-label="Primary mobile"
          className="mx-auto max-w-6xl px-4 pb-4"
        >
          {locationChip ? (
            <div className="border-border border-b pb-3">
              <Link
                href={locationChip.href}
                onClick={() => setOpen(false)}
                className="focus-visible:ring-ring flex cursor-pointer items-center gap-2 rounded-md py-1 text-sm text-primary no-underline outline-none focus-visible:ring-3 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <MapPin className="size-4 shrink-0" aria-hidden />
                <span className="font-medium text-foreground">Location:</span>
                <span className="min-w-0 truncate">{locationChip.label}</span>
              </Link>
              <p className="mt-1 text-xs text-muted-foreground">
                Tap to change in Settings.
              </p>
            </div>
          ) : null}
          <ul className="flex flex-col gap-1 pt-2">
            {primaryNav.map(({ href, label }) => {
              const active =
                href === "/"
                  ? pathname === "/"
                  : pathname === href || pathname.startsWith(`${href}/`);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "cursor-pointer block rounded-md px-3 py-2.5 text-sm font-medium no-underline outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      active
                        ? "bg-secondary text-secondary-foreground"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
