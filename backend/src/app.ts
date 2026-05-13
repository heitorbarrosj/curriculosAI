import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";
import { apiRateLimit } from "./middlewares/rateLimit.middleware.js";
import { routes } from "./routes/index.js";

export const app = express();

app.use(helmet());

app.use(helmet());

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(compression());

app.use(compression());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

app.use(apiRateLimit);


app.get("/", (_req, res) => {
  res.send("API online");
});

app.get("/api", (_req, res) => {
  res.send("API funcionando");
});

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);