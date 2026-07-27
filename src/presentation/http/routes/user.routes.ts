import { Router } from "express";
import type { UserController } from "../controllers/user.controller.ts";

export function createUserRouter(controller: UserController): Router {
  const router = Router();
  router.post("/users", controller.register);
  return router;
}
