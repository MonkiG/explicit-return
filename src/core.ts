export interface ResultBase<T, E> {
  readonly ok: boolean;

  unwrap(): T;
  unwrapOr(value: T): T;

  map<U>(fn: (value: T) => U): Result<U, E>;
  andThen<U, F>(fn: (value: T) => Result<U, F>): Result<U, E | F>;

  match<U>(handlers: { ok: (value: T) => U; err: (error: E) => U }): U;
}

export interface Ok<T, E = never> extends ResultBase<T, E> {
  readonly ok: true;
  readonly value: T;
}

export interface Err<T = never, E = unknown> extends ResultBase<T, E> {
  readonly ok: false;
  readonly error: E;
}

export type Result<T, E = Error> = Ok<T, E> | Err<T, E>;
export type AsyncResult<T, E = Error> = Promise<Result<T, E>>;

export const Ok = <T, E = never>(value: T): Ok<T, E> => ({
  ok: true as const,
  value,

  unwrap: () => value,
  unwrapOr: () => value,

  map: <U>(fn: (value: T) => U): Result<U, E> => Ok<U, E>(fn(value)),
  andThen: <U, F>(fn: (value: T) => Result<U, F>): Result<U, E | F> =>
    fn(value),

  match: <U>(handlers: { ok: (value: T) => U; err: (error: E) => U }): U =>
    handlers.ok(value),
});

export const Err = <T = never, E = unknown>(error: E): Err<T, E> => ({
  ok: false,
  error,

  unwrap: () => {
    throw error;
  },

  unwrapOr: <U>(value: U) => value,

  map: <U>(): Result<U, E> => Err<U, E>(error),
  andThen: <U, F>(): Result<U, E | F> => Err<U, E>(error),

  match: <U>(handlers: { ok: (value: T) => U; err: (error: E) => U }): U =>
    handlers.err(error),
});
