import type { Logger } from "../../application/ports/logger.port.ts";

/**
 * Swap this for a Pino/Winston-backed implementation in production —
 * it's just another adapter behind the `Logger` port.
 */
export class ConsoleLogger implements Logger {
  info(message: string, meta?: Record<string, unknown>): void {
    console.log(JSON.stringify({ level: "info", message, ...meta }));
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    console.warn(JSON.stringify({ level: "warn", message, ...meta }));
  }

  error(message: string, meta?: Record<string, unknown>): void {
    console.error(JSON.stringify({ level: "error", message, ...meta }));
  }
}
