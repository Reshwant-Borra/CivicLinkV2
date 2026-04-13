"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BillSearchFormProps {
  defaultValue?: string;
}

/**
 * Search form for federal bills.
 *
 * Submits as GET /federal?q=... so that:
 * - The page is a pure Server Component (no client fetch needed)
 * - URL is shareable / bookmarkable
 * - Works without JS (progressive enhancement)
 */
export function BillSearchForm({ defaultValue = "" }: BillSearchFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = inputRef.current?.value.trim() ?? "";
    const params = new URLSearchParams(searchParams);
    if (q) {
      params.set("q", q);
    } else {
      params.delete("q");
    }
    params.delete("offset"); // reset pagination on new search
    startTransition(() => {
      router.push(`/federal?${params.toString()}`);
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      aria-label="Search federal bills"
      className="flex w-full gap-2"
    >
      <div className="relative flex-1">
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          ref={inputRef}
          name="q"
          type="search"
          defaultValue={defaultValue}
          placeholder="Search bills by keyword, title, or sponsor…"
          className="pl-9"
          aria-label="Search bills"
          disabled={isPending}
        />
      </div>
      <Button type="submit" disabled={isPending} aria-busy={isPending}>
        {isPending ? "Searching…" : "Search"}
      </Button>
    </form>
  );
}
