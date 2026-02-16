import express from "express";
import { requestId } from "./middleware/requestId";
import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";
import exampleRoutes from "./routes/example.routes";
import { requestLogger } from "./middleware/requestLogger";

const app = express();
app.use(express.json());
app.use(requestId());
app.use(requestLogger());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/example", exampleRoutes);

if (process.env.NODE_ENV === "test") {
  app.get("/__test__/boom", () => {
    throw new Error("boom");
  });
}

app.use(notFound);
app.use(errorHandler);

export { app };
