"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

// Polls while a job is still running, so staff see status change without
// reloading. Polling stops 15 minutes after the newest pending inquiry was
// created, so a stuck record does not poll forever.
export function RefreshButton({
  pendingSince,
}: {
  pendingSince: string | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [live, setLive] = useState(false);
  useEffect(() => {
    const recent =
      pendingSince !== null &&
      Date.now() - new Date(pendingSince).getTime() < 15 * 60000;
    setLive(recent);
    if (!recent) return;
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
      {pending ? "Refreshing…" : live ? "Checking for updates…" : "Refresh results"}
    </Button>
  );
}
