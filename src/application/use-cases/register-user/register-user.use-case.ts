import type { UserRepository } from "../../../domain/repositories/user-repository.port.ts";
import type { IdGenerator } from "../../ports/id-generator.port.ts";
import type { Clock } from "../../ports/clock.port.ts";
import type { Logger } from "../../ports/logger.port.ts";
import { Email } from "../../../domain/value-objects/email.ts";
import { User } from "../../../domain/entities/user.entity.ts";
import { UserAlreadyExistsError, type DomainError } from "../../../domain/errors/domain-error.ts";
import { Result } from "../../../shared/result.ts";
import type { RegisterUserInput, RegisterUserOutput } from "./register-user.dto.ts";

interface RegisterUserDependencies {
  userRepository: UserRepository;
  idGenerator: IdGenerator;
  clock: Clock;
  logger: Logger;
}

/**
 * A use case (a.k.a. interactor / application service): orchestrates domain
 * objects and ports to fulfil one specific application action. It depends
 * only on interfaces (ports), never on concrete infrastructure — those are
 * injected via the constructor by the composition root at startup.
 */
export class RegisterUserUseCase {
  private readonly userRepository: UserRepository;
  private readonly idGenerator: IdGenerator;
  private readonly clock: Clock;
  private readonly logger: Logger;

  constructor(deps: RegisterUserDependencies) {
    this.userRepository = deps.userRepository;
    this.idGenerator = deps.idGenerator;
    this.clock = deps.clock;
    this.logger = deps.logger;
  }

  async execute(input: RegisterUserInput): Promise<Result<RegisterUserOutput, DomainError>> {
    const emailResult = Email.create(input.email);
    if (!emailResult.ok) return emailResult;

    const existing = await this.userRepository.findByEmail(emailResult.value);
    if (existing) {
      return Result.fail(new UserAlreadyExistsError(input.email));
    }

    const userResult = User.create({
      id: this.idGenerator.next(),
      email: emailResult.value,
      displayName: input.displayName,
      createdAt: this.clock.now(),
    });
    if (!userResult.ok) return userResult;

    await this.userRepository.save(userResult.value);
    this.logger.info("User registered", { userId: userResult.value.id });

    return Result.ok({
      id: userResult.value.id,
      email: userResult.value.email.value,
      displayName: userResult.value.displayName,
    });
  }
}
