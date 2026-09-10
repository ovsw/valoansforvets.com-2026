import { afterEach, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  currentUser: vi.fn(),
  redirect: vi.fn(() => {
    throw new Error("redirect");
  }),
}));
vi.mock("@clerk/nextjs/server", () => ({
  auth: mocks.auth,
  currentUser: mocks.currentUser,
}));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
import { requireStaff } from "./auth";
afterEach(() => {
  vi.resetAllMocks();
  vi.unstubAllEnvs();
});
it("stops anonymous access before looking up a user", async () => {
  mocks.auth.mockResolvedValue({ userId: null });
  await expect(requireStaff()).rejects.toThrow("redirect");
  expect(mocks.currentUser).not.toHaveBeenCalled();
});
it("rejects a signed-in user outside the staff list", async () => {
  vi.stubEnv("CRM_STAFF_EMAILS", "ovi@ovswebsites.com");
  mocks.auth.mockResolvedValue({ userId: "user-other" });
  mocks.currentUser.mockResolvedValue({
    emailAddresses: [
      {
        emailAddress: "other@example.com",
        verification: { status: "verified" },
      },
    ],
  });
  await expect(requireStaff()).rejects.toThrow("Staff access");
});
it("accepts only a verified staff identity", async () => {
  vi.stubEnv("CRM_STAFF_EMAILS", "ovi@ovswebsites.com");
  mocks.auth.mockResolvedValue({ userId: "user-staff" });
  mocks.currentUser.mockResolvedValue({
    emailAddresses: [
      {
        emailAddress: "ovi@ovswebsites.com",
        verification: { status: "unverified" },
      },
    ],
  });
  await expect(requireStaff()).rejects.toThrow("Staff access");
  mocks.currentUser.mockResolvedValue({
    emailAddresses: [
      {
        emailAddress: "ovi@ovswebsites.com",
        verification: { status: "verified" },
      },
    ],
  });
  await expect(requireStaff()).resolves.toEqual({
    userId: "user-staff",
    email: "ovi@ovswebsites.com",
  });
});
