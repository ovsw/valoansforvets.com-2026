import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("./robots.ts", import.meta.url), "utf8");

test("robots blocks every crawler", () => {
  assert.match(source, /userAgent: "\*"/);
  assert.match(source, /disallow: "\/"/);
  assert.doesNotMatch(source, /\ballow:/);
  assert.doesNotMatch(source, /sitemap:/);
});
