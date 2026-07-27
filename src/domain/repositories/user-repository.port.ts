import type { User } from "../entities/user.entity.ts";
import type { Email } from "../value-objects/email.ts";

/**
 * A port: the domain/application layers define WHAT they need; the
 * infrastructure layer defines HOW it's actually done (Postgres, an
 * in-memory map, etc.). This is the Dependency Inversion Principle,
 * the same idea behind an IRepository<T> interface in a .NET solution.
 */
export interface UserRepository {
  findByEmail(email: Email): Promise<User | null>;
  save(user: User): Promise<void>;
}
