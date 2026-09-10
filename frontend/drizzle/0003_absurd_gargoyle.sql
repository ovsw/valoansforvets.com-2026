ALTER TABLE "crm_simulated_sms" DROP CONSTRAINT "crm_simulated_sms_inquiry_id_crm_test_inquiries_id_fk";
--> statement-breakpoint
ALTER TABLE "crm_simulated_sms" ADD CONSTRAINT "crm_simulated_sms_inquiry_id_crm_test_inquiries_id_fk" FOREIGN KEY ("inquiry_id") REFERENCES "public"."crm_test_inquiries"("id") ON DELETE cascade ON UPDATE no action;