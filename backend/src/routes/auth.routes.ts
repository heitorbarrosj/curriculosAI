import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authRateLimit } from "../middlewares/rateLimit.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { forgotPasswordSchema, loginSchema, refreshSchema, registerSchema, resetPasswordSchema } from "../validators/auth.validator.js";
import { asyncHandler } from "../utils/http.js";

export const authRoutes = Router();
authRoutes.post("/register", authRateLimit, validate(registerSchema), asyncHandler(authController.register));
authRoutes.post("/login", authRateLimit, validate(loginSchema), asyncHandler(authController.login));
authRoutes.post("/refresh", validate(refreshSchema), asyncHandler(authController.refresh));
authRoutes.post("/logout", authMiddleware, asyncHandler(authController.logout));
authRoutes.post("/forgot-password", authRateLimit, validate(forgotPasswordSchema), asyncHandler(authController.forgotPassword));
authRoutes.post("/reset-password", authRateLimit, validate(resetPasswordSchema), asyncHandler(authController.resetPassword));
