"use client";

import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteInquiries } from "./actions";

// One control for every delete path: a row, the detail panel, and the bulk
// selection. The button opens a modal confirm. Nothing is sent until the
// confirm button in the dialog is used.
export function DeleteForm({
  ids,
  label = "Delete",
  compact = false,
}: {
  ids: string[];
  label?: string;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const count = ids.length;
  const noun = count === 1 ? "this inquiry" : `${count} inquiries`;
  // The action reports success and failure as one message. Show it as a toast
  // after the dialog closes, so the list can re-render behind it.
  function action(formData: FormData) {
    startTransition(async () => {
      const message = await deleteInquiries("", formData);
      setOpen(false);
      toast(message);
    });
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
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
        >
          <Trash2 />
          {compact ? null : label}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <form action={action}>
          {ids.map((id) => (
            <input key={id} type="hidden" name="inquiryId" value={id} />
          ))}
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {noun}?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the inquiry and its simulated SMS. This cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            <Button type="submit" variant="destructive" disabled={pending}>
              {pending ? "Deleting…" : `Delete ${noun}`}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
