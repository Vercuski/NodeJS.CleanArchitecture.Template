import type { Request, Response } from "express";
import { registerUserInputSchema } from "../../../application/use-cases/register-user/register-user.dto.ts";
import type { RegisterUserUseCase } from "../../../application/use-cases/register-user/register-user.use-case.ts";

interface UserControllerDependencies {
  registerUser: RegisterUserUseCase;
}

export class UserController {
  private readonly registerUser: RegisterUserUseCase;

  constructor(deps: UserControllerDependencies) {
    this.registerUser = deps.registerUser;
  }

  // Arrow-function class field keeps `this` bound when passed to Express as a handler.
  register = async (req: Request, res: Response): Promise<void> => {
    const parsed = registerUserInputSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: { code: "VALIDATION_ERROR", details: parsed.error.flatten() } });
      return;
    }

    const result = await this.registerUser.execute(parsed.data);
    if (!result.ok) {
      res.status(409).json({ error: { code: result.error.code, message: result.error.message } });
      return;
    }

    res.status(201).json(result.value);
  };
}
