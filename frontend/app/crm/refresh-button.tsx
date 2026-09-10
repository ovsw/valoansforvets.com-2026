"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";

// Polls while a job is still running, so staff see status change without
// reloading. Polling stops 15 minutes after the last write to any pending
// inquiry, so a stuck record does not poll forever. A retry writes the row,
// which starts polling again.
export function RefreshButton({
  pendingSince,
}: {
  pendingSince: string | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  useEffect(() => {
    if (
      pendingSince === null ||
      Date.now() - new Date(pendingSince).getTime() >= 15 * 60000
    )
      return;
    const timer = setInterval(
      () => startTransition(() => router.refresh()),
      4000,
    );
    return () => clearInterval(timer);
  }, [pendingSince, router]);
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
      {pending ? "Refreshing…" : "Refresh results"}
    </Button>
  );
}
