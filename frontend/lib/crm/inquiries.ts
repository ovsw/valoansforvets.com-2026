import "server-only";
import { tasks, idempotencyKeys } from "@trigger.dev/sdk";
import { desc, eq } from "drizzle-orm";
import { database } from "@/db/client";
import { simulatedSms, testInquiries } from "@/db/schema";
import type { testInquiry } from "@/trigger/test-inquiry";
import { requireStaff } from "./auth";
import { isTestRecipient } from "./policy";

export async function listTestInquiries() {
  await requireStaff();
  const rows = await database()
    .select()
    .from(testInquiries)
    .leftJoin(simulatedSms, eq(simulatedSms.inquiryId, testInquiries.id))
    .orderBy(desc(testInquiries.createdAt))
    .limit(20);
  return rows.map((row) => ({
    ...row.crm_test_inquiries,
    sms: row.crm_simulated_sms,
  }));
}

// Any staff member can submit or retry. The email goes to the submitter.
export async function submitTestInquiry(id: string) {
  const staff = await requireStaff();
  if (!isTestRecipient(staff.email))
    throw new Error("Your address is not on the test email list.");
  const db = database();
  await db
    .insert(testInquiries)
    .values({ id, createdBy: staff.userId, recipient: staff.email })
    .onConflictDoNothing();
  const [row] = await db
    .select()
    .from(testInquiries)
    .where(eq(testInquiries.id, id));
  if (!row) throw new Error("Test inquiry is not available.");
  if (row.jobStatus === "complete") return;
  try {
    const idempotencyKey = await idempotencyKeys.create(`test-inquiry:${id}`, {
      scope: "global",
    });
    const run = await tasks.trigger<typeof testInquiry>(
      "test-inquiry",
      {
        inquiryId: id,
      },
      { idempotencyKey },
    );
    // Do not overwrite a completion if the worker finishes before this update.
    await db
      .update(testInquiries)
      .set({ runId: run.id })
      .where(eq(testInquiries.id, id));
  } catch {
    throw new Error(
      "The inquiry was saved, but the job could not be confirmed. Retry this inquiry.",
    );
  }
}
