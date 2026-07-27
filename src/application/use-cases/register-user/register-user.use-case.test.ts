import { describe, expect, it } from "vitest";
import { RegisterUserUseCase } from "./register-user.use-case.ts";
import { InMemoryUserRepository } from "../../../infrastructure/persistence/in-memory-user.repository.ts";
import { UuidGenerator } from "../../../infrastructure/ids/uuid-generator.ts";
import { SystemClock } from "../../../infrastructure/time/system-clock.ts";
import { ConsoleLogger } from "../../../infrastructure/logging/console-logger.ts";

function makeUseCase() {
  return new RegisterUserUseCase({
    userRepository: new InMemoryUserRepository(),
    idGenerator: new UuidGenerator(),
    clock: new SystemClock(),
    logger: new ConsoleLogger(),
  });
}

describe("RegisterUserUseCase", () => {
  it("registers a new user", async () => {
    const useCase = makeUseCase();

    const result = await useCase.execute({ email: "ada@example.com", displayName: "Ada" });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.email).toBe("ada@example.com");
      expect(result.value.id).toBeTruthy();
    }
  });

  it("rejects an invalid email", async () => {
    const useCase = makeUseCase();

    const result = await useCase.execute({ email: "not-an-email", displayName: "Ada" });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("INVALID_EMAIL");
    }
  });

  it("rejects a duplicate email", async () => {
    const useCase = makeUseCase();

    await useCase.execute({ email: "ada@example.com", displayName: "Ada" });
    const result = await useCase.execute({ email: "ada@example.com", displayName: "Ada Two" });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("USER_ALREADY_EXISTS");
    }
  });
});
