"use client";

import { Trash2 } from "lucide-react";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteInquiries } from "./actions";

// One control for every delete path: a row, the detail panel, and the bulk
// selection. The first click only reveals the confirm step. Nothing is sent
// until the confirm button is used.
export function DeleteForm({
  ids,
  label = "Delete",
  compact = false,
}: {
  ids: string[];
  label?: string;
  compact?: boolean;
}) {
  const [message, action, pending] = useActionState(deleteInquiries, "");
  const [confirming, setConfirming] = useState(false);
  const count = ids.length;
  const noun = count === 1 ? "this inquiry" : `${count} inquiries`;
  if (!confirming)
    return (
      <div className={compact ? "flex items-center" : ""}>
        <Button
          type="button"
          variant={compact ? "ghost" : "outline"}
          size={compact ? "icon" : "default"}
          className={
            compact
              ? "text-muted-foreground hover:text-red-700"
              : "text-red-700 hover:text-red-800"
          }
          aria-label={compact ? `Delete ${noun}` : undefined}
          onClick={() => setConfirming(true)}
        >
          <Trash2 />
          {compact ? null : label}
        </Button>
        {message && !compact && (
          <p className="mt-3 text-sm text-muted-foreground" role="status">
            {message}
          </p>
        )}
      </div>
    );
  return (
    <form
      action={action}
      className={
        compact
          ? "flex items-center gap-1 whitespace-nowrap"
          : "rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
      }
    >
      {ids.map((id) => (
        <input key={id} type="hidden" name="inquiryId" value={id} />
      ))}
      {compact ? null : (
        <p className="mb-3">Delete {noun}? This cannot be undone.</p>
      )}
      <div className="flex items-center gap-2">
        <Button
          type="submit"
          size="sm"
          variant="destructive"
          disabled={pending}
        >
          {pending ? "Deleting…" : compact ? "Confirm" : `Delete ${noun}`}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={pending}
          onClick={() => setConfirming(false)}
        >
          Cancel
        </Button>
      </div>
      {message && (
        <p className="mt-3 text-sm" role="status">
          {message}
        </p>
      )}
    </form>
  );
}
