import { spawnSync } from "node:child_process";
import { closeSync, mkdirSync, openSync, unlinkSync } from "node:fs";
import { previewDatabaseUrl } from "../lib/crm/policy";

const url = new URL(previewDatabaseUrl());
mkdirSync(".local/backups", { recursive: true, mode: 0o700 });
const path = `.local/backups/preview-${new Date().toISOString().replaceAll(":", "-")}.dump`;
const fd = openSync(path, "wx", 0o600);
const result = spawnSync(
  "pg_dump",
  ["--format=custom", "--no-owner", "--no-acl"],
  {
    env: {
      ...process.env,
      PGHOST: url.hostname,
      PGPORT: url.port || "5432",
      PGUSER: decodeURIComponent(url.username),
      PGPASSWORD: decodeURIComponent(url.password),
      PGDATABASE: url.pathname.slice(1),
      PGSSLMODE: "require",
    },
    stdio: ["ignore", fd, "pipe"],
  },
);
closeSync(fd);
if (result.status !== 0) {
  unlinkSync(path);
  throw new Error("Backup failed. Do not use the output file.");
}
const check = spawnSync("pg_restore", ["--list", path], { encoding: "utf8" });
if (check.status !== 0 || !check.stdout.includes("crm_test_inquiries")) {
  unlinkSync(path);
  throw new Error("Backup archive validation failed.");
}
console.log(`Backup saved and archive checked: ${path}`);
