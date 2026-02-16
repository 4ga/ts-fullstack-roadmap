import type { NextFunction, Request, Response } from "express";
import { isHttpError, PUBLIC_ERROR_MESSAGES } from "./httpError";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent) return next(err);

  let status = 500;
  let publicMessage = PUBLIC_ERROR_MESSAGES[500];

  if (isHttpError(err)) {
    status = err.statusCode;
    publicMessage = err.publicMessage;
  }

  return res.status(status).json({ error: publicMessage });
}
