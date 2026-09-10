import "server-only";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { isStaffEmail } from "./policy";

export async function staffUser() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const user = await currentUser();
  if (
    !user?.emailAddresses.some((email) =>
      isStaffEmail(
        email.emailAddress,
        email.verification?.status === "verified",
      ),
    )
  )
    return null;
  return userId;
}

export async function requireStaff() {
  const userId = await staffUser();
  if (!userId) throw new Error("Staff access is required.");
  return userId;
}
