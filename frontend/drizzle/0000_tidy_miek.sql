CREATE TABLE "crm_test_inquiries" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_by" text NOT NULL,
	"recipient" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"email_id" text,
	"sms_status" text DEFAULT 'pending' NOT NULL,
	"job_status" text DEFAULT 'pending' NOT NULL,
	"run_id" text
);
