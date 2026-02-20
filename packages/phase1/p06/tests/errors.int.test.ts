import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "../src/app";

describe("Global error handler", () => {
  it("404 unknown", async () => {
    const res = await request(app).get("/nope");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Not Found" });
    expect(res.headers["x-request-id"]).toBeTruthy();
    expect(res.headers["content-type"]).toMatch(/application\/json/);
  });

  it("400 validation failure", async () => {
    const res = await request(app).post("/example/echo").send({});

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Bad Request" });
    expect(res.headers["x-request-id"]).toBeTruthy();
    expect(res.headers["content-type"]).toMatch(/application\/json/);
  });

  it("500 unexpected error", async () => {
    const res = await request(app).get("/__test__/boom");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Internal Server Error" });
    expect(res.headers["x-request-id"]).toBeTruthy();

    // no leaks
    expect("stack" in res.body).toBe(false);
    expect("message" in res.body).toBe(false);
    expect(res.headers["content-type"]).toMatch(/application\/json/);

    // test-only
    expect(res.text).not.toMatch(/boom/i);
    expect(res.text).not.toMatch(/\bat\b\s+/);
  });
});
