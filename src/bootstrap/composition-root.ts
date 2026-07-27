import type { Express } from "express";
import { createServer } from "../presentation/http/server.ts";
import { UserController } from "../presentation/http/controllers/user.controller.ts";
import { RegisterUserUseCase } from "../application/use-cases/register-user/register-user.use-case.ts";
import { InMemoryUserRepository } from "../infrastructure/persistence/in-memory-user.repository.ts";
import { UuidGenerator } from "../infrastructure/ids/uuid-generator.ts";
import { SystemClock } from "../infrastructure/time/system-clock.ts";
import { ConsoleLogger } from "../infrastructure/logging/console-logger.ts";

/**
 * Manual dependency injection ("poor man's DI" / Composition Root pattern —
 * the same idea as Program.cs wiring up an IServiceCollection in .NET, just
 * without a container). No decorators, no reflection, no magic: every wire
 * is a plain constructor call you can Ctrl+click through.
 */
export function buildApp(): Express {
  // Infrastructure (adapters) — the only layer allowed to know concrete implementations.
  const logger = new ConsoleLogger();
  const userRepository = new InMemoryUserRepository();
  const idGenerator = new UuidGenerator();
  const clock = new SystemClock();

  // Application (use cases), wired with the ports/adapters above.
  const registerUser = new RegisterUserUseCase({ userRepository, idGenerator, clock, logger });

  // Presentation (adapters in the other direction: HTTP in, use case out).
  const userController = new UserController({ registerUser });

  return createServer({ userController, logger });
}
