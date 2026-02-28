interface Ok<T> {
  ok: true;
  value: T;
}

interface Err<E> {
  ok: false;
  error: E;
}

export type Result<T, E = Error> = Ok<T> | Err<E>;
export type AsyncResult<T, E = Error> = Promise<Result<T, E>>;

export const Ok = <T>(value: T): Ok<T> => {
  return { ok: true, value };
};

export const Err = <E>(error: E): Err<E> => {
  return { ok: false, error };
};
