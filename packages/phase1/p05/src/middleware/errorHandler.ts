import type { NextFunction, Request, Response } from "express";
import { isHttpError } from "./httpError";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent) return next(err);

  let status = 500;
  let publicMessage = "Internal Server Error";

  if (isHttpError(err) && (err.statusCode === 400 || err.statusCode === 404)) {
    status = err.statusCode;
    publicMessage = err.publicMessage;
  }

  return res.status(status).json({ error: publicMessage });
}
