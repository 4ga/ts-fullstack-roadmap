type LogLevel = "info" | "warn" | "error";

const SECRET_KEYS = new Set([
  "authorization",
  "cookie",
  "set-cookie",
  "password",
  "pass",
  "pwd",
  "token",
  "accessToken",
  "refreshToken",
  "x-request-id",
  "apikey",
  "api-key",
]);

function sanitize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sanitize);

  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (SECRET_KEYS.has(k.toLowerCase())) out[k] = "[REDACTED]";
      else out[k] = sanitize(v);
    }
    return out;
  }

  return value;
}

function write(level: LogLevel, msg: string, meta?: Record<string, unknown>) {
  const entry = {
    level,
    time: new Date().toISOString(),
    msg,
    ...(meta ? (sanitize(meta) as Record<string, unknown>) : {}),
  };

  // Structured JSON log line
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(entry));
}

export const logger = {
  info: (msg: string, meta?: Record<string, unknown>) =>
    write("info", msg, meta),
  warn: (msg: string, meta?: Record<string, unknown>) =>
    write("warn", msg, meta),
  error: (msg: string, meta?: Record<string, unknown>) =>
    write("error", msg, meta),
};
