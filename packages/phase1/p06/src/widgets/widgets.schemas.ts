import { z } from "zod";

export const widgetIdParamsSchema = z.object({
  id: z.string().trim().min(1),
});

const nameSchema = z.string().min(1).max(100);

export const createWidgetBodySchema = z.object({
  name: nameSchema,
});

export const updateWidgetBodySchema = z
  .object({ name: nameSchema.optional() })
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "At least one field must be provided",
  });

export const listWidgetsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});
