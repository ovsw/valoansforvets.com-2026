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
});
