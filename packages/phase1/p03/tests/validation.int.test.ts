import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app";

describe("P02 validation tests", () => {
  it("POST /example/echo with {name: 'Grace'} -> 200", async () => {
    const res = await request(app)
      .post("/example/echo")
      .send({ name: "Grace" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true, body: { name: "Grace" } });
  });

  it("POST /example/echo with invalid body -> 400 Bad Request", async () => {
    const res = await request(app).post("/example/echo").send({});

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Bad Request" });
  });
});
