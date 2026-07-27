import type { Email } from "../value-objects/email.ts";
import { InvalidDisplayNameError } from "../errors/domain-error.ts";
import { Result } from "../../shared/result.ts";

interface UserProps {
  id: string;
  email: Email;
  displayName: string;
  createdAt: Date;
}

/**
 * An Entity: has an identity (`id`) that persists across state changes.
 * Note there are no parameter-property shorthands in the constructor —
 * that TypeScript syntax needs code generation, and this project only
 * uses TypeScript syntax that Node.js can strip and run directly. See
 * the README for details.
 */
export class User {
  readonly id: string;
  readonly email: Email;
  readonly displayName: string;
  readonly createdAt: Date;

  private constructor(props: UserProps) {
    this.id = props.id;
    this.email = props.email;
    this.displayName = props.displayName;
    this.createdAt = props.createdAt;
  }

  static create(props: UserProps): Result<User, InvalidDisplayNameError> {
    if (props.displayName.trim().length < 2) {
      return Result.fail(new InvalidDisplayNameError(props.displayName));
    }
    return Result.ok(new User(props));
  }
}
