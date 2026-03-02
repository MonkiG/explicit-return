import { expect, it, describe } from "vitest";
import {
  fromNullable,
  fromPromise,
  fromThrowable,
} from "./../src/functionHelpers";

describe("fromThrowable", () => {
  it("should return Ok when function does not throw", () => {
    const result = fromThrowable(() => 42);

    expect(result).toMatchObject({
      ok: true,
      value: 42,
    });
  });

  it("should return Err when function throws", () => {
    const result = fromThrowable(() => {
      throw new Error("boom");
    });

    expect(result.ok).toBe(false);
    expect(result).toMatchObject({
      ok: false,
      error: expect.any(Error),
    });

    if (!result.ok) {
      expect(result.error.message).toBe("boom");
    }
  });

  it("should map error when mapError is provided", () => {
    const result = fromThrowable(
      () => {
        throw new Error("boom");
      },
      (err) => new Error(`mapped: ${(err as Error).message}`),
    );

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.error.message).toBe("mapped: boom");
    }
  });
});

describe("fromPromise", () => {
  it("should return Ok when promise resolves", async () => {
    const result = await fromPromise(Promise.resolve(100));

    expect(result).toMatchObject({
      ok: true,
      value: 100,
    });
  });

  it("should return Err when promise rejects", async () => {
    const result = await fromPromise(Promise.reject(new Error("fail")));

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.error.message).toBe("fail");
    }
  });

  it("should map error when mapError is provided", async () => {
    const result = await fromPromise(
      Promise.reject("raw error"),
      (err) => new Error(`mapped: ${err}`),
    );

    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.error.message).toBe("mapped: raw error");
    }
  });
});

describe("fromNullable", () => {
  it("should return Ok when value is not null or undefined", () => {
    const result = fromNullable("hello", "error");

    expect(result).toMatchObject({
      ok: true,
      value: "hello",
    });
  });

  it("should return Err when value is null", () => {
    const result = fromNullable(null, "not found");

    expect(result).toMatchObject({
      ok: false,
      error: "not found",
    });
  });

  it("should return Err when value is undefined", () => {
    const result = fromNullable(undefined, "missing");

    expect(result).toMatchObject({
      ok: false,
      error: "missing",
    });
  });

  it("should not treat falsy values as null", () => {
    expect(fromNullable(0, "err")).toMatchObject({
      ok: true,
      value: 0,
    });

    expect(fromNullable("", "err")).toMatchObject({
      ok: true,
      value: "",
    });

    expect(fromNullable(false, "err")).toMatchObject({
      ok: true,
      value: false,
    });
  });
});
