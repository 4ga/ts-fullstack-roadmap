import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app";

describe("P04 request-id", () => {
  it("echoes x-request-id when provided", async () => {
    const res = await request(app)
      .get("/health")
      .set("x-request-id", "abc-123");

    expect(res.status).toBe(200);
    expect(res.headers["x-request-id"]).toBe("abc-123");
  });

  it("generates x-request-id when missing", async () => {
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    const rid = res.headers["x-request-id"];
    expect(typeof rid).toBe("string");
    expect(rid.length).toBeGreaterThan(0);

    // Optional: UUID v4-ish shape (keep test deterministic)
    expect(rid).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });
});
