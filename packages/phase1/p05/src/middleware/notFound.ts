import { NextFunction, Request, Response } from "express";
import { HttpError } from "./httpError";

export function notFound(_req: Request, _res: Response, next: NextFunction) {
  return next(new HttpError(404));
}
