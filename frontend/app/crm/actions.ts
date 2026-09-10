"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { deleteTestInquiries, submitTestInquiry } from "@/lib/crm/inquiries";

export async function createTestInquiry(_previous: string, formData: FormData) {
  const parsed = z.uuid().safeParse(formData.get("inquiryId"));
  if (!parsed.success) return "Invalid test inquiry. Refresh the page.";
  try {
    await submitTestInquiry(parsed.data);
  } catch (error) {
    console.error("Test inquiry action failed", error);
    return "The test could not finish. Close this panel, find the inquiry in the list, and retry it.";
  }
  revalidatePath("/crm");
  return "Test inquiry saved. The status updates here as the job runs.";
}

export async function deleteInquiries(_previous: string, formData: FormData) {
  const parsed = z
    .array(z.uuid())
    .min(1)
    .safeParse(formData.getAll("inquiryId"));
  if (!parsed.success) return "Select at least one inquiry to delete.";
  let count: number;
  try {
    count = await deleteTestInquiries(parsed.data);
  } catch (error) {
    console.error("Delete inquiries action failed", error);
    return "The inquiries could not be deleted. Refresh and try again.";
  }
  revalidatePath("/crm");
  return count === 1 ? "1 inquiry deleted." : `${count} inquiries deleted.`;
}
