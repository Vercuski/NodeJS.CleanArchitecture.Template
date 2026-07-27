import { InvalidEmailError } from "../errors/domain-error.ts";
import { Result } from "../../shared/result.ts";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * A Value Object: immutable, has no identity of its own, and is only ever
 * created through `create`, which enforces its invariants. Two Emails with
 * the same value are considered equal.
 */
export class Email {
  readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(raw: string): Result<Email, InvalidEmailError> {
    const normalized = raw.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(normalized)) {
      return Result.fail(new InvalidEmailError(raw));
    }
    return Result.ok(new Email(normalized));
  }
}
