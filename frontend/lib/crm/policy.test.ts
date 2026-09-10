import { afterEach, describe, expect, it, vi } from "vitest";
import {
  canRetryEmail,
  isStaffEmail,
  previewDatabaseUrl,
  testRecipient,
} from "./policy";

afterEach(() => vi.unstubAllEnvs());

describe("CRM trust boundaries", () => {
  it("denies unverified, unlisted, and empty-list access", () => {
    expect(
      isStaffEmail("ovi@ovswebsites.com", false, "ovi@ovswebsites.com"),
    ).toBe(false);
    expect(isStaffEmail("other@example.com", true, "ovi@ovswebsites.com")).toBe(
      false,
    );
    expect(isStaffEmail("ovi@ovswebsites.com", true, "")).toBe(false);
    expect(
      isStaffEmail("Ovi@ovswebsites.com", true, " ovi@ovswebsites.com "),
    ).toBe(true);
  });
  it("rejects production and missing database configuration", () => {
    vi.stubEnv("PREVIEW_DATABASE_URL", "");
    expect(previewDatabaseUrl).toThrow();
    vi.stubEnv(
      "PREVIEW_DATABASE_URL",
      "postgresql://user:password@ep-small-lab-ay9irkqt-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require",
    );
    expect(previewDatabaseUrl).toThrow();
  });
  it("prevents redirecting test email to an arbitrary address", () => {
    vi.stubEnv("TEST_EMAIL_ALLOWLIST", "borrower@example.com");
    expect(testRecipient).toThrow();
    vi.stubEnv(
      "TEST_EMAIL_ALLOWLIST",
      "ovi@ovswebsites.com,borrower@example.com",
    );
    expect(testRecipient).toThrow();
    vi.stubEnv("TEST_EMAIL_ALLOWLIST", "ovi@ovswebsites.com");
    expect(testRecipient()).toBe("ovi@ovswebsites.com");
  });
  it("stops retries before provider idempotency expires", () => {
    const start = new Date("2026-09-10T00:00:00Z");
    expect(canRetryEmail(start, start.getTime() + 22 * 3600000)).toBe(true);
    expect(canRetryEmail(start, start.getTime() + 23 * 3600000)).toBe(false);
  });
});
