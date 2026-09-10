import "server-only";
import { tasks, idempotencyKeys } from "@trigger.dev/sdk";
import { desc, eq, inArray } from "drizzle-orm";
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
      .set({ runId: run.id, updatedAt: new Date() })
      .where(eq(testInquiries.id, id));
  } catch (error) {
    console.error("Trigger.dev dispatch failed for inquiry", id, error);
    throw new Error(
      "The inquiry was saved, but the job could not be confirmed. Retry this inquiry.",
    );
  }
}

// Any staff member can delete any inquiry. The simulated SMS row cascades.
// A running job for a deleted inquiry fails with "not found" and writes nothing.
export async function deleteTestInquiries(ids: string[]) {
  await requireStaff();
  if (ids.length === 0) return 0;
  const deleted = await database()
    .delete(testInquiries)
    .where(inArray(testInquiries.id, ids))
    .returning({ id: testInquiries.id });
  return deleted.length;
}
