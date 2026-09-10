import { schemaTask } from "@trigger.dev/sdk";
import { z } from "zod";

export const SMS_MESSAGE =
  "VA Loans for Vets: We received your consultation request. Jimmy will contact you shortly.";

// Fixed test data only. This task never contacts a messaging provider.
export const simulateSms = schemaTask({
  id: "simulate-sms",
  schema: z.object({}).strict(),
  run: async () => ({
    status: "simulated" as const,
    channel: "sms" as const,
    recipient: "Test recipient (no phone number)",
    message: SMS_MESSAGE,
    sent: false,
    simulatedAt: new Date().toISOString(),
  }),
});
