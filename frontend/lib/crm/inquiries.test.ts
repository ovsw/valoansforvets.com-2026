import { beforeEach, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  staff: vi.fn(),
  database: vi.fn(),
  insert: vi.fn(),
  row: vi.fn(),
  update: vi.fn(),
  deleteWhere: vi.fn(),
  trigger: vi.fn(),
  key: vi.fn(),
}));
vi.mock("./auth", () => ({ requireStaff: mocks.staff }));
vi.mock("./policy", () => ({
  isTestRecipient: (email: string) => email === "ovi@ovswebsites.com",
}));
vi.mock("@/db/client", () => ({ database: mocks.database }));
vi.mock("@trigger.dev/sdk", () => ({
  tasks: { trigger: mocks.trigger },
  idempotencyKeys: { create: mocks.key },
}));
import { deleteTestInquiries, submitTestInquiry } from "./inquiries";

beforeEach(() => {
  vi.resetAllMocks();
  mocks.staff.mockResolvedValue({
    userId: "staff",
    email: "ovi@ovswebsites.com",
  });
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
    delete: () => ({ where: mocks.deleteWhere }),
  });
  mocks.deleteWhere.mockReturnValue({
    returning: vi.fn().mockResolvedValue([{ id: "a" }, { id: "b" }]),
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
  expect(mocks.update).toHaveBeenCalledWith({
    runId: "run",
    updatedAt: expect.any(Date),
  });
});

it("stops before database access when staff authorization fails", async () => {
  mocks.staff.mockRejectedValue(new Error("Denied"));
  await expect(submitTestInquiry("inquiry")).rejects.toThrow("Denied");
  expect(mocks.database).not.toHaveBeenCalled();
});

it("lets any staff member retry another staff member's inquiry", async () => {
  mocks.row.mockResolvedValue([
    { createdBy: "another-staff", jobStatus: "pending" },
  ]);
  await submitTestInquiry("inquiry");
  expect(mocks.trigger).toHaveBeenCalled();
});

it("refuses a staff member whose address is not a test recipient", async () => {
  mocks.staff.mockResolvedValue({ userId: "staff", email: "new@example.com" });
  await expect(submitTestInquiry("inquiry")).rejects.toThrow("test email list");
  expect(mocks.database).not.toHaveBeenCalled();
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

it("deletes the given inquiries and reports how many were removed", async () => {
  await expect(deleteTestInquiries(["a", "b", "missing"])).resolves.toBe(2);
  expect(mocks.deleteWhere).toHaveBeenCalledTimes(1);
});

it("does not touch the database for an empty delete", async () => {
  await expect(deleteTestInquiries([])).resolves.toBe(0);
  expect(mocks.database).not.toHaveBeenCalled();
});

it("stops a delete before database access when staff authorization fails", async () => {
  mocks.staff.mockRejectedValue(new Error("Denied"));
  await expect(deleteTestInquiries(["a"])).rejects.toThrow("Denied");
  expect(mocks.database).not.toHaveBeenCalled();
});
