import { Router } from "express";
import { authRoutes } from "./auth.routes.js";
import { protectedRoutes } from "./protected.routes.js";

export const routes = Router();

routes.get("/health", (_req, res) => res.json({ status: "ok", service: "curriculoia-api" }));
routes.use("/auth", authRoutes);
routes.use(protectedRoutes);
