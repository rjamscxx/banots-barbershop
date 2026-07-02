import { beforeEach, describe, expect, it } from "vitest";
import { createSessionToken, verifySessionToken } from "./session";

describe("session tokens", () => {
  beforeEach(() => {
    process.env.SESSION_SECRET = "test-secret-at-least-32-chars-long!!";
  });

  it("round-trips a valid token", () => {
    const token = createSessionToken();
    expect(token).toBeTruthy();
    expect(verifySessionToken(token)).toBe(true);
  });

  it("rejects a tampered signature", () => {
    const token = createSessionToken()!;
    const lastChar = token.at(-1);
    const differentChar = lastChar === "0" ? "1" : "0";
    expect(verifySessionToken(token.slice(0, -1) + differentChar)).toBe(false);
  });

  it("rejects a tampered expiry", () => {
    const token = createSessionToken()!;
    const [, sig] = token.split(".");
    expect(verifySessionToken(`${Date.now() + 99999999}.${sig}`)).toBe(false);
  });

  it("rejects an expired token", () => {
    const past = Date.now() - 10_000;
    const token = createSessionToken(past - 1000, 1000)!; // expired 9s ago
    expect(verifySessionToken(token)).toBe(false);
  });

  it("rejects garbage and empties", () => {
    expect(verifySessionToken(undefined)).toBe(false);
    expect(verifySessionToken("")).toBe(false);
    expect(verifySessionToken("not.a.token")).toBe(false);
    expect(verifySessionToken("12345")).toBe(false);
  });

  it("fails closed without SESSION_SECRET", () => {
    const token = createSessionToken()!;
    delete process.env.SESSION_SECRET;
    expect(createSessionToken()).toBe(null);
    expect(verifySessionToken(token)).toBe(false);
  });
});
