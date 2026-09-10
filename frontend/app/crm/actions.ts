"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { submitTestInquiry } from "@/lib/crm/inquiries";

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
