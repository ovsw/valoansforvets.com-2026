"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";

// Polls while a job is still running, so staff see status change without reloading.
export function RefreshButton({ live }: { live: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  useEffect(() => {
    if (!live) return;
    const timer = setInterval(
      () => startTransition(() => router.refresh()),
      4000,
    );
    return () => clearInterval(timer);
  }, [live, router]);
  return (
    <Button
      variant="outline"
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => router.refresh())}
    >
      <RefreshCw
        className={pending ? "animate-spin motion-reduce:animate-none" : ""}
      />
      {pending ? "Refreshing…" : live ? "Checking for updates…" : "Refresh results"}
    </Button>
  );
}
