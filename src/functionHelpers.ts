import { AsyncResult, Err, Ok, Result } from "./core";

/**
 * Executes a function and captures thrown exceptions into a `Result`.
 *
 * @typeParam T - The success value type.
 * @typeParam E - The error type. Defaults to `Error`.
 *
 * @param fn - A function that may throw.
 * @param mapError - Optional mapper to transform the thrown value into a custom error type.
 *
 * @returns A `Result` containing `Ok<T>` if the function succeeds,
 * or `Err<E>` if it throws.
 *
 * @remarks
 * - If `mapError` is not provided, the thrown value is cast to `E`.
 * - Useful for wrapping unsafe synchronous operations.
 *
 * @example
 * ```ts
 * const result = fromThrowable(() => JSON.parse('{"a":1}'));
 * ```
 *
 * @example
 * ```ts
 * const result = fromThrowable(
 *   () => riskyOperation(),
 *   () => new CustomError("Failure")
 * );
 * ```
 */
export const fromThrowable = <T, E = Error>(
  fn: () => T,
  mapError?: (error: unknown) => E,
): Result<T, E> => {
  try {
    return Ok<T>(fn());
  } catch (error: unknown) {
    const mapped = mapError ? mapError(error) : (error as E);
    return Err<E>(mapped);
  }
};

/**
 * Wraps a Promise into an `AsyncResult`.
 *
 * @typeParam T - The resolved value type.
 * @typeParam E - The error type. Defaults to `Error`.
 *
 * @param promise - The promise to wrap.
 * @param mapError - Optional mapper to transform the rejection reason into a custom error type.
 *
 * @returns A Promise resolving to `Result<T, E>`.
 *
 * @remarks
 * - If the promise resolves, returns `Ok<T>`.
 * - If the promise rejects, returns `Err<E>`.
 * - If `mapError` is not provided, the rejection reason is cast to `E`.
 *
 * @example
 * ```ts
 * const result = await fromPromise(fetchUser());
 * ```
 */
export const fromPromise = async <T, E = Error>(
  promise: Promise<T>,
  mapError?: (error: unknown) => E,
): AsyncResult<T, E> => {
  try {
    const value = await promise;
    return Ok<T>(value);
  } catch (error: unknown) {
    const mapped = mapError ? mapError(error) : (error as E);
    return Err<E>(mapped);
  }
};

/**
 * Converts a nullable value into a `Result`.
 *
 * @typeParam T - The value type.
 * @typeParam E - The error type.
 *
 * @param value - A value that may be `null` or `undefined`.
 * @param error - The error to return if the value is nullish.
 *
 * @returns `Ok<T>` if the value is not nullish,
 * otherwise `Err<E>`.
 *
 * @remarks
 * Falsy values such as `0`, `false`, and `""` are treated as valid values.
 *
 * @example
 * ```ts
 * const result = fromNullable(user, new Error("User not found"));
 * ```
 */
export const fromNullable = <T, E>(
  value: T | null | undefined,
  error: E,
): Result<T, E> => (value == null ? Err<E>(error) : Ok<T>(value));
