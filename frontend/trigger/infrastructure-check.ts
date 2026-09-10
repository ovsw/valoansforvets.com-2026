import { schemaTask } from "@trigger.dev/sdk";
import { z } from "zod";

// A manual connection check. No database, email, or private records are used.
export const infrastructureCheck = schemaTask({
  id: "infrastructure-check",
  schema: z.object({}).strict(),
  run: async (_payload, { ctx }) => ({
    status: "ok",
    project: "VALoansForVets.com",
    environment: ctx.environment.type,
    checkedAt: new Date().toISOString(),
  }),
});
