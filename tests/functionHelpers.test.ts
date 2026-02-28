import { expect, it, describe } from "vitest";
import {
  fromNullable,
  fromPromise,
  fromThrowable,
} from "./../src/functionHelpers";
import { Ok, Err } from "./../src/core";

describe("fromThrowable", () => {
  it("should return Ok when function does not throw", () => {
    const result = fromThrowable(() => 42);

    expect(result).toEqual(Ok(42));
  });

  it("should return Err when function throws", () => {
    const result = fromThrowable(() => {
      throw new Error("boom");
    });

    expect(result).toEqual(Err(new Error("boom")));
  });

  it("should map error when mapError is provided", () => {
    const result = fromThrowable(
      () => {
        throw new Error("boom");
      },
      (err) => new Error(`mapped: ${(err as Error).message}`),
    );

    expect(result).toEqual(Err(new Error("mapped: boom")));
  });
});

describe("fromPromise", () => {
  it("should return Ok when promise resolves", async () => {
    const result = await fromPromise(Promise.resolve(100));

    expect(result).toEqual(Ok(100));
  });

  it("should return Err when promise rejects", async () => {
    const result = await fromPromise(Promise.reject(new Error("fail")));

    expect(result).toEqual(Err(new Error("fail")));
  });

  it("should map error when mapError is provided", async () => {
    const result = await fromPromise(
      Promise.reject("raw error"),
      (err) => new Error(`mapped: ${err}`),
    );

    expect(result).toEqual(Err(new Error("mapped: raw error")));
  });
});

describe("fromNullable", () => {
  it("should return Ok when value is not null or undefined", () => {
    const result = fromNullable("hello", "error");

    expect(result).toEqual(Ok("hello"));
  });

  it("should return Err when value is null", () => {
    const result = fromNullable(null, "not found");

    expect(result).toEqual(Err("not found"));
  });

  it("should return Err when value is undefined", () => {
    const result = fromNullable(undefined, "missing");

    expect(result).toEqual(Err("missing"));
  });

  it("should not treat falsy values as null", () => {
    expect(fromNullable(0, "err")).toEqual(Ok(0));
    expect(fromNullable("", "err")).toEqual(Ok(""));
    expect(fromNullable(false, "err")).toEqual(Ok(false));
  });
});
