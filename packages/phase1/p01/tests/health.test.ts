import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "../src/app";

describe("P01 health check", () => {
  it("GET /health --> 200 {status: 200}", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it(`GET /nope --> 404 {error: "Not Found"}`, async () => {
    const res = await request(app).get("/nope");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Not Found" });
  });
});
