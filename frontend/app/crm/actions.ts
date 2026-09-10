"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { submitTestInquiry } from "@/lib/crm/inquiries";

export async function createTestInquiry(_previous: string, formData: FormData) {
  const parsed = z.uuid().safeParse(formData.get("inquiryId"));
  if (!parsed.success) return "Invalid test inquiry. Refresh the page.";
  try {
    await submitTestInquiry(parsed.data);
  } catch {
    return "The test could not finish. Refresh to check whether it was saved, then retry the same inquiry.";
  }
  revalidatePath("/crm");
  return "Test inquiry saved. Refresh to see the job result.";
}
