import { afterEach, beforeEach, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  spawn: vi.fn(),
  unlink: vi.fn(),
  close: vi.fn(),
}));
vi.mock("node:child_process", () => ({
  spawnSync: mocks.spawn,
  default: { spawnSync: mocks.spawn },
}));
vi.mock("node:fs", () => {
  const fs = {
    mkdirSync: vi.fn(),
    openSync: vi.fn(() => 7),
    closeSync: mocks.close,
    unlinkSync: mocks.unlink,
  };
  return { ...fs, default: fs };
});
vi.mock("../lib/crm/policy", () => ({
  previewDatabaseUrl: () => "postgresql://localhost/test",
}));
beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  vi.spyOn(console, "log").mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());

it("removes a failed dump and closes its file", async () => {
  mocks.spawn.mockReturnValueOnce({ status: 1 });
  await expect(import("./backup-preview")).rejects.toThrow("Backup failed");
  expect(mocks.close).toHaveBeenCalledWith(7);
  expect(mocks.unlink).toHaveBeenCalledWith(
    expect.stringMatching(/preview-.*\.dump$/),
  );
  expect(mocks.spawn).toHaveBeenCalledTimes(1);
});

it("removes an archive whose table-of-contents check fails", async () => {
  mocks.spawn
    .mockReturnValueOnce({ status: 0 })
    .mockReturnValueOnce({ status: 0, stdout: "unrelated table" });
  await expect(import("./backup-preview")).rejects.toThrow(
    "Backup archive validation failed",
  );
  expect(mocks.unlink).toHaveBeenCalledOnce();
});

it("keeps an archive that passes both checks", async () => {
  mocks.spawn
    .mockReturnValueOnce({ status: 0 })
    .mockReturnValueOnce({ status: 0, stdout: "TABLE crm_test_inquiries" });
  await import("./backup-preview");
  expect(mocks.unlink).not.toHaveBeenCalled();
});
