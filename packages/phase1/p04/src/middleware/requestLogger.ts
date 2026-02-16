import type { Request, Response, NextFunction } from "express";
import { logger } from "../lib/logger";

export function requestLogger() {
  return (req: Request, res: Response, next: NextFunction) => {
    const start = process.hrtime.bigint();

    res.on("finish", () => {
      const durationMs = Number(process.hrtime.bigint() - start) / 1e6;

      // Safe fields only: no headers, no cookies, no body
      logger.info("request", {
        requestId: req.requestId,
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        durationMs: Math.round(durationMs),
      });
    });

    next();
  };
}
