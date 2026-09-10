import { beforeEach, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  staff: vi.fn(),
  database: vi.fn(),
  insert: vi.fn(),
  row: vi.fn(),
  update: vi.fn(),
  trigger: vi.fn(),
  key: vi.fn(),
}));
vi.mock("./auth", () => ({ requireStaff: mocks.staff }));
vi.mock("./policy", () => ({ testRecipient: () => "ovi@ovswebsites.com" }));
vi.mock("@/db/client", () => ({ database: mocks.database }));
vi.mock("@trigger.dev/sdk", () => ({
  tasks: { trigger: mocks.trigger },
  idempotencyKeys: { create: mocks.key },
}));
import { submitTestInquiry } from "./inquiries";

beforeEach(() => {
  vi.resetAllMocks();
  mocks.staff.mockResolvedValue("staff");
  mocks.row.mockResolvedValue([
    { id: "inquiry", createdBy: "staff", jobStatus: "pending" },
  ]);
  mocks.key.mockImplementation(async (value) => value);
  mocks.trigger.mockResolvedValue({ id: "run" });
  mocks.database.mockReturnValue({
    insert: () => ({
      values: mocks.insert.mockReturnValue({ onConflictDoNothing: vi.fn() }),
    }),
    select: () => ({ from: () => ({ where: mocks.row }) }),
    update: () => ({ set: mocks.update.mockReturnValue({ where: vi.fn() }) }),
  });
});

it("uses one global dispatch key for concurrent submissions of an inquiry", async () => {
  await Promise.all([
    submitTestInquiry("inquiry"),
    submitTestInquiry("inquiry"),
  ]);
  expect(mocks.key).toHaveBeenCalledTimes(2);
  for (const call of mocks.key.mock.calls)
    expect(call).toEqual(["test-inquiry:inquiry", { scope: "global" }]);
  expect(mocks.trigger).toHaveBeenCalledWith(
    "test-inquiry",
    { inquiryId: "inquiry" },
    { idempotencyKey: "test-inquiry:inquiry" },
  );
  expect(mocks.update).toHaveBeenCalledWith({ runId: "run" });
});

it("stops before database access when staff authorization fails", async () => {
  mocks.staff.mockRejectedValue(new Error("Denied"));
  await expect(submitTestInquiry("inquiry")).rejects.toThrow("Denied");
  expect(mocks.database).not.toHaveBeenCalled();
});

it("does not dispatch another staff member's inquiry", async () => {
  mocks.row.mockResolvedValue([
    { createdBy: "another-staff", jobStatus: "pending" },
  ]);
  await expect(submitTestInquiry("inquiry")).rejects.toThrow("not available");
  expect(mocks.trigger).not.toHaveBeenCalled();
});

it("does not dispatch a completed inquiry", async () => {
  mocks.row.mockResolvedValue([{ createdBy: "staff", jobStatus: "complete" }]);
  await submitTestInquiry("inquiry");
  expect(mocks.trigger).not.toHaveBeenCalled();
});

it("leaves a saved inquiry available after a dispatch error", async () => {
  mocks.trigger.mockRejectedValue(new Error("Offline"));
  await expect(submitTestInquiry("inquiry")).rejects.toThrow(
    "inquiry was saved",
  );
  expect(mocks.insert).toHaveBeenCalledWith({
    id: "inquiry",
    createdBy: "staff",
    recipient: "ovi@ovswebsites.com",
  });
  expect(mocks.update).not.toHaveBeenCalled();
});
