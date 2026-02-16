import "dotenv/config";
import express from "express";
import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";
import { requestId } from "./middleware/requestId";

const app = express();

app.use(express.json());
app.use(requestId());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(notFound);
app.use(errorHandler);

export { app };
