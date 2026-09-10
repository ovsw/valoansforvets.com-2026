import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const testInquiries = pgTable("crm_test_inquiries", {
  id: uuid("id").primaryKey(),
  createdBy: text("created_by").notNull(),
  recipient: text("recipient").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  emailId: text("email_id"),
  smsStatus: text("sms_status").notNull().default("pending"),
  jobStatus: text("job_status").notNull().default("pending"),
  runId: text("run_id"),
  lastError: text("last_error"),
});

// One simulated text per inquiry. Nothing here reaches a messaging provider.
export const simulatedSms = pgTable("crm_simulated_sms", {
  inquiryId: uuid("inquiry_id")
    .primaryKey()
    .references(() => testInquiries.id),
  recipient: text("recipient").notNull(),
  message: text("message").notNull(),
  simulatedAt: timestamp("simulated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
