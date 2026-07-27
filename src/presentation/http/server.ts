import express, { type Express } from "express";
import { createUserRouter } from "./routes/user.routes.ts";
import { createErrorHandler } from "./middlewares/error-handler.ts";
import type { UserController } from "./controllers/user.controller.ts";
import type { Logger } from "../../application/ports/logger.port.ts";

interface ServerDependencies {
  userController: UserController;
  logger: Logger;
}

export function createServer(deps: ServerDependencies): Express {
  const app = express();
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use(createUserRouter(deps.userController));

  // Error handler must be registered last.
  app.use(createErrorHandler(deps.logger));

  return app;
}
