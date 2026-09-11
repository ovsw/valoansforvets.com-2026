import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    template: "%s | VA Loans for Vets CRM",
    default: "VA Loans for Vets CRM",
  },
  robots: "noindex, nofollow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider signInUrl="/sign-in" signUpUrl="/sign-up">
          {children}
          <Toaster position="top-center" richColors />
        </ClerkProvider>
      </body>
    </html>
  );
}
