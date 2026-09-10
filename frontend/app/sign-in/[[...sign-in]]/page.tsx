// Shadcnblocks login1/signup1 shell; Clerk owns the secure form and challenges.
import Link from "next/link";
import { Suspense } from "react";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-muted px-4 py-12">
      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          VA Loans for Vets
        </Link>
        <Suspense fallback={<p>Loading sign-in…</p>}>
          <SignIn
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
            path="/sign-in"
            routing="path"
            signUpUrl="/sign-up"
            forceRedirectUrl="/crm"
          />
        </Suspense>
      </div>
    </main>
  );
}
