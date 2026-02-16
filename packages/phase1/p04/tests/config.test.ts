import { describe, it, expect } from "vitest";
import { parseConfig } from "../src/config";

describe("config parsing", () => {
  it("parses valid env and coerces PORT to a number", () => {
    const cfg = parseConfig({
      NODE_ENV: "test",
      PORT: "4001",
      DATABASE_URL: "http://example.com/db",
    });

    expect(cfg.NODE_ENV).toBe("test");
    expect(cfg.PORT).toBe(4001);
    expect(cfg.DATABASE_URL).toBe("http://example.com/db");
  });

  it("throws on missing required env (DATABASE_URL)", () => {
    expect(() =>
      parseConfig({
        NODE_ENV: "test",
        PORT: "3000",
      } as any),
    ).toThrow("Invalid environment configuration");
  });

  it("throws on invalid PORT", () => {
    expect(() =>
      parseConfig({
        NODE_ENV: "test",
        PORT: "not-a-number",
        DATABASE_URL: "http://example.com/db",
      } as any),
    ).toThrow("Invalid environment configuration");
  });
});
