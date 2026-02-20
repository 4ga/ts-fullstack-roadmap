import request from "supertest";
import { describe, it, expect } from "vitest";
import { createApp } from "../src/app";

function makeIdGen() {
  let n = 0;
  return { nextId: () => `w_${++n}` };
}

function makeClock(times: string[]) {
  let i = 0;
  return {
    nowISO: () => times[Math.min(i++, times.length - 1)],
  };
}

function buildTestApp() {
  const idGen = makeIdGen();

  // Provide enough timestamps for create + update tests
  const clock = makeClock([
    "2026-02-17T00:00:00.000Z",
    "2026-02-17T00:00:01.000Z",
    "2026-02-17T00:00:02.000Z",
  ]);

  return createApp({ widgets: { idGen, clock } });
}

describe("Widgets API", () => {
  it("POST /widgets creates a widget", async () => {
    const app = buildTestApp();

    const res = await request(app).post("/widgets").send({ name: "Alpha" });

    expect(res.status).toBe(201);
    expect(res.headers["content-type"]).toMatch(/application\/json/);
    expect(res.headers["x-request-id"]).toBeTruthy();

    expect(res.body).toEqual({
      id: "w_1",
      name: "Alpha",
      createdAt: "2026-02-17T00:00:00.000Z",
      updatedAt: "2026-02-17T00:00:00.000Z",
    });
  });

  it("GET /widgets lists with default limit/offset", async () => {
    const app = buildTestApp();

    await request(app).post("/widgets").send({ name: "A" });
    await request(app).post("/widgets").send({ name: "B" });

    const res = await request(app).get("/widgets");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/application\/json/);
    expect(res.headers["x-request-id"]).toBeTruthy();

    expect(res.body.total).toBe(2);
    expect(res.body.limit).toBe(20);
    expect(res.body.offset).toBe(0);
    expect(res.body.items.map((w: any) => w.id)).toEqual(["w_1", "w_2"]);
  });

  it("GET /widgets respects limit/offset", async () => {
    const app = buildTestApp();

    await request(app).post("/widgets").send({ name: "A" });
    await request(app).post("/widgets").send({ name: "B" });
    await request(app).post("/widgets").send({ name: "C" });

    const res = await request(app).get("/widgets?limit=1&offset=1");
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(3);
    expect(res.body.limit).toBe(1);
    expect(res.body.offset).toBe(1);
    expect(res.body.items.map((w: any) => w.id)).toEqual(["w_2"]);
  });

  it("GET /widgets/:id reads a widget", async () => {
    const app = buildTestApp();

    const created = await request(app).post("/widgets").send({ name: "Alpha" });
    const id = created.body.id;

    const res = await request(app).get(`/widgets/${id}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(id);
    expect(res.body.name).toBe("Alpha");
  });

  it("PATCH /widgets/:id updates a widget", async () => {
    const app = buildTestApp();

    const created = await request(app).post("/widgets").send({ name: "Alpha" });
    const id = created.body.id;
    const createdAt = created.body.createdAt;

    const res = await request(app)
      .patch(`/widgets/${id}`)
      .send({ name: "Beta" });

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(id);
    expect(res.body.name).toBe("Beta");
    expect(res.body.createdAt).toBe(createdAt);
    expect(res.body.updatedAt).not.toBe(createdAt); // updatedAt changed
  });

  it("DELETE /widgets/:id deletes a widget", async () => {
    const app = buildTestApp();

    const created = await request(app).post("/widgets").send({ name: "Alpha" });
    const id = created.body.id;

    const del = await request(app).delete(`/widgets/${id}`);
    expect(del.status).toBe(204);
    expect(del.headers["x-request-id"]).toBeTruthy();

    const res = await request(app).get(`/widgets/${id}`);
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Not Found" });
  });

  it("400 on invalid POST body", async () => {
    const app = buildTestApp();

    const res = await request(app).post("/widgets").send({});
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Bad Request" });
  });

  it("400 on empty PATCH body {}", async () => {
    const app = buildTestApp();

    const created = await request(app).post("/widgets").send({ name: "Alpha" });
    const id = created.body.id;

    const res = await request(app).patch(`/widgets/${id}`).send({});
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Bad Request" });
  });

  it("400 on invalid list query", async () => {
    const app = buildTestApp();

    const res = await request(app).get("/widgets?limit=0");
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Bad Request" });
  });

  it("400 on invalid id param", async () => {
    const app = buildTestApp();

    const res = await request(app).get("/widgets/%20"); // space
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Bad Request" });
  });

  it("404 on unknown id (GET/PATCH/DELETE)", async () => {
    const app = buildTestApp();

    const g = await request(app).get("/widgets/does-not-exist");
    expect(g.status).toBe(404);
    expect(g.body).toEqual({ error: "Not Found" });

    const p = await request(app)
      .patch("/widgets/does-not-exist")
      .send({ name: "X" });
    expect(p.status).toBe(404);
    expect(p.body).toEqual({ error: "Not Found" });

    const d = await request(app).delete("/widgets/does-not-exist");
    expect(d.status).toBe(404);
    expect(d.body).toEqual({ error: "Not Found" });
  });
});
