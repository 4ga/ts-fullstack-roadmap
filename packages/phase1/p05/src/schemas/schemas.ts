import { z } from "zod";

export const echoBodySchema = z.object({
  name: z.string().min(1),
});

export type EchoBody = z.infer<typeof echoBodySchema>;
