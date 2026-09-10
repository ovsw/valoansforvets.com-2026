"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function RefreshButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
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
