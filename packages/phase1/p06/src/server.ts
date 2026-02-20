import { app } from "./app";
import { getConfig } from "./config";

try {
  const config = getConfig();
  app.listen(config.PORT, () =>
    console.log(`Server listening on port ${config.PORT}`),
  );
} catch (err) {
  console.error(`Failed to start server: ${(err as Error).message}`);
  process.exit(1);
}
