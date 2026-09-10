"use client";

import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import { createTestInquiry } from "./actions";

export function TestForm({
  inquiryId,
  retry = false,
}: {
  inquiryId: string;
  retry?: boolean;
}) {
  const [message, action, pending] = useActionState(createTestInquiry, "");
  return (
    <form action={action}>
      <input type="hidden" name="inquiryId" value={inquiryId} />
      <Button type="submit" disabled={pending}>
        {pending
          ? "Saving…"
          : retry
            ? "Retry this inquiry"
            : "Submit test inquiry"}
      </Button>
      <p className="mt-3 text-sm text-muted-foreground" role="status">
        {message}
      </p>
    </form>
  );
}
