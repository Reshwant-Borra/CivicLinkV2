"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

/** Clears httpOnly jurisdiction cookie via DELETE /api/geo/jurisdiction. */
export function ClearLocationButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onClear() {
    setPending(true);
    try {
      await fetch("/api/geo/jurisdiction", { method: "DELETE" });
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      disabled={pending}
      onClick={onClear}
    >
      {pending ? "Clearing…" : "Clear saved location"}
    </Button>
  );
}
