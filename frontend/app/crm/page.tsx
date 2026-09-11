import { CrmShell } from "./shell";
import { Suspense } from "react";
import { randomUUID } from "node:crypto";
import { UserButton } from "@clerk/nextjs";
import { staffUser } from "@/lib/crm/auth";
import { listTestInquiries } from "@/lib/crm/inquiries";
import { InquiryWorkspace } from "./inquiry-workspace";

export const metadata = {
  title: "Inquiries",
  robots: "noindex, nofollow",
};

export default function CrmPage() {
  return (
    <Suspense
      fallback={
        <main className="p-8 text-sm text-muted-foreground">
          Loading inquiries…
        </main>
      }
    >
      <CrmContent />
    </Suspense>
  );
}

async function CrmContent() {
  const staff = await staffUser();
  if (!staff)
    return (
      <main className="mx-auto max-w-lg space-y-4 p-8">
        <h1 className="text-2xl font-semibold">Staff access required</h1>
        <p>This account does not have access to the CRM.</p>
        <UserButton />
      </main>
    );
  const inquiries = await listTestInquiries();
  return (
    <CrmShell>
      <InquiryWorkspace
        inquiryId={randomUUID()}
        staffEmail={staff.email}
        inquiries={inquiries.map(
          ({
            id,
            recipient,
            createdAt,
            jobStatus,
            emailId,
            smsStatus,
            lastError,
            updatedAt,
            sms,
          }) => ({
            id,
            recipient,
            createdAt: createdAt.toISOString(),
            jobStatus,
            emailId,
            smsStatus,
            lastError,
            updatedAt: updatedAt.toISOString(),
            sms: sms && {
              recipient: sms.recipient,
              message: sms.message,
              simulatedAt: sms.simulatedAt.toISOString(),
            },
          }),
        )}
      />
    </CrmShell>
  );
}
