import type { UserRepository } from "../../domain/repositories/user-repository.port.ts";
import type { User } from "../../domain/entities/user.entity.ts";
import type { Email } from "../../domain/value-objects/email.ts";

/**
 * An adapter implementing the `UserRepository` port. Swap this out for a
 * PostgresUserRepository / PrismaUserRepository later — nothing in
 * domain/ or application/ needs to change.
 */
export class InMemoryUserRepository implements UserRepository {
  private readonly usersByEmail = new Map<string, User>();

  findByEmail(email: Email): Promise<User | null> {
    return Promise.resolve(this.usersByEmail.get(email.value) ?? null);
  }

  save(user: User): Promise<void> {
    this.usersByEmail.set(user.email.value, user);
    return Promise.resolve();
  }
}
