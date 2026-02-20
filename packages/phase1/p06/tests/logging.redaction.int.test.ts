import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import { app } from "../src/app";

describe("P04 logging redaction", () => {
  it("logs structured JSON with requestId and does not include secrets", async () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});

    await request(app)
      .post("/example/echo")
      .set("x-request-id", "rid-999")
      .set("authorization", "Bearer super-secret-token")
      .set("cookie", "session=very-secret")
      .send({ name: "Grace", password: "dont-log-me" });

    // Grab all log lines produced by this request
    const lines = spy.mock.calls.map((c) => String(c[0]));
    spy.mockRestore();

    expect(lines.length).toBeGreaterThan(0);

    // Find the request log entry
    const reqLine = lines.find((l) => l.includes('"msg":"request"'));
    expect(reqLine).toBeTruthy();

    // Must include requestId
    expect(reqLine!).toContain('"requestId":"rid-999"');

    // Must NOT leak secrets
    expect(reqLine!).not.toContain("super-secret-token");
    expect(reqLine!).not.toContain("very-secret");
    expect(reqLine!).not.toContain("dont-log-me");
    expect(reqLine!.toLowerCase()).not.toContain("authorization");
    expect(reqLine!.toLowerCase()).not.toContain("cookie");
    expect(reqLine!.toLowerCase()).not.toContain("password");
  });
});
