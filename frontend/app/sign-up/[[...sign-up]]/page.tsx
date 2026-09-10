// Shadcnblocks login1/signup1 shell; Clerk owns the secure form and challenges.
import Link from "next/link";
import { Suspense } from "react";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-muted px-4 py-12">
      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          VA Loans for Vets
        </Link>
        <Suspense fallback={<p>Loading sign-up…</p>}>
          <SignUp
            appearance={{
              elements: {
                rootBox: "w-full",
                cardBox: "w-full shadow-md rounded-md",
                card: "border border-muted bg-background",
                formButtonPrimary:
                  "bg-primary text-primary-foreground hover:bg-primary/90",
                footerActionLink: "text-primary",
              },
            }}
            path="/sign-up"
            routing="path"
            signInUrl="/sign-in"
            forceRedirectUrl="/crm"
          />
        </Suspense>
      </div>
    </main>
  );
}
