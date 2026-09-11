import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { hostname, tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { allocatePorts, firstSlotForPath, FRONTEND_BASE_PORT, portsForSlot, SLOT_COUNT, validateOverrides } from "./worktree-config.mjs";

async function temporaryWorktree() { return mkdtemp(path.join(tmpdir(), "crm-worktree-test-")); }
function reservationRootFor(worktreeRoot) { return path.join(worktreeRoot, ".test-reservations"); }
function allocationOptions(worktreeRoot, options = {}) { return { worktreeRoot, reservationRoot: reservationRootFor(worktreeRoot), ...options }; }

test("the same worktree gets the same bounded first slot", () => {
  const root = "/work/example/t3code-stable";
  assert.equal(firstSlotForPath(root), firstSlotForPath(root));
  for (let slot = 0; slot < SLOT_COUNT; slot += 1) assert.equal(portsForSlot(slot).frontendPort, FRONTEND_BASE_PORT + slot);
});

test("an occupied first slot falls forward inside the pool", async () => {
  const worktreeRoot = await temporaryWorktree();
  const blocked = portsForSlot(firstSlotForPath(worktreeRoot));
  const selected = await allocatePorts(allocationOptions(worktreeRoot, { probe: async (port) => port !== blocked.frontendPort }));
  assert.equal(selected.slot, (blocked.slot + 1) % SLOT_COUNT);
  await selected.release();
});

test("a selection persists and legacy state migrates", async () => {
  const worktreeRoot = await temporaryWorktree();
  const runtimeFile = path.join(worktreeRoot, ".worktree-ports.json");
  await writeFile(runtimeFile, JSON.stringify({ version: 1, frontendPort: 3004, deprecatedPort: 3337 }));
  const selected = await allocatePorts(allocationOptions(worktreeRoot, { runtimeFile, probe: async () => true }));
  assert.deepEqual(selected, portsForSlot(4));
  assert.deepEqual(JSON.parse(await readFile(runtimeFile, "utf8")), portsForSlot(4));
  await selected.release();
});

test("concurrent allocations cannot reserve the same shared slot", async () => {
  const sharedRoot = await temporaryWorktree();
  const reservationRoot = path.join(sharedRoot, "reservations");
  const [first, second] = await Promise.all(["one", "two"].map((name, index) => allocatePorts({ worktreeRoot: path.join(sharedRoot, name), runtimeFile: path.join(sharedRoot, `runtime-${index}.json`), reservationRoot, probe: async () => true })));
  assert.notEqual(first.slot, second.slot);
  await Promise.all([first.release(), second.release()]);
});

test("a reservation left by a crashed local process is reclaimed", async () => {
  const worktreeRoot = await temporaryWorktree();
  const reservationRoot = reservationRootFor(worktreeRoot);
  const slot = firstSlotForPath(worktreeRoot);
  const reservationPath = path.join(reservationRoot, `slot-${slot}`);
  await mkdir(reservationPath, { recursive: true });
  await writeFile(path.join(reservationPath, "owner.json"), JSON.stringify({ ownerId: "stale-owner", pid: 1_073_741_824, hostname: hostname(), worktreeRoot }));
  const selected = await allocatePorts(allocationOptions(worktreeRoot, { probe: async () => true }));
  assert.equal(selected.slot, slot);
  await selected.release();
});

test("manual overrides are allowlisted", () => {
  assert.throws(() => validateOverrides({ frontendPort: "3010" }), /between/);
  assert.deepEqual(validateOverrides({ frontendPort: "3001" }), portsForSlot(1));
});
