import type { Request, Response, NextFunction, RequestHandler } from "express";
import type { z } from "zod";

type ValidateSchemas = {
  body?: z.ZodTypeAny;
  query?: z.ZodTypeAny;
  params?: z.ZodTypeAny;
};

export function validate(schemas: ValidateSchemas): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const validated: { body?: unknown; params?: unknown; query?: unknown } = {};

    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success)
        return res.status(400).json({ error: "Bad Request" });
      validated.body = result.data;
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success)
        return res.status(400).json({ error: "Bad Request" });
      validated.params = result.data;
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success)
        return res.status(400).json({ error: "Bad Request" });
      validated.query = result.data;
    }

    req.validated = validated;

    next();
  };
}
