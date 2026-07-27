/**
 * Base type for errors that represent a broken business rule, as opposed
 * to an infrastructure failure (those are thrown, not returned).
 */
export abstract class DomainError extends Error {
  abstract readonly code: string;
}

export class InvalidEmailError extends DomainError {
  readonly code = "INVALID_EMAIL";
  constructor(raw: string) {
    super(`"${raw}" is not a valid email address.`);
    this.name = "InvalidEmailError";
  }
}

export class InvalidDisplayNameError extends DomainError {
  readonly code = "INVALID_DISPLAY_NAME";
  constructor(raw: string) {
    super(`"${raw}" is not a valid display name.`);
    this.name = "InvalidDisplayNameError";
  }
}

export class UserAlreadyExistsError extends DomainError {
  readonly code = "USER_ALREADY_EXISTS";
  constructor(email: string) {
    super(`A user with email "${email}" already exists.`);
    this.name = "UserAlreadyExistsError";
  }
}
