import { describe, it, expect } from "vitest";
import { Ok, Err, Result } from "../src/core";

describe("Ok", () => {
  it("should unwrap value", () => {
    const result = Ok(42);

    expect(result.unwrap()).toBe(42);
  });

  it("should ignore unwrapOr and return value", () => {
    const result = Ok(42);

    expect(result.unwrapOr(100)).toBe(42);
  });

  it("should map value", () => {
    const result = Ok(2).map((x) => x * 2);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBe(4);
    }
  });

  it("should chain with andThen", () => {
    const result = Ok(5).andThen((x) => Ok(x + 5));

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBe(10);
    }
  });

  it("should match ok branch", () => {
    const result = Ok("hello");

    const output = result.match({
      ok: (v) => `Value: ${v}`,
      err: () => "Error",
    });

    expect(output).toBe("Value: hello");
  });
});

describe("Err", () => {
  it("should throw on unwrap", () => {
    const result = Err(new Error("boom"));

    expect(() => result.unwrap()).toThrow("boom");
  });

  it("should return fallback on unwrapOr", () => {
    const result = Err<number, string>("error");

    expect(result.unwrapOr(999)).toBe(999);
  });

  it("should not map value", () => {
    const result = Err<number, string>("error").map((x) => x * 2);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("error");
    }
  });

  it("should not execute andThen", () => {
    const result = Err<number, string>("error").andThen((x) => Ok(x * 2));

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("error");
    }
  });

  it("should match err branch", () => {
    const result = Err<string, string>("fail");

    const output = result.match({
      ok: () => "ok",
      err: (e) => `Error: ${e}`,
    });

    expect(output).toBe("Error: fail");
  });
});

describe("Result behavior", () => {
  it("map should not affect Err", () => {
    const result: Result<number, string> = Err("fail");

    const mapped = result.map((x) => x + 1);

    expect(mapped.ok).toBe(false);
  });

  it("andThen should flatten nested Results", () => {
    const result = Ok(10)
      .andThen((x) => Ok(x + 5))
      .andThen((x) => Ok(x * 2));

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBe(30);
    }
  });

  it("Err should short-circuit chain", () => {
    const result = Ok(10)
      .andThen(() => Err<number, string>("fail"))
      .andThen((x) => Ok(x * 2));

    expect(result.ok).toBe(false);
  });
});
