import express from "express";
import { randomUUID } from "node:crypto";
import { requestId } from "./middleware/requestId";
import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";
import exampleRoutes from "./routes/example.routes";
import { requestLogger } from "./middleware/requestLogger";
import { widgetsRouter } from "./widgets/widgets.router";
import { WidgetsStoreDeps } from "./widgets/widgets.store";

export type AppDeps = { widgets: WidgetsStoreDeps };

export function createApp(deps: AppDeps) {
  const app = express();

  app.use(express.json());
  app.use(requestId());
  app.use(requestLogger());

  app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));

  app.use("/example", exampleRoutes);
  app.use("/widgets", widgetsRouter(deps.widgets));

  if (process.env.NODE_ENV === "test") {
    app.get("/__test__/boom", () => {
      throw new Error("boom");
    });
  }

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

export const app = createApp({
  widgets: {
    idGen: { nextId: () => randomUUID() },
    clock: { nowISO: () => new Date().toISOString() },
  },
});
