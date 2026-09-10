import "server-only";
import { tasks, idempotencyKeys } from "@trigger.dev/sdk";
import { desc, eq } from "drizzle-orm";
import { database } from "@/db/client";
import { testInquiries } from "@/db/schema";
import type { testInquiry } from "@/trigger/test-inquiry";
import { requireStaff } from "./auth";
import { testRecipient } from "./policy";

export async function listTestInquiries() {
  await requireStaff();
  return database()
    .select()
    .from(testInquiries)
    .orderBy(desc(testInquiries.createdAt))
    .limit(20);
}

export async function submitTestInquiry(id: string) {
  const userId = await requireStaff();
  const db = database();
  await db
    .insert(testInquiries)
    .values({ id, createdBy: userId, recipient: testRecipient() })
    .onConflictDoNothing();
  const [row] = await db
    .select()
    .from(testInquiries)
    .where(eq(testInquiries.id, id));
  if (!row || row.createdBy !== userId)
    throw new Error("Test inquiry is not available.");
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
