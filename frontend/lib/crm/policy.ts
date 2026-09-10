export function isStaffEmail(
  email: string,
  verified: boolean,
  allowlist = process.env.CRM_STAFF_EMAILS ?? "",
) {
  return (
    verified &&
    allowlist
      .split(",")
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean)
      .includes(email.toLowerCase())
  );
}

export function previewDatabaseUrl() {
  const value = process.env.PREVIEW_DATABASE_URL;
  if (!value) throw new Error("PREVIEW_DATABASE_URL is required.");
  const url = new URL(value);
  // This first test flow is pinned to the verified development branch.
  if (
    url.hostname !==
      "ep-wandering-mud-ayz2xd29-pooler.c-5.us-east-2.aws.neon.tech" ||
    url.searchParams.get("sslmode") !== "require"
  ) {
    throw new Error(
      "The CRM test flow requires the verified development database with TLS.",
    );
  }
  return value;
}

export function testRecipient() {
  const addresses = (process.env.TEST_EMAIL_ALLOWLIST ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (addresses.length !== 1 || addresses[0] !== "ovi@ovswebsites.com")
    throw new Error("The test recipient must be ovi@ovswebsites.com.");
  return addresses[0];
}

export function canRetryEmail(createdAt: Date, now = Date.now()) {
  // Resend keeps idempotency keys for 24 hours. Leave a one-hour margin.
  return now - createdAt.getTime() < 23 * 60 * 60 * 1000;
}
