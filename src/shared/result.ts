/**
 * A Result represents either a success value or an expected failure,
 * without relying on thrown exceptions for control flow. Use this for
 * anything a caller is expected to handle (validation, business rule
 * violations). Reserve thrown exceptions for truly exceptional,
 * unrecoverable situations.
 *
 * Analogous to Ardalis.Result / FluentResults in .NET.
 */
export type Result<T, E> = { readonly ok: true; readonly value: T } | { readonly ok: false; readonly error: E };

export const Result = {
  ok<T>(value: T): Result<T, never> {
    return { ok: true, value };
  },
  fail<E>(error: E): Result<never, E> {
    return { ok: false, error };
  },
};
