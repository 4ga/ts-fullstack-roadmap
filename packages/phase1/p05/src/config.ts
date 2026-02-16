import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  // Accept "3000" (string) and turn into number
  PORT: z.coerce.number().int().positive().default(3000),

  // Optional for now; keep it to practice 12-factor config
  DATABASE_URL: z.string().min(1),
});

export type AppConfig = z.infer<typeof envSchema>;

/**
 * Pure function for unit tests.
 * Pass in my env-lik object adn get a typed config or throw
 */
export function parseConfig(env: NodeJS.ProcessEnv): AppConfig {
  const result = envSchema.safeParse(env);
  if (!result.success) {
    // Fail fast with a clear message (no stack leaked in HTTP anyway; this is startup)
    throw new Error("Invalid environment configuration");
  }
  return result.data;
}

// The one exported config used by the running app
export function getConfig(): AppConfig {
  return parseConfig(process.env);
}
