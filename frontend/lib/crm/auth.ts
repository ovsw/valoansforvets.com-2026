import "server-only";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { isStaffEmail } from "./policy";

export type Staff = { userId: string; email: string };

export async function staffUser(): Promise<Staff | null> {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const user = await currentUser();
  const staffEmail = user?.emailAddresses.find((email) =>
    isStaffEmail(
      email.emailAddress,
      email.verification?.status === "verified",
    ),
  );
  if (!staffEmail) return null;
  return { userId, email: staffEmail.emailAddress.toLowerCase() };
}

export async function requireStaff() {
  const staff = await staffUser();
  if (!staff) throw new Error("Staff access is required.");
  return staff;
}
