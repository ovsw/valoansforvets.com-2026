CREATE TABLE "crm_simulated_sms" (
	"inquiry_id" uuid PRIMARY KEY NOT NULL,
	"recipient" text NOT NULL,
	"message" text NOT NULL,
	"simulated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "crm_test_inquiries" ADD COLUMN "last_error" text;--> statement-breakpoint
ALTER TABLE "crm_simulated_sms" ADD CONSTRAINT "crm_simulated_sms_inquiry_id_crm_test_inquiries_id_fk" FOREIGN KEY ("inquiry_id") REFERENCES "public"."crm_test_inquiries"("id") ON DELETE no action ON UPDATE no action;