import type { NextFunction, Request, Response } from "express";
import type { Logger } from "../../../application/ports/logger.port.ts";

export function createErrorHandler(logger: Logger) {
  return function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
    logger.error("Unhandled error", { error: err instanceof Error ? err.message : String(err) });
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Something went wrong." } });
  };
}
