import { defineConfig } from "@trigger.dev/sdk";

export default defineConfig({
  project: "proj_zufesthoajsdxpvfeqsr",
  runtime: "node",
  dirs: ["./trigger"],
  maxDuration: 60,
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
    },
  },
});
