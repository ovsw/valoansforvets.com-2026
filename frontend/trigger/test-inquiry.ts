import { schemaTask } from "@trigger.dev/sdk";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { database } from "../db/client";
import { simulatedSms, testInquiries } from "../db/schema";
import { canRetryEmail, isTestRecipient } from "../lib/crm/policy";
import { SMS_MESSAGE } from "./simulate-sms";

export const testInquiry = schemaTask({
  id: "test-inquiry",
  schema: z.object({ inquiryId: z.uuid() }).strict(),
  queue: { concurrencyLimit: 1 },
  run: async ({ inquiryId }) => {
    const db = database();
    const [inquiry] = await db
      .select()
      .from(testInquiries)
      .where(eq(testInquiries.id, inquiryId));
    if (!inquiry) throw new Error("Test inquiry not found.");
    try {
      if (!isTestRecipient(inquiry.recipient))
        throw new Error("Recipient is not on the test email list.");
      if (!inquiry.emailId) {
        if (process.env.PREVIEW_EMAIL_ENABLED !== "true")
          throw new Error("Preview email is disabled.");
        if (!canRetryEmail(inquiry.createdAt))
          throw new Error(
            "Email retry window has ended. Check Resend before taking further action.",
          );
        if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM)
          throw new Error("Email configuration is missing.");
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
            "Idempotency-Key": `crm-test-${inquiryId}`,
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM,
            to: [inquiry.recipient],
            subject: "VA Loans for Vets — test inquiry received",
            text: "TEST ONLY. We received your consultation request. Jimmy will contact you shortly. This is a development test; no consultation was requested. SMS was simulated and no text message was sent.",
          }),
          signal: AbortSignal.timeout(15000),
        });
        if (!response.ok)
          throw new Error(`Email provider returned status ${response.status}.`);
        const result = z
          .object({ id: z.string().min(1) })
          .parse(await response.json());
        await db
          .update(testInquiries)
          .set({ emailId: result.id })
          .where(eq(testInquiries.id, inquiryId));
      }
      // The primary key keeps one simulated text per inquiry across retries.
      await db
        .insert(simulatedSms)
        .values({
          inquiryId,
          recipient: "Test recipient (no phone number)",
          message: SMS_MESSAGE,
        })
        .onConflictDoNothing();
      await db
        .update(testInquiries)
        .set({ smsStatus: "simulated", jobStatus: "complete", lastError: null })
        .where(eq(testInquiries.id, inquiryId));
      return { inquiryId, email: "accepted", sms: "simulated" };
    } catch (error) {
      await db
        .update(testInquiries)
        .set({
          jobStatus: "failed",
          lastError: error instanceof Error ? error.message : "Unknown error.",
        })
        .where(eq(testInquiries.id, inquiryId));
      throw new Error(
        "Test notification failed. Check configuration or the email provider before retrying.",
      );
    }
  },
});
